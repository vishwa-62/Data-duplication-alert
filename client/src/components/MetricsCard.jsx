import React from 'react';

export const MetricsCard = ({ icon: Icon, title, value, subtitle, color = 'var(--accent-primary)', bgGlow = 'rgba(0, 242, 254, 0.15)' }) => {
  return (
    <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Top Border Accent Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: color,
        boxShadow: `0 0 10px ${color}`
      }} />

      <div className="metric-icon" style={{ background: bgGlow, color: color, borderColor: color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="metric-value" style={{ color: color }}>{value}</div>
        <div className="metric-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
