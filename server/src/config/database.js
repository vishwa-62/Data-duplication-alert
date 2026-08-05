import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite Database at:', dbPath);
  }
});

// Promisified database helpers
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Initialize schema and initial seed data
export const initDatabase = async () => {
  try {
    // 1. Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        role TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        risk_score INTEGER DEFAULT 15,
        is_frozen INTEGER DEFAULT 0,
        total_downloads INTEGER DEFAULT 0,
        duplicate_downloads INTEGER DEFAULT 0
      )
    `);

    // Ensure columns exist if migrating existing DB
    try { await dbRun(`ALTER TABLE users ADD COLUMN risk_score INTEGER DEFAULT 15`); } catch (e) {}
    try { await dbRun(`ALTER TABLE users ADD COLUMN is_frozen INTEGER DEFAULT 0`); } catch (e) {}
    try { await dbRun(`ALTER TABLE users ADD COLUMN total_downloads INTEGER DEFAULT 0`); } catch (e) {}
    try { await dbRun(`ALTER TABLE users ADD COLUMN duplicate_downloads INTEGER DEFAULT 0`); } catch (e) {}

    // 2. Datasets Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS datasets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        size_mb REAL NOT NULL,
        file_format TEXT NOT NULL,
        sensitivity TEXT NOT NULL,
        download_count INTEGER DEFAULT 0
      )
    `);

    // 3. Download Logs Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS download_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        dataset_id INTEGER NOT NULL,
        requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        filter_params TEXT DEFAULT '{}',
        request_hash TEXT NOT NULL,
        status TEXT NOT NULL, -- 'SUCCESS', 'WARNING_ISSUED', 'BLOCKED', 'SERVED_FROM_CACHE'
        size_mb REAL NOT NULL,
        is_duplicate INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (dataset_id) REFERENCES datasets(id)
      )
    `);

    // 4. Alerts Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        download_log_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        dataset_id INTEGER NOT NULL,
        duplicate_count INTEGER NOT NULL,
        time_window_mins INTEGER NOT NULL,
        risk_level TEXT NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
        status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'RESOLVED', 'DISMISSED'
        detected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolution_note TEXT,
        FOREIGN KEY (download_log_id) REFERENCES download_logs(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (dataset_id) REFERENCES datasets(id)
      )
    `);

    // 5. Settings Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Security Policy Rules Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rule_type TEXT NOT NULL, -- 'MAX_FILE_SIZE', 'CRITICAL_BLOCK', 'DUPLICATE_LIMIT', 'DEPARTMENT_CAP'
        threshold_value REAL NOT NULL,
        action TEXT NOT NULL, -- 'BLOCK', 'ALERT_HIGH', 'REQUIRE_CACHE'
        status INTEGER DEFAULT 1, -- 1 = Enabled, 0 = Disabled
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Cache Entries Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS cache_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_hash TEXT UNIQUE NOT NULL,
        dataset_id INTEGER NOT NULL,
        filter_params TEXT NOT NULL,
        file_format TEXT NOT NULL,
        size_mb REAL NOT NULL,
        hit_count INTEGER DEFAULT 0,
        cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dataset_id) REFERENCES datasets(id)
      )
    `);

    // Seed default settings if empty
    const existingSettings = await dbQuery(`SELECT COUNT(*) as count FROM settings`);
    if (existingSettings[0].count === 0) {
      await dbRun(`INSERT INTO settings (key, value) VALUES ('DUPLICATE_WINDOW_MINS', '60')`);
      await dbRun(`INSERT INTO settings (key, value) VALUES ('ALERT_THRESHOLD_LOW', '2')`);
      await dbRun(`INSERT INTO settings (key, value) VALUES ('ALERT_THRESHOLD_HIGH', '4')`);
      await dbRun(`INSERT INTO settings (key, value) VALUES ('BLOCK_ON_CRITICAL', 'true')`);
      await dbRun(`INSERT INTO settings (key, value) VALUES ('CACHE_RETENTION_HOURS', '24')`);
    }

    // Seed Policies if empty
    const existingPolicies = await dbQuery(`SELECT COUNT(*) as count FROM policies`);
    if (existingPolicies[0].count === 0) {
      await dbRun(`INSERT INTO policies (name, rule_type, threshold_value, action, status) VALUES
        ('Large File Repeat Limit', 'MAX_FILE_SIZE', 1000.0, 'REQUIRE_CACHE', 1),
        ('Critical PII Instant High Alert', 'CRITICAL_BLOCK', 1.0, 'ALERT_HIGH', 1),
        ('Excessive Repeat Auto-Block', 'DUPLICATE_LIMIT', 3.0, 'BLOCK', 1)
      `);
    }

    // Seed Users if empty
    const existingUsers = await dbQuery(`SELECT COUNT(*) as count FROM users`);
    if (existingUsers[0].count === 0) {
      await dbRun(`INSERT INTO users (name, email, department, role, ip_address, risk_score, is_frozen, total_downloads, duplicate_downloads) VALUES 
        ('Alex Mercer', 'alex.mercer@corp.internal', 'Data Analytics', 'Senior Analyst', '192.168.1.45', 72, 0, 15, 7),
        ('Sophia Chen', 'sophia.chen@corp.internal', 'Finance & Risk', 'Financial Auditor', '192.168.1.88', 45, 0, 10, 3),
        ('Marcus Vance', 'marcus.vance@corp.internal', 'Cybersecurity Ops', 'SOC Admin', '192.168.2.110', 10, 0, 24, 0),
        ('Elena Rostova', 'elena.rostova@corp.internal', 'Engineering', 'DevOps Specialist', '192.168.1.102', 25, 0, 8, 1),
        ('David Miller', 'david.miller@corp.internal', 'Human Resources', 'HR Manager', '192.168.3.15', 88, 1, 12, 8)
      `);
    }

    // Seed Datasets if empty
    const existingDatasets = await dbQuery(`SELECT COUNT(*) as count FROM datasets`);
    if (existingDatasets[0].count === 0) {
      await dbRun(`INSERT INTO datasets (title, category, description, size_mb, file_format, sensitivity, download_count) VALUES 
        ('Q3 Global Revenue & Tax Ledger 2025', 'Finance', 'Detailed transactional logs, regional tax compliance files, and revenue splits.', 485.5, 'CSV', 'HIGH', 14),
        ('Customer Telemetry & PII Activity Logs', 'Analytics', 'Raw user events, session duration, hashed IP records, and location heatmaps.', 1240.0, 'JSON', 'CRITICAL', 32),
        ('Core Database Infrastructure Dumps', 'Engineering', 'Full anonymized snapshot of production database tables for sandbox testing.', 3450.0, 'SQL', 'HIGH', 8),
        ('Employee Performance Reviews & Salaries 2024-2025', 'HR', 'Comprehensive HR records, salary bands, performance scoring, and bonuses.', 120.2, 'XLSX', 'CRITICAL', 5),
        ('Quarterly Marketing Campaign Conversion Metrics', 'Marketing', 'Ad spend data, conversion leads, click-through metrics across platforms.', 68.4, 'CSV', 'LOW', 41),
        ('System Security Audit & Access Logs', 'Security', 'Authentication attempts, firewall breaches, token issuances, and VPN sessions.', 890.0, 'LOG', 'HIGH', 19)
      `);
    }

    console.log('Database initialization & feature expansion migration completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default db;
