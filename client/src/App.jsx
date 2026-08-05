import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ToastNotification } from './components/ToastNotification.jsx';
import { LiveTicker } from './components/LiveTicker.jsx';

import { DashboardPage } from './pages/DashboardPage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { AlertsPage } from './pages/AlertsPage.jsx';
import { UsersPage } from './pages/UsersPage.jsx';
import { PoliciesPage } from './pages/PoliciesPage.jsx';
import { TopologyPage } from './pages/TopologyPage.jsx';
import { AuditLogsPage } from './pages/AuditLogsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { loading } = useApp();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Initializing Data Shield Engine v2.5...</div>
          <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>Connecting to SQLite database & Threat Intelligence</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <Navbar />
        <main className="content-area">
          {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
          {activeTab === 'catalog' && <CatalogPage />}
          {activeTab === 'alerts' && <AlertsPage />}
          {activeTab === 'users' && <UsersPage />}
          {activeTab === 'policies' && <PoliciesPage />}
          {activeTab === 'topology' && <TopologyPage />}
          {activeTab === 'audit-logs' && <AuditLogsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
      <LiveTicker />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
