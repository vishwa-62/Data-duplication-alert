import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { RiskBadge } from '../components/RiskBadge.jsx';
import { DownloadModal } from '../components/DownloadModal.jsx';
import { Search, Download, Database, ShieldAlert, Layers } from 'lucide-react';

export const CatalogPage = () => {
  const { datasets } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDownloadDataset, setActiveDownloadDataset] = useState(null);

  const categories = ['ALL', 'Finance', 'Analytics', 'Engineering', 'HR', 'Marketing', 'Security'];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || d.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Dataset Catalog</h1>
          <p className="page-subtitle">Browse and request data exports. Live duplicate protection algorithms monitor every transaction.</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search datasets, reports, or descriptions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.375rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredDatasets.map(dataset => (
          <div key={dataset.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-medium" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  {dataset.category}
                </span>
                <RiskBadge level={dataset.sensitivity} />
              </div>

              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {dataset.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '2.5rem', lineHeight: 1.4 }}>
                {dataset.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Format: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{dataset.file_format}</strong></span>
                <span>Size: <strong style={{ color: 'var(--text-primary)' }}>{dataset.size_mb} MB</strong></span>
                <span>Downloads: <strong style={{ color: 'var(--text-primary)' }}>{dataset.download_count}</strong></span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setActiveDownloadDataset(dataset)}
              >
                <Download size={16} />
                Request Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Download Modal Dialog */}
      {activeDownloadDataset && (
        <DownloadModal
          dataset={activeDownloadDataset}
          onClose={() => setActiveDownloadDataset(null)}
        />
      )}
    </div>
  );
};
