import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, XCircle, HelpCircle, ExternalLink, Clock, FileText, History, Mail } from 'lucide-react';
import { MANTRA_CONFIG } from '../../mantra';
import { getAdminAuthHeaders, fetchApplicationEmailLogs } from '../../mantra/api';
import SendEmailModal from './SendEmailModal';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

export default function CampusApplicationDetailsDrawer({ isOpen, onClose, applicationId, onActionSuccess, onOpenRejectModal, onOpenRequestInfoModal }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history' | 'emails'
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  // Lock background body scroll when modal is open
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

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchDetails();
      fetchEmailHistory();
    }
  }, [isOpen, applicationId]);

  const fetchEmailHistory = async () => {
    if (!applicationId) return;
    try {
      setLoadingEmails(true);
      const res = await fetchApplicationEmailLogs(applicationId);
      if (res.success && res.data) {
        setEmailLogs(res.data);
      }
    } catch (err) {
      console.error('[CampusApplicationDetailsDrawer] Error fetching email history:', err);
    } finally {
      setLoadingEmails(false);
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/campus-program/admin/applications/${applicationId}`, {
        headers: getAdminAuthHeaders(),
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success) {
        setDetails(json.data);
      }
    } catch (err) {
      console.error('[CampusApplicationDetailsDrawer] Error fetching details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const app = details?.application || {};
  const versionHistory = details?.versionHistory || [];

  const handleApproveClick = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/admin/review`, {
        method: 'POST',
        headers: { ...getAdminAuthHeaders(), 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          applicationId,
          action: 'approve',
          reviewerId: app?.reviewed_by || 'Admin Reviewer',
          reviewerNotes: 'Application approved by administrator.'
        })
      });
      const json = await res.json();
      if (json.success && onActionSuccess) {
        onActionSuccess(json.data);
        onClose();
      }
    } catch (err) {
      console.error('[CampusApplicationDetailsDrawer] Error approving:', err);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', label: 'Approved' };
      case 'rejected':
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', label: 'Rejected' };
      case 'more_info_required':
        return { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5', label: 'Info Requested' };
      case 'under_review':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: 'Under Review' };
      default:
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a', label: 'Pending Review' };
    }
  };

  const badge = getStatusBadge(app.application_status);

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      
      {/* Dead-Centered Modal Card with Premium Blue Header */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '85vh',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(30, 58, 138, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        
        {/* Top Header - Lighter Blue Gradient Tone */}
        <div style={{
          padding: '22px 26px',
          borderBottom: '1px solid #93c5fd',
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, padding: '4px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 900, whiteSpace: 'nowrap', display: 'inline-block' }}>
                {badge.label}
              </span>
              {versionHistory.length > 1 && (
                <span style={{ background: 'rgba(255, 255, 255, 0.18)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '3px 10px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800 }}>
                  Submission #{app.version || 1}
                </span>
              )}
            </div>

            <h2 style={{ margin: '8px 0 2px', fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
              {app.full_name || 'Applicant Candidate'}
            </h2>
            <div style={{ fontSize: '0.84rem', color: '#f0f9ff' }}>
              {app.email} • {app.college}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              flexShrink: 0,
              transition: 'all 0.15s ease',
              marginTop: '0px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Simplified Tabs: Details, Submission History, and Email Communications */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 16px', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'details' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'details' ? '#2563eb' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={15} /> Application Details
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'history' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'history' ? '#2563eb' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={15} /> Submission History ({versionHistory.length})
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'emails' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'emails' ? '#2563eb' : '#64748b',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Mail size={15} /> Email History ({emailLogs.length})
          </button>
        </div>

        {/* Scrollable Inner Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: 700 }}>
              Loading application details...
            </div>
          ) : (
            <>
              {activeTab === 'details' && (
                <>
                  {/* Academic Profile */}
                  <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Academic Credentials
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.84rem' }}>
                      <div><span style={{ color: '#64748b' }}>University:</span> <strong style={{ color: '#0f172a', display: 'block' }}>{app.college}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Degree & Year:</span> <strong style={{ color: '#0f172a', display: 'block' }}>{app.course} ({app.year})</strong></div>
                      <div><span style={{ color: '#64748b' }}>City/Location:</span> <strong style={{ color: '#0f172a', display: 'block' }}>{app.city}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Phone:</span> <strong style={{ color: '#0f172a', display: 'block' }}>{app.country_code} {app.phone || 'N/A'}</strong></div>
                    </div>
                  </div>

                  {/* Statement of Motivation */}
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
                      Statement of Motivation
                    </h4>
                    <div style={{ background: '#ffffff', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                      {app.motivation || 'No motivation provided.'}
                    </div>
                  </div>

                  {/* Experience & Availability */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Weekly Availability</span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#2563eb', marginTop: '2px' }}>
                        {app.availability || '3-5 hours/week'}
                      </div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Submissions Count</span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                        {versionHistory.length} Submission{versionHistory.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Leadership Experience */}
                  {app.previous_experience && (
                    <div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
                        Previous Leadership & Advocacy Experience
                      </h4>
                      <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                        {app.previous_experience}
                      </div>
                    </div>
                  )}

                  {/* Social Profiles */}
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 900, color: '#0f172a' }}>
                      Social & Institutional Links
                    </h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {app.linkedin_url ? (
                        <a href={app.linkedin_url} target="_blank" rel="noreferrer" style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#2563eb', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          LinkedIn Profile <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No LinkedIn link provided</span>
                      )}
                    </div>
                  </div>

                  {/* Rejection Reason Callout if Rejected */}
                  {app.application_status === 'rejected' && app.review_reason && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', padding: '12px 16px', borderRadius: '12px', color: '#991b1b', fontSize: '0.84rem' }}>
                      <strong style={{ display: 'block', marginBottom: '2px', color: '#b91c1c' }}>Rejection Reason (Visible to Applicant):</strong>
                      {app.review_reason}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>
                    Applicant Submission History ({versionHistory.length})
                  </h4>
                  {versionHistory.map((v, index) => {
                    const stBadge = getStatusBadge(v.application_status);
                    return (
                      <div key={v.id} style={{ background: '#ffffff', border: v.id === app.id ? '1.5px solid #2563eb' : '1px solid #e2e8f0', padding: '16px', borderRadius: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 900, color: '#1e3a8a', fontSize: '0.9rem' }}>
                              Submission #{v.version || (index + 1)}
                            </span>
                            <span style={{ background: stBadge.bg, color: stBadge.text, border: `1px solid ${stBadge.border}`, padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                              {stBadge.label}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                            {new Date(v.submitted_at || v.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                          <strong>Motivation:</strong> "{v.motivation}"
                        </div>
                        {v.previous_experience && (
                          <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '6px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                            <strong>Experience:</strong> {v.previous_experience}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'emails' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>
                      Email Communication History ({emailLogs.length})
                    </h4>
                    <button
                      onClick={() => setIsSendEmailOpen(true)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Mail size={13} /> Compose Email
                    </button>
                  </div>

                  {loadingEmails ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                      Loading email communications...
                    </div>
                  ) : emailLogs.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '36px 20px',
                      background: '#f8fafc',
                      borderRadius: '14px',
                      border: '1px dashed #cbd5e1',
                      color: '#64748b'
                    }}>
                      <Mail size={28} style={{ margin: '0 auto 8px', opacity: 0.5, display: 'block' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#334155' }}>No emails sent yet</div>
                      <p style={{ margin: '4px 0 14px', fontSize: '0.8rem' }}>
                        Send a predefined template email directly to {app.full_name || 'this applicant'}.
                      </p>
                      <button
                        onClick={() => setIsSendEmailOpen(true)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#2563eb',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Send First Email
                      </button>
                    </div>
                  ) : (
                    emailLogs.map((log) => {
                      const isSent = log.status === 'sent';
                      return (
                        <div key={log.id} style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: isSent ? '4px solid #10b981' : '4px solid #ef4444',
                          padding: '14px 16px',
                          borderRadius: '12px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{
                                background: isSent ? '#ecfdf5' : '#fef2f2',
                                color: isSent ? '#047857' : '#b91c1c',
                                border: `1px solid ${isSent ? '#a7f3d0' : '#fecaca'}`,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                display: 'inline-block',
                                marginBottom: '4px'
                              }}>
                                {isSent ? '✓ Sent' : '✕ Failed'} {log.template ? `· ${log.template}` : ''}
                              </span>
                              <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                                {log.subject}
                              </h5>
                            </div>
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>
                              {new Date(log.sent_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                            <span><strong>To:</strong> {log.recipient_email}</span>
                            <span><strong>From:</strong> {log.sender_email}</span>
                            <span><strong>Sent by:</strong> {log.sent_by}</span>
                          </div>

                          {log.error_message && (
                            <div style={{ marginTop: '6px', fontSize: '0.76rem', color: '#b91c1c', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                              Error: {log.error_message}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Bottom Review Action Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setIsSendEmailOpen(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '99px',
                border: '1px solid #bfdbfe',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mail size={14} /> Send Email
            </button>

            <button
              onClick={() => onOpenRequestInfoModal(app)}
              style={{
                padding: '9px 16px',
                borderRadius: '99px',
                border: '1px solid #fed7aa',
                background: '#fff7ed',
                color: '#c2410c',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <HelpCircle size={14} /> Request Info
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onOpenRejectModal(app)}
              style={{
                padding: '9px 18px',
                borderRadius: '99px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#b91c1c',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <XCircle size={15} /> Reject
            </button>

            <button
              onClick={handleApproveClick}
              style={{
                padding: '9px 22px',
                borderRadius: '99px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <CheckCircle2 size={15} /> Approve & Activate
            </button>
          </div>
        </div>

      </div>

      {/* Send Email Modal Portal */}
      <SendEmailModal
        isOpen={isSendEmailOpen}
        onClose={() => setIsSendEmailOpen(false)}
        application={app}
        onEmailSentSuccess={() => {
          fetchEmailHistory();
          fetchDetails();
          if (onActionSuccess) {
            onActionSuccess();
          }
        }}
      />

    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
