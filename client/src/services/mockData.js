export const MOCK_USERS = [
  { id: 1, name: 'Alex Mercer', email: 'alex.mercer@corp.internal', department: 'Data Analytics', role: 'Senior Analyst', ip_address: '192.168.1.45', risk_score: 72, is_frozen: 0, total_downloads: 15, duplicate_downloads: 7 },
  { id: 2, name: 'Sophia Chen', email: 'sophia.chen@corp.internal', department: 'Finance & Risk', role: 'Financial Auditor', ip_address: '192.168.1.88', risk_score: 45, is_frozen: 0, total_downloads: 10, duplicate_downloads: 3 },
  { id: 3, name: 'Marcus Vance', email: 'marcus.vance@corp.internal', department: 'Cybersecurity Ops', role: 'SOC Admin', ip_address: '192.168.2.110', risk_score: 10, is_frozen: 0, total_downloads: 24, duplicate_downloads: 0 },
  { id: 4, name: 'Elena Rostova', email: 'elena.rostova@corp.internal', department: 'Engineering', role: 'DevOps Specialist', ip_address: '192.168.1.102', risk_score: 25, is_frozen: 0, total_downloads: 8, duplicate_downloads: 1 },
  { id: 5, name: 'David Miller', email: 'david.miller@corp.internal', department: 'Human Resources', role: 'HR Manager', ip_address: '192.168.3.15', risk_score: 88, is_frozen: 1, total_downloads: 12, duplicate_downloads: 8 },
  { id: 6, name: 'Samantha Wright', email: 'samantha.wright@corp.internal', department: 'Product Management', role: 'Lead Product Analyst', ip_address: '192.168.4.22', risk_score: 35, is_frozen: 0, total_downloads: 18, duplicate_downloads: 2 },
  { id: 7, name: 'Vikram Patel', email: 'vikram.patel@corp.internal', department: 'Legal & Compliance', role: 'Regulatory Officer', ip_address: '192.168.5.64', risk_score: 62, is_frozen: 0, total_downloads: 14, duplicate_downloads: 5 },
  { id: 8, name: 'Jordan Taylor', email: 'jordan.taylor@corp.internal', department: 'Marketing & Sales', role: 'Growth Data Strategist', ip_address: '192.168.1.211', risk_score: 50, is_frozen: 0, total_downloads: 29, duplicate_downloads: 6 },
  { id: 9, name: 'Hiroshi Tanaka', email: 'hiroshi.tanaka@corp.internal', department: 'Customer Support', role: 'Tier 3 Tech Lead', ip_address: '192.168.6.77', risk_score: 15, is_frozen: 0, total_downloads: 9, duplicate_downloads: 0 },
  { id: 10, name: 'Chloe Dubois', email: 'chloe.dubois@corp.internal', department: 'Engineering', role: 'Machine Learning Engineer', ip_address: '192.168.1.199', risk_score: 78, is_frozen: 0, total_downloads: 35, duplicate_downloads: 12 },
  { id: 11, name: 'Gabriel Santos', email: 'gabriel.santos@corp.internal', department: 'Finance & Risk', role: 'Treasury Analyst', ip_address: '192.168.1.91', risk_score: 20, is_frozen: 0, total_downloads: 11, duplicate_downloads: 1 },
  { id: 12, name: 'Beatrice Vance', email: 'beatrice.vance@corp.internal', department: 'Data Analytics', role: 'Data Engineer', ip_address: '192.168.2.115', risk_score: 95, is_frozen: 1, total_downloads: 42, duplicate_downloads: 19 },
  { id: 13, name: 'Liam O\'Connor', email: 'liam.oconnor@corp.internal', department: 'DevOps & Cloud Security', role: 'Cloud Architect', ip_address: '192.168.7.40', risk_score: 18, is_frozen: 0, total_downloads: 16, duplicate_downloads: 1 },
  { id: 14, name: 'Fatima Al-Mansoor', email: 'fatima.almansoor@corp.internal', department: 'Cybersecurity Ops', role: 'Incident Responder', ip_address: '192.168.2.140', risk_score: 8, is_frozen: 0, total_downloads: 22, duplicate_downloads: 0 },
  { id: 15, name: 'Oscar Lindqvist', email: 'oscar.lindqvist@corp.internal', department: 'Human Resources', role: 'Talent Operations Lead', ip_address: '192.168.3.82', risk_score: 30, is_frozen: 0, total_downloads: 7, duplicate_downloads: 1 }
];

export const MOCK_DATASETS = [
  { id: 1, title: 'Q3 Global Revenue & Tax Ledger 2025', category: 'Finance', description: 'Detailed transactional logs, regional tax compliance files, and revenue splits.', size_mb: 485.5, file_format: 'CSV', sensitivity: 'HIGH', download_count: 34 },
  { id: 2, title: 'Customer Telemetry & PII Activity Logs', category: 'Analytics', description: 'Raw user events, session duration, hashed IP records, and location heatmaps.', size_mb: 1240.0, file_format: 'JSON', sensitivity: 'CRITICAL', download_count: 52 },
  { id: 3, title: 'Core Database Infrastructure Dumps', category: 'Engineering', description: 'Full anonymized snapshot of production database tables for sandbox testing.', size_mb: 3450.0, file_format: 'SQL', sensitivity: 'HIGH', download_count: 18 },
  { id: 4, title: 'Employee Performance Reviews & Salaries 2024-2025', category: 'HR', description: 'Comprehensive HR records, salary bands, performance scoring, and bonuses.', size_mb: 120.2, file_format: 'XLSX', sensitivity: 'CRITICAL', download_count: 15 },
  { id: 5, title: 'Quarterly Marketing Campaign Conversion Metrics', category: 'Marketing', description: 'Ad spend data, conversion leads, click-through metrics across platforms.', size_mb: 68.4, file_format: 'CSV', sensitivity: 'LOW', download_count: 61 },
  { id: 6, title: 'System Security Audit & Access Logs', category: 'Security', description: 'Authentication attempts, firewall breaches, token issuances, and VPN sessions.', size_mb: 890.0, file_format: 'LOG', sensitivity: 'HIGH', download_count: 29 },
  { id: 7, title: 'User Authentication Tokens & OAuth Credentials', category: 'Security', description: 'Encrypted access tokens, refreshed OAuth grant logs, and session secrets.', size_mb: 215.0, file_format: 'JSON', sensitivity: 'CRITICAL', download_count: 22 },
  { id: 8, title: 'Global Logistics & Supply Chain Shipments Q1-Q4', category: 'Operations', description: 'Fleet tracking logs, warehouse inventory balances, and transit latency metrics.', size_mb: 1850.0, file_format: 'PARQUET', sensitivity: 'MEDIUM', download_count: 38 },
  { id: 9, title: 'Customer Support Escalation Tickets & Chat Transcripts', category: 'Support', description: 'Resolved tier-3 support tickets, customer sentiment tags, and agent replies.', size_mb: 520.0, file_format: 'JSON', sensitivity: 'MEDIUM', download_count: 26 },
  { id: 10, title: 'Patent Filings & Proprietary Source Code Archival', category: 'Legal', description: 'Archived patent claims, NDA documentation, and core algorithmic source code.', size_mb: 4200.0, file_format: 'ZIP', sensitivity: 'CRITICAL', download_count: 9 },
  { id: 11, title: 'ML Model Weights & Training Evaluation Datasets', category: 'AI/ML', description: 'Trained Transformer embeddings, validation datasets, and hyperparameter logs.', size_mb: 6500.0, file_format: 'PARQUET', sensitivity: 'MEDIUM', download_count: 47 },
  { id: 12, title: 'Enterprise ERP Financial Statements & General Ledger', category: 'Finance', description: 'Consolidated balance sheets, quarterly EBITDA targets, and vendor payouts.', size_mb: 310.0, file_format: 'XLSX', sensitivity: 'HIGH', download_count: 20 },
  { id: 13, title: 'Executive Board Meeting Transcripts & M&A Dossiers', category: 'Executive', description: 'Confidential board meeting minutes, acquisition evaluations, and strategic plans.', size_mb: 95.0, file_format: 'PDF', sensitivity: 'CRITICAL', download_count: 11 },
  { id: 14, title: 'Cloud Infrastructure Terraform State Snapshots', category: 'DevOps', description: 'IaC topology mappings, VPC subnets, and cloud security group configurations.', size_mb: 150.0, file_format: 'JSON', sensitivity: 'HIGH', download_count: 33 },
  { id: 15, title: 'Healthcare Benefits & Claims Master Records', category: 'HR', description: 'Anonymized health insurance claim records, employee coverage tiers, and payouts.', size_mb: 780.0, file_format: 'CSV', sensitivity: 'CRITICAL', download_count: 14 }
];

export const MOCK_POLICIES = [
  { id: 1, name: 'Large File Repeat Limit', rule_type: 'MAX_FILE_SIZE', threshold_value: 1000.0, action: 'REQUIRE_CACHE', status: 1, created_at: '2026-08-01 10:00:00' },
  { id: 2, name: 'Critical PII Instant High Alert', rule_type: 'CRITICAL_BLOCK', threshold_value: 1.0, action: 'ALERT_HIGH', status: 1, created_at: '2026-08-02 11:30:00' },
  { id: 3, name: 'Excessive Repeat Auto-Block', rule_type: 'DUPLICATE_LIMIT', threshold_value: 3.0, action: 'BLOCK', status: 1, created_at: '2026-08-03 14:15:00' },
  { id: 4, name: 'Massive Export Department Cap', rule_type: 'DEPARTMENT_CAP', threshold_value: 5000.0, action: 'ALERT_HIGH', status: 1, created_at: '2026-08-04 09:45:00' },
  { id: 5, name: 'Suspicious Rapid Bulk Download', rule_type: 'DUPLICATE_LIMIT', threshold_value: 5.0, action: 'BLOCK', status: 1, created_at: '2026-08-05 16:20:00' }
];

export const MOCK_ALERTS = [
  { id: 1, risk_level: 'CRITICAL', status: 'ACTIVE', duplicate_count: 4, time_window_mins: 60, detected_at: '2026-08-08 09:45:10', resolution_note: 'Auto-blocked by system policy rule. User risk score exceeded safety threshold.', user_id: 12, user_name: 'Beatrice Vance', user_email: 'beatrice.vance@corp.internal', user_department: 'Data Analytics', ip_address: '192.168.2.115', user_risk_score: 95, dataset_id: 11, dataset_title: 'ML Model Weights & Training Evaluation Datasets', size_mb: 6500.0, file_format: 'PARQUET', sensitivity: 'MEDIUM' },
  { id: 2, risk_level: 'CRITICAL', status: 'ACTIVE', duplicate_count: 3, time_window_mins: 60, detected_at: '2026-08-08 09:30:22', resolution_note: null, user_id: 5, user_name: 'David Miller', user_email: 'david.miller@corp.internal', user_department: 'Human Resources', ip_address: '192.168.3.15', user_risk_score: 88, dataset_id: 4, dataset_title: 'Employee Performance Reviews & Salaries 2024-2025', size_mb: 120.2, file_format: 'XLSX', sensitivity: 'CRITICAL' },
  { id: 3, risk_level: 'HIGH', status: 'ACTIVE', duplicate_count: 3, time_window_mins: 60, detected_at: '2026-08-08 09:15:05', resolution_note: null, user_id: 10, user_name: 'Chloe Dubois', user_email: 'chloe.dubois@corp.internal', user_department: 'Engineering', ip_address: '192.168.1.199', user_risk_score: 78, dataset_id: 2, dataset_title: 'Customer Telemetry & PII Activity Logs', size_mb: 1240.0, file_format: 'JSON', sensitivity: 'CRITICAL' },
  { id: 4, risk_level: 'HIGH', status: 'RESOLVED', duplicate_count: 2, time_window_mins: 60, detected_at: '2026-08-08 08:50:00', resolution_note: 'Reviewed by SOC Admin. Verified legitimate business use.', user_id: 1, user_name: 'Alex Mercer', user_email: 'alex.mercer@corp.internal', user_department: 'Data Analytics', ip_address: '192.168.1.45', user_risk_score: 72, dataset_id: 1, dataset_title: 'Q3 Global Revenue & Tax Ledger 2025', size_mb: 485.5, file_format: 'CSV', sensitivity: 'HIGH' },
  { id: 5, risk_level: 'HIGH', status: 'RESOLVED', duplicate_count: 2, time_window_mins: 60, detected_at: '2026-08-08 08:20:00', resolution_note: 'User instructed to serve from local cache.', user_id: 7, user_name: 'Vikram Patel', user_email: 'vikram.patel@corp.internal', user_department: 'Legal & Compliance', ip_address: '192.168.5.64', user_risk_score: 62, dataset_id: 10, dataset_title: 'Patent Filings & Proprietary Source Code Archival', size_mb: 4200.0, file_format: 'ZIP', sensitivity: 'CRITICAL' },
  { id: 6, risk_level: 'MEDIUM', status: 'DISMISSED', duplicate_count: 2, time_window_mins: 60, detected_at: '2026-08-08 07:10:00', resolution_note: 'False positive alert during scheduled batch processing.', user_id: 8, user_name: 'Jordan Taylor', user_email: 'jordan.taylor@corp.internal', user_department: 'Marketing & Sales', ip_address: '192.168.1.211', user_risk_score: 50, dataset_id: 8, dataset_title: 'Global Logistics & Supply Chain Shipments Q1-Q4', size_mb: 1850.0, file_format: 'PARQUET', sensitivity: 'MEDIUM' }
];

export const MOCK_AUDIT_LOGS = [
  { id: 1, requested_at: '2026-08-08 09:46:00', filter_params: '{"region":"US-East","split":"train"}', status: 'BLOCKED', size_mb: 6500.0, is_duplicate: 1, request_hash: 'c81e728d9d4c2f636f067f89cc14862c', user_name: 'Beatrice Vance', user_email: 'beatrice.vance@corp.internal', department: 'Data Analytics', ip_address: '192.168.2.115', dataset_title: 'ML Model Weights & Training Evaluation Datasets', category: 'AI/ML', file_format: 'PARQUET' },
  { id: 2, requested_at: '2026-08-08 09:40:00', filter_params: '{"region":"US-East","split":"train"}', status: 'WARNING_ISSUED', size_mb: 6500.0, is_duplicate: 1, request_hash: 'c81e728d9d4c2f636f067f89cc14862c', user_name: 'Beatrice Vance', user_email: 'beatrice.vance@corp.internal', department: 'Data Analytics', ip_address: '192.168.2.115', dataset_title: 'ML Model Weights & Training Evaluation Datasets', category: 'AI/ML', file_format: 'PARQUET' },
  { id: 3, requested_at: '2026-08-08 09:30:00', filter_params: '{"department":"Executive","year":"2025"}', status: 'BLOCKED', size_mb: 120.2, is_duplicate: 1, request_hash: '3c59dc048e8850243be8079a5c74d079', user_name: 'David Miller', user_email: 'david.miller@corp.internal', department: 'Human Resources', ip_address: '192.168.3.15', dataset_title: 'Employee Performance Reviews & Salaries 2024-2025', category: 'HR', file_format: 'XLSX' },
  { id: 4, requested_at: '2026-08-08 09:15:00', filter_params: '{"sample_rate":"100%"}', status: 'WARNING_ISSUED', size_mb: 1240.0, is_duplicate: 1, request_hash: 'b6d767d2f8ed5d21a44b0e5886680cb9', user_name: 'Chloe Dubois', user_email: 'chloe.dubois@corp.internal', department: 'Engineering', ip_address: '192.168.1.199', dataset_title: 'Customer Telemetry & PII Activity Logs', category: 'Analytics', file_format: 'JSON' },
  { id: 5, requested_at: '2026-08-08 08:50:00', filter_params: '{"quarter":"Q3","status":"audited"}', status: 'WARNING_ISSUED', size_mb: 485.5, is_duplicate: 1, request_hash: 'a87ff679a2f3e71d9181a67b7542122c', user_name: 'Alex Mercer', user_email: 'alex.mercer@corp.internal', department: 'Data Analytics', ip_address: '192.168.1.45', dataset_title: 'Q3 Global Revenue & Tax Ledger 2025', category: 'Finance', file_format: 'CSV' },
  { id: 6, requested_at: '2026-08-08 08:20:00', filter_params: '{"classification":"strict"}', status: 'WARNING_ISSUED', size_mb: 4200.0, is_duplicate: 1, request_hash: 'e4da3b7fbbce2345d7772b0674a318d5', user_name: 'Vikram Patel', user_email: 'vikram.patel@corp.internal', department: 'Legal & Compliance', ip_address: '192.168.5.64', dataset_title: 'Patent Filings & Proprietary Source Code Archival', category: 'Legal', file_format: 'ZIP' },
  { id: 7, requested_at: '2026-08-08 07:15:00', filter_params: '{"format":"csv"}', status: 'SERVED_FROM_CACHE', size_mb: 485.5, is_duplicate: 1, request_hash: '1679091c5a880faf6fb5e6087eb1b2dc', user_name: 'Sophia Chen', user_email: 'sophia.chen@corp.internal', department: 'Finance & Risk', ip_address: '192.168.1.88', dataset_title: 'Q3 Global Revenue & Tax Ledger 2025', category: 'Finance', file_format: 'CSV' },
  { id: 8, requested_at: '2026-08-08 06:45:00', filter_params: '{"severity":"high"}', status: 'SUCCESS', size_mb: 890.0, is_duplicate: 0, request_hash: '8f14e45fceea167a5a36dedd4bea2543', user_name: 'Marcus Vance', user_email: 'marcus.vance@corp.internal', department: 'Cybersecurity Ops', ip_address: '192.168.2.110', dataset_title: 'System Security Audit & Access Logs', category: 'Security', file_format: 'LOG' }
];

export const MOCK_SETTINGS = {
  DUPLICATE_WINDOW_MINS: '60',
  ALERT_THRESHOLD_LOW: '2',
  ALERT_THRESHOLD_HIGH: '4',
  BLOCK_ON_CRITICAL: 'true',
  CACHE_RETENTION_HOURS: '24'
};

export const MOCK_ANALYTICS = {
  totalDownloads: 39,
  duplicateDownloads: 21,
  blockedDownloads: 6,
  cacheHits: 12,
  activeAlerts: 7,
  bandwidthWastedMB: 19850,
  bandwidthWastedGB: 19.38,
  bandwidthSavedCacheMB: 14200,
  departmentBreakdown: [
    { department: 'Data Analytics', total_requests: 12, duplicates: 7 },
    { department: 'Engineering', total_requests: 9, duplicates: 4 },
    { department: 'Human Resources', total_requests: 6, duplicates: 4 },
    { department: 'Legal & Compliance', total_requests: 4, duplicates: 3 },
    { department: 'Finance & Risk', total_requests: 5, duplicates: 2 },
    { department: 'Marketing & Sales', total_requests: 3, duplicates: 1 }
  ],
  riskDistribution: [
    { risk_level: 'CRITICAL', count: 4 },
    { risk_level: 'HIGH', count: 8 },
    { risk_level: 'MEDIUM', count: 6 },
    { risk_level: 'LOW', count: 4 }
  ],
  trafficTrends: [
    { hour: '00:00', requests: 4, duplicates: 1 },
    { hour: '04:00', requests: 3, duplicates: 0 },
    { hour: '08:00', requests: 22, duplicates: 7 },
    { hour: '12:00', requests: 38, duplicates: 12 },
    { hour: '16:00', requests: 29, duplicates: 6 },
    { hour: '20:00', requests: 14, duplicates: 3 }
  ]
};
