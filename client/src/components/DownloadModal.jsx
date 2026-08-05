import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Download, AlertTriangle, ShieldAlert, FileText, Check, X, RefreshCw, HardDrive, Lock } from 'lucide-react';
import { RiskBadge } from './RiskBadge.jsx';

export const DownloadModal = ({ dataset, onClose }) => {
  const { triggerDownload, handleServeFromCache, selectedUser } = useApp();
  const [filterRegion, setFilterRegion] = useState('Global');
  const [filterFormat, setFilterFormat] = useState(dataset.file_format || 'CSV');
  const [filterYear, setFilterYear] = useState('2025');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const isUserFrozen = selectedUser?.is_frozen === 1;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const filterParams = { region: filterRegion, format: filterFormat, year: filterYear };
      const res = await triggerDownload(dataset.id, filterParams);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCache = async () => {
    if (!result?.requestHash) return;
    setLoading(true);
    try {
      await handleServeFromCache(dataset.id, result.requestHash);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Request Data Download</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dataset ID: #{dataset.id}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Dataset Metadata */}
        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{dataset.title}</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{dataset.description}</div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{dataset.category}</strong></span>
            <span>Size: <strong style={{ color: 'var(--text-primary)' }}>{dataset.size_mb} MB</strong></span>
            <span>Sensitivity: <RiskBadge level={dataset.sensitivity} /></span>
          </div>
        </div>

        {/* Selected User Notice */}
        <div style={{ fontSize: '0.8125rem', marginBottom: '1.25rem', color: isUserFrozen ? 'var(--color-critical)' : 'var(--text-secondary)', background: isUserFrozen ? 'var(--color-critical-bg)' : 'var(--bg-surface)', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isUserFrozen ? <Lock size={16} /> : null}
          <div>
            Requesting as: <strong style={{ color: isUserFrozen ? 'var(--color-critical)' : 'var(--accent-primary)' }}>{selectedUser?.name} ({selectedUser?.department})</strong>
            {isUserFrozen && <div style={{ fontSize: '0.75rem', marginTop: 2 }}>Account frozen due to high anomaly risk ({selectedUser?.risk_score}/100).</div>}
          </div>
        </div>

        {!result ? (
          <>
            {/* Export Parameter Customization */}
            <div className="form-group">
              <label className="form-label">Export Format</label>
              <select className="form-select" value={filterFormat} onChange={e => setFilterFormat(e.target.value)} disabled={isUserFrozen}>
                <option value="CSV">CSV (Structured Text)</option>
                <option value="JSON">JSON (Nested Data)</option>
                <option value="XLSX">Excel Spreadsheet (.xlsx)</option>
                <option value="SQL">SQL Dump Script</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Region Filter</label>
                <select className="form-select" value={filterRegion} onChange={e => setFilterRegion(e.target.value)} disabled={isUserFrozen}>
                  <option value="Global">Global (All Regions)</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Data Year</label>
                <select className="form-select" value={filterYear} onChange={e => setFilterYear(e.target.value)} disabled={isUserFrozen}>
                  <option value="2025">2025 (Current)</option>
                  <option value="2024">2024 (Historical)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDownload} disabled={loading || isUserFrozen}>
                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                Confirm & Download
              </button>
            </div>
          </>
        ) : (
          /* Result & Duplication Warning overlay */
          <div style={{ animation: 'modal-slide-in 0.2s ease-out' }}>
            {result.status === 'BLOCKED' || result.status === 'USER_FROZEN' ? (
              <div style={{ background: 'var(--color-critical-bg)', border: '1px solid var(--color-critical)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
                <ShieldAlert size={48} style={{ color: 'var(--color-critical)', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-critical)' }}>
                  {result.status === 'USER_FROZEN' ? 'USER PRIVILEGES SUSPENDED' : 'DOWNLOAD BLOCKED'}
                </h4>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>{result.message}</p>
              </div>
            ) : result.isDuplicate ? (
              <div style={{ background: 'var(--color-warning-bg)', border: '1px solid var(--color-warning)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={24} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>DUPLICATION WARNING</h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{result.message}</p>

                <div style={{ background: 'var(--bg-primary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
                  <div>Duplicate Count: <strong>{result.duplicateCount} download(s) in window</strong></div>
                  <div>Risk Level: <RiskBadge level={result.riskLevel} /></div>
                  <div>Bandwidth Saved if Cached Used: <strong>{dataset.size_mb} MB</strong></div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, background: 'var(--color-success)' }} onClick={handleUseCache} disabled={loading}>
                    <HardDrive size={14} />
                    Serve Cached Payload (0 MB Wasted)
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={onClose}>
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center' }}>
                <Check size={40} style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-success)' }}>DOWNLOAD INITIATED</h4>
                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>File payload served clean with zero duplication flags.</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
