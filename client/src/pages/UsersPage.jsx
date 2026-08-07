import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { User, ShieldAlert, Lock, Unlock, RefreshCw, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const UsersPage = () => {
  const { users, freezeUserAccount, unfreezeUserAccount, resetUserRisk, setSelectedUser, selectedUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">USER RISK SCORING DIRECTORY</h1>
          <p className="page-subtitle">Monitor user anomaly risk indexes, execute payload download suspensions, and switch operational personas.</p>
        </div>
      </div>

      {/* Cyber Search */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="SEARCH PERSONAS BY NAME, EMAIL, ROLE, OR DEPARTMENT..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* User Risk Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredUsers.map(user => {
          const isSelected = selectedUser?.id === user.id;
          const isHighRisk = user.risk_score >= 60;
          const isFrozen = user.is_frozen === 1;

          let scoreColor = 'var(--color-success)';
          if (user.risk_score >= 70) scoreColor = 'var(--color-critical)';
          else if (user.risk_score >= 40) scoreColor = 'var(--color-warning)';

          return (
            <div key={user.id} className="glass-card" style={{
              border: isFrozen ? '1px solid var(--color-critical)' : isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              position: 'relative'
            }}>
              {/* Persona Active indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 12, right: 12,
                  background: 'var(--accent-primary)',
                  color: '#020914',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em'
                }}>
                  ACTIVE PERSONA
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 'var(--radius-md)',
                  background: isFrozen ? 'var(--color-critical-bg)' : 'var(--bg-surface)',
                  border: isFrozen ? '1px solid var(--color-critical)' : '1px solid var(--accent-primary)',
                  color: isFrozen ? 'var(--color-critical)' : 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {user.name.charAt(0)}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{user.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{user.role} • {user.department}</div>
                </div>
              </div>

              {/* Risk Score Progress Gauge */}
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  <span>ANOMALY RISK INDEX</span>
                  <span style={{ color: scoreColor }}>{user.risk_score} / 100</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{
                    height: '100%',
                    width: `${user.risk_score}%`,
                    background: scoreColor,
                    boxShadow: `0 0 10px ${scoreColor}`,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.625rem', fontFamily: 'var(--font-mono)' }}>
                  <span>REQS: <strong>{user.total_downloads || 0}</strong></span>
                  <span>DUPLICATES: <strong style={{ color: user.duplicate_downloads > 0 ? 'var(--color-warning)' : 'var(--text-primary)' }}>{user.duplicate_downloads || 0}</strong></span>
                </div>
              </div>

              {/* Status & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                {isFrozen ? (
                  <span className="badge badge-critical">FROZEN</span>
                ) : isHighRisk ? (
                  <span className="badge badge-medium">HIGH RISK</span>
                ) : (
                  <span className="badge badge-success">ACTIVE</span>
                )}

                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {!isSelected && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(user)}>
                      SELECT
                    </button>
                  )}

                  {isFrozen ? (
                    <button className="btn btn-primary btn-sm" onClick={() => unfreezeUserAccount(user.id)} style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
                      <Unlock size={14} /> UNFREEZE
                    </button>
                  ) : (
                    <button className="btn btn-danger btn-sm" onClick={() => freezeUserAccount(user.id)}>
                      <Lock size={14} /> FREEZE
                    </button>
                  )}

                  <button className="btn btn-secondary btn-sm" onClick={() => resetUserRisk(user.id)} title="Reset Risk Score to 10">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
