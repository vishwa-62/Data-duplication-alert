import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LayoutDashboard, Database, ShieldAlert, FileSpreadsheet, Settings, Users, Sliders, Network, Shield, Cpu, Activity } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { alerts } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Dataset Catalog', icon: Database },
    { id: 'alerts', label: 'Security Alerts', icon: ShieldAlert, badge: activeAlertsCount },
    { id: 'users', label: 'User Risk Directory', icon: Users },
    { id: 'policies', label: 'Security Rules', icon: Sliders },
    { id: 'topology', label: 'System Topology', icon: Network },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileSpreadsheet },
    { id: 'settings', label: 'Engine Settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 1rem',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.5rem 0.5rem 1.25rem 0.5rem',
        borderBottom: '1px dashed var(--border-color)',
        marginBottom: '1rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, #0284c7 100%)',
          width: 42,
          height: 42,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#020914',
          boxShadow: '0 0 15px var(--accent-glow)',
          border: '1px solid var(--accent-primary)'
        }}>
          <Shield size={24} />
        </div>
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)'
          }}>
            DUPLI-GUARD
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--accent-primary)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Tactical Security Matrix
          </div>
        </div>
      </div>

      {/* Live System Operational Status Badge */}
      <div style={{
        margin: '0 0.25rem 1.25rem 0.25rem',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
          <Activity size={14} className="animate-spin" />
          <span style={{ fontWeight: 700 }}>STATUS: ACTIVE</span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>v2.5</span>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-surface)' : 'transparent',
                border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
                boxShadow: isActive ? 'var(--neon-shadow)' : 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.01em',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span style={{
                  background: 'var(--color-critical)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '0.125rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: '0 0 10px rgba(255, 0, 85, 0.5)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer metadata */}
      <div style={{
        padding: '1rem 0.5rem 0 0.5rem',
        borderTop: '1px dashed var(--border-color)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
          <Cpu size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>ENGINE CORE v2.5</span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
          SQLite • Encryption Enabled
        </div>
      </div>
    </aside>
  );
};
