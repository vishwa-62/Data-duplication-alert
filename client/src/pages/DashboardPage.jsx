import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { MetricsCard } from '../components/MetricsCard.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { TrafficChart } from '../components/AnalyticsCharts.jsx';
import { ThreatRadar } from '../components/ThreatRadar.jsx';
import { GaugeMeter } from '../components/GaugeMeter.jsx';
import { Download, AlertTriangle, HardDrive, ShieldAlert, CheckCircle, ArrowRight, Server, Activity, Radio, Cpu, ShieldCheck } from 'lucide-react';

export const DashboardPage = ({ setActiveTab }) => {
  const { analytics, alerts, resolveAlert } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').slice(0, 5);

  const duplicateRatio = analytics?.totalDownloads > 0
    ? Math.round((analytics.duplicateDownloads / analytics.totalDownloads) * 100)
    : 0;

  return (
    <div>
      {/* Tactical Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">OPERATIONS THREAT CENTER</h1>
          <p className="page-subtitle">Real-time telemetry, node scanner matrix, bandwidth optimization, and automated threat mitigation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('catalog')}>
          <Download size={16} />
          EXECUTE DATASET CATALOG SCAN
        </button>
      </div>

      {/* High-Density Metric Cards Grid */}
      <div className="metrics-grid">
        <MetricsCard
          icon={Download}
          title="Total Download Volume"
          value={analytics?.totalDownloads || 0}
          subtitle="All users & node clusters"
          color="var(--accent-primary)"
          bgGlow="var(--accent-glow)"
        />
        <MetricsCard
          icon={AlertTriangle}
          title="Duplicates Flagged"
          value={analytics?.duplicateDownloads || 0}
          subtitle={`${analytics?.blockedDownloads || 0} Downloads Auto-Blocked`}
          color="var(--color-warning)"
          bgGlow="var(--color-warning-bg)"
        />
        <MetricsCard
          icon={HardDrive}
          title="Bandwidth Consumption"
          value={`${analytics?.bandwidthWastedGB || 0} GB`}
          subtitle={`Cache Saved: ~${analytics?.bandwidthSavedCacheMB || 0} MB`}
          color="var(--color-info)"
          bgGlow="var(--color-info-bg)"
        />
        <MetricsCard
          icon={Server}
          title="Cache Hits Served"
          value={analytics?.cacheHits || 0}
          subtitle="Zero MB network overhead"
          color="var(--color-success)"
          bgGlow="var(--color-success-bg)"
        />
        <MetricsCard
          icon={ShieldAlert}
          title="Active SOC Alerts"
          value={analytics?.activeAlerts || 0}
          subtitle="Requires operator action"
          color="var(--color-critical)"
          bgGlow="var(--color-critical-bg)"
        />
      </div>

      {/* Two Column Section: Live Threat Radar + Gauge Meters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Threat Radar Visualizer */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', width: '100%', justifyContent: 'flex-start', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
            <Radio size={18} style={{ color: 'var(--accent-primary)' }} className="animate-spin" />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LIVE NODE SCANNER MATRIX
            </h3>
          </div>
          <ThreatRadar />
        </div>

        {/* Circular Gauge Ring Meters */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              THREAT INDEX & CACHE RATIO
            </h3>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            24-HOUR TELEMETRY & DUPLICATION TRENDS
          </h3>
        </div>
        <TrafficChart data={analytics?.trafficTrends || []} />
      </div>

      {/* Two Column Layout: Active Alerts Feed + Department Risk Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Active Alerts Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: 'var(--color-critical)' }} />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LIVE THREAT FEED ({alerts.length})
              </h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('alerts')}>
              VIEW ALL <ArrowRight size={14} />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <CheckCircle size={40} style={{ color: 'var(--color-success)', margin: '0 auto 0.75rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-success)' }}>ZERO ACTIVE INCIDENTS</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>All node transfers operating within nominal parameters.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {activeAlerts.map(alert => (
                <div key={alert.id} style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <RiskBadge level={alert.risk_level} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{alert.user_name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>[{alert.user_department}]</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      Requested <strong style={{ color: 'var(--accent-primary)' }}>{alert.dataset_title}</strong> {alert.duplicate_count}x within {alert.time_window_mins} mins.
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      Risk Index: {alert.user_risk_score}/100 • Detected: {new Date(alert.detected_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flexShrink: 0 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => resolveAlert(alert.id, 'RESOLVED', 'Verified & approved by SOC operator')}>
                      RESOLVE
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => resolveAlert(alert.id, 'DISMISSED', 'False positive alert')}>
                      DISMISS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Department Breakdown */}
        <div className="glass-card">
          <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DEPARTMENT RISK TELEMETRY
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {analytics?.departmentBreakdown?.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{item.department}</span>
                  <span style={{ color: item.duplicates > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {item.duplicates} DUPLICATE(S) / {item.total_requests} REQS
                  </span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (item.duplicates / Math.max(1, item.total_requests)) * 100)}%`,
                    background: item.duplicates > 2 ? 'var(--color-critical)' : item.duplicates > 0 ? 'var(--color-warning)' : 'var(--color-success)',
                    boxShadow: item.duplicates > 0 ? '0 0 10px rgba(245, 158, 11, 0.4)' : 'none',
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
