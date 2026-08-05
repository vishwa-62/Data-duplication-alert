import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Database, ShieldCheck, User, HardDrive, Cpu, ArrowRight, Activity } from 'lucide-react';

export const TopologyPage = () => {
  const { datasets, users, analytics } = useApp();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Network Architecture & Data Flow Topology</h1>
          <p className="page-subtitle">Interactive visual topology map of data storage repositories, duplicate threat inspection engines, user personas, and local cache nodes.</p>
        </div>
      </div>

      {/* Visual Flow Architecture Board */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          
          {/* Node 1: User Persona Ingestion */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <User size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>User Personas</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {users.length} Active Identity Nodes
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.375rem', borderRadius: 'var(--radius-sm)' }}>
              Ingesting HTTP Download Requests
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <ArrowRight size={28} className="animate-pulse" />
          </div>

          {/* Node 2: Duplication Detection Engine */}
          <div style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <div style={{ background: 'var(--accent-primary)', color: '#fff', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <Cpu size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Detection Engine</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              MD5 Request Fingerprinting
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '0.375rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
              60-Min Sliding Window Rules
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <ArrowRight size={28} className="animate-pulse" />
          </div>

          {/* Node 3: Local Cache Storage Node */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <HardDrive size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Local Cache Storage</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {analytics?.cacheHits || 0} Served Cache Payloads
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.375rem', borderRadius: 'var(--radius-sm)' }}>
              ~{analytics?.bandwidthSavedCacheMB || 0} MB Bandwidth Saved
            </div>
          </div>

        </div>
      </div>

      {/* Database Storage Repositories */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Database size={20} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Connected Data Repositories</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {datasets.map(d => (
            <div key={d.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{d.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {d.category} • {d.file_format} • {d.size_mb} MB
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-success)' }}>
                <Activity size={12} />
                <span>ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
