import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Activity, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const LiveTicker = () => {
  const { alerts, analytics } = useApp();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="ticker-bar">
      <div className="ticker-title">
        <Activity size={14} />
        SECURITY TICKER
      </div>

      <div className="ticker-content">
        <span>⚡ <strong>System Status:</strong> Operational • Threat Detection Engine v2.0 Online</span>
        <span>🛡️ <strong>Total Download Volume:</strong> {analytics?.totalDownloads || 0} Request(s)</span>
        <span>⚠️ <strong>Duplicates Prevented:</strong> {analytics?.duplicateDownloads || 0} Attempt(s)</span>
        <span>💾 <strong>Cache Payload Saved:</strong> {analytics?.bandwidthSavedCacheMB || 0} MB</span>
        <span>🚨 <strong>Active Alerts:</strong> {activeAlertsCount} Unresolved SOC Incidents</span>
        <span>⚡ <strong>System Status:</strong> Operational • Threat Detection Engine v2.0 Online</span>
        <span>🛡️ <strong>Total Download Volume:</strong> {analytics?.totalDownloads || 0} Request(s)</span>
        <span>⚠️ <strong>Duplicates Prevented:</strong> {analytics?.duplicateDownloads || 0} Attempt(s)</span>
      </div>
    </div>
  );
};
