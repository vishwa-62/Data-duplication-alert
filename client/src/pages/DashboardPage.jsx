import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MetricsCard } from '../components/MetricsCard.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { TrafficChart } from '../components/AnalyticsCharts.jsx';
import { ThreatRadar } from '../components/ThreatRadar.jsx';
import { GaugeMeter } from '../components/GaugeMeter.jsx';
import { Download, AlertTriangle, HardDrive, ShieldAlert, CheckCircle, ArrowRight, Server, Activity, Radio } from 'lucide-react';

export const DashboardPage = ({ setActiveTab }) => {
  const { analytics, alerts, resolveAlert } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').slice(0, 5);

  const duplicateRatio = analytics?.totalDownloads > 0
    ? Math.round((analytics.duplicateDownloads / analytics.totalDownloads) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operations Threat Center</h1>
          <p className="page-subtitle">Real-time threat monitoring, live node radar, dataset downloads, and bandwidth cache efficiency.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('catalog')}>
          <Download size={16} />
          Go to Dataset Catalog
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <MetricsCard
          icon={Download}
          title="Total Download Requests"
          value={analytics?.totalDownloads || 0}
          subtitle="Across all users & departments"
          color="var(--accent-primary)"
          bgGlow="var(--accent-glow)"
        />
        <MetricsCard
          icon={AlertTriangle}
          title="Duplicate Attempts Flagged"
          value={analytics?.duplicateDownloads || 0}
          subtitle={`${analytics?.blockedDownloads || 0} Downloads Auto-Blocked`}
          color="var(--color-warning)"
          bgGlow="var(--color-warning-bg)"
        />
        <MetricsCard
          icon={HardDrive}
          title="Bandwidth Consumed / Saved"
          value={`${analytics?.bandwidthWastedGB || 0} GB`}
          subtitle={`Cache Saved: ~${analytics?.bandwidthSavedCacheMB || 0} MB`}
          color="var(--color-info)"
          bgGlow="var(--color-info-bg)"
        />
        <MetricsCard
          icon={Server}
          title="Cache Hits Served"
          value={analytics?.cacheHits || 0}
          subtitle="Zero MB network cost"
          color="var(--color-success)"
          bgGlow="var(--color-success-bg)"
        />
        <MetricsCard
          icon={ShieldAlert}
          title="Active Security Alerts"
          value={analytics?.activeAlerts || 0}
          subtitle="Requires SOC resolution"
          color="var(--color-critical)"
          bgGlow="var(--color-critical-bg)"
        />
      </div>

      {/* Two Column Section: Live Threat Radar + Gauge Meters & Traffic Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Threat Radar Visualizer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', width: '100%', justifyContent: 'flex-start' }}>
            <Radio size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Live Node Scanner</h3>
          </div>
          <ThreatRadar />
        </div>

        {/* Circular Gauge Ring Meters */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Efficiency & Threat Meter</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
            <GaugeMeter
              value={duplicateRatio}
              title="Duplicate Ratio"
              label="Repeat Rate"
              color={duplicateRatio > 50 ? 'var(--color-warning)' : 'var(--color-success)'}
            />
            <GaugeMeter
              value={analytics?.activeAlerts > 0 ? 75 : 15}
              title="Threat Index"
              label="Security Status"
              color={analytics?.activeAlerts > 0 ? 'var(--color-critical)' : 'var(--color-success)'}
            />
          </div>
        </div>
      </div>

      {/* Visual Traffic Trends Chart */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>24-Hour Traffic & Duplication Trends</h3>
        </div>
        <TrafficChart data={analytics?.trafficTrends || []} />
      </div>

      {/* Two Column Layout: Active Alerts Feed + Department Risk Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Active Alerts Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} style={{ color: 'var(--color-critical)' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Live Duplication Threat Alerts</h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('alerts')}>
              View All ({alerts.length}) <ArrowRight size={14} />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle size={36} style={{ color: 'var(--color-success)', margin: '0 auto 0.5rem auto' }} />
              <div>No active duplication alerts! All downloads are operating within safety parameters.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {activeAlerts.map(alert => (
                <div key={alert.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <RiskBadge level={alert.risk_level} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{alert.user_name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({alert.user_department})</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Requested <strong>{alert.dataset_title}</strong> {alert.duplicate_count}x within {alert.time_window_mins} mins.
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Risk Score: {alert.user_risk_score}/100 • Detected: {new Date(alert.detected_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flexShrink: 0 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => resolveAlert(alert.id, 'RESOLVED', 'Verified & approved by SOC operator')}>
                      Resolve
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => resolveAlert(alert.id, 'DISMISSED', 'False positive alert')}>
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>Duplication Risk by Department</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.departmentBreakdown?.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.375rem' }}>
                  <span>{item.department}</span>
                  <span style={{ color: item.duplicates > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {item.duplicates} Duplicate(s) / {item.total_requests} Request(s)
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (item.duplicates / Math.max(1, item.total_requests)) * 100)}%`,
                    background: item.duplicates > 2 ? 'var(--color-danger)' : item.duplicates > 0 ? 'var(--color-warning)' : 'var(--color-success)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
