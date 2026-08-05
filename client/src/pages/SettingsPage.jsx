import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Settings, Save, ShieldCheck, Sliders } from 'lucide-react';

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
          <h1 className="page-title">Duplication Detection Rules & Settings</h1>
          <p className="page-subtitle">Configure duplicate window sensitivity, threat alert thresholds, and automated block enforcement.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ maxWidth: '720px' }}>
        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Sliders size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Detection Window & Frequency Rules</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Duplicate Detection Window (Minutes)</label>
            <input
              type="number"
              name="DUPLICATE_WINDOW_MINS"
              className="form-input"
              value={formData.DUPLICATE_WINDOW_MINS}
              onChange={handleChange}
              min={5}
              max={1440}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Time window in minutes to track identical requests from the same user persona.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Low Risk Threshold (Downloads)</label>
              <input
                type="number"
                name="ALERT_THRESHOLD_LOW"
                className="form-input"
                value={formData.ALERT_THRESHOLD_LOW}
                onChange={handleChange}
                min={1}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Number of repeat downloads before issuing warning alert.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">High Risk Threshold (Downloads)</label>
              <input
                type="number"
                name="ALERT_THRESHOLD_HIGH"
                className="form-input"
                value={formData.ALERT_THRESHOLD_HIGH}
                onChange={handleChange}
                min={2}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Number of repeat downloads triggering high/critical alerts.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-critical)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Automated Enforcement Controls</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Auto-Block Download on Critical Risk</label>
            <select
              name="BLOCK_ON_CRITICAL"
              className="form-select"
              value={formData.BLOCK_ON_CRITICAL}
              onChange={handleChange}
            >
              <option value="true">Enabled (Automatically block downloads on critical frequency)</option>
              <option value="false">Disabled (Only issue security warning alerts)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cache Retention Window (Hours)</label>
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
            {saving ? 'Saving Settings...' : 'Save Detection Rules'}
          </button>
        </div>
      </form>
    </div>
  );
};
