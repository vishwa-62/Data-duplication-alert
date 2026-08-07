import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Settings, Save, ShieldCheck, Sliders, Cpu } from 'lucide-react';

export const SettingsPage = () => {
  const { settings, updateSystemSettings } = useApp();
  const [formData, setFormData] = useState({
    DUPLICATE_WINDOW_MINS: '60',
    ALERT_THRESHOLD_LOW: '2',
    ALERT_THRESHOLD_HIGH: '4',
    BLOCK_ON_CRITICAL: 'true',
    CACHE_RETENTION_HOURS: '24'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateSystemSettings(formData);
    setSaving(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">DETECTION RULES & ENGINE CONFIGURATION</h1>
          <p className="page-subtitle">Configure sliding window time sensitivity, threat alert boundaries, cache retention, and auto-blocking.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: '750px' }}>
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.75rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SLIDING WINDOW & FREQUENCY SENSITIVITY
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">DUPLICATE DETECTION SLIDING WINDOW (MINUTES)</label>
            <input
              type="number"
              name="DUPLICATE_WINDOW_MINS"
              className="form-input"
              value={formData.DUPLICATE_WINDOW_MINS}
              onChange={handleChange}
              min={5}
              max={1440}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              Tracking window in minutes for matching identical request hashes per identity node.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">LOW RISK THRESHOLD (DOWNLOADS)</label>
              <input
                type="number"
                name="ALERT_THRESHOLD_LOW"
                className="form-input"
                value={formData.ALERT_THRESHOLD_LOW}
                onChange={handleChange}
                min={1}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                Download repeat count before issuing warning alert.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">HIGH RISK THRESHOLD (DOWNLOADS)</label>
              <input
                type="number"
                name="ALERT_THRESHOLD_HIGH"
                className="form-input"
                value={formData.ALERT_THRESHOLD_HIGH}
                onChange={handleChange}
                min={2}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                Download repeat count triggering high/critical alerts.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-critical)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AUTOMATED ENFORCEMENT & CACHE RETENTION
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">AUTO-BLOCK DOWNLOAD ON CRITICAL RISK</label>
            <select
              name="BLOCK_ON_CRITICAL"
              className="form-select"
              value={formData.BLOCK_ON_CRITICAL}
              onChange={handleChange}
            >
              <option value="true">ENABLED (Automatically block downloads on critical frequency)</option>
              <option value="false">DISABLED (Only issue security warning alerts)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">CACHE RETENTION WINDOW (HOURS)</label>
            <input
              type="number"
              name="CACHE_RETENTION_HOURS"
              className="form-input"
              value={formData.CACHE_RETENTION_HOURS}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'SAVING RULES...' : 'SAVE DETECTION RULES'}
          </button>
        </div>
      </form>
    </div>
  );
};
