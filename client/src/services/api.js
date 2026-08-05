const BASE_URL = '/api';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.error || `HTTP error! status: ${response.status}`);
  }
  return json;
}

export const api = {
  // Datasets
  getDatasets: () => fetchJSON(`${BASE_URL}/datasets`),
  createDataset: (data) => fetchJSON(`${BASE_URL}/datasets`, { method: 'POST', body: JSON.stringify(data) }),

  // Users & Risk
  getUsers: () => fetchJSON(`${BASE_URL}/users`),
  freezeUser: (userId) => fetchJSON(`${BASE_URL}/users/${userId}/freeze`, { method: 'POST' }),
  unfreezeUser: (userId) => fetchJSON(`${BASE_URL}/users/${userId}/unfreeze`, { method: 'POST' }),
  resetUserRisk: (userId) => fetchJSON(`${BASE_URL}/users/${userId}/reset-risk`, { method: 'POST' }),

  // Download simulation & Cache
  requestDownload: (userId, datasetId, filterParams = {}) => 
    fetchJSON(`${BASE_URL}/downloads/request`, {
      method: 'POST',
      body: JSON.stringify({ userId, datasetId, filterParams })
    }),
  serveFromCache: (userId, datasetId, requestHash) =>
    fetchJSON(`${BASE_URL}/downloads/serve-cached`, {
      method: 'POST',
      body: JSON.stringify({ userId, datasetId, requestHash })
    }),

  // Security Policies
  getPolicies: () => fetchJSON(`${BASE_URL}/policies`),
  createPolicy: (policyData) => fetchJSON(`${BASE_URL}/policies`, { method: 'POST', body: JSON.stringify(policyData) }),
  togglePolicy: (policyId) => fetchJSON(`${BASE_URL}/policies/${policyId}/toggle`, { method: 'PATCH' }),
  deletePolicy: (policyId) => fetchJSON(`${BASE_URL}/policies/${policyId}`, { method: 'DELETE' }),

  // Alerts
  getAlerts: () => fetchJSON(`${BASE_URL}/alerts`),
  updateAlertStatus: (alertId, status, note = '') =>
    fetchJSON(`${BASE_URL}/alerts/${alertId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note })
    }),

  // Audit Logs & Export
  getAuditLogs: () => fetchJSON(`${BASE_URL}/audit-logs`),

  // Settings
  getSettings: () => fetchJSON(`${BASE_URL}/settings`),
  updateSettings: (settingsObj) =>
    fetchJSON(`${BASE_URL}/settings`, {
      method: 'POST',
      body: JSON.stringify(settingsObj)
    }),

  // Analytics
  getAnalytics: () => fetchJSON(`${BASE_URL}/analytics`)
};
