import React from 'react';

export const TrafficChart = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...data.map(d => Math.max(d.requests, d.duplicates)), 10);

  const getX = (idx) => padding + (idx * (width - 2 * padding)) / (data.length - 1);
  const getY = (val) => height - padding - (val * (height - 2 * padding)) / maxVal;

  const requestsPoints = data.map((d, i) => `${getX(i)},${getY(d.requests)}`).join(' ');
  const duplicatesPoints = data.map((d, i) => `${getX(i)},${getY(d.duplicates)}`).join(' ');

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="requestsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="duplicatesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-critical)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-critical)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Tactical Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => (
          <line
            key={idx}
            x1={padding}
            y1={padding + ratio * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + ratio * (height - 2 * padding)}
            stroke="var(--border-color)"
            strokeDasharray="2 4"
          />
        ))}

        {/* Total Requests Area */}
        <polygon
          points={`${padding},${height - padding} ${requestsPoints} ${width - padding},${height - padding}`}
          fill="url(#requestsGrad)"
        />
        <polyline points={requestsPoints} fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px var(--accent-primary))' }} />

        {/* Duplicates Area */}
        <polygon
          points={`${padding},${height - padding} ${duplicatesPoints} ${width - padding},${height - padding}`}
          fill="url(#duplicatesGrad)"
        />
        <polyline points={duplicatesPoints} fill="none" stroke="var(--color-critical)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px var(--color-critical))' }} />

        {/* Data points & X axis labels */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.requests)} r="4" fill="var(--accent-primary)" stroke="#020914" strokeWidth="1.5" />
            <circle cx={getX(i)} cy={getY(d.duplicates)} r="4" fill="var(--color-critical)" stroke="#020914" strokeWidth="1.5" />
            <text x={getX(i)} y={height - 8} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight="700">
              {d.hour}
            </text>
          </g>
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--accent-primary)', boxShadow: '0 0 6px var(--accent-primary)' }} />
          TOTAL TELEMETRY TRAFFIC
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-critical)', fontWeight: 700 }}>
          <span style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--color-critical)', boxShadow: '0 0 6px var(--color-critical)' }} />
          DUPLICATE THREAT ATTEMPTS
        </div>
      </div>
    </div>
  );
};
