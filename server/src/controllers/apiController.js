import { dbGet, dbQuery, dbRun } from '../config/database.js';
import { processDownloadRequest, serveFromCache } from '../services/detectionEngine.js';

// --- DATASETS ---
export const getDatasets = async (req, res) => {
  try {
    const datasets = await dbQuery('SELECT * FROM datasets ORDER BY id ASC');
    res.json({ success: true, data: datasets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createDataset = async (req, res) => {
  try {
    const { title, category, description, size_mb, file_format, sensitivity } = req.body;
    if (!title || !category || !size_mb || !file_format) {
      return res.status(400).json({ success: false, error: 'Missing required dataset fields' });
    }
    const result = await dbRun(`
      INSERT INTO datasets (title, category, description, size_mb, file_format, sensitivity)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, category, description || '', size_mb, file_format, sensitivity || 'LOW']);
    res.json({ success: true, id: result.id, message: 'Dataset created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- USERS & RISK MANAGEMENT ---
export const getUsers = async (req, res) => {
  try {
    const users = await dbQuery('SELECT * FROM users ORDER BY risk_score DESC, id ASC');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const freezeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await dbRun('UPDATE users SET is_frozen = 1 WHERE id = ?', [userId]);
    res.json({ success: true, message: `User #${userId} download privileges frozen.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const unfreezeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await dbRun('UPDATE users SET is_frozen = 0 WHERE id = ?', [userId]);
    res.json({ success: true, message: `User #${userId} download privileges unfrozen.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const resetUserRiskScore = async (req, res) => {
  try {
    const { userId } = req.params;
    await dbRun('UPDATE users SET risk_score = 10, is_frozen = 0 WHERE id = ?', [userId]);
    res.json({ success: true, message: `User #${userId} risk score reset to 10.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- DOWNLOADS & DETECTION ---
export const requestDownload = async (req, res) => {
  try {
    const { userId, datasetId, filterParams } = req.body;
    if (!userId || !datasetId) {
      return res.status(400).json({ success: false, error: 'userId and datasetId are required' });
    }

    const result = await processDownloadRequest({ userId, datasetId, filterParams });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleServeFromCache = async (req, res) => {
  try {
    const { userId, datasetId, requestHash } = req.body;
    const result = await serveFromCache({ userId, datasetId, requestHash });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- SECURITY POLICY RULES ---
export const getPolicies = async (req, res) => {
  try {
    const policies = await dbQuery('SELECT * FROM policies ORDER BY id ASC');
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const { name, rule_type, threshold_value, action } = req.body;
    if (!name || !rule_type || threshold_value === undefined || !action) {
      return res.status(400).json({ success: false, error: 'Missing policy fields' });
    }
    const result = await dbRun(`
      INSERT INTO policies (name, rule_type, threshold_value, action, status)
      VALUES (?, ?, ?, ?, 1)
    `, [name, rule_type, threshold_value, action]);
    res.json({ success: true, id: result.id, message: `Security policy '${name}' created successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const togglePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    const policy = await dbGet('SELECT * FROM policies WHERE id = ?', [policyId]);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });
    
    const newStatus = policy.status === 1 ? 0 : 1;
    await dbRun('UPDATE policies SET status = ? WHERE id = ?', [newStatus, policyId]);
    res.json({ success: true, message: `Policy status updated to ${newStatus === 1 ? 'Enabled' : 'Disabled'}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    const { policyId } = req.params;
    await dbRun('DELETE FROM policies WHERE id = ?', [policyId]);
    res.json({ success: true, message: `Policy #${policyId} deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ALERTS MANAGEMENT ---
export const getAlerts = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id, a.risk_level, a.status, a.duplicate_count, a.time_window_mins, a.detected_at, a.resolution_note,
        u.id as user_id, u.name as user_name, u.email as user_email, u.department as user_department, u.ip_address, u.risk_score as user_risk_score,
        d.id as dataset_id, d.title as dataset_title, d.size_mb, d.file_format, d.sensitivity
      FROM alerts a
      JOIN users u ON a.user_id = u.id
      JOIN datasets d ON a.dataset_id = d.id
      ORDER BY a.detected_at DESC
    `;
    const alerts = await dbQuery(sql);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, note } = req.body;
    if (!['ACTIVE', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    await dbRun(`
      UPDATE alerts 
      SET status = ?, resolution_note = ?
      WHERE id = ?
    `, [status, note || '', alertId]);

    res.json({ success: true, message: `Alert #${alertId} updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- AUDIT LOGS & EXPORT ---
export const getAuditLogs = async (req, res) => {
  try {
    const sql = `
      SELECT 
        l.id, l.requested_at, l.filter_params, l.status, l.size_mb, l.is_duplicate, l.request_hash,
        u.name as user_name, u.email as user_email, u.department, u.ip_address,
        d.title as dataset_title, d.category, d.file_format
      FROM download_logs l
      JOIN users u ON l.user_id = u.id
      JOIN datasets d ON l.dataset_id = d.id
      ORDER BY l.requested_at DESC
    `;
    const logs = await dbQuery(sql);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const { format } = req.query; // 'csv' or 'json'
    const logs = await dbQuery(`
      SELECT l.id, l.requested_at, u.name as user_name, u.department, d.title as dataset_title, l.size_mb, l.status, l.is_duplicate, l.request_hash
      FROM download_logs l
      JOIN users u ON l.user_id = u.id
      JOIN datasets d ON l.dataset_id = d.id
      ORDER BY l.requested_at DESC
    `);

    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'User', 'Department', 'Dataset', 'Size (MB)', 'Status', 'Is Duplicate', 'Hash'];
      const rows = logs.map(l => [
        l.id,
        `"${l.requested_at}"`,
        `"${l.user_name}"`,
        `"${l.department}"`,
        `"${l.dataset_title.replace(/"/g, '""')}"`,
        l.size_mb,
        l.status,
        l.is_duplicate ? 'YES' : 'NO',
        l.request_hash
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="download_audit_logs.csv"');
      return res.send(csvContent);
    }

    res.json(logs);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- SETTINGS ---
export const getSettings = async (req, res) => {
  try {
    const settings = await dbQuery('SELECT * FROM settings');
    const settingsObj = {};
    settings.forEach(item => {
      settingsObj[item.key] = item.value;
    });
    res.json({ success: true, data: settingsObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await dbRun(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
      `, [key, String(value)]);
    }
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- ANALYTICS DASHBOARD SUMMARY ---
export const getAnalytics = async (req, res) => {
  try {
    const totalDownloadsRow = await dbGet('SELECT COUNT(*) as count FROM download_logs');
    const duplicateDownloadsRow = await dbGet('SELECT COUNT(*) as count FROM download_logs WHERE is_duplicate = 1');
    const blockedDownloadsRow = await dbGet('SELECT COUNT(*) as count FROM download_logs WHERE status = "BLOCKED"');
    const activeAlertsRow = await dbGet('SELECT COUNT(*) as count FROM alerts WHERE status = "ACTIVE"');
    const cacheHitsRow = await dbGet('SELECT COUNT(*) as count FROM download_logs WHERE status = "SERVED_FROM_CACHE"');

    const bandwidthWastedRow = await dbGet(`
      SELECT SUM(size_mb) as total_mb 
      FROM download_logs 
      WHERE is_duplicate = 1 AND status != "SERVED_FROM_CACHE"
    `);

    const bandwidthSavedCacheRow = await dbGet(`
      SELECT SUM(size_mb) as total_mb 
      FROM download_logs 
      WHERE status = "SERVED_FROM_CACHE"
    `);

    const departmentBreakdown = await dbQuery(`
      SELECT u.department, COUNT(l.id) as total_requests, SUM(l.is_duplicate) as duplicates
      FROM download_logs l
      JOIN users u ON l.user_id = u.id
      GROUP BY u.department
      ORDER BY duplicates DESC
    `);

    const riskDistribution = await dbQuery(`
      SELECT risk_level, COUNT(*) as count
      FROM alerts
      GROUP BY risk_level
    `);

    // Simulated 24-hour traffic trend data for visual charts
    const trafficTrends = [
      { hour: '00:00', requests: 4, duplicates: 0 },
      { hour: '04:00', requests: 2, duplicates: 0 },
      { hour: '08:00', requests: 18, duplicates: 3 },
      { hour: '12:00', requests: 35, duplicates: 8 },
      { hour: '16:00', requests: 28, duplicates: 5 },
      { hour: '20:00', requests: 12, duplicates: 2 }
    ];

    res.json({
      success: true,
      data: {
        totalDownloads: totalDownloadsRow.count || 0,
        duplicateDownloads: duplicateDownloadsRow.count || 0,
        blockedDownloads: blockedDownloadsRow.count || 0,
        cacheHits: cacheHitsRow.count || 0,
        activeAlerts: activeAlertsRow.count || 0,
        bandwidthWastedMB: Math.round(bandwidthWastedRow.total_mb || 0),
        bandwidthWastedGB: parseFloat(((bandwidthWastedRow.total_mb || 0) / 1024).toFixed(2)),
        bandwidthSavedCacheMB: Math.round(bandwidthSavedCacheRow.total_mb || 0),
        departmentBreakdown,
        riskDistribution,
        trafficTrends
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
