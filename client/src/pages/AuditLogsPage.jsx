import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { MOCK_AUDIT_LOGS } from '../services/mockData.js';
import { Search, Download, FileText, Code, CheckCircle, ShieldAlert } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState(MOCK_AUDIT_LOGS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      if (res.data?.length > 0) setLogs(res.data);
    } catch (err) {
      console.warn('Backend API offline or on GitHub Pages static host, using mock audit logs.');
      setLogs(MOCK_AUDIT_LOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Department', 'Dataset', 'Size (MB)', 'Status', 'Is Duplicate', 'Hash'];
    const rows = logs.map(l => [
      l.id,
      `"${l.requested_at}"`,
      `"${l.user_name}"`,
      `"${l.department}"`,
      `"${l.dataset_title ? l.dataset_title.replace(/"/g, '""') : ''}"`,
      l.size_mb,
      l.status,
      l.is_duplicate ? 'YES' : 'NO',
      l.request_hash
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'download_audit_logs.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'audit_logs_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter(l => {
    const text = `${l.user_name} ${l.user_email} ${l.dataset_title} ${l.department}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">IMMUTABLE AUDIT TRAIL & EXPORTS</h1>
          <p className="page-subtitle">Historical archive of all payload request hashes, network fingerprints, and SOC compliance exports.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <FileText size={16} /> EXPORT CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportJSON}>
            <Code size={16} /> EXPORT JSON
          </button>
        </div>
      </div>

      {/* Cyber Search & Filter Controls */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="SEARCH BY PERSONA, EMAIL, DEPT OR DATASET..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>LOG STATUS:</span>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '200px' }}>
            <option value="ALL">ALL LOG STATUSES</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARNING_ISSUED">WARNING_ISSUED</option>
            <option value="SERVED_FROM_CACHE">SERVED_FROM_CACHE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* High-Tech Data Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>LOG ID</th>
              <th>TIMESTAMP</th>
              <th>PERSONA / DEPT</th>
              <th>TARGET DATASET</th>
              <th>FILTER PARAMS</th>
              <th>PAYLOAD SIZE</th>
              <th>DUPLICATE FLAG</th>
              <th>ACTION STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  FETCHING TRANSACTION TELEMETRY FROM DATABASE...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  NO AUDIT TRAIL LOGS MATCHED SEARCH QUERY.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)' }}>#{log.id}</td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {new Date(log.requested_at).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{log.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{log.department} ({log.ip_address})</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.dataset_title}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.file_format}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.filter_params}
                  </td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{log.size_mb} MB</td>
                  <td>
                    {log.is_duplicate ? (
                      <span className="badge badge-medium">YES (DUPLICATE)</span>
                    ) : (
                      <span className="badge badge-success">NO</span>
                    )}
                  </td>
                  <td>
                    {log.status === 'BLOCKED' ? (
                      <span className="badge badge-critical">BLOCKED</span>
                    ) : log.status === 'WARNING_ISSUED' ? (
                      <span className="badge badge-high">WARNING ISSUED</span>
                    ) : log.status === 'SERVED_FROM_CACHE' ? (
                      <span className="badge badge-low" style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)' }}>CACHE SERVED</span>
                    ) : (
                      <span className="badge badge-success">SUCCESS</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
