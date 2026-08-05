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
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="duplicatesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => (
          <line
            key={idx}
            x1={padding}
            y1={padding + ratio * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + ratio * (height - 2 * padding)}
            stroke="var(--border-color)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Total Requests Area */}
        <polygon
          points={`${padding},${height - padding} ${requestsPoints} ${width - padding},${height - padding}`}
          fill="url(#requestsGrad)"
        />
        <polyline points={requestsPoints} fill="none" stroke="#6366f1" strokeWidth="3" />

        {/* Duplicates Area */}
        <polygon
          points={`${padding},${height - padding} ${duplicatesPoints} ${width - padding},${height - padding}`}
          fill="url(#duplicatesGrad)"
        />
        <polyline points={duplicatesPoints} fill="none" stroke="#f59e0b" strokeWidth="3" />

        {/* Data points & X axis labels */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.requests)} r="4" fill="#6366f1" />
            <circle cx={getX(i)} cy={getY(d.duplicates)} r="4" fill="#f59e0b" />
            <text x={getX(i)} y={height - 8} fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)">
              {d.hour}
            </text>
          </g>
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6366f1', fontWeight: 600 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1' }} />
          Total Requests
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f59e0b', fontWeight: 600 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          Duplicates Flagged
        </div>
      </div>
    </div>
  );
};
