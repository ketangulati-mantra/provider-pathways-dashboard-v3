import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Search, Eye, Filter, CheckCircle2, XCircle, Clock, Building2, Calendar,
  UserCheck, Plus, ChevronDown, X, Mail, User, RefreshCw, Download,
  FileSpreadsheet, Globe, Phone, Tag, ShieldCheck, ArrowRight, Briefcase, HelpCircle,
  ExternalLink, Sparkles, MapPin, Check, ChevronUp, AlertCircle
} from 'lucide-react';
import ManageReviewersModal from './ManageReviewersModal';
import { MANTRA_CONFIG } from '../../mantra';
import { useAuth } from '../../auth/AuthContext';
import { fetchAdminReviewers, getAdminAuthHeaders } from '../../mantra/api';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const DEFAULT_REVIEWERS = [
  'Unassigned'
];

// Helper to safely render missing/empty fields without null/undefined
const safeVal = (val, fallback = 'Not provided') => {
  if (val === null || val === undefined || String(val).trim() === '') return fallback;
  return val;
};

// ─── Company Referral Detail Modal (Streamlined CRM Review Record) ──────────
function SubmissionDetailsModal({ app, isOpen, onClose }) {
  const [historyExpanded, setHistoryExpanded] = useState(false);

  if (!isOpen || !app) return null;

  const STATUS_BADGES = {
    pending: { label: 'Pending', bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    submitted: { label: 'Pending', bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
    under_review: { label: 'Under Review', bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },
    reviewed: { label: 'Reviewed', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    mail_sent: { label: 'Contacted', bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
    approved: { label: 'Reviewed', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    rejected: { label: 'Archived', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' }
  };

  const currentSt = (app.review_status || app.application_status || app.status || 'pending').toLowerCase();
  const currentBadge = STATUS_BADGES[currentSt] || STATUS_BADGES.pending;

  const formattedSubmittedDate = (() => {
    const raw = app.submitted_at || app.updated_at || app.created_at || app.submittedAt;
    if (!raw) return 'N/A';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  })();

  const formattedUpdatedDate = (() => {
    const raw = app.updated_at || app.reviewed_at || app.submitted_at;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  })();

  // Needs parsing
  const companyNeedsList = (() => {
    if (Array.isArray(app.company_needs) && app.company_needs.length > 0) return app.company_needs;
    if (Array.isArray(app.companyNeeds) && app.companyNeeds.length > 0) return app.companyNeeds;
    if (typeof app.company_needs === 'string' && app.company_needs.trim()) {
      try {
        const parsed = JSON.parse(app.company_needs);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [app.company_needs];
      }
    }
    return null;
  })();

  const termsConfirmed = app.terms_accepted ?? app.termsAccepted ?? true;

  // Normalized company fields
  const displayCompanyName = app.company_name || app.companyName;
  const displayCompanyCountry = app.company_country || app.companyCountry || 'India';
  const displayCompanyCity = app.company_city || app.companyCity || (app.company_name ? app.city : null);
  const locationString = displayCompanyCity ? `${displayCompanyCity}, ${displayCompanyCountry}` : displayCompanyCountry;

  // Status logs parsing
  const rawLogs = app.status_history || app.statusHistory || [];
  let logs = Array.isArray(rawLogs) && rawLogs.length > 0 ? [...rawLogs] : [];
  if (logs.length === 0) {
    logs.push({
      status: 'pending',
      changed_at: app.submitted_at || app.created_at || new Date().toISOString(),
      changed_by: 'System / User'
    });
    if (currentSt !== 'pending' && currentSt !== 'submitted') {
      logs.push({
        status: currentSt,
        changed_at: app.reviewed_at || app.updated_at || new Date().toISOString(),
        changed_by: app.reviewed_by || 'Reviewer'
      });
    }
  }
  const visibleLogs = historyExpanded ? logs : logs.slice(-3);

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════ 1. MODAL HEADER ══════════════════ */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', minWidth: 0 }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0, marginTop: '2px' }}>
                <Building2 size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
                    {displayCompanyName ? displayCompanyName : <span style={{ color: '#94a3b8', fontWeight: 600 }}>Company name not provided</span>}
                  </h2>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${currentBadge.border}`,
                      background: currentBadge.bg,
                      color: currentBadge.color,
                      fontWeight: 800,
                      fontSize: '0.68rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {currentBadge.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px', lineHeight: 1.4 }}>
                  Company Referral &bull; Referred by <strong style={{ color: '#0f172a' }}>{safeVal(app.full_name, 'Unknown Referrer')}</strong> &bull; Submitted {formattedSubmittedDate}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close modal"
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0, transition: 'all 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              <X size={15} />
            </button>
          </div>

          {/* ══════════════════ 2. QUICK SUMMARY STRIP ══════════════════ */}
          <div style={{
            marginTop: '12px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '8px 12px', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>COMPANY</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={displayCompanyName || 'Not provided'}>
                {safeVal(displayCompanyName, 'Not provided')}
              </div>
            </div>

            <div style={{ padding: '8px 12px', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>LOCATION</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={locationString}>
                {safeVal(locationString, 'Not provided')}
              </div>
            </div>

            <div style={{ padding: '8px 12px', borderRight: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>INDUSTRY</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.company_industry || app.industry || app.industries || 'Not provided'}>
                {safeVal(app.company_industry || app.industry || app.industries, 'Not provided')}
              </div>
            </div>

            <div style={{ padding: '8px 12px' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>COMPANY SIZE</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {safeVal(app.company_size || app.companySize, 'Not provided')}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════ SCROLLABLE CONTENT BODY ══════════════════ */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', WebkitOverflowScrolling: 'touch' }}>

          {/* ══════════════════ 3. SECTION: COMPANY DETAILS ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} /> COMPANY DETAILS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 20px' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Company / Organization</div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginTop: '1px', wordBreak: 'break-word' }}>
                  {safeVal(displayCompanyName, 'Not provided')}
                </div>
              </div>

              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Website</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {app.company_website || app.website ? (
                    <a
                      href={(app.company_website || app.website).startsWith('http') ? (app.company_website || app.website) : `https://${app.company_website || app.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={app.company_website || app.website}
                      style={{ color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.company_website || app.website}</span>
                      <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    </a>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>Not provided</span>
                  )}
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Country</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', wordBreak: 'break-word' }}>
                  {safeVal(displayCompanyCountry, 'India')}
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>City / Location</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', wordBreak: 'break-word' }}>
                  {safeVal(displayCompanyCity, 'Not provided')}
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Industry</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', wordBreak: 'break-word' }}>
                  {safeVal(app.company_industry || app.industry || app.industries, 'Not provided')}
                </div>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Company Size</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', wordBreak: 'break-word' }}>
                  {safeVal(app.company_size || app.companySize, 'Not provided')}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════ 4. SECTION: INTRODUCTION ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserCheck size={13} /> INTRODUCTION
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px 16px' }}>
              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Who can you connect Mantra with?</div>
                <div style={{ marginTop: '3px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 9px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                    {safeVal(app.decision_maker || app.company_connections || app.decisionMaker, 'Not provided')}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>How can you introduce Mantra?</div>
                <div style={{ marginTop: '3px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 9px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#1d4ed8' }}>
                    {safeVal(app.intro_method || app.introMethod, 'Not provided')}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>How do you know the company?</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  {safeVal(app.relationship, 'Not provided')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Connection strength</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  {safeVal(app.connection_reach || app.connection_strength || app.connectionStrength, 'Not provided')}
                </div>
              </div>

              {app.direct_contact_person && (
                <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Direct Contact Person:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{app.direct_contact_person}</span>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════ 5. SECTION: COMPANY NEED ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={13} /> COMPANY NEED
            </div>

            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Potential Need</div>
              {companyNeedsList && companyNeedsList.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {companyNeedsList.map((need, i) => (
                    <span
                      key={i}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700
                      }}
                    >
                      {need}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {app.motivation && app.motivation !== 'Corporate Referral Introduction' ? app.motivation : 'Not provided'}
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════ 6. SECTION: REFERRAL FROM ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} /> REFERRAL FROM
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px 16px' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>{safeVal(app.full_name, 'Referrer')}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Provider / Referrer</div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Email</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '1px', wordBreak: 'break-all' }}>
                  {safeVal(app.email, 'Not provided')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Phone</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginTop: '1px' }}>
                  {app.phone ? (app.phone.startsWith('+') ? app.phone : `${app.country_code || ''} ${app.phone}`.trim()) : 'Not provided'}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════ 7. SECTION: REFERRAL CONTEXT ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              REFERRAL CONTEXT
            </div>

            <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              {app.referral_context || app.referralContext || (app.motivation && app.motivation !== 'Corporate Referral Introduction' ? app.motivation : 'No additional context provided.')}
            </div>

            <div style={{ paddingTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {termsConfirmed ? (
                <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} color="#059669" /> Referral partnership terms confirmed
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#b91c1c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <XCircle size={13} color="#dc2626" /> Referral partnership terms not confirmed
                </span>
              )}
            </div>
          </div>

          {/* ══════════════════ 8. SECTION: REFERRAL OPPORTUNITY ══════════════════ */}
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              REFERRAL OPPORTUNITY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { step: '01', text: 'Provider introduces Mantra to the company.' },
                { step: '02', text: "Mantra's corporate team handles the conversation and next steps." },
                { step: '03', text: 'Company signs a qualifying corporate / EAP contract.' },
                { step: '04', text: 'Provider may be eligible for 15–20% of contract value.' },
                { step: '05', text: 'Provider may have an opportunity to serve as a preferred or primary provider, subject to the applicable arrangement.' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.74rem', color: '#0c4a6e', lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 800, color: '#0284c7', flexShrink: 0 }}>{item.step}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════ 9. SECTION: REFERRAL STATUS & REVIEWER ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              REFERRAL STATUS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px 14px' }}>
              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Current Status</div>
                <div style={{ marginTop: '2px' }}>
                  <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '6px', border: `1px solid ${currentBadge.border}`, background: currentBadge.bg, color: currentBadge.color, fontWeight: 800, fontSize: '0.72rem' }}>
                    {currentBadge.label}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Assigned Reviewer</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginTop: '3px' }}>
                  {safeVal(app.reviewed_by, 'Unassigned')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Submitted</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginTop: '3px' }}>
                  {formattedSubmittedDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>Last Updated</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginTop: '3px' }}>
                  {formattedUpdatedDate || formattedSubmittedDate}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════ 10. SECTION: REFERRAL STATUS HISTORY ══════════════════ */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> REFERRAL STATUS HISTORY
              </div>
              {logs.length > 3 && (
                <button
                  type="button"
                  onClick={() => setHistoryExpanded(!historyExpanded)}
                  style={{ border: 'none', background: 'transparent', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}
                >
                  <span>{historyExpanded ? 'Show less' : `Show all (${logs.length})`}</span>
                  {historyExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>

            {/* Timeline Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
              {visibleLogs.map((logItem, idx) => {
                const stKey = String(logItem.status || 'pending').toLowerCase().trim();
                const badge = STATUS_BADGES[stKey] || STATUS_BADGES.pending;
                const logTime = logItem.changed_at || logItem.created_at || logItem.timestamp ? new Date(logItem.changed_at || logItem.created_at || logItem.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'N/A';
                const actor = logItem.changed_by || logItem.changedBy || 'Reviewer';

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.74rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: badge.color, marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>{badge.label}</strong>
                        <span style={{ color: '#64748b', marginLeft: '6px' }}>by {actor}</span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                        {logTime}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ══════════════════ MODAL FOOTER ══════════════════ */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#1e293b', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Main Admin Dashboard Component ──────────────────────────────────────────
export default function CorporateAdminDashboard() {
  const { admin: currentAdmin, user } = useAuth();
  const activeUser = currentAdmin || user;
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [reviewerFilter, setReviewerFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applicationsData, setApplicationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Modal State
  const [viewApp, setViewApp] = useState(null);

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Custom Reviewers State
  const [reviewerOptions, setReviewerOptions] = useState(DEFAULT_REVIEWERS);
  const [isManagingReviewers, setIsManagingReviewers] = useState(false);

  // Filter Visibility Toggle State
  const [filterVisibility, setFilterVisibility] = useState({
    date: true,
    status: true,
    reviewer: true,
    location: true,
    industry: true,
    search: true
  });
  const [isFilterSettingsOpen, setIsFilterSettingsOpen] = useState(false);
  const filterSettingsRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterSettingsRef.current && !filterSettingsRef.current.contains(e.target)) {
        setIsFilterSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [activeTab, searchQuery]);

  const loadDbReviewers = async (appsList = []) => {
    try {
      const res = await fetchAdminReviewers();
      let dbNames = [];
      if (res && res.success) {
        if (Array.isArray(res.reviewers)) {
          dbNames = res.reviewers.map(r => r.name || r.email || r.user_id).filter(Boolean);
        } else if (Array.isArray(res.data)) {
          dbNames = res.data.map(r => (typeof r === 'string' ? r : r.name || r.email)).filter(Boolean);
        }
      }
      const currentApps = appsList.length > 0 ? appsList : (applicationsData?.applications || []);
      const existingReviewers = currentApps
        .map(a => a.reviewed_by)
        .filter(r => r && r.trim() && r !== 'Unassigned');

      const allActiveReviewers = Array.from(new Set([...dbNames, ...existingReviewers]));
      setReviewerOptions(allActiveReviewers);
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error loading DB reviewers:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/corporate-program/admin/applications?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`, {
        headers: getAdminAuthHeaders(),
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success) {
        setApplicationsData(json.data);
        const apps = json.data?.applications || [];
        loadDbReviewers(apps);
      }
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error fetching corporate referrals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReviewer = (name) => {
    if (!reviewerOptions.includes(name)) {
      setReviewerOptions(prev => [...prev, name]);
    }
  };

  const handleDeleteReviewer = (name) => {
    setReviewerOptions(prev => prev.filter(r => r !== name));
    if (reviewerFilter === name) {
      setReviewerFilter('all');
    }
  };

  const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: '#fef3c7', border: '#fde68a', color: '#b45309' },
    under_review: { label: 'Under Review', bg: '#ffedd5', border: '#fed7aa', color: '#c2410c' },
    reviewed: { label: 'Reviewed', bg: '#dcfce7', border: '#bbf7d0', color: '#15803d' },
    mail_sent: { label: 'Contacted', bg: '#f0f9ff', border: '#bae6fd', color: '#0369a1' },
  };

  const handleStatusChange = async (app, newStatus) => {
    const appId = app.id || app.user_id;
    const loggedInAdminName = activeUser?.name || activeUser?.email || (typeof window !== 'undefined' && localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user') || '{}')?.name : null) || 'Admin';
    const isUnassigned = newStatus === 'pending' || newStatus === 'submitted';

    const targetReviewer = isUnassigned
      ? 'Unassigned'
      : (!app.reviewed_by || app.reviewed_by === 'Unassigned' ? loggedInAdminName : app.reviewed_by);

    // Instant Optimistic State Update (Applications + Status Counts Metrics in 0ms Real-Time)
    setApplicationsData(prev => {
      if (!prev) return prev;
      const appsList = prev.applications || (Array.isArray(prev) ? prev : []);
      const prevCounts = { ...(prev.statusCounts || { pending: 0, underReview: 0, reviewed: 0, mailSent: 0, all: appsList.length }) };

      const oldApp = appsList.find(item => 
        (item.id !== undefined && app.id !== undefined && String(item.id) === String(app.id)) ||
        (item.user_id !== undefined && app.user_id !== undefined && String(item.user_id) === String(app.user_id))
      );

      const oldSt = (oldApp?.application_status || oldApp?.review_status || app.application_status || 'pending').toLowerCase();
      const normalizeSt = (s) => (s === 'submitted' || s === 'pending' || s === '') ? 'pending' : s === 'approved' ? 'reviewed' : s;
      const oldNorm = normalizeSt(oldSt);
      const newNorm = normalizeSt(newStatus.toLowerCase());

      if (oldNorm !== newNorm) {
        if (oldNorm === 'pending') prevCounts.pending = Math.max(0, prevCounts.pending - 1);
        else if (oldNorm === 'under_review') prevCounts.underReview = Math.max(0, prevCounts.underReview - 1);
        else if (oldNorm === 'reviewed') prevCounts.reviewed = Math.max(0, prevCounts.reviewed - 1);
        else if (oldNorm === 'mail_sent') prevCounts.mailSent = Math.max(0, prevCounts.mailSent - 1);

        if (newNorm === 'pending') prevCounts.pending++;
        else if (newNorm === 'under_review') prevCounts.underReview++;
        else if (newNorm === 'reviewed') prevCounts.reviewed++;
        else if (newNorm === 'mail_sent') prevCounts.mailSent++;
      }

      const updatedApps = appsList.map(item => {
        const matchesId = (item.id !== undefined && app.id !== undefined && String(item.id) === String(app.id));
        const matchesUser = (item.user_id !== undefined && app.user_id !== undefined && String(item.user_id) === String(app.user_id));
        if (matchesId || matchesUser) {
          const prevHistory = Array.isArray(item.status_history) ? item.status_history : [];
          const newHistory = [...prevHistory];
          if (newHistory.length === 0) {
            newHistory.push({
              status: 'pending',
              changed_at: item.submitted_at || item.created_at || new Date().toISOString(),
              changed_by: 'System / User'
            });
          }
          const lastSt = newHistory[newHistory.length - 1]?.status;
          if (String(lastSt).toLowerCase() !== String(newStatus).toLowerCase()) {
            newHistory.push({
              status: newStatus,
              changed_at: new Date().toISOString(),
              changed_by: targetReviewer || loggedInAdminName || 'Reviewer'
            });
          }

          return {
            ...item,
            application_status: newStatus,
            review_status: newStatus,
            reviewed_by: targetReviewer,
            status_history: newHistory,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });

      return {
        ...prev,
        applications: updatedApps,
        statusCounts: prevCounts
      };
    });

    if (targetReviewer && targetReviewer !== 'Unassigned' && !reviewerOptions.includes(targetReviewer)) {
      setReviewerOptions(prev => [...prev, targetReviewer]);
    }

    try {
      const res = await fetch(`${API_BASE}/api/corporate-program/admin/applications/${appId}/reviewer`, {
        method: 'PATCH',
        headers: { ...getAdminAuthHeaders(), 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reviewer: targetReviewer, status: newStatus })
      });
      const data = await res.json();
      if (!data.success) {
        fetchApplications();
      }
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error updating status:', err);
      fetchApplications();
    }
  };

  const handleReviewerChange = async (app, newReviewer) => {
    const appId = app.id || app.user_id;
    const isUnassigned = newReviewer === 'Unassigned';
    const targetStatus = isUnassigned ? 'pending' : (app.application_status === 'pending' || app.application_status === 'submitted' ? 'under_review' : app.application_status || 'under_review');

    // Instant Optimistic State Update
    setApplicationsData(prev => {
      if (!prev) return prev;
      const appsList = prev.applications || (Array.isArray(prev) ? prev : []);
      const prevCounts = { ...(prev.statusCounts || { pending: 0, underReview: 0, reviewed: 0, mailSent: 0, all: appsList.length }) };

      const oldApp = appsList.find(item => 
        (item.id !== undefined && app.id !== undefined && String(item.id) === String(app.id)) ||
        (item.user_id !== undefined && app.user_id !== undefined && String(item.user_id) === String(app.user_id))
      );

      const oldSt = (oldApp?.application_status || oldApp?.review_status || app.application_status || 'pending').toLowerCase();
      const normalizeSt = (s) => (s === 'submitted' || s === 'pending' || s === '') ? 'pending' : s === 'approved' ? 'reviewed' : s;
      const oldNorm = normalizeSt(oldSt);
      const newNorm = normalizeSt(targetStatus.toLowerCase());

      if (oldNorm !== newNorm) {
        if (oldNorm === 'pending') prevCounts.pending = Math.max(0, prevCounts.pending - 1);
        else if (oldNorm === 'under_review') prevCounts.underReview = Math.max(0, prevCounts.underReview - 1);
        else if (oldNorm === 'reviewed') prevCounts.reviewed = Math.max(0, prevCounts.reviewed - 1);
        else if (oldNorm === 'mail_sent') prevCounts.mailSent = Math.max(0, prevCounts.mailSent - 1);

        if (newNorm === 'pending') prevCounts.pending++;
        else if (newNorm === 'under_review') prevCounts.underReview++;
        else if (newNorm === 'reviewed') prevCounts.reviewed++;
        else if (newNorm === 'mail_sent') prevCounts.mailSent++;
      }

      const updatedApps = appsList.map(item => {
        const matchesId = (item.id !== undefined && app.id !== undefined && String(item.id) === String(app.id));
        const matchesUser = (item.user_id !== undefined && app.user_id !== undefined && String(item.user_id) === String(app.user_id));
        if (matchesId || matchesUser) {
          const prevHistory = Array.isArray(item.status_history) ? item.status_history : [];
          const newHistory = [...prevHistory];
          if (newHistory.length === 0) {
            newHistory.push({
              status: 'pending',
              changed_at: item.submitted_at || item.created_at || new Date().toISOString(),
              changed_by: 'System / User'
            });
          }
          if (!isUnassigned) {
            newHistory.push({
              status: targetStatus,
              changed_at: new Date().toISOString(),
              changed_by: newReviewer
            });
          }

          return {
            ...item,
            reviewed_by: newReviewer,
            application_status: targetStatus,
            review_status: targetStatus,
            status_history: newHistory,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });

      return {
        ...prev,
        applications: updatedApps,
        statusCounts: prevCounts
      };
    });

    try {
      const res = await fetch(`${API_BASE}/api/corporate-program/admin/applications/${appId}/reviewer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewer: newReviewer, status: targetStatus })
      });
      const data = await res.json();
      if (!data.success) {
        fetchApplications();
      }
    } catch (err) {
      console.error('[CorporateAdminDashboard] Error updating reviewer:', err);
      fetchApplications();
    }
  };

  const applications = applicationsData?.applications || [];

  // Filter Pipeline: Date, Reviewer, Location, Industry, Search
  const filteredApps = applications.filter((app) => {
    // 1. Date Filter
    if (dateFilter !== 'all') {
      const subDate = new Date(app.submitted_at || app.updated_at || app.created_at);
      if (isNaN(subDate.getTime())) return false;
      const now = new Date();

      if (dateFilter === 'today') {
        if (subDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (subDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        if (subDate < monthAgo) return false;
      } else if (dateFilter === 'custom') {
        if (customStartDate) {
          const s = new Date(customStartDate);
          s.setHours(0, 0, 0, 0);
          if (subDate < s) return false;
        }
        if (customEndDate) {
          const e = new Date(customEndDate);
          e.setHours(23, 59, 59, 999);
          if (subDate > e) return false;
        }
      }
    }

    // 2. Reviewer Filter
    if (reviewerFilter !== 'all') {
      const rev = app.reviewed_by || 'Unassigned';
      if (reviewerFilter === 'Unassigned') {
        if (rev && rev !== 'Unassigned') return false;
      } else {
        if (rev !== reviewerFilter) return false;
      }
    }

    // 3. Location Filter (Country or City)
    if (selectedLocation !== 'all') {
      const appCountry = (app.company_country || '').toLowerCase();
      const appCity = (app.company_city || app.city || '').toLowerCase();
      const targetLoc = selectedLocation.toLowerCase();
      if (!appCountry.includes(targetLoc) && !appCity.includes(targetLoc)) return false;
    }

    // 4. Industry Filter
    if (selectedIndustry !== 'all') {
      const ind = (app.company_industry || app.industry || app.industries || '').toLowerCase();
      if (!ind.includes(selectedIndustry.toLowerCase())) return false;
    }

    return true;
  });

  // Calculate unique locations and industries for filter options
  const uniqueLocations = Array.from(new Set(applications.map(a => {
    if (a.company_city && a.company_country) return `${a.company_city}, ${a.company_country}`;
    if (a.company_city) return a.company_city;
    if (a.company_country) return a.company_country;
    if (a.city) return a.city;
    return null;
  }).filter(Boolean)));

  const uniqueIndustries = Array.from(new Set(applications.map(a => a.company_industry || a.industry || a.industries).filter(Boolean)));

  const handleClearAllFilters = () => {
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setReviewerFilter('all');
    setSelectedLocation('all');
    setSelectedIndustry('all');
    setSearchQuery('');
  };

  const isAnyFilterActive =
    dateFilter !== 'all' ||
    reviewerFilter !== 'all' ||
    selectedLocation !== 'all' ||
    selectedIndustry !== 'all' ||
    searchQuery.trim() !== '';

  const handleExportCSV = () => {
    if (!filteredApps.length) return;
    const headers = [
      'Referrer Name', 'Referrer Email', 'Referrer Phone', 'Relationship to Company', 'Connection Reach',
      'Company Name', 'Website', 'Country', 'City / Location', 'Industry', 'Company Size',
      'Contact Role', 'Introduction Method', 'Direct Contact Person', 'Company Needs', 'Referral Context',
      'Date Submitted', 'Status', 'Reviewer'
    ];

    const rows = filteredApps.map(a => [
      `"${a.full_name || ''}"`,
      `"${a.email || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.relationship || ''}"`,
      `"${a.connection_reach || a.connection_strength || ''}"`,
      `"${a.company_name || a.companyName || ''}"`,
      `"${a.company_website || a.website || ''}"`,
      `"${a.company_country || a.companyCountry || 'India'}"`,
      `"${a.company_city || a.companyCity || a.city || ''}"`,
      `"${a.company_industry || a.industry || a.industries || ''}"`,
      `"${a.company_size || a.companySize || ''}"`,
      `"${a.decision_maker || a.company_connections || ''}"`,
      `"${a.intro_method || ''}"`,
      `"${a.direct_contact_person || ''}"`,
      `"${Array.isArray(a.company_needs) ? a.company_needs.join(', ') : (a.company_needs || '')}"`,
      `"${(a.referral_context || a.motivation || '').replace(/"/g, '""')}"`,
      `"${a.submitted_at || a.created_at || ''}"`,
      `"${a.application_status || 'pending'}"`,
      `"${a.reviewed_by || 'Unassigned'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Corporate_Company_Referrals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusCounts = applicationsData?.statusCounts || {
    pending: 0,
    underReview: 0,
    reviewed: 0,
    mailSent: 0,
    all: 0
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header Banner */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Corporate Referrals Pipeline
            </h1>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              Company Lead Pipeline
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.84rem' }}>
            Review company and organization referrals submitted by providers for EAP and corporate wellness partnerships.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsManagingReviewers(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={14} color="#2563eb" />
            <span>Manage Reviewers ({reviewerOptions.length})</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards (Standard Compact Strip) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        
        {/* Card 1: PENDING */}
        <div
          onClick={() => setActiveTab('pending')}
          style={{
            background: activeTab === 'pending' ? '#fef9c3' : '#fffbeb',
            border: `1.5px solid ${activeTab === 'pending' ? '#eab308' : '#fef08a'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854d0e', flexShrink: 0 }}>
            <Clock size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>PENDING</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#713f12', lineHeight: 1.1 }}>{statusCounts.pending}</div>
          </div>
        </div>

        {/* Card 2: UNDER REVIEW */}
        <div
          onClick={() => setActiveTab('under_review')}
          style={{
            background: activeTab === 'under_review' ? '#fed7aa' : '#fff7ed',
            border: `1.5px solid ${activeTab === 'under_review' ? '#f97316' : '#ffedd5'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a3412', flexShrink: 0 }}>
            <Building2 size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.04em' }}>UNDER REVIEW</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#7c2d12', lineHeight: 1.1 }}>{statusCounts.underReview}</div>
          </div>
        </div>

        {/* Card 3: REVIEWED */}
        <div
          onClick={() => setActiveTab('reviewed')}
          style={{
            background: activeTab === 'reviewed' ? '#bbf7d0' : '#f0fdf4',
            border: `1.5px solid ${activeTab === 'reviewed' ? '#22c55e' : '#dcfce7'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', flexShrink: 0 }}>
            <CheckCircle2 size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>REVIEWED</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#14532d', lineHeight: 1.1 }}>{statusCounts.reviewed}</div>
          </div>
        </div>

        {/* Card 4: MAIL SENT / CONTACTED */}
        <div
          onClick={() => setActiveTab('mail_sent')}
          style={{
            background: activeTab === 'mail_sent' ? '#bae6fd' : '#f0f9ff',
            border: `1.5px solid ${activeTab === 'mail_sent' ? '#0ea5e9' : '#e0f2fe'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075985', flexShrink: 0 }}>
            <Mail size={15} />
          </div>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#075985', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MAIL SENT</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0c4a6e', lineHeight: 1.1 }}>{statusCounts.mailSent}</div>
          </div>
        </div>

      </div>

      {/* Filter and Control Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Status Tabs Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {[
            { key: 'all', label: 'All Referrals', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'under_review', label: 'Under Review', count: statusCounts.underReview },
            { key: 'reviewed', label: 'Reviewed', count: statusCounts.reviewed },
            { key: 'mail_sent', label: 'Contacted', count: statusCounts.mailSent },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: activeTab === tab.key ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: activeTab === tab.key ? '#eff6ff' : '#ffffff',
                color: activeTab === tab.key ? '#1d4ed8' : '#64748b',
                fontWeight: activeTab === tab.key ? 800 : 600,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: activeTab === tab.key ? '#2563eb' : '#f1f5f9',
                color: activeTab === tab.key ? '#ffffff' : '#64748b',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.66rem',
                fontWeight: 800
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic Filters & Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {/* 1. Date Filter Dropdown */}
          {filterVisibility.date && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <Calendar size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          )}

          {/* Custom Date Pickers */}
          {dateFilter === 'custom' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '3px 6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.72rem', color: '#1e293b', outline: 'none' }}
              />
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.72rem', color: '#1e293b', outline: 'none' }}
              />
            </div>
          )}

          {/* 2. Reviewer Filter Dropdown */}
          {filterVisibility.reviewer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <UserCheck size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={reviewerFilter}
                onChange={(e) => setReviewerFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '140px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Reviewers</option>
                <option value="Unassigned">Unassigned</option>
                {reviewerOptions.filter(r => r !== 'Unassigned').map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Location Filter Dropdown */}
          {filterVisibility.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '160px' }}>
              <Building2 size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '130px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}

          {/* 4. Target Industry Filter Dropdown */}
          {filterVisibility.industry && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', maxWidth: '170px' }}>
              <Filter size={12} color="#64748b" style={{ flexShrink: 0 }} />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '0.76rem', color: '#1e293b', fontWeight: 700, outline: 'none', cursor: 'pointer', maxWidth: '140px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              >
                <option value="all">All Industries</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Customizer Settings Popover */}
          <div style={{ position: 'relative' }} ref={filterSettingsRef}>
            <button
              onClick={() => setIsFilterSettingsOpen(!isFilterSettingsOpen)}
              title="Filter Options & Visibility"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: isFilterSettingsOpen ? '#eff6ff' : '#ffffff',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                height: '28px'
              }}
            >
              <Filter size={12} color="#2563eb" />
              <span>Filters</span>
              <ChevronDown size={10} color="#64748b" />
            </button>

            {isFilterSettingsOpen && (
              <div style={{
                position: 'absolute',
                top: '34px',
                right: 0,
                zIndex: 99,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                width: '180px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Visible Filters
                </div>
                {Object.keys(filterVisibility).map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#1e293b', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={filterVisibility[key]}
                      onChange={(e) => setFilterVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{key} Filter</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Reset All Filters Button */}
          {isAnyFilterActive && (
            <button
              onClick={handleClearAllFilters}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={12} /> Clear Filters
            </button>
          )}

          {/* Search Input */}
          {filterVisibility.search && (
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={12} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search referrer, company, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '28px',
                  padding: '0 8px 0 26px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.72rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={() => fetchApplications()}
            title="Refresh Referrals"
            style={{
              padding: '5px 8px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px'
            }}
          >
            <RefreshCw size={12} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            style={{
              padding: '5px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '28px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

        </div>
      </div>

      {/* Main Table — 8-Column Corporate Referral Layout */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '850px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ background: '#043263', borderBottom: '1px solid #03254c', color: '#ffffff', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '8px 10px', width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Referrer</th>
                <th style={{ padding: '8px 10px', width: '20%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Company / Organization</th>
                <th style={{ padding: '8px 10px', width: '12%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Location</th>
                <th style={{ padding: '8px 10px', width: '14%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Industry</th>
                <th style={{ padding: '8px 10px', width: '13%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Date Submitted</th>
                <th style={{ padding: '8px 10px', width: '11%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Status</th>
                <th style={{ padding: '8px 10px', width: '11%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reviewer</th>
                <th style={{ padding: '8px 10px', width: '8%', textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                    Loading corporate referrals...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                    No corporate referrals found matching current criteria.
                  </td>
                </tr>
              ) : (
                (filteredApps.slice((currentPage - 1) * pageSize, currentPage * pageSize)).map((app) => {
                  const companyNameDisplay = app.company_name || app.companyName;
                  const companyCountryDisplay = app.company_country || app.companyCountry || 'India';
                  const companyCityDisplay = app.company_city || app.companyCity || (app.company_name ? app.city : null);

                  let locationDisplay = 'Not provided';
                  if (companyCityDisplay && companyCountryDisplay) {
                    locationDisplay = `${companyCityDisplay}, ${companyCountryDisplay}`;
                  } else if (companyCountryDisplay) {
                    locationDisplay = companyCountryDisplay;
                  } else if (companyCityDisplay) {
                    locationDisplay = companyCityDisplay;
                  } else if (app.city) {
                    locationDisplay = app.city;
                  }

                  return (
                    <tr key={app.id || app.user_id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>

                      {/* REFERRER */}
                      <td style={{ padding: '7px 10px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.full_name ? `${app.full_name} (${app.email || 'No Email'})` : 'Referrer'}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.78rem', color: '#0f172a', fontWeight: 800 }}>
                          {safeVal(app.full_name, 'Referrer')}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {safeVal(app.email, 'No email')}
                        </div>
                      </td>

                      {/* COMPANY / ORGANIZATION */}
                      <td style={{ padding: '7px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a', overflow: 'hidden', textOverflow: 'ellipsis' }} title={companyNameDisplay || 'Not provided'}>
                          {safeVal(companyNameDisplay, 'Not provided')}
                        </div>
                        {(app.company_website || app.website) && (
                          <div style={{ fontSize: '0.66rem', color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {app.company_website || app.website}
                          </div>
                        )}
                      </td>

                      {/* LOCATION (City, Country) */}
                      <td style={{ padding: '7px 10px', color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.74rem' }} title={locationDisplay}>
                        {locationDisplay}
                      </td>

                      {/* INDUSTRY */}
                      <td style={{ padding: '7px 10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.74rem' }} title={app.company_industry || app.industry || app.industries}>
                        {safeVal(app.company_industry || app.industry || app.industries, 'N/A')}
                      </td>

                      {/* DATE SUBMITTED */}
                      <td style={{ padding: '7px 10px', color: '#64748b', fontSize: '0.74rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(() => {
                          const rawDate = app.submitted_at || app.updated_at || app.created_at || app.submittedAt;
                          if (!rawDate) return 'N/A';
                          const d = new Date(rawDate);
                          return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        })()}
                      </td>

                      {/* STATUS */}
                      <td style={{ padding: '7px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(() => {
                          const currentSt = (app.review_status || app.application_status || 'submitted').toLowerCase();
                          const mappedSt = (currentSt === 'submitted' || currentSt === 'pending') ? 'pending' : currentSt;
                          const conf = STATUS_CONFIG[mappedSt] || STATUS_CONFIG.pending;
                          return (
                            <select
                              value={mappedSt}
                              onChange={(e) => handleStatusChange(app, e.target.value)}
                              style={{
                                padding: '2px 6px',
                                borderRadius: '6px',
                                border: `1px solid ${conf.border}`,
                                background: conf.bg,
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                color: conf.color,
                                outline: 'none',
                                cursor: 'pointer',
                                maxWidth: '100%',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="under_review">Under Review</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="mail_sent">Contacted</option>
                            </select>
                          );
                        })()}
                      </td>

                      {/* REVIEWER */}
                      <td style={{ padding: '7px 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <select
                          value={app.reviewed_by || 'Unassigned'}
                          onChange={(e) => handleReviewerChange(app, e.target.value)}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '#eff6ff' : '#ffffff',
                            color: app.reviewed_by && app.reviewed_by !== 'Unassigned' ? '#1d4ed8' : '#64748b',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            outline: 'none',
                            cursor: 'pointer',
                            maxWidth: '100%',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                          }}
                        >
                          <option value="Unassigned">Unassigned</option>
                          {reviewerOptions.filter(r => r !== 'Unassigned').map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: '7px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setViewApp(app)}
                          title="View Referral Details"
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#2563eb',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                          }}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
          <div>
            Showing {filteredApps.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredApps.length)} of {filteredApps.length} referrals
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ padding: '2px 6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.72rem', fontWeight: 700, background: '#ffffff', color: '#1e293b', outline: 'none' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', fontWeight: 700, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#334155' }}
              >
                Previous
              </button>
              <button
                disabled={currentPage * pageSize >= filteredApps.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                style={{ padding: '3px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', fontWeight: 700, cursor: currentPage * pageSize >= filteredApps.length ? 'not-allowed' : 'pointer', color: currentPage * pageSize >= filteredApps.length ? '#cbd5e1' : '#334155' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Detail Modal */}
      <SubmissionDetailsModal
        app={viewApp}
        isOpen={Boolean(viewApp)}
        onClose={() => setViewApp(null)}
      />

      {/* Manage Reviewers Modal */}
      <ManageReviewersModal
        isOpen={isManagingReviewers}
        onClose={() => setIsManagingReviewers(false)}
        reviewers={reviewerOptions}
        onAddReviewer={handleAddReviewer}
        onDeleteReviewer={handleDeleteReviewer}
      />

    </div>
  );
}
