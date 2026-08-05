import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Search, Download, FileText, Code, CheckCircle, ShieldAlert } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/audit-logs/export?format=csv', '_blank');
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
          <h1 className="page-title">Immutable Audit Trail & Data Export</h1>
          <p className="page-subtitle">Historical records of all data download requests, request fingerprints, and compliance export options.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            <FileText size={16} /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportJSON}>
            <Code size={16} /> Export JSON
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by user, email, department, or dataset..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: '180px' }}>
            <option value="ALL">All Log Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARNING_ISSUED">WARNING_ISSUED</option>
            <option value="SERVED_FROM_CACHE">SERVED_FROM_CACHE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Timestamp</th>
              <th>User / Dept</th>
              <th>Dataset Requested</th>
              <th>Request Filters</th>
              <th>Size</th>
              <th>Duplicate Flag</th>
              <th>Action Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Loading transaction logs from SQLite database...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No log entries matched your filter query.
                </td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{log.id}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {new Date(log.requested_at).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{log.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.department} ({log.ip_address})</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.dataset_title}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.file_format}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.filter_params}
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.size_mb} MB</td>
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
                      <span className="badge badge-low" style={{ color: 'var(--color-success)', background: 'var(--color-success-bg)' }}>SERVED FROM CACHE</span>
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
