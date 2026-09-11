import { google } from 'googleapis';
import { config } from '../../config/index.js';
import { sql } from '../../db/client.js';
import { encryptToken, decryptToken } from '../../utils/crypto.js';

export interface GmailSenderAccount {
  id?: string;
  sender_id: string;
  email: string;
  display_name: string;
  status: 'connected' | 'disconnected' | 'revoked' | 'unauthorized';
  google_account_id?: string | null;
  connected_by?: string;
  connected_at?: string;
  updated_at?: string;
}

export interface SendEmailOptions {
  senderId: 'ketan' | 'nirmay' | string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  applicationId?: string | number | null;
  templateId?: string | null;
  sentByAdminName?: string | null;
  idempotencyKey?: string | null;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  threadId?: string;
  error?: string;
}

// In-memory request lock to prevent duplicate sends on rapid clicks / retries
const activeSendLocks = new Map<string, Promise<SendEmailResult>>();

// In-memory fallback cache for connected senders in case DB HTTP fetch has transient network errors
const inMemoryConnectedSenders = new Map<string, {
  sender_id: string;
  email: string;
  display_name: string;
  refresh_token_encrypted: string;
  google_account_id?: string | null;
  status: 'connected';
  connected_by: string;
  connected_at: string;
  updated_at: string;
}>();

export class GmailEmailService {
  /**
   * Initializes OAuth2 client for Google Gmail API
   */
  public getOAuth2Client() {
    const { clientId, clientSecret, redirectUri } = config.google;
    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth Client ID and Secret are not configured (GOOGLE_GMAIL_CLIENT_ID, GOOGLE_GMAIL_CLIENT_SECRET).');
    }
    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  /**
   * Generates authorization URL for a specific sender identity ('ketan' | 'nirmay')
   */
  public generateAuthUrl(senderId: string, stateToken: string): string {
    const cleanId = String(senderId || '').trim().toLowerCase();
    const senders = config.email.senders as Record<string, { id: string; name: string; email: string }>;

    if (!senders[cleanId]) {
      throw new Error(`Invalid sender identity: "${senderId}". Allowed identities: ${Object.keys(senders).join(', ')}`);
    }

    const oauth2Client = this.getOAuth2Client();
    const targetEmail = senders[cleanId].email;

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // Forces Google to supply refresh_token
      scope: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/userinfo.email'],
      state: stateToken,
      login_hint: targetEmail
    });
  }

  /**
   * Exchanges OAuth authorization code for tokens and saves refresh token encrypted in DB
   */
  public async handleOAuthCallback(code: string, senderId: string, adminName: string) {
    const cleanId = String(senderId || '').trim().toLowerCase();
    const senders = config.email.senders as Record<string, { id: string; name: string; email: string }>;

    if (!senders[cleanId]) {
      throw new Error(`Invalid sender identity: "${senderId}". Allowed identities: ${Object.keys(senders).join(', ')}`);
    }

    const expectedConfig = senders[cleanId];
    const oauth2Client = this.getOAuth2Client();

    let tokens: any;
    try {
      const tokenRes = await oauth2Client.getToken(code);
      tokens = tokenRes.tokens;
    } catch (err: any) {
      console.error('[GmailEmailService] Failed to exchange code with Google:', err);
      throw new Error(`Google token exchange error: ${err?.message || 'Invalid authorization code or request.'}`);
    }

    oauth2Client.setCredentials(tokens);

    // Verify authorized user email matches the expected sender identity
    let grantedEmail = '';
    let googleAccountId = null;
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      grantedEmail = userInfo.data.email?.toLowerCase() || '';
      googleAccountId = userInfo.data.id || null;
    } catch (err: any) {
      console.warn('[GmailEmailService] Warning: Could not fetch user profile info:', err?.message);
    }

    if (grantedEmail && grantedEmail !== expectedConfig.email.toLowerCase()) {
      throw new Error(`Authorization mismatch: You signed in as "${grantedEmail}", but this connection is for "${expectedConfig.email}". Please authorize with the matching account.`);
    }

    if (!tokens.refresh_token) {
      // Check if we already have an existing refresh token in memory or DB
      const existing = await this.getSenderRecord(cleanId);
      if (!existing?.refresh_token_encrypted) {
        throw new Error('Google did not return a refresh token. Please revoke access in your Google Account security settings and reconnect with prompt=consent.');
      }
    }

    const refreshTokenEncrypted = tokens.refresh_token 
      ? encryptToken(tokens.refresh_token)
      : (await this.getSenderRecord(cleanId))?.refresh_token_encrypted;

    if (!refreshTokenEncrypted) {
      throw new Error('Failed to acquire refresh token from Google.');
    }

    const nowIso = new Date().toISOString();

    // Cache in-memory immediately so emails work seamlessly regardless of DB state
    inMemoryConnectedSenders.set(cleanId, {
      sender_id: cleanId,
      email: expectedConfig.email,
      display_name: expectedConfig.name,
      refresh_token_encrypted: refreshTokenEncrypted,
      google_account_id: googleAccountId,
      status: 'connected',
      connected_by: adminName || 'admin',
      connected_at: nowIso,
      updated_at: nowIso
    });

    // Attempt to persist or update sender record in Neon DB
    try {
      await sql`
        INSERT INTO gmail_sender_accounts (
          sender_id, email, display_name, refresh_token_encrypted, google_account_id, status, connected_by, connected_at, updated_at
        ) VALUES (
          ${cleanId},
          ${expectedConfig.email},
          ${expectedConfig.name},
          ${refreshTokenEncrypted},
          ${googleAccountId},
          'connected',
          ${adminName},
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (sender_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_name = EXCLUDED.display_name,
          refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
          google_account_id = EXCLUDED.google_account_id,
          status = 'connected',
          connected_by = EXCLUDED.connected_by,
          connected_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP;
      `;
      console.log(`[GmailEmailService] Sender account "${cleanId}" successfully persisted to database.`);
    } catch (dbErr: any) {
      console.warn(`[GmailEmailService] Database sync notice for "${cleanId}":`, dbErr?.message);
      // Sender is cached in-memory so connection remains operational!
    }

    return {
      senderId: cleanId,
      email: expectedConfig.email,
      displayName: expectedConfig.name,
      status: 'connected'
    };
  }

  /**
   * Fetches stored sender record from DB or in-memory fallback
   */
  public async getSenderRecord(senderId: string): Promise<any | null> {
    const cleanId = String(senderId).toLowerCase();
    try {
      const rows = await sql`
        SELECT * FROM gmail_sender_accounts WHERE sender_id = ${cleanId} LIMIT 1;
      `;
      if (rows && rows[0]) {
        return rows[0];
      }
    } catch (err) {
      console.warn('[GmailEmailService] Notice: Error querying database for sender record, checking memory cache:', err);
    }

    return inMemoryConnectedSenders.get(cleanId) || null;
  }

  /**
   * Retrieves all sender identities and their live connection status
   */
  public async getSendersStatus() {
    const configuredSenders = config.email.senders as Record<string, { id: string; name: string; email: string }>;
    
    let dbAccounts: any[] = [];
    try {
      dbAccounts = await sql`SELECT sender_id, email, display_name, status, connected_at, connected_by FROM gmail_sender_accounts;`;
    } catch (err) {
      console.warn('[GmailEmailService] Notice fetching gmail_sender_accounts from DB, checking memory cache');
    }

    const dbMap = new Map(dbAccounts.map((a: any) => [a.sender_id, a]));

    return Object.values(configuredSenders).map((s) => {
      const dbRow = dbMap.get(s.id);
      const memRow = inMemoryConnectedSenders.get(s.id);
      const isConnected = (dbRow && dbRow.status === 'connected') || (memRow && memRow.status === 'connected');

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        formatted: `${s.name} <${s.email}>`,
        status: isConnected ? 'connected' : 'disconnected',
        connectedAt: dbRow?.connected_at || memRow?.connected_at || null,
        connectedBy: dbRow?.connected_by || memRow?.connected_by || null
      };
    });
  }

  /**
   * Disconnects a stored sender account
   */
  public async disconnectSender(senderId: string) {
    const cleanId = String(senderId || '').trim().toLowerCase();
    inMemoryConnectedSenders.delete(cleanId);
    try {
      await sql`
        UPDATE gmail_sender_accounts
        SET status = 'disconnected', refresh_token_encrypted = '', updated_at = CURRENT_TIMESTAMP
        WHERE sender_id = ${cleanId};
      `;
      return { success: true };
    } catch (err: any) {
      return { success: true };
    }
  }

  /**
   * Constructs an RFC 2822 MIME message and encodes it in URL-safe Base64
   */
  private createMimeMessage(options: {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
  }): string {
    const boundary = `====_MANTRA_BOUNDARY_${Date.now()}_====`;
    const cleanSubject = `=?UTF-8?B?${Buffer.from(options.subject, 'utf8').toString('base64')}?=`;

    const lines: string[] = [
      `From: ${options.from}`,
      `To: ${options.to}`,
      `Subject: ${cleanSubject}`,
      `MIME-Version: 1.0`,
    ];

    if (options.replyTo) {
      lines.push(`Reply-To: ${options.replyTo}`);
    }

    if (options.html && options.text) {
      lines.push(
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/plain; charset="UTF-8"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        Buffer.from(options.text, 'utf8').toString('base64'),
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset="UTF-8"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        Buffer.from(options.html, 'utf8').toString('base64'),
        ``,
        `--${boundary}--`
      );
    } else if (options.html) {
      lines.push(
        `Content-Type: text/html; charset="UTF-8"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        Buffer.from(options.html, 'utf8').toString('base64')
      );
    } else {
      lines.push(
        `Content-Type: text/plain; charset="UTF-8"`,
        `Content-Transfer-Encoding: base64`,
        ``,
        Buffer.from(options.text || '', 'utf8').toString('base64')
      );
    }

    const rawMime = lines.join('\r\n');
    return Buffer.from(rawMime, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Main Send Email function using authorized Gmail account
   */
  public async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    const {
      senderId,
      to,
      subject,
      html,
      text,
      replyTo,
      applicationId,
      templateId,
      sentByAdminName,
      idempotencyKey
    } = options;

    // 1. Validate Recipient Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanTo = String(to || '').trim().toLowerCase();
    if (!cleanTo || !emailRegex.test(cleanTo)) {
      throw new Error('Please check the recipient email address.');
    }

    // 2. Validate Sender ID
    const cleanSenderId = String(senderId || '').trim().toLowerCase();
    const configuredSenders = config.email.senders as Record<string, { id: string; name: string; email: string }>;
    
    if (!configuredSenders[cleanSenderId]) {
      throw new Error(`Invalid or unauthorized sender identity: "${senderId}". Allowed identities: ${Object.keys(configuredSenders).join(', ')}`);
    }

    const senderConfig = configuredSenders[cleanSenderId];
    const fromHeader = `${senderConfig.name} <${senderConfig.email}>`;

    // 3. Check Stored Gmail OAuth Credentials
    const senderRecord = await this.getSenderRecord(cleanSenderId);
    if (!senderRecord || senderRecord.status !== 'connected' || !senderRecord.refresh_token_encrypted) {
      throw new Error(`Connect this Gmail account (${senderConfig.email}) before sending.`);
    }

    // 4. Validate Subject & Body
    const cleanSubject = String(subject || '').trim();
    if (!cleanSubject) {
      throw new Error('Email subject is required.');
    }

    const cleanText = text?.trim() || '';
    const cleanHtml = html?.trim() || (cleanText ? `<p style="white-space: pre-wrap;">${cleanText}</p>` : '');

    if (!cleanText && !cleanHtml) {
      throw new Error('Email message body cannot be empty.');
    }

    // 5. Concurrency & Idempotency Key Lock
    const lockKey = idempotencyKey 
      ? `idemp_${idempotencyKey}`
      : `send_${cleanTo}_${cleanSubject.substring(0, 30)}_${cleanSenderId}`;

    if (activeSendLocks.has(lockKey)) {
      console.log(`[GmailEmailService] Concurrent send detected for key ${lockKey}, returning existing in-flight promise.`);
      return await activeSendLocks.get(lockKey)!;
    }

    const sendPromise = (async (): Promise<SendEmailResult> => {
      let providerMessageId: string | null = null;
      let threadId: string | null = null;
      let errorMessage: string | null = null;

      try {
        let decryptedRefreshToken = '';
        try {
          decryptedRefreshToken = decryptToken(senderRecord.refresh_token_encrypted);
        } catch (decryptErr) {
          console.error('[GmailEmailService] Token decryption failed:', decryptErr);
          throw new Error('Google authorization token could not be decrypted. Please reconnect this Gmail account.');
        }

        const oauth2Client = this.getOAuth2Client();
        oauth2Client.setCredentials({ refresh_token: decryptedRefreshToken });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const raw = this.createMimeMessage({
          from: fromHeader,
          to: cleanTo,
          subject: cleanSubject,
          text: cleanText,
          html: cleanHtml,
          replyTo: replyTo || senderConfig.email
        });

        const res = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw }
        });

        providerMessageId = res.data.id || null;
        threadId = res.data.threadId || null;

        // 6. Log success in email_logs
        await this.logEmailRecord({
          applicationId: applicationId ? String(applicationId) : null,
          recipientEmail: cleanTo,
          senderEmail: senderConfig.email,
          senderId: cleanSenderId,
          template: templateId || null,
          subject: cleanSubject,
          status: 'sent',
          sentBy: sentByAdminName || 'admin',
          providerMessageId,
          errorMessage: null
        });

        return {
          success: true,
          messageId: providerMessageId || undefined,
          threadId: threadId || undefined
        };
      } catch (err: any) {
        console.error('[GmailEmailService] Gmail send error:', err);

        // Detect revoked or expired token
        const errorStr = String(err?.message || err?.response?.data?.error || '');
        if (errorStr.includes('invalid_grant') || errorStr.includes('Token has been expired or revoked') || err?.code === 401) {
          try {
            await sql`
              UPDATE gmail_sender_accounts
              SET status = 'revoked', updated_at = CURRENT_TIMESTAMP
              WHERE sender_id = ${cleanSenderId};
            `;
          } catch (dbErr) {}
          errorMessage = 'Google authorization has expired or was revoked. Reconnect this Gmail account.';
        } else {
          errorMessage = err?.message || 'Unable to send email. Please try again.';
        }

        // Log failure in DB
        try {
          await this.logEmailRecord({
            applicationId: applicationId ? String(applicationId) : null,
            recipientEmail: cleanTo,
            senderEmail: senderConfig.email,
            senderId: cleanSenderId,
            template: templateId || null,
            subject: cleanSubject,
            status: 'failed',
            sentBy: sentByAdminName || 'admin',
            providerMessageId: null,
            errorMessage
          });
        } catch (dbErr) {
          console.error('[GmailEmailService] Failed to record email failure log:', dbErr);
        }

        return {
          success: false,
          error: errorMessage || undefined
        };
      } finally {
        activeSendLocks.delete(lockKey);
      }
    })();

    activeSendLocks.set(lockKey, sendPromise);
    return await sendPromise;
  }

  /**
   * Insert record into email_logs table
   */
  private async logEmailRecord(data: {
    applicationId: string | null;
    recipientEmail: string;
    senderEmail: string;
    senderId: string;
    template: string | null;
    subject: string;
    status: string;
    sentBy: string;
    providerMessageId: string | null;
    errorMessage: string | null;
  }) {
    try {
      await sql`
        INSERT INTO email_logs (
          application_id,
          recipient_email,
          sender_email,
          sender_id,
          template,
          subject,
          status,
          sent_by,
          provider_message_id,
          error_message
        ) VALUES (
          ${data.applicationId},
          ${data.recipientEmail},
          ${data.senderEmail},
          ${data.senderId},
          ${data.template},
          ${data.subject},
          ${data.status},
          ${data.sentBy},
          ${data.providerMessageId},
          ${data.errorMessage}
        );
      `;
    } catch (err) {
      console.warn('[GmailEmailService] Could not write to email_logs table:', err);
    }
  }

  /**
   * Fetch email logs for a specific application
   */
  public async getLogsForApplication(applicationId: string | number) {
    try {
      const rows = await sql`
        SELECT 
          id,
          application_id,
          recipient_email,
          sender_email,
          sender_id,
          template,
          subject,
          status,
          sent_at,
          sent_by,
          provider_message_id,
          error_message
        FROM email_logs
        WHERE application_id = ${String(applicationId)}
        ORDER BY sent_at DESC;
      `;
      return rows;
    } catch (err) {
      console.warn('[GmailEmailService] Error reading email_logs:', err);
      return [];
    }
  }
}

export const emailService = new GmailEmailService();
