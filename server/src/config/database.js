import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedComprehensiveData } from './seeder.js';

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

    // Run comprehensive data seeder
    await seedComprehensiveData(dbRun, dbQuery, dbGet, false);

    console.log('Database initialization & comprehensive data seeding completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default db;
