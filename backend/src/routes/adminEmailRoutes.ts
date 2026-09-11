import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authenticateAdmin.js';
import {
  getEmailSenders,
  getEmailTemplates,
  renderApplicationTemplate,
  sendAdminEmail,
  getApplicationEmailLogs,
  initiateGmailAuth,
  handleGmailOAuthCallback,
  disconnectGmailSender
} from '../controllers/adminEmailController.js';

const router = Router();

// OAuth callback from Google (public GET endpoint verified with state token)
router.get('/oauth/callback', handleGmailOAuthCallback);

// Gmail Management Endpoints (require admin authentication)
router.get('/senders', authenticateAdmin, getEmailSenders);
router.get('/auth/:senderId', authenticateAdmin, initiateGmailAuth);
router.post('/disconnect/:senderId', authenticateAdmin, disconnectGmailSender);

// Email Template & Send Endpoints
router.get('/templates', authenticateAdmin, getEmailTemplates);
router.post('/render', authenticateAdmin, renderApplicationTemplate);
router.post('/send', authenticateAdmin, sendAdminEmail);
router.get('/logs/:applicationId', authenticateAdmin, getApplicationEmailLogs);

export default router;
