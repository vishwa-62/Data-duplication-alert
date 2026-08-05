import React, { useEffect, useState } from 'react';

export const ThreatRadar = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }}>
        {/* Radar Circles */}
        <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border-color)" strokeWidth="1" />
        <circle cx="100" cy="100" r="65" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="var(--border-color)" strokeWidth="1" />
        <circle cx="100" cy="100" r="15" fill="none" stroke="var(--border-color)" strokeWidth="1" />

        {/* Crosshair Lines */}
        <line x1="10" y1="100" x2="190" y2="100" stroke="var(--border-color)" strokeWidth="1" />
        <line x1="100" y1="10" x2="100" y2="190" stroke="var(--border-color)" strokeWidth="1" />

        {/* Animated Sweep Wedge */}
        <g transform={`rotate(${rotation} 100 100)`}>
          <path d="M 100 100 L 100 10 A 90 90 0 0 1 180 60 Z" fill="var(--accent-glow)" opacity="0.6" />
          <line x1="100" y1="100" x2="100" y2="10" stroke="var(--accent-primary)" strokeWidth="2" />
        </g>

        {/* Simulated Detection Targets */}
        <g>
          <circle cx="130" cy="65" r="4" fill="var(--color-critical)">
            <animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="140" r="3.5" fill="var(--color-warning)" />
          <circle cx="150" cy="120" r="3" fill="var(--color-success)" />
          <circle cx="60" cy="50" r="3" fill="var(--accent-primary)" />
        </g>
      </svg>

      <div style={{
        position: 'absolute',
        bottom: -5,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.6875rem',
        fontWeight: 800,
        color: 'var(--accent-primary)',
        letterSpacing: '0.05em'
      }}>
        LIVE SCANNER ACTIVE
      </div>
    </div>
  );
};
