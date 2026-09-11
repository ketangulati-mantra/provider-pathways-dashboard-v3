import { Response, NextFunction, Request } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../types/auth.js';
import { emailService } from '../services/email/emailService.js';
import { EMAIL_TEMPLATES, renderTemplateString } from '../services/email/emailTemplates.js';
import { CampusRepository } from '../campus-program/repositories/campusRepository.js';
import { CampusService } from '../campus-program/services/campusService.js';

const campusRepo = new CampusRepository();
const campusService = new CampusService();

// In-memory cache for OAuth CSRF state verification (expires in 15 mins)
const oauthStateCache = new Map<string, { senderId: string; adminName: string; expiresAt: number }>();

/**
 * GET /api/admin/email/senders
 * Returns allowed sender identities configured on backend with their Gmail connection status
 */
export async function getEmailSenders(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const senders = await emailService.getSendersStatus();
    res.json({
      success: true,
      data: senders
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/gmail/auth/:senderId
 * Generates Google OAuth consent URL for a specific sender ('ketan' | 'nirmay')
 */
export async function initiateGmailAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const senderId = req.params.senderId?.toLowerCase();
    const adminName = req.admin?.name || req.admin?.email || 'Admin';

    // Generate secure CSRF state token
    const stateToken = crypto.randomBytes(24).toString('hex');
    oauthStateCache.set(stateToken, {
      senderId,
      adminName,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    // Cleanup expired states
    for (const [k, v] of oauthStateCache.entries()) {
      if (Date.now() > v.expiresAt) oauthStateCache.delete(k);
    }

    const authUrl = emailService.generateAuthUrl(senderId, stateToken);

    res.json({
      success: true,
      data: {
        authUrl,
        senderId,
        state: stateToken
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error?.message || 'Failed to initiate Gmail authorization.' });
  }
}

/**
 * GET /api/admin/gmail/oauth/callback
 * Handles Google OAuth redirect callback
 */
export async function handleGmailOAuthCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const error = req.query.error as string;

    if (error) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Gmail Authorization Failed</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:50px; background:#fef2f2; color:#991b1b;">
          <h2>❌ Google Authorization Cancelled or Failed</h2>
          <p>${error}</p>
          <button onclick="window.close()" style="padding:10px 20px; background:#b91c1c; color:#fff; border:none; border-radius:6px; cursor:pointer;">Close Window</button>
        </body>
        </html>
      `);
    }

    if (!code || !state) {
      return res.status(400).send('Missing authorization code or state token.');
    }

    const cachedState = oauthStateCache.get(state);
    if (!cachedState || Date.now() > cachedState.expiresAt) {
      return res.status(400).send('Invalid or expired OAuth state token. Please try connecting again.');
    }

    oauthStateCache.delete(state);

    const result = await emailService.handleOAuthCallback(code, cachedState.senderId, cachedState.adminName);

    // Send friendly HTML message that automatically notifies parent opener window and closes
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gmail Account Connected</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdf4; color: #166534; }
          .card { background: #ffffff; border: 1px solid #bbf7d0; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 440px; }
          h2 { margin: 0 0 10px; color: #15803d; }
          p { color: #4b5563; font-size: 0.95rem; margin-bottom: 24px; }
          .btn { background: #16a34a; color: #fff; padding: 10px 24px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="font-size: 40px; margin-bottom: 12px;">✅</div>
          <h2>Gmail Connected Successfully!</h2>
          <p>Account <strong>${result.email}</strong> is now authorized to send emails via Gmail API.</p>
          <button class="btn" onclick="finish()">Return to Dashboard</button>
        </div>
        <script>
          function finish() {
            if (window.opener) {
              window.opener.postMessage({ type: 'GMAIL_AUTH_SUCCESS', senderId: '${result.senderId}' }, '*');
            }
            window.close();
          }
          // Auto close after 2.5s
          setTimeout(finish, 2500);
        </script>
      </body>
      </html>
    `);
  } catch (error: any) {
    console.error('[AdminEmailController] OAuth callback error:', error);
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Gmail Connection Error</title></head>
      <body style="font-family:sans-serif; text-align:center; padding:50px; background:#fef2f2; color:#991b1b;">
        <h2>❌ Connection Error</h2>
        <p>${error?.message || 'Failed to exchange authorization tokens with Google.'}</p>
        <button onclick="window.close()" style="padding:10px 20px; background:#b91c1c; color:#fff; border:none; border-radius:6px; cursor:pointer;">Close Window</button>
      </body>
      </html>
    `);
  }
}

/**
 * POST /api/admin/gmail/disconnect/:senderId
 */
export async function disconnectGmailSender(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const senderId = req.params.senderId?.toLowerCase();
    const result = await emailService.disconnectSender(senderId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/email/templates
 * Returns list of email templates with default content
 */
export async function getEmailTemplates(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const templates = Object.values(EMAIL_TEMPLATES).map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      defaultSubject: t.defaultSubject,
      defaultText: t.defaultText,
      defaultHtml: t.defaultHtml
    }));

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/email/render
 * Populates a template with actual application variables
 */
export async function renderApplicationTemplate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { templateId, applicationId } = req.body;

    if (!templateId || !EMAIL_TEMPLATES[templateId]) {
      return res.status(400).json({ success: false, error: 'Valid templateId is required.' });
    }

    const template = EMAIL_TEMPLATES[templateId];

    let applicantName = 'Applicant';
    let appNumber = String(applicationId || '');
    let reviewerName = req.admin?.name || req.admin?.email || 'Mantra Review Team';

    if (applicationId) {
      const app = await campusRepo.findApplicationById(applicationId);
      if (app) {
        applicantName = app.full_name || app.email || 'Applicant';
        appNumber = String(app.id || applicationId);
      }
    }

    const variables: Record<string, string> = {
      applicantName,
      applicationId: appNumber,
      reviewerName
    };

    const renderedSubject = renderTemplateString(template.defaultSubject, variables);
    const renderedText = renderTemplateString(template.defaultText, variables);
    const renderedHtml = renderTemplateString(template.defaultHtml, variables);

    res.json({
      success: true,
      data: {
        templateId,
        subject: renderedSubject,
        text: renderedText,
        html: renderedHtml,
        variables
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/email/send
 * Authenticated Admin Send Email Endpoint (Routes via Gmail API)
 */
export async function sendAdminEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      senderId,
      to,
      subject,
      text,
      html,
      replyTo,
      applicationId,
      templateId,
      idempotencyKey
    } = req.body;

    if (!senderId) {
      return res.status(400).json({ success: false, error: 'senderId is required.' });
    }

    if (!to) {
      return res.status(400).json({ success: false, error: 'Recipient email "to" is required.' });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, error: 'Subject cannot be empty.' });
    }

    if (!text && !html) {
      return res.status(400).json({ success: false, error: 'Email message content cannot be empty.' });
    }

    const adminName = req.admin?.name || req.admin?.email || 'Admin';

    const result = await emailService.sendEmail({
      senderId,
      to,
      subject,
      text,
      html,
      replyTo,
      applicationId,
      templateId,
      sentByAdminName: adminName,
      idempotencyKey: idempotencyKey || req.headers['x-idempotency-key'] as string
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Unable to send email. Please try again.'
      });
    }

    // Automatically sync application status according to the email template sent
    if (applicationId) {
      try {
        if (templateId === 'application_approved') {
          await campusService.processAdminReview(
            String(applicationId),
            'approve',
            undefined,
            `Approved via email dispatched by ${adminName}`,
            undefined,
            adminName
          );
        } else if (templateId === 'application_rejected') {
          await campusService.processAdminReview(
            String(applicationId),
            'reject',
            'Application not accepted for current cohort (notified via email)',
            `Rejected via email dispatched by ${adminName}`,
            undefined,
            adminName
          );
        } else if (templateId === 'need_more_information') {
          await campusService.processAdminReview(
            String(applicationId),
            'request_info',
            undefined,
            `Requested additional information via email dispatched by ${adminName}`,
            [],
            adminName
          );
        }
      } catch (syncErr) {
        console.error('[AdminEmailController] Warning: Failed to sync application status with email:', syncErr);
      }
    }

    res.json({
      success: true,
      message: 'Email sent successfully.',
      data: result
    });
  } catch (error: any) {
    console.error('[AdminEmailController] Error in sendAdminEmail:', error);
    res.status(400).json({
      success: false,
      error: error?.message || 'Unable to send email. Please try again.'
    });
  }
}

/**
 * GET /api/admin/email/logs/:applicationId
 * Returns email history logs for an application
 */
export async function getApplicationEmailLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applicationId = req.params.applicationId;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: 'applicationId is required.' });
    }

    const logs = await emailService.getLogsForApplication(applicationId);

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
}
