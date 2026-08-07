import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { ShieldAlert, CheckCircle2, XCircle, Search, Filter, ShieldCheck, FileText } from 'lucide-react';

export const AlertsPage = () => {
  const { alerts, resolveAlert } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [selectedAlertForNote, setSelectedAlertForNote] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesRisk = filterRisk === 'ALL' || a.risk_level === filterRisk;
    return matchesStatus && matchesRisk;
  });

  const handleConfirmResolve = async () => {
    if (!selectedAlertForNote) return;
    await resolveAlert(selectedAlertForNote.id, 'RESOLVED', resolutionNote || 'Resolved via Security Operations Center');
    setSelectedAlertForNote(null);
    setResolutionNote('');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">SECURITY INCIDENT ALERTS</h1>
          <p className="page-subtitle">Manage duplicate download threat flags, review risk anomalies, and log mandatory SOC resolution notes.</p>
        </div>
      </div>

      {/* Cyber Filter Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Filter size={16} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>STATUS:</span>
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '160px' }}>
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="DISMISSED">DISMISSED</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>RISK SCORE:</span>
          <select className="form-select" value={filterRisk} onChange={e => setFilterRisk(e.target.value)} style={{ width: '160px' }}>
            <option value="ALL">ALL LEVELS</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* High-Tech Data Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ALERT ID</th>
              <th>RISK LEVEL</th>
              <th>REQUESTING PERSONA</th>
              <th>TARGET DATASET</th>
              <th>DUPLICATES</th>
              <th>STATUS</th>
              <th>DETECTED TIME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  NO INCIDENTS MATCHING ACTIVE FILTER PARAMETERS.
                </td>
              </tr>
            ) : (
              filteredAlerts.map(alert => (
                <tr key={alert.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>#{alert.id}</td>
                  <td><RiskBadge level={alert.risk_level} /></td>
                  <td>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{alert.user_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{alert.user_email} • {alert.user_department}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{alert.dataset_title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{alert.size_mb} MB • {alert.file_format}</div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-warning)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{alert.duplicate_count}x</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}> in {alert.time_window_mins}m</span>
                  </td>
                  <td>
                    <span className={`badge ${alert.status === 'ACTIVE' ? 'badge-critical' : alert.status === 'RESOLVED' ? 'badge-success' : 'badge-low'}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {new Date(alert.detected_at).toLocaleString()}
                  </td>
                  <td>
                    {alert.status === 'ACTIVE' ? (
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedAlertForNote(alert)}
                        >
                          RESOLVE
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => resolveAlert(alert.id, 'DISMISSED', 'Dismissed by SOC admin')}
                        >
                          DISMISS
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {alert.resolution_note || 'RESOLVED'}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resolve Note Modal */}
      {selectedAlertForNote && (
        <div className="modal-overlay" onClick={() => setSelectedAlertForNote(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              // RESOLVE SECURITY INCIDENT #{selectedAlertForNote.id}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Log mandatory resolution audit note for persona <strong>{selectedAlertForNote.user_name}</strong> downloading <strong>{selectedAlertForNote.dataset_title}</strong>.
            </p>

            <div className="form-group">
              <label className="form-label">RESOLUTION NOTE / AUDIT LOG REASON</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Verified with SOC Lead. Transfer approved for quarterly analytics compliance."
                value={resolutionNote}
                onChange={e => setResolutionNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedAlertForNote(null)}>CANCEL</button>
              <button className="btn btn-primary" onClick={handleConfirmResolve}>SUBMIT RESOLUTION</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
