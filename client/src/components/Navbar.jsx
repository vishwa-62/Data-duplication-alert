import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ShieldCheck, User, AlertTriangle, RefreshCw, Lock, Palette } from 'lucide-react';

export const Navbar = () => {
  const { users, selectedUser, setSelectedUser, alerts, refreshAllData, loading, theme, setTheme } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
          <ShieldCheck size={14} />
          <span>Detection Engine Active</span>
        </div>
      </div>

      {/* Right Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Multi-Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--bg-surface)', padding: '0.375rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Palette size={15} style={{ color: 'var(--accent-primary)' }} />
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.75rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="cyber" style={{ background: '#0f172a', color: '#fff' }}>🌌 Cyber Dark</option>
            <option value="emerald" style={{ background: '#0b1f19', color: '#ecfdf5' }}>🌿 Emerald Matrix</option>
            <option value="sunset" style={{ background: '#1d0f28', color: '#fff1f2' }}>🌅 Neon Sunset</option>
            <option value="light" style={{ background: '#ffffff', color: '#0f172a' }}>☀️ Enterprise Slate</option>
          </select>
        </div>

        {/* Active Alerts Pill */}
        {activeAlertsCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'var(--color-critical-bg)',
            color: 'var(--color-critical)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <AlertTriangle size={14} />
            <span>{activeAlertsCount} Alert(s)</span>
          </div>
        )}

        {/* Refresh Data Button */}
        <button
          onClick={refreshAllData}
          title="Refresh All System Data"
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.375rem 0.625rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* User Switcher with Risk Score & Frozen Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', border: selectedUser?.is_frozen ? '1px solid var(--color-critical)' : '1px solid var(--border-color)' }}>
          {selectedUser?.is_frozen ? (
            <Lock size={16} style={{ color: 'var(--color-critical)' }} />
          ) : (
            <User size={16} style={{ color: 'var(--accent-primary)' }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Persona</span>
              {selectedUser && (
                <span style={{ fontSize: '0.6875rem', color: selectedUser.risk_score > 60 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 700 }}>
                  (Risk: {selectedUser.risk_score}/100)
                </span>
              )}
            </div>

            <select
              value={selectedUser?.id || ''}
              onChange={e => {
                const u = users.find(x => x.id === parseInt(e.target.value, 10));
                if (u) setSelectedUser(u);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: selectedUser?.is_frozen ? 'var(--color-critical)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {u.name} ({u.department}) {u.is_frozen ? '🔒 FROZEN' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
