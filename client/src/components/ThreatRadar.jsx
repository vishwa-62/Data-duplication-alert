import React, { useEffect, useState } from 'react';

export const ThreatRadar = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: 240, height: 240, margin: '0 auto' }}>
      <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}>
        {/* Outer Radar Ring */}
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--border-highlight)" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="var(--border-color)" strokeWidth="1" />
        <circle cx="100" cy="100" r="20" fill="none" stroke="var(--border-color)" strokeWidth="1" />

        {/* Crosshair Axes */}
        <line x1="8" y1="100" x2="192" y2="100" stroke="var(--border-color)" strokeWidth="1" />
        <line x1="100" y1="8" x2="100" y2="192" stroke="var(--border-color)" strokeWidth="1" />
        
        {/* Diagonal Tech Markers */}
        <line x1="35" y1="35" x2="165" y2="165" stroke="rgba(0, 242, 254, 0.08)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="165" y1="35" x2="35" y2="165" stroke="rgba(0, 242, 254, 0.08)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Rotating Sweep Beam */}
        <g transform={`rotate(${rotation} 100 100)`}>
          <path d="M 100 100 L 100 8 A 92 92 0 0 1 185 60 Z" fill="url(#radarGradient)" opacity="0.75" />
          <line x1="100" y1="100" x2="100" y2="8" stroke="var(--accent-primary)" strokeWidth="2" />
        </g>

        {/* Radar Sweep Gradient */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Target Threat Blips */}
        <g>
          {/* Critical Threat Node */}
          <g transform="translate(135, 60)">
            <circle cx="0" cy="0" r="4" fill="var(--color-critical)">
              <animate attributeName="r" values="3;7;3" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="8" fill="none" stroke="var(--color-critical)" strokeWidth="1" opacity="0.6">
              <animate attributeName="r" values="6;14;6" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Warning Node */}
          <circle cx="70" cy="145" r="3.5" fill="var(--color-warning)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Safe Active Node */}
          <circle cx="155" cy="125" r="3" fill="var(--color-success)" />
          
          {/* Protected User Node */}
          <circle cx="55" cy="55" r="3.5" fill="var(--accent-primary)" />
        </g>
      </svg>

      {/* Angle Readout Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.6875rem',
        fontWeight: 800,
        fontFamily: 'var(--font-mono)',
        color: 'var(--accent-primary)',
        letterSpacing: '0.08em'
      }}>
        RADAR SEC :: {rotation.toString().padStart(3, '0')}° BEARING
      </div>
    </div>
  );
};
