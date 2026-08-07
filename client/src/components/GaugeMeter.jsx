import React from 'react';

export const GaugeMeter = ({ value = 65, title, label, color = 'var(--accent-primary)' }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 8px ${color})` }}>
          {/* Outer Tick Frame Ring */}
          <circle
            cx="50" cy="50" r="48"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          {/* Track Circle */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="var(--bg-surface)"
            strokeWidth="7"
          />
          {/* Glowing Arc Progress Ring */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: color, letterSpacing: '-0.02em' }}>
            {value}%
          </div>
          {label && <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{label}</div>}
        </div>
      </div>
      {title && (
        <div style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
          {title}
        </div>
      )}
    </div>
  );
};
