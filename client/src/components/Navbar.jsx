import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ShieldCheck, User, AlertTriangle, RefreshCw, Lock, Palette, Clock, Radio } from 'lucide-react';

export const Navbar = () => {
  const { users, selectedUser, setSelectedUser, alerts, refreshAllData, loading, theme, setTheme } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* System Operational Badge & UTC Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--color-success)',
          background: 'var(--color-success-bg)',
          border: '1px solid var(--color-success)',
          padding: '0.375rem 0.875rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
        }}>
          <Radio size={14} className="animate-spin" />
          <span>REALTIME RADAR ACTIVE</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          background: 'var(--bg-surface)',
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <Clock size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>{timeString}</span>
        </div>
      </div>

      {/* Action & Control Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Multi-Theme Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-surface)',
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <Palette size={15} style={{ color: 'var(--accent-primary)' }} />
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="cyber" style={{ background: '#071322', color: '#e0f2fe' }}>⚡ CYBER MATRIX</option>
            <option value="emerald" style={{ background: '#052115', color: '#ecfdf5' }}>🌿 EMERALD MATRIX</option>
            <option value="sunset" style={{ background: '#1d0a2a', color: '#fff1f2' }}>🌅 NEON SUNSET</option>
            <option value="light" style={{ background: '#1e293b', color: '#f8fafc' }}>🛡️ DARK SLATE</option>
          </select>
        </div>

        {/* Active Alerts Pill */}
        {activeAlertsCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-critical-bg)',
            color: 'var(--color-critical)',
            border: '1px solid var(--color-critical)',
            padding: '0.375rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            boxShadow: '0 0 12px rgba(255, 0, 85, 0.4)',
            animation: 'pulse-glow 1.5s infinite'
          }}>
            <AlertTriangle size={15} />
            <span>{activeAlertsCount} CRITICAL THREAT(S)</span>
          </div>
        )}

        {/* Refresh Data Button */}
        <button
          onClick={refreshAllData}
          title="Refresh All Telemetry Data"
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.45rem 0.75rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>

        {/* User Persona Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          background: 'var(--bg-surface)',
          padding: '0.375rem 0.875rem',
          borderRadius: 'var(--radius-md)',
          border: selectedUser?.is_frozen ? '1px solid var(--color-critical)' : '1px solid var(--border-color)',
          boxShadow: selectedUser?.is_frozen ? '0 0 12px rgba(255, 0, 85, 0.3)' : 'none'
        }}>
          {selectedUser?.is_frozen ? (
            <Lock size={16} style={{ color: 'var(--color-critical)' }} />
          ) : (
            <User size={16} style={{ color: 'var(--accent-primary)' }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                PERSONA
              </span>
              {selectedUser && (
                <span style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: selectedUser.risk_score > 60 ? 'var(--color-warning)' : 'var(--color-success)',
                  fontWeight: 700
                }}>
                  (RISK: {selectedUser.risk_score}/100)
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
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  {u.name} ({u.department}) {u.is_frozen ? '🔒 [FROZEN]' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
