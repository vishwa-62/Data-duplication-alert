import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Database, ShieldCheck, User, HardDrive, Cpu, ArrowRight, Activity, Radio, Network } from 'lucide-react';

export const TopologyPage = () => {
  const { datasets, users, analytics } = useApp();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">NETWORK ARCHITECTURE & TOPOLOGY</h1>
          <p className="page-subtitle">Interactive visual matrix mapping identity nodes, MD5 fingerprint engines, cache storage, and data clusters.</p>
        </div>
      </div>

      {/* Visual Flow Architecture Board */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          
          {/* Node 1: User Persona Ingestion */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', width: 50, height: 50, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: '0 0 12px var(--accent-glow)' }}>
              <User size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>USER PERSONAS</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {users.length} Identity Nodes
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.375rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>
              Ingesting HTTP Requests
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <ArrowRight size={32} className="animate-pulse" style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary))' }} />
          </div>

          {/* Node 2: Duplication Detection Engine */}
          <div style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', boxShadow: 'var(--neon-shadow)' }}>
            <div style={{ background: 'var(--accent-primary)', color: '#020914', width: 52, height: 52, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: '0 0 20px var(--accent-primary)' }}>
              <Cpu size={26} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>DETECTION ENGINE</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              MD5 Fingerprint Engine
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--color-success)', background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', padding: '0.375rem', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              60-MIN SLIDING WINDOW
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <ArrowRight size={32} className="animate-pulse" style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary))' }} />
          </div>

          {/* Node 3: Local Cache Storage Node */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', color: 'var(--color-success)', width: 50, height: 50, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)' }}>
              <HardDrive size={24} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>LOCAL CACHE NODE</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              {analytics?.cacheHits || 0} Cache Hits Served
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '0.375rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>
              ~{analytics?.bandwidthSavedCacheMB || 0} MB Bandwidth Saved
            </div>
          </div>

        </div>
      </div>

      {/* Database Storage Repositories */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
          <Database size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CONNECTED DATA REPOSITORIES ({datasets.length})
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {datasets.map(d => (
            <div key={d.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>{d.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                  {d.category.toUpperCase()} • {d.file_format} • {d.size_mb} MB
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-success)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                <Activity size={12} className="animate-spin" />
                <span>ONLINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
