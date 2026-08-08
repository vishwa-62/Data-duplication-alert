import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState({});
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
      setUsers(fetchedUsers);

      if (selectedUser) {
        const current = fetchedUsers.find(u => u.id === selectedUser.id);
        if (current) setSelectedUser(current);
      } else if (fetchedUsers.length > 0) {
        setSelectedUser(fetchedUsers[0]);
      }

      setDatasets(datasetsRes.data || []);
      setAlerts(alertsRes.data || []);
      setPolicies(policiesRes.data || []);
      setAnalytics(analyticsRes.data || null);
      setSettings(settingsRes.data || {});
    } catch (err) {
      console.error('Failed to load application data:', err);
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
      addToast('error', 'Download Error', err.message);
      throw err;
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
      addToast('error', 'Cache Error', err.message);
    }
  };

  const freezeUserAccount = async (userId) => {
    try {
      await api.freezeUser(userId);
      addToast('warning', 'User Frozen', `User #${userId} download privileges have been suspended.`);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Action Error', err.message);
    }
  };

  const unfreezeUserAccount = async (userId) => {
    try {
      await api.unfreezeUser(userId);
      addToast('success', 'User Unfrozen', `User #${userId} download privileges restored.`);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Action Error', err.message);
    }
  };

  const resetUserRisk = async (userId) => {
    try {
      await api.resetUserRisk(userId);
      addToast('info', 'Risk Reset', `User #${userId} risk score reset to 10.`);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Action Error', err.message);
    }
  };

  const toggleSecurityPolicy = async (policyId) => {
    try {
      await api.togglePolicy(policyId);
      addToast('info', 'Policy Updated', 'Security policy status toggled.');
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Policy Error', err.message);
    }
  };

  const createSecurityPolicy = async (policyData) => {
    try {
      await api.createPolicy(policyData);
      addToast('success', 'Policy Created', `New security policy '${policyData.name}' created.`);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Creation Error', err.message);
    }
  };

  const resolveAlert = async (alertId, status, note = '') => {
    try {
      await api.updateAlertStatus(alertId, status, note);
      addToast('info', 'Alert Updated', `Security alert #${alertId} updated to ${status}.`);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Update Error', err.message);
    }
  };

  const updateSystemSettings = async (newSettings) => {
    try {
      await api.updateSettings(newSettings);
      addToast('success', 'Settings Saved', 'Detection parameters updated.');
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Save Failed', err.message);
    }
  };

  const seedDatabaseData = async (forceReset = false) => {
    try {
      const res = await api.seedData(forceReset);
      addToast('success', 'Data Populated', res.message);
      await refreshAllData();
    } catch (err) {
      addToast('error', 'Seeding Failed', err.message);
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
