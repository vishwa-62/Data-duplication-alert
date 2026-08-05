import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LayoutDashboard, Database, ShieldAlert, FileSpreadsheet, Settings, Users, Sliders, Network, Shield } from 'lucide-react';

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
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ background: 'var(--accent-primary)', width: 36, height: 36, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 12px var(--accent-glow)' }}>
          <Shield size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>DUPLI-GUARD</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Download Alert Engine</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '1.5rem', flex: 1 }}>
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
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </div>

              {item.badge > 0 && (
                <span style={{
                  background: 'var(--color-critical)',
                  color: '#fff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '0.125rem 0.5rem',
                  borderRadius: 'var(--radius-full)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer metadata */}
      <div style={{ padding: '1rem 0.5rem 0 0.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>SQLite Database</div>
        <div>v2.5 Pro Edition</div>
      </div>
    </aside>
  );
};
