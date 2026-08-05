import React from 'react';

export const MetricsCard = ({ icon: Icon, title, value, subtitle, color = 'var(--accent-primary)', bgGlow = 'rgba(99, 102, 241, 0.12)' }) => {
  return (
    <div className="glass-card metric-card">
      <div className="metric-icon" style={{ background: bgGlow, color: color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <div className="metric-value">{value}</div>
        <div className="metric-label">{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
};
