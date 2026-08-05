import crypto from 'crypto';
import { dbGet, dbQuery, dbRun } from '../config/database.js';

export const generateRequestHash = (userId, datasetId, filterParams = {}) => {
  const paramString = JSON.stringify(filterParams || {});
  const rawString = `user:${userId}-dataset:${datasetId}-params:${paramString}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
};

export const processDownloadRequest = async ({ userId, datasetId, filterParams = {} }) => {
  // 1. Fetch User
  const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('User not found');

  // Check if User Download Privileges are Frozen
  if (user.is_frozen === 1) {
    return {
      status: 'USER_FROZEN',
      isDuplicate: false,
      user: { id: user.id, name: user.name, email: user.email, riskScore: user.risk_score },
      message: `Access Denied: User account '${user.name}' has been frozen by security policy due to high risk score (${user.risk_score}/100).`
    };
  }

  // 2. Fetch Dataset
  const dataset = await dbGet('SELECT * FROM datasets WHERE id = ?', [datasetId]);
  if (!dataset) throw new Error('Dataset not found');

  // 3. Fetch Settings & Active Security Policies
  const settingsRows = await dbQuery('SELECT key, value FROM settings');
  const settingsMap = {};
  settingsRows.forEach(row => { settingsMap[row.key] = row.value; });

  const windowMins = parseInt(settingsMap['DUPLICATE_WINDOW_MINS'] || '60', 10);
  const thresholdLow = parseInt(settingsMap['ALERT_THRESHOLD_LOW'] || '2', 10);
  const thresholdHigh = parseInt(settingsMap['ALERT_THRESHOLD_HIGH'] || '4', 10);
  const blockOnCritical = settingsMap['BLOCK_ON_CRITICAL'] === 'true';

  const activePolicies = await dbQuery('SELECT * FROM policies WHERE status = 1');

  // 4. Request Hash & Recent Downloads Query
  const requestHash = generateRequestHash(userId, datasetId, filterParams);
  const filterParamsJson = JSON.stringify(filterParams);

  const sqlCheck = `
    SELECT * FROM download_logs 
    WHERE user_id = ? 
      AND dataset_id = ? 
      AND request_hash = ?
      AND requested_at >= datetime('now', '-${windowMins} minutes')
    ORDER BY requested_at DESC
  `;
  const recentMatchingLogs = await dbQuery(sqlCheck, [userId, datasetId, requestHash]);

  const duplicateCount = recentMatchingLogs.length;
  const isDuplicate = duplicateCount > 0;

  let riskLevel = null;
  let status = 'SUCCESS';
  let alertCreated = false;
  let alertInfo = null;
  let message = 'Download initialized successfully.';
  let policyTriggered = null;

  // 5. Evaluate Custom Security Policies
  for (const policy of activePolicies) {
    if (policy.rule_type === 'MAX_FILE_SIZE' && dataset.size_mb >= policy.threshold_value && isDuplicate) {
      policyTriggered = policy.name;
      if (policy.action === 'REQUIRE_CACHE') {
        status = 'WARNING_ISSUED';
        message = `Security Policy '${policy.name}' Triggered: Large dataset (${dataset.size_mb} MB) already requested. Please serve from cache.`;
      }
    } else if (policy.rule_type === 'CRITICAL_BLOCK' && dataset.sensitivity === 'CRITICAL' && isDuplicate) {
      policyTriggered = policy.name;
      riskLevel = 'HIGH';
    } else if (policy.rule_type === 'DUPLICATE_LIMIT' && duplicateCount >= policy.threshold_value) {
      policyTriggered = policy.name;
      if (policy.action === 'BLOCK') {
        status = 'BLOCKED';
        message = `Security Policy '${policy.name}' Enforced: Excessive repeat request limit (${policy.threshold_value}) breached. Download blocked.`;
      }
    }
  }

  // Standard Duplication Risk Scoring if not already overridden by policy
  if (isDuplicate) {
    if (!riskLevel) {
      if (duplicateCount >= thresholdHigh) {
        riskLevel = dataset.sensitivity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
      } else if (duplicateCount >= thresholdLow) {
        riskLevel = dataset.sensitivity === 'CRITICAL' || dataset.sensitivity === 'HIGH' ? 'HIGH' : 'MEDIUM';
      } else {
        riskLevel = 'LOW';
      }
    }

    if (status !== 'BLOCKED' && riskLevel === 'CRITICAL' && blockOnCritical) {
      status = 'BLOCKED';
      message = `Download blocked! You have requested this dataset ${duplicateCount + 1} times within ${windowMins} minutes. Access temporarily suspended.`;
    } else if (status === 'SUCCESS') {
      status = 'WARNING_ISSUED';
      message = `Duplicate download detected! This dataset was already downloaded ${duplicateCount} time(s) in the last ${windowMins} minutes.`;
    }
  }

  // 6. Insert Download Log Record
  const logInsert = await dbRun(`
    INSERT INTO download_logs (user_id, dataset_id, requested_at, filter_params, request_hash, status, size_mb, is_duplicate)
    VALUES (?, ?, datetime('now'), ?, ?, ?, ?, ?)
  `, [userId, datasetId, filterParamsJson, requestHash, status, dataset.size_mb, isDuplicate ? 1 : 0]);

  const downloadLogId = logInsert.id;

  // 7. Update User Risk Score & Counters
  const newRiskScore = Math.min(100, Math.max(0, user.risk_score + (isDuplicate ? 12 * (duplicateCount + 1) : -2)));
  const isAutoFrozen = newRiskScore >= 90 ? 1 : user.is_frozen;

  await dbRun(`
    UPDATE users 
    SET risk_score = ?, 
        is_frozen = ?,
        total_downloads = total_downloads + 1,
        duplicate_downloads = duplicate_downloads + ?
    WHERE id = ?
  `, [newRiskScore, isAutoFrozen, isDuplicate ? 1 : 0, userId]);

  // 8. Cache Registration (Create entry if not existing)
  await dbRun(`
    INSERT INTO cache_entries (request_hash, dataset_id, filter_params, file_format, size_mb, hit_count, cached_at)
    VALUES (?, ?, ?, ?, ?, 0, datetime('now'))
    ON CONFLICT(request_hash) DO UPDATE SET cached_at = datetime('now')
  `, [requestHash, datasetId, filterParamsJson, filterParams.format || dataset.file_format, dataset.size_mb]);

  // 9. Increment Dataset Download Count if not blocked
  if (status !== 'BLOCKED') {
    await dbRun(`UPDATE datasets SET download_count = download_count + 1 WHERE id = ?`, [datasetId]);
  }

  // 10. Generate Security Alert
  if (isDuplicate && riskLevel) {
    const alertInsert = await dbRun(`
      INSERT INTO alerts (download_log_id, user_id, dataset_id, duplicate_count, time_window_mins, risk_level, status, detected_at)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', datetime('now'))
    `, [downloadLogId, userId, datasetId, duplicateCount + 1, windowMins, riskLevel]);

    alertCreated = true;
    alertInfo = {
      id: alertInsert.id,
      riskLevel,
      duplicateCount: duplicateCount + 1,
      timeWindowMins: windowMins
    };
  }

  const bandwidthWastedMB = isDuplicate ? dataset.size_mb * duplicateCount : 0;

  return {
    downloadLogId,
    user: { id: user.id, name: user.name, email: user.email, department: user.department, riskScore: newRiskScore, isFrozen: isAutoFrozen === 1 },
    dataset: { id: dataset.id, title: dataset.title, sizeMb: dataset.size_mb, fileFormat: dataset.file_format },
    status,
    isDuplicate,
    duplicateCount,
    bandwidthWastedMB,
    riskLevel,
    policyTriggered,
    requestHash,
    alertCreated,
    alertInfo,
    message,
    timestamp: new Date().toISOString()
  };
};

export const serveFromCache = async ({ userId, datasetId, requestHash }) => {
  const user = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  const dataset = await dbGet('SELECT * FROM datasets WHERE id = ?', [datasetId]);

  if (!user || !dataset) throw new Error('User or dataset not found');

  // Update Cache Entry Hit Count
  await dbRun(`UPDATE cache_entries SET hit_count = hit_count + 1 WHERE request_hash = ?`, [requestHash]);

  // Log as SERVED_FROM_CACHE
  const logInsert = await dbRun(`
    INSERT INTO download_logs (user_id, dataset_id, requested_at, filter_params, request_hash, status, size_mb, is_duplicate)
    VALUES (?, ?, datetime('now'), '{}', ?, 'SERVED_FROM_CACHE', ?, 1)
  `, [userId, datasetId, requestHash, dataset.size_mb]);

  return {
    success: true,
    downloadLogId: logInsert.id,
    message: `Payload served directly from local cache! 0 MB network bandwidth consumed.`
  };
};
