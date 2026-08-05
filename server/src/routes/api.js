import express from 'express';
import {
  getDatasets,
  createDataset,
  getUsers,
  freezeUser,
  unfreezeUser,
  resetUserRiskScore,
  requestDownload,
  handleServeFromCache,
  getPolicies,
  createPolicy,
  togglePolicy,
  deletePolicy,
  getAlerts,
  updateAlertStatus,
  getAuditLogs,
  exportAuditLogs,
  getSettings,
  updateSettings,
  getAnalytics
} from '../controllers/apiController.js';

const router = express.Router();

// Datasets
router.get('/datasets', getDatasets);
router.post('/datasets', createDataset);

// Users & Risk Management
router.get('/users', getUsers);
router.post('/users/:userId/freeze', freezeUser);
router.post('/users/:userId/unfreeze', unfreezeUser);
router.post('/users/:userId/reset-risk', resetUserRiskScore);

// Download & Cache
router.post('/downloads/request', requestDownload);
router.post('/downloads/serve-cached', handleServeFromCache);

// Security Policies
router.get('/policies', getPolicies);
router.post('/policies', createPolicy);
router.patch('/policies/:policyId/toggle', togglePolicy);
router.delete('/policies/:policyId', deletePolicy);

// Alerts
router.get('/alerts', getAlerts);
router.patch('/alerts/:alertId', updateAlertStatus);

// Audit logs & Data Export
router.get('/audit-logs', getAuditLogs);
router.get('/audit-logs/export', exportAuditLogs);

// Settings
router.get('/settings', getSettings);
router.post('/settings', updateSettings);

// Analytics
router.get('/analytics', getAnalytics);

export default router;
