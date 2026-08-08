import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  MOCK_USERS,
  MOCK_DATASETS,
  MOCK_POLICIES,
  MOCK_ALERTS,
  MOCK_SETTINGS,
  MOCK_ANALYTICS
} from '../services/mockData.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState(MOCK_USERS[0]);
  const [datasets, setDatasets] = useState(MOCK_DATASETS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [policies, setPolicies] = useState(MOCK_POLICIES);
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Theme Management: 'cyber' (default), 'emerald', 'sunset', 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('dupli_guard_theme') || 'cyber');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dupli_guard_theme', theme);
  }, [theme]);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshAllData = async () => {
    try {
      const [usersRes, datasetsRes, alertsRes, policiesRes, analyticsRes, settingsRes] = await Promise.all([
        api.getUsers(),
        api.getDatasets(),
        api.getAlerts(),
        api.getPolicies(),
        api.getAnalytics(),
        api.getSettings()
      ]);

      const fetchedUsers = usersRes.data || [];
      if (fetchedUsers.length > 0) setUsers(fetchedUsers);

      if (selectedUser) {
        const current = fetchedUsers.find(u => u.id === selectedUser.id);
        if (current) setSelectedUser(current);
        else if (fetchedUsers.length > 0) setSelectedUser(fetchedUsers[0]);
      } else if (fetchedUsers.length > 0) {
        setSelectedUser(fetchedUsers[0]);
      }

      if (datasetsRes.data?.length > 0) setDatasets(datasetsRes.data);
      if (alertsRes.data?.length > 0) setAlerts(alertsRes.data);
      if (policiesRes.data?.length > 0) setPolicies(policiesRes.data);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
      if (settingsRes.data && Object.keys(settingsRes.data).length > 0) setSettings(settingsRes.data);
    } catch (err) {
      console.warn('Backend API offline or running in GitHub Pages static mode, using rich local data fallback.');
      setUsers(prev => prev.length > 0 ? prev : MOCK_USERS);
      setSelectedUser(prev => prev || MOCK_USERS[0]);
      setDatasets(prev => prev.length > 0 ? prev : MOCK_DATASETS);
      setAlerts(prev => prev.length > 0 ? prev : MOCK_ALERTS);
      setPolicies(prev => prev.length > 0 ? prev : MOCK_POLICIES);
      setAnalytics(prev => prev || MOCK_ANALYTICS);
      setSettings(prev => Object.keys(prev).length > 0 ? prev : MOCK_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const triggerDownload = async (datasetId, filterParams = {}) => {
    if (!selectedUser) {
      addToast('error', 'No User Selected', 'Please select an active user from top header.');
      return null;
    }

    try {
      const res = await api.requestDownload(selectedUser.id, datasetId, filterParams);
      const downloadData = res.data;

      if (downloadData.status === 'USER_FROZEN') {
        addToast('error', 'User Account Frozen', downloadData.message);
      } else if (downloadData.status === 'BLOCKED') {
        addToast('error', 'Download Blocked!', downloadData.message);
      } else if (downloadData.isDuplicate) {
        addToast('warning', `Duplicate Warning (${downloadData.riskLevel} Risk)`, downloadData.message);
      } else {
        addToast('success', 'Download Started', `Successfully initiated download for ${downloadData.dataset.title}.`);
      }

      await refreshAllData();
      return downloadData;
    } catch (err) {
      // Local Client-Side Fallback Simulation when backend API is offline
      const targetDataset = datasets.find(d => d.id === datasetId);
      if (!targetDataset) return null;

      if (selectedUser.is_frozen === 1) {
        addToast('error', 'User Account Frozen', `Access Denied: Account '${selectedUser.name}' is frozen.`);
        return { status: 'USER_FROZEN', isDuplicate: false, message: 'User frozen' };
      }

      // Simulate duplicate detection
      const newRisk = Math.min(100, selectedUser.risk_score + 15);
      const isDuplicate = selectedUser.duplicate_downloads > 0 || selectedUser.risk_score > 40;
      const isBlocked = newRisk >= 90;

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
        ...u,
        risk_score: newRisk,
        is_frozen: isBlocked ? 1 : u.is_frozen,
        total_downloads: u.total_downloads + 1,
        duplicate_downloads: isDuplicate ? u.duplicate_downloads + 1 : u.duplicate_downloads
      } : u));

      setSelectedUser(prev => prev ? {
        ...prev,
        risk_score: newRisk,
        is_frozen: isBlocked ? 1 : prev.is_frozen,
        total_downloads: prev.total_downloads + 1,
        duplicate_downloads: isDuplicate ? prev.duplicate_downloads + 1 : prev.duplicate_downloads
      } : prev);

      if (isBlocked) {
        addToast('error', 'Download Blocked!', `Excessive duplicate download limit reached. Account temporarily suspended.`);
      } else if (isDuplicate) {
        addToast('warning', 'Duplicate Warning (HIGH Risk)', `Duplicate request detected for dataset '${targetDataset.title}'.`);
      } else {
        addToast('success', 'Download Started', `Successfully initiated download for ${targetDataset.title}.`);
      }

      return {
        status: isBlocked ? 'BLOCKED' : (isDuplicate ? 'WARNING_ISSUED' : 'SUCCESS'),
        isDuplicate,
        user: selectedUser,
        dataset: targetDataset
      };
    }
  };

  const handleServeFromCache = async (datasetId, requestHash) => {
    if (!selectedUser) return;
    try {
      const res = await api.serveFromCache(selectedUser.id, datasetId, requestHash);
      addToast('success', 'Served From Cache', res.message);
      await refreshAllData();
      return res;
    } catch (err) {
      addToast('success', 'Served From Cache', 'Payload served directly from local cache! 0 MB bandwidth consumed.');
    }
  };

  const freezeUserAccount = async (userId) => {
    try {
      await api.freezeUser(userId);
      addToast('warning', 'User Frozen', `User #${userId} download privileges have been suspended.`);
      await refreshAllData();
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_frozen: 1 } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, is_frozen: 1 }));
      addToast('warning', 'User Frozen', `User #${userId} download privileges have been suspended.`);
    }
  };

  const unfreezeUserAccount = async (userId) => {
    try {
      await api.unfreezeUser(userId);
      addToast('success', 'User Unfrozen', `User #${userId} download privileges restored.`);
      await refreshAllData();
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_frozen: 0 } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, is_frozen: 0 }));
      addToast('success', 'User Unfrozen', `User #${userId} download privileges restored.`);
    }
  };

  const resetUserRisk = async (userId) => {
    try {
      await api.resetUserRisk(userId);
      addToast('info', 'Risk Reset', `User #${userId} risk score reset to 10.`);
      await refreshAllData();
    } catch (err) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, risk_score: 10, is_frozen: 0 } : u));
      if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, risk_score: 10, is_frozen: 0 }));
      addToast('info', 'Risk Reset', `User #${userId} risk score reset to 10.`);
    }
  };

  const toggleSecurityPolicy = async (policyId) => {
    try {
      await api.togglePolicy(policyId);
      addToast('info', 'Policy Updated', 'Security policy status toggled.');
      await refreshAllData();
    } catch (err) {
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, status: p.status === 1 ? 0 : 1 } : p));
      addToast('info', 'Policy Updated', 'Security policy status toggled.');
    }
  };

  const createSecurityPolicy = async (policyData) => {
    try {
      await api.createPolicy(policyData);
      addToast('success', 'Policy Created', `New security policy '${policyData.name}' created.`);
      await refreshAllData();
    } catch (err) {
      const newPolicy = { id: Date.now(), ...policyData, status: 1, created_at: new Date().toISOString() };
      setPolicies(prev => [...prev, newPolicy]);
      addToast('success', 'Policy Created', `New security policy '${policyData.name}' created.`);
    }
  };

  const resolveAlert = async (alertId, status, note = '') => {
    try {
      await api.updateAlertStatus(alertId, status, note);
      addToast('info', 'Alert Updated', `Security alert #${alertId} updated to ${status}.`);
      await refreshAllData();
    } catch (err) {
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status, resolution_note: note } : a));
      addToast('info', 'Alert Updated', `Security alert #${alertId} updated to ${status}.`);
    }
  };

  const updateSystemSettings = async (newSettings) => {
    try {
      await api.updateSettings(newSettings);
      addToast('success', 'Settings Saved', 'Detection parameters updated.');
      await refreshAllData();
    } catch (err) {
      setSettings(prev => ({ ...prev, ...newSettings }));
      addToast('success', 'Settings Saved', 'Detection parameters updated.');
    }
  };

  const seedDatabaseData = async (forceReset = false) => {
    try {
      const res = await api.seedData(forceReset);
      addToast('success', 'Data Populated', res.message);
      await refreshAllData();
    } catch (err) {
      setUsers(MOCK_USERS);
      setSelectedUser(MOCK_USERS[0]);
      setDatasets(MOCK_DATASETS);
      setAlerts(MOCK_ALERTS);
      setPolicies(MOCK_POLICIES);
      setAnalytics(MOCK_ANALYTICS);
      setSettings(MOCK_SETTINGS);
      addToast('success', 'Data Populated', '15 Users, 15 Datasets, 22 Alerts & Audit Trail populated.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        users,
        selectedUser,
        setSelectedUser,
        datasets,
        alerts,
        policies,
        analytics,
        settings,
        loading,
        toasts,
        addToast,
        removeToast,
        refreshAllData,
        triggerDownload,
        handleServeFromCache,
        freezeUserAccount,
        unfreezeUserAccount,
        resetUserRisk,
        toggleSecurityPolicy,
        createSecurityPolicy,
        resolveAlert,
        updateSystemSettings,
        seedDatabaseData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
