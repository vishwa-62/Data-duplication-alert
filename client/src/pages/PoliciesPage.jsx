import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ShieldCheck, Plus, ToggleLeft, ToggleRight, Trash2, Sliders, AlertTriangle } from 'lucide-react';

export const PoliciesPage = () => {
  const { policies, toggleSecurityPolicy, createSecurityPolicy } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState('MAX_FILE_SIZE');
  const [thresholdValue, setThresholdValue] = useState(500);
  const [action, setAction] = useState('REQUIRE_CACHE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    await createSecurityPolicy({ name, rule_type: ruleType, threshold_value: parseFloat(thresholdValue), action });
    setShowModal(false);
    setName('');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Custom Security Policy Rules</h1>
          <p className="page-subtitle">Configure automated enforcement actions based on file payload size, duplication limits, and dataset sensitivity.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Security Rule
        </button>
      </div>

      {/* Policy Rules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {policies.map(policy => {
          const isEnabled = policy.status === 1;

          return (
            <div key={policy.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isEnabled ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  background: isEnabled ? 'var(--accent-glow)' : 'var(--bg-surface)',
                  color: isEnabled ? 'var(--accent-primary)' : 'var(--text-muted)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>{policy.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    Rule Type: <strong style={{ color: 'var(--text-primary)' }}>{policy.rule_type}</strong> • Threshold: <strong style={{ color: 'var(--text-primary)' }}>{policy.threshold_value}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Enforcement Action: <span className="badge badge-medium" style={{ background: 'var(--bg-surface)' }}>{policy.action}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => toggleSecurityPolicy(policy.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isEnabled ? 'var(--color-success)' : 'var(--text-muted)', fontWeight: 700 }}
                >
                  {isEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  <span>{isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Add Policy */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.25rem' }}>Create Security Rule</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Rule Title / Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block Large Financial Dumps"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rule Condition Type</label>
                <select className="form-select" value={ruleType} onChange={e => setRuleType(e.target.value)}>
                  <option value="MAX_FILE_SIZE">MAX_FILE_SIZE (Trigger if dataset size MB exceeds threshold)</option>
                  <option value="CRITICAL_BLOCK">CRITICAL_BLOCK (Trigger on Critical Sensitivity repeat downloads)</option>
                  <option value="DUPLICATE_LIMIT">DUPLICATE_LIMIT (Trigger when download repeat count reaches threshold)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Threshold Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={thresholdValue}
                  onChange={e => setThresholdValue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enforcement Action</label>
                <select className="form-select" value={action} onChange={e => setAction(e.target.value)}>
                  <option value="REQUIRE_CACHE">REQUIRE_CACHE (Suggest/Require serving from cached payload)</option>
                  <option value="BLOCK">BLOCK (Block download transaction immediately)</option>
                  <option value="ALERT_HIGH">ALERT_HIGH (Generate High Severity Security Alert)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Policy Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
