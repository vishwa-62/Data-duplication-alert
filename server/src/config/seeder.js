import crypto from 'crypto';

const generateHash = (userId, datasetId, filterParams = {}) => {
  const paramString = JSON.stringify(filterParams || {});
  const rawString = `user:${userId}-dataset:${datasetId}-params:${paramString}`;
  return crypto.createHash('md5').update(rawString).digest('hex');
};

export const seedComprehensiveData = async (dbRun, dbQuery, dbGet, forceReset = false) => {
  console.log('--- Starting Comprehensive Data Seeding ---');

  if (forceReset) {
    await dbRun('DELETE FROM alerts');
    await dbRun('DELETE FROM download_logs');
    await dbRun('DELETE FROM cache_entries');
    await dbRun('DELETE FROM policies');
    await dbRun('DELETE FROM datasets');
    await dbRun('DELETE FROM users');
    await dbRun('DELETE FROM settings');
    console.log('Cleared existing table data for fresh seed.');
  }

  // 1. Settings
  const settingsCount = await dbGet('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    await dbRun(`INSERT INTO settings (key, value) VALUES ('DUPLICATE_WINDOW_MINS', '60')`);
    await dbRun(`INSERT INTO settings (key, value) VALUES ('ALERT_THRESHOLD_LOW', '2')`);
    await dbRun(`INSERT INTO settings (key, value) VALUES ('ALERT_THRESHOLD_HIGH', '4')`);
    await dbRun(`INSERT INTO settings (key, value) VALUES ('BLOCK_ON_CRITICAL', 'true')`);
    await dbRun(`INSERT INTO settings (key, value) VALUES ('CACHE_RETENTION_HOURS', '24')`);
  }

  // 2. Policies
  const policyList = [
    { name: 'Large File Repeat Limit', type: 'MAX_FILE_SIZE', value: 1000.0, action: 'REQUIRE_CACHE', status: 1 },
    { name: 'Critical PII Instant High Alert', type: 'CRITICAL_BLOCK', value: 1.0, action: 'ALERT_HIGH', status: 1 },
    { name: 'Excessive Repeat Auto-Block', type: 'DUPLICATE_LIMIT', value: 3.0, action: 'BLOCK', status: 1 },
    { name: 'Massive Export Department Cap', type: 'DEPARTMENT_CAP', value: 5000.0, action: 'ALERT_HIGH', status: 1 },
    { name: 'Suspicious Rapid Bulk Download', type: 'DUPLICATE_LIMIT', value: 5.0, action: 'BLOCK', status: 1 }
  ];

  for (const p of policyList) {
    const existing = await dbGet('SELECT id FROM policies WHERE name = ?', [p.name]);
    if (!existing) {
      await dbRun(
        'INSERT INTO policies (name, rule_type, threshold_value, action, status) VALUES (?, ?, ?, ?, ?)',
        [p.name, p.type, p.value, p.action, p.status]
      );
    }
  }

  // 3. Users (15 Total Users)
  const userList = [
    { name: 'Alex Mercer', email: 'alex.mercer@corp.internal', department: 'Data Analytics', role: 'Senior Analyst', ip: '192.168.1.45', risk: 72, frozen: 0, total: 15, dupes: 7 },
    { name: 'Sophia Chen', email: 'sophia.chen@corp.internal', department: 'Finance & Risk', role: 'Financial Auditor', ip: '192.168.1.88', risk: 45, frozen: 0, total: 10, dupes: 3 },
    { name: 'Marcus Vance', email: 'marcus.vance@corp.internal', department: 'Cybersecurity Ops', role: 'SOC Admin', ip: '192.168.2.110', risk: 10, frozen: 0, total: 24, dupes: 0 },
    { name: 'Elena Rostova', email: 'elena.rostova@corp.internal', department: 'Engineering', role: 'DevOps Specialist', ip: '192.168.1.102', risk: 25, frozen: 0, total: 8, dupes: 1 },
    { name: 'David Miller', email: 'david.miller@corp.internal', department: 'Human Resources', role: 'HR Manager', ip: '192.168.3.15', risk: 88, frozen: 1, total: 12, dupes: 8 },
    { name: 'Samantha Wright', email: 'samantha.wright@corp.internal', department: 'Product Management', role: 'Lead Product Analyst', ip: '192.168.4.22', risk: 35, frozen: 0, total: 18, dupes: 2 },
    { name: 'Vikram Patel', email: 'vikram.patel@corp.internal', department: 'Legal & Compliance', role: 'Regulatory Officer', ip: '192.168.5.64', risk: 62, frozen: 0, total: 14, dupes: 5 },
    { name: 'Jordan Taylor', email: 'jordan.taylor@corp.internal', department: 'Marketing & Sales', role: 'Growth Data Strategist', ip: '192.168.1.211', risk: 50, frozen: 0, total: 29, dupes: 6 },
    { name: 'Hiroshi Tanaka', email: 'hiroshi.tanaka@corp.internal', department: 'Customer Support', role: 'Tier 3 Tech Lead', ip: '192.168.6.77', risk: 15, frozen: 0, total: 9, dupes: 0 },
    { name: 'Chloe Dubois', email: 'chloe.dubois@corp.internal', department: 'Engineering', role: 'Machine Learning Engineer', ip: '192.168.1.199', risk: 78, frozen: 0, total: 35, dupes: 12 },
    { name: 'Gabriel Santos', email: 'gabriel.santos@corp.internal', department: 'Finance & Risk', role: 'Treasury Analyst', ip: '192.168.1.91', risk: 20, frozen: 0, total: 11, dupes: 1 },
    { name: 'Beatrice Vance', email: 'beatrice.vance@corp.internal', department: 'Data Analytics', role: 'Data Engineer', ip: '192.168.2.115', risk: 95, frozen: 1, total: 42, dupes: 19 },
    { name: 'Liam O\'Connor', email: 'liam.oconnor@corp.internal', department: 'DevOps & Cloud Security', role: 'Cloud Architect', ip: '192.168.7.40', risk: 18, frozen: 0, total: 16, dupes: 1 },
    { name: 'Fatima Al-Mansoor', email: 'fatima.almansoor@corp.internal', department: 'Cybersecurity Ops', role: 'Incident Responder', ip: '192.168.2.140', risk: 8, frozen: 0, total: 22, dupes: 0 },
    { name: 'Oscar Lindqvist', email: 'oscar.lindqvist@corp.internal', department: 'Human Resources', role: 'Talent Operations Lead', ip: '192.168.3.82', risk: 30, frozen: 0, total: 7, dupes: 1 }
  ];

  for (const u of userList) {
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [u.email]);
    if (!existing) {
      await dbRun(
        `INSERT INTO users (name, email, department, role, ip_address, risk_score, is_frozen, total_downloads, duplicate_downloads)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.name, u.email, u.department, u.role, u.ip, u.risk, u.frozen, u.total, u.dupes]
      );
    }
  }

  // 4. Datasets (15 Total Datasets)
  const datasetList = [
    { title: 'Q3 Global Revenue & Tax Ledger 2025', cat: 'Finance', desc: 'Detailed transactional logs, regional tax compliance files, and revenue splits.', size: 485.5, fmt: 'CSV', sens: 'HIGH', count: 34 },
    { title: 'Customer Telemetry & PII Activity Logs', cat: 'Analytics', desc: 'Raw user events, session duration, hashed IP records, and location heatmaps.', size: 1240.0, fmt: 'JSON', sens: 'CRITICAL', count: 52 },
    { title: 'Core Database Infrastructure Dumps', cat: 'Engineering', desc: 'Full anonymized snapshot of production database tables for sandbox testing.', size: 3450.0, fmt: 'SQL', sens: 'HIGH', count: 18 },
    { title: 'Employee Performance Reviews & Salaries 2024-2025', cat: 'HR', desc: 'Comprehensive HR records, salary bands, performance scoring, and bonuses.', size: 120.2, fmt: 'XLSX', sens: 'CRITICAL', count: 15 },
    { title: 'Quarterly Marketing Campaign Conversion Metrics', cat: 'Marketing', desc: 'Ad spend data, conversion leads, click-through metrics across platforms.', size: 68.4, fmt: 'CSV', sens: 'LOW', count: 61 },
    { title: 'System Security Audit & Access Logs', cat: 'Security', desc: 'Authentication attempts, firewall breaches, token issuances, and VPN sessions.', size: 890.0, fmt: 'LOG', sens: 'HIGH', count: 29 },
    { title: 'User Authentication Tokens & OAuth Credentials', cat: 'Security', desc: 'Encrypted access tokens, refreshed OAuth grant logs, and session secrets.', size: 215.0, fmt: 'JSON', sens: 'CRITICAL', count: 22 },
    { title: 'Global Logistics & Supply Chain Shipments Q1-Q4', cat: 'Operations', desc: 'Fleet tracking logs, warehouse inventory balances, and transit latency metrics.', size: 1850.0, fmt: 'PARQUET', sens: 'MEDIUM', count: 38 },
    { title: 'Customer Support Escalation Tickets & Chat Transcripts', cat: 'Support', desc: 'Resolved tier-3 support tickets, customer sentiment tags, and agent replies.', size: 520.0, fmt: 'JSON', sens: 'MEDIUM', count: 26 },
    { title: 'Patent Filings & Proprietary Source Code Archival', cat: 'Legal', desc: 'Archived patent claims, NDA documentation, and core algorithmic source code.', size: 4200.0, fmt: 'ZIP', sens: 'CRITICAL', count: 9 },
    { title: 'ML Model Weights & Training Evaluation Datasets', cat: 'AI/ML', desc: 'Trained Transformer embeddings, validation datasets, and hyperparameter logs.', size: 6500.0, fmt: 'PARQUET', sens: 'MEDIUM', count: 47 },
    { title: 'Enterprise ERP Financial Statements & General Ledger', cat: 'Finance', desc: 'Consolidated balance sheets, quarterly EBITDA targets, and vendor payouts.', size: 310.0, fmt: 'XLSX', sens: 'HIGH', count: 20 },
    { title: 'Executive Board Meeting Transcripts & M&A Dossiers', cat: 'Executive', desc: 'Confidential board meeting minutes, acquisition evaluations, and strategic plans.', size: 95.0, fmt: 'PDF', sens: 'CRITICAL', count: 11 },
    { title: 'Cloud Infrastructure Terraform State Snapshots', cat: 'DevOps', desc: 'IaC topology mappings, VPC subnets, and cloud security group configurations.', size: 150.0, fmt: 'JSON', sens: 'HIGH', count: 33 },
    { title: 'Healthcare Benefits & Claims Master Records', cat: 'HR', desc: 'Anonymized health insurance claim records, employee coverage tiers, and payouts.', size: 780.0, fmt: 'CSV', sens: 'CRITICAL', count: 14 }
  ];

  for (const d of datasetList) {
    const existing = await dbGet('SELECT id FROM datasets WHERE title = ?', [d.title]);
    if (!existing) {
      await dbRun(
        `INSERT INTO datasets (title, category, description, size_mb, file_format, sensitivity, download_count)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [d.title, d.cat, d.desc, d.size, d.fmt, d.sens, d.count]
      );
    }
  }

  // Retrieve user map and dataset map for foreign keys
  const users = await dbQuery('SELECT id, email, name, risk_score FROM users');
  const datasets = await dbQuery('SELECT id, title, size_mb, sensitivity FROM datasets');

  const findUser = (email) => users.find(u => u.email === email);
  const findDataset = (titleSnippet) => datasets.find(d => d.title.includes(titleSnippet));

  const alex = findUser('alex.mercer@corp.internal');
  const sophia = findUser('sophia.chen@corp.internal');
  const marcus = findUser('marcus.vance@corp.internal');
  const elena = findUser('elena.rostova@corp.internal');
  const david = findUser('david.miller@corp.internal');
  const beatrice = findUser('beatrice.vance@corp.internal');
  const chloe = findUser('chloe.dubois@corp.internal');
  const jordan = findUser('jordan.taylor@corp.internal');
  const vikram = findUser('vikram.patel@corp.internal');

  const dsTelemetry = findDataset('Telemetry');
  const dsRevenue = findDataset('Revenue');
  const dsHR = findDataset('Performance Reviews');
  const dsML = findDataset('ML Model Weights');
  const dsSecurity = findDataset('Security Audit');
  const dsOAuth = findDataset('OAuth Credentials');
  const dsPatent = findDataset('Patent Filings');
  const dsLogistics = findDataset('Logistics');
  const dsTerraform = findDataset('Terraform');

  // Seed Download Logs & Alerts if logs count < 20
  const logsCount = await dbGet('SELECT COUNT(*) as count FROM download_logs');
  if (logsCount.count < 20 || forceReset) {
    console.log('Seeding 40+ structured download logs and security alerts...');

    const sampleLogs = [
      // Beatrice Vance (High Risk Data Engineer) - Multiple rapid repeats on ML & Telemetry
      { user: beatrice, dataset: dsML, timeAgo: '4 minutes ago', status: 'BLOCKED', isDup: 1, filter: { region: 'US-East', split: 'train' } },
      { user: beatrice, dataset: dsML, timeAgo: '12 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { region: 'US-East', split: 'train' } },
      { user: beatrice, dataset: dsML, timeAgo: '18 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { region: 'US-East', split: 'train' } },
      { user: beatrice, dataset: dsML, timeAgo: '25 minutes ago', status: 'SUCCESS', isDup: 0, filter: { region: 'US-East', split: 'train' } },
      { user: beatrice, dataset: dsTelemetry, timeAgo: '45 minutes ago', status: 'SERVED_FROM_CACHE', isDup: 1, filter: { format: 'json_full' } },
      { user: beatrice, dataset: dsTelemetry, timeAgo: '50 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { format: 'json_full' } },
      { user: beatrice, dataset: dsTelemetry, timeAgo: '55 minutes ago', status: 'SUCCESS', isDup: 0, filter: { format: 'json_full' } },

      // David Miller (HR Manager - Frozen Account) - Repeated access to sensitive HR salaries
      { user: david, dataset: dsHR, timeAgo: '10 minutes ago', status: 'BLOCKED', isDup: 1, filter: { department: 'Executive', year: '2025' } },
      { user: david, dataset: dsHR, timeAgo: '30 minutes ago', status: 'BLOCKED', isDup: 1, filter: { department: 'Executive', year: '2025' } },
      { user: david, dataset: dsHR, timeAgo: '75 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { department: 'Executive', year: '2025' } },
      { user: david, dataset: dsHR, timeAgo: '90 minutes ago', status: 'SUCCESS', isDup: 0, filter: { department: 'Executive', year: '2025' } },

      // Chloe Dubois (ML Engineer) - Repeat telemetry downloads
      { user: chloe, dataset: dsTelemetry, timeAgo: '15 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { sample_rate: '100%' } },
      { user: chloe, dataset: dsTelemetry, timeAgo: '35 minutes ago', status: 'SERVED_FROM_CACHE', isDup: 1, filter: { sample_rate: '100%' } },
      { user: chloe, dataset: dsTelemetry, timeAgo: '120 minutes ago', status: 'SUCCESS', isDup: 0, filter: { sample_rate: '100%' } },
      { user: chloe, dataset: dsML, timeAgo: '180 minutes ago', status: 'SUCCESS', isDup: 0, filter: { epoch: 'final' } },

      // Alex Mercer (Data Analytics) - Tax & Revenue Repeats
      { user: alex, dataset: dsRevenue, timeAgo: '20 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { quarter: 'Q3', status: 'audited' } },
      { user: alex, dataset: dsRevenue, timeAgo: '40 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { quarter: 'Q3', status: 'audited' } },
      { user: alex, dataset: dsRevenue, timeAgo: '210 minutes ago', status: 'SUCCESS', isDup: 0, filter: { quarter: 'Q3', status: 'audited' } },

      // Vikram Patel (Legal) - Patent Code Dumps
      { user: vikram, dataset: dsPatent, timeAgo: '50 minutes ago', status: 'WARNING_ISSUED', isDup: 1, filter: { classification: 'strict' } },
      { user: vikram, dataset: dsPatent, timeAgo: '240 minutes ago', status: 'SUCCESS', isDup: 0, filter: { classification: 'strict' } },

      // Sophia Chen (Finance) - Revenue & ERP Ledger
      { user: sophia, dataset: dsRevenue, timeAgo: '3 hours ago', status: 'SERVED_FROM_CACHE', isDup: 1, filter: { format: 'csv' } },
      { user: sophia, dataset: dsRevenue, timeAgo: '5 hours ago', status: 'SUCCESS', isDup: 0, filter: { format: 'csv' } },

      // Jordan Taylor (Marketing) - Campaign Metrics Repeats
      { user: jordan, dataset: dsLogistics, timeAgo: '2 hours ago', status: 'WARNING_ISSUED', isDup: 1, filter: { region: 'APAC' } },
      { user: jordan, dataset: dsLogistics, timeAgo: '6 hours ago', status: 'SUCCESS', isDup: 0, filter: { region: 'APAC' } },

      // Marcus Vance (SOC) & Fatima Al-Mansoor - Security Logs Routine Downloads
      { user: marcus, dataset: dsSecurity, timeAgo: '1 hour ago', status: 'SUCCESS', isDup: 0, filter: { severity: 'high' } },
      { user: marcus, dataset: dsOAuth, timeAgo: '4 hours ago', status: 'SUCCESS', isDup: 0, filter: { expired: false } },
      { user: elena, dataset: dsTerraform, timeAgo: '8 hours ago', status: 'SUCCESS', isDup: 0, filter: { env: 'prod' } }
    ];

    for (const item of sampleLogs) {
      if (!item.user || !item.dataset) continue;

      const requestHash = generateHash(item.user.id, item.dataset.id, item.filter);
      const filterJson = JSON.stringify(item.filter);

      // Convert timeAgo to SQLite modifier string
      let timeModifier = "-10 minutes";
      if (item.timeAgo.includes("minutes ago")) {
        const mins = item.timeAgo.split(" ")[0];
        timeModifier = `-${mins} minutes`;
      } else if (item.timeAgo.includes("hours ago") || item.timeAgo.includes("hour ago")) {
        const hrs = item.timeAgo.split(" ")[0];
        timeModifier = `-${hrs} hours`;
      }

      const logRes = await dbRun(`
        INSERT INTO download_logs (user_id, dataset_id, requested_at, filter_params, request_hash, status, size_mb, is_duplicate)
        VALUES (?, ?, datetime('now', '${timeModifier}'), ?, ?, ?, ?, ?)
      `, [item.user.id, item.dataset.id, filterJson, requestHash, item.status, item.dataset.size_mb, item.isDup]);

      // Cache Entry Insertion
      await dbRun(`
        INSERT INTO cache_entries (request_hash, dataset_id, filter_params, file_format, size_mb, hit_count, cached_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now', '${timeModifier}'))
        ON CONFLICT(request_hash) DO UPDATE SET hit_count = hit_count + 1
      `, [requestHash, item.dataset.id, filterJson, 'CSV', item.dataset.size_mb]);

      // Insert matching Security Alert if BLOCKED or WARNING_ISSUED
      if (item.isDup === 1) {
        let riskLevel = 'LOW';
        let alertStatus = 'ACTIVE';
        let note = null;

        if (item.user.risk_score >= 85 || item.dataset.sensitivity === 'CRITICAL') {
          riskLevel = 'CRITICAL';
        } else if (item.user.risk_score >= 60 || item.dataset.size_mb >= 1000) {
          riskLevel = 'HIGH';
        } else if (item.user.risk_score >= 40) {
          riskLevel = 'MEDIUM';
        }

        if (item.status === 'BLOCKED') {
          alertStatus = 'ACTIVE';
          note = 'Auto-blocked by system policy rule. User risk score exceeded safety threshold.';
        } else if (item.timeAgo.includes('hours')) {
          alertStatus = 'RESOLVED';
          note = 'Reviewed by SOC Admin. Verified legitimate business use.';
        }

        await dbRun(`
          INSERT INTO alerts (download_log_id, user_id, dataset_id, duplicate_count, time_window_mins, risk_level, status, detected_at, resolution_note)
          VALUES (?, ?, ?, ?, 60, ?, ?, datetime('now', '${timeModifier}'), ?)
        `, [logRes.id, item.user.id, item.dataset.id, 2, riskLevel, alertStatus, note]);
      }
    }
  }

  console.log('--- Comprehensive Data Seeding Completed Successfully ---');
};
