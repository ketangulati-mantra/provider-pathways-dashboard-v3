import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  Mail, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Unlink,
  CheckCircle,
  XCircle,
  HelpCircle,
  Inbox,
  FileText,
  UserCheck
} from 'lucide-react';
import { fetchEmailSenders, fetchEmailTemplates, renderEmailTemplate, sendAdminEmail, initiateGmailOAuth, disconnectGmailSender } from '../../mantra/api';

// Template icon & badge styling helper
const getTemplateMeta = (id) => {
  switch (id) {
    case 'application_received':
      return {
        icon: Inbox,
        color: '#2563eb',
        bg: '#eff6ff',
        border: '#bfdbfe',
        badge: 'Received',
        badgeBg: '#dbeafe',
        badgeColor: '#1e40af'
      };
    case 'application_approved':
      return {
        icon: CheckCircle,
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
        badge: 'Approved',
        badgeBg: '#d1fae5',
        badgeColor: '#065f46'
      };
    case 'application_rejected':
      return {
        icon: XCircle,
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        badge: 'Rejected',
        badgeBg: '#fee2e2',
        badgeColor: '#991b1b'
      };
    case 'need_more_information':
      return {
        icon: HelpCircle,
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
        badge: 'More Info',
        badgeBg: '#fef3c7',
        badgeColor: '#92400e'
      };
    default:
      return {
        icon: FileText,
        color: '#64748b',
        bg: '#f8fafc',
        border: '#e2e8f0',
        badge: 'Template',
        badgeBg: '#f1f5f9',
        badgeColor: '#475569'
      };
  }
};

export default function SendEmailModal({
  isOpen,
  onClose,
  application,
  onEmailSentSuccess
}) {
  const [senders, setSenders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedSenderId, setSelectedSenderId] = useState('ketan');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [renderingTemplate, setRenderingTemplate] = useState(false);
  const [connectingSender, setConnectingSender] = useState(false);
  const [sendingState, setSendingState] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Listen for OAuth success message from Google popup window
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data?.type === 'GMAIL_AUTH_SUCCESS') {
        loadSendersAndTemplates();
        setFeedbackMessage(`Gmail account (${event.data.senderId}) connected successfully!`);
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  // Initialize data on open
  useEffect(() => {
    if (isOpen && application) {
      setRecipientEmail(application.email || '');
      setSendingState('idle');
      setFeedbackMessage('');
      setIdempotencyKey(`idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
      loadSendersAndTemplates();
    }
  }, [isOpen, application]);

  const loadSendersAndTemplates = async () => {
    try {
      setLoadingConfig(true);
      const [sendersRes, templatesRes] = await Promise.all([
        fetchEmailSenders(),
        fetchEmailTemplates()
      ]);

      if (sendersRes.success && sendersRes.data && sendersRes.data.length > 0) {
        setSenders(sendersRes.data);
        const hasKetan = sendersRes.data.find(s => s.id === 'ketan');
        setSelectedSenderId(hasKetan ? 'ketan' : sendersRes.data[0].id);
      }

      if (templatesRes.success && templatesRes.data && templatesRes.data.length > 0) {
        setTemplates(templatesRes.data);
        
        // Auto-select smart template based on current application status if possible
        const appStatus = application?.application_status;
        let defaultTpl = 'application_received';
        if (appStatus === 'approved') defaultTpl = 'application_approved';
        else if (appStatus === 'rejected') defaultTpl = 'application_rejected';
        else if (appStatus === 'more_info_required') defaultTpl = 'need_more_information';
        
        const matched = templatesRes.data.find(t => t.id === defaultTpl);
        const finalTplId = matched ? defaultTpl : templatesRes.data[0].id;
        setSelectedTemplateId(finalTplId);
        
        // Render initial template content
        await handleTemplateSelect(finalTplId);
      }
    } catch (err) {
      console.error('[SendEmailModal] Error loading configs:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleConnectGmail = async (senderId) => {
    try {
      setConnectingSender(true);
      const res = await initiateGmailOAuth(senderId);
      if (res.success && res.data?.authUrl) {
        // Open Google OAuth consent screen in a secure popup window
        const width = 560;
        const height = 660;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open(
          res.data.authUrl,
          'Google_Gmail_OAuth',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
        );
      } else {
        setFeedbackMessage(res.error || 'Failed to initiate Google OAuth.');
        setSendingState('error');
      }
    } catch (err) {
      console.error('[SendEmailModal] OAuth error:', err);
      setFeedbackMessage('Failed to connect Gmail account.');
      setSendingState('error');
    } finally {
      setConnectingSender(false);
    }
  };

  const handleTemplateSelect = async (tplId) => {
    setSelectedTemplateId(tplId);
    if (!tplId) return;

    try {
      setRenderingTemplate(true);
      const res = await renderEmailTemplate(tplId, application?.id);
      if (res.success && res.data) {
        setSubject(res.data.subject || '');
        setMessage(res.data.text || '');
      }
    } catch (err) {
      console.error('[SendEmailModal] Error rendering template:', err);
    } finally {
      setRenderingTemplate(false);
    }
  };

  const handleSendEmail = async (e) => {
    e?.preventDefault();

    if (sendingState === 'sending') return;

    const currentSender = senders.find(s => s.id === selectedSenderId);
    if (currentSender && currentSender.status !== 'connected') {
      setFeedbackMessage(`Connect this Gmail account (${currentSender.email}) before sending.`);
      setSendingState('error');
      return;
    }

    if (!recipientEmail || !recipientEmail.trim()) {
      setFeedbackMessage('Recipient email address is required.');
      setSendingState('error');
      return;
    }

    if (!subject || !subject.trim()) {
      setFeedbackMessage('Email subject cannot be empty.');
      setSendingState('error');
      return;
    }

    if (!message || !message.trim()) {
      setFeedbackMessage('Email message body cannot be empty.');
      setSendingState('error');
      return;
    }

    setSendingState('sending');
    setFeedbackMessage('');

    try {
      const res = await sendAdminEmail({
        senderId: selectedSenderId,
        to: recipientEmail.trim(),
        subject: subject.trim(),
        text: message.trim(),
        applicationId: application?.id,
        templateId: selectedTemplateId || undefined,
        idempotencyKey
      });

      if (res.success) {
        setSendingState('success');
        setFeedbackMessage('Email sent successfully via Gmail API.');
        if (onEmailSentSuccess) {
          onEmailSentSuccess();
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSendingState('error');
        setFeedbackMessage(res.error || 'Unable to send email. Please try again.');
      }
    } catch (err) {
      console.error('[SendEmailModal] Send email exception:', err);
      setSendingState('error');
      setFeedbackMessage('Unable to send email. Please try again.');
    }
  };

  if (!isOpen) return null;

  const currentSenderObj = senders.find(s => s.id === selectedSenderId);
  const isSenderConnected = currentSenderObj?.status === 'connected';

  const modalContent = (
    <div
      onClick={sendingState === 'sending' ? undefined : onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.18)', 
              padding: '10px', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}>
              <Mail size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Send Predefined Email
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>To: <strong>{application?.full_name || 'Applicant'}</strong></span>
                <span>•</span>
                <span>App #{application?.id || '—'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={sendingState === 'sending'}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: sendingState === 'sending' ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Feedback Alerts */}
            {sendingState === 'success' && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={18} color="#059669" />
                {feedbackMessage || 'Email sent successfully.'}
              </div>
            )}

            {sendingState === 'error' && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.86rem',
                fontWeight: 700
              }}>
                <AlertCircle size={18} color="#dc2626" />
                {feedbackMessage || 'Unable to send email. Please try again.'}
              </div>
            )}

            {/* Sender & Recipient Section in a compact 2-column card */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px'
            }}>
              {/* From Sender Identity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    From Identity
                  </label>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '5px',
                    background: isSenderConnected ? '#d1fae5' : '#fee2e2',
                    color: isSenderConnected ? '#065f46' : '#991b1b',
                    border: `1px solid ${isSenderConnected ? '#a7f3d0' : '#fecaca'}`
                  }}>
                    {isSenderConnected ? '● Connected' : '○ Not Connected'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={selectedSenderId}
                    onChange={(e) => setSelectedSenderId(e.target.value)}
                    disabled={sendingState === 'sending' || loadingConfig}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {senders.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>

                  {isSenderConnected ? (
                    <button
                      type="button"
                      onClick={() => handleConnectGmail(selectedSenderId)}
                      disabled={connectingSender}
                      title="Click to reconnect / re-authorize this account with Google"
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <RefreshCw size={11} className={connectingSender ? 'animate-spin' : ''} /> Reconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleConnectGmail(selectedSenderId)}
                      disabled={connectingSender}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #93c5fd',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <ExternalLink size={12} /> Connect
                    </button>
                  )}
                </div>
              </div>

              {/* To Recipient */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  To Applicant
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  disabled={sendingState === 'sending'}
                  placeholder="applicant@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.84rem',
                    color: '#0f172a',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Visual Predefined Templates Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Select Template
                </label>
                {renderingTemplate && (
                  <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Loader2 size={12} className="animate-spin" /> Rendering variables...
                  </span>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}>
                {templates.map((t) => {
                  const meta = getTemplateMeta(t.id);
                  const Icon = meta.icon;
                  const isSelected = selectedTemplateId === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleTemplateSelect(t.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${meta.color}` : '1.5px solid #e2e8f0',
                        background: isSelected ? meta.bg : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                        boxShadow: isSelected ? `0 2px 8px ${meta.color}20` : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{
                            color: meta.color,
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <Icon size={15} />
                          </div>
                          <span style={{
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            color: isSelected ? '#0f172a' : '#334155'
                          }}>
                            {t.name}
                          </span>
                        </div>

                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: isSelected ? meta.badgeBg : '#f1f5f9',
                          color: isSelected ? meta.badgeColor : '#64748b'
                        }}>
                          {meta.badge}
                        </span>
                      </div>

                      <p style={{
                        margin: 0,
                        fontSize: '0.73rem',
                        color: '#64748b',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {t.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sendingState === 'sending'}
                placeholder="Email Subject Line"
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Editable Message Body */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Email Message (Editable Preview)
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                  Personalize applicant variables before dispatch
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sendingState === 'sending'}
                rows={8}
                required
                placeholder="Write your email message..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  color: '#1e293b',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
              <Sparkles size={14} color="#3b82f6" />
              <span>Delivered via Google Gmail API OAuth 2.0</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={sendingState === 'sending'}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: sendingState === 'sending' ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingState === 'sending' || sendingState === 'success' || renderingTemplate}
                style={{
                  padding: '8px 22px',
                  borderRadius: '9px',
                  border: 'none',
                  background: sendingState === 'sending' 
                    ? '#94a3b8' 
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: (sendingState === 'sending' || sendingState === 'success') ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                {sendingState === 'sending' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending Email...
                  </>
                ) : sendingState === 'success' ? (
                  <>
                    <CheckCircle2 size={15} />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

