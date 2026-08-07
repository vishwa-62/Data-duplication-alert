import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Activity, ShieldAlert, Radio, CheckCircle, Cpu } from 'lucide-react';

export const LiveTicker = () => {
  const { alerts, analytics } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="ticker-bar">
      <div className="ticker-title">
        <Radio size={14} className="animate-spin" />
        TACTICAL TELEMETRY STREAM
      </div>

      <div className="ticker-content">
        <span>⚡ <strong style={{ color: 'var(--accent-primary)' }}>SYSTEM STATUS:</strong> OPERATIONAL • ENGINE MATRIX v2.5 ACTIVE</span>
        <span>🛡️ <strong style={{ color: 'var(--text-primary)' }}>TOTAL DOWNLOADS:</strong> {analytics?.totalDownloads || 0} REQS</span>
        <span>⚠️ <strong style={{ color: 'var(--color-warning)' }}>DUPLICATES BLOCKED:</strong> {analytics?.duplicateDownloads || 0} ATTEMPTS</span>
        <span>💾 <strong style={{ color: 'var(--color-success)' }}>BANDWIDTH SAVED:</strong> {analytics?.bandwidthSavedCacheMB || 0} MB (ZERO COST)</span>
        <span>🚨 <strong style={{ color: 'var(--color-critical)' }}>SOC ALERTS:</strong> {activeAlertsCount} ACTIVE THREAT(S)</span>
        <span>🔒 <strong style={{ color: 'var(--color-info)' }}>POLICY RULE ENGINE:</strong> ENFORCING DL-POL-901</span>
        <span>⚡ <strong style={{ color: 'var(--accent-primary)' }}>SYSTEM STATUS:</strong> OPERATIONAL • ENGINE MATRIX v2.5 ACTIVE</span>
        <span>🛡️ <strong style={{ color: 'var(--text-primary)' }}>TOTAL DOWNLOADS:</strong> {analytics?.totalDownloads || 0} REQS</span>
      </div>
    </div>
  );
};
