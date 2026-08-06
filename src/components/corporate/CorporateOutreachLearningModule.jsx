import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  CheckCircle2, Sparkles, Copy, Check, FileText, Download, Mail, ArrowRight,
  ShieldCheck, Send, Users, Calendar, Award, Building2, HelpCircle, ArrowLeft,
  MessageSquare, UserCheck, Video, XCircle, AlertTriangle, Eye, RefreshCw, ExternalLink, X, Play,
  ChevronRight, Lock, BookOpen, Layers, Clock
} from 'lucide-react';
import { getCurrentUserId, MANTRA_CONFIG, completeLesson, goBack } from '../../mantra';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const Linkedin = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── REUSABLE OUTREACH TEMPLATE PREVIEW MODAL ───────────────────────────────────

function TemplatePreviewModal({ isOpen, onClose, title, subject, content, onCopy, openAction }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '560px',
          maxHeight: '85vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template Preview</div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {subject && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 14px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>Subject Line: </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{subject}</span>
            </div>
          )}

          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6, margin: 0, background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {content}
          </pre>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
            Close
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {openAction && (
              <button onClick={openAction.onClick} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ExternalLink size={14} /> {openAction.label}
              </button>
            )}

            {onCopy && (
              <button onClick={onCopy} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Copy size={14} /> Copy Template
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── TABBED OUTREACH TOOLKIT COMPONENT ──────────────────────────────────────────

function OutreachToolkitTabbedSection({ providerProfile }) {
  const [activeTab, setActiveTab] = useState('email');
  const [copyToast, setCopyToast] = useState('');
  const [previewModal, setPreviewModal] = useState(null);

  const [recipientName, setRecipientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userFullName, setUserFullName] = useState(providerProfile?.fullName || '');

  const providerName = userFullName || '{{Your Name}}';
  const providerEmail = providerProfile?.email || 'provider@mantra.care';
  const providerPhone = providerProfile?.phone ? `${providerProfile.countryCode || '+1'} ${providerProfile.phone}` : '+1 555-0199';
  const providerRole = 'Corporate Growth Partner';

  const triggerToast = (msg) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(''), 2500);
  };

  const handleCopyDirect = (text, name) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${name} copied successfully.`);
  };

  // TEMPLATES
  const emailSubject = `Employee Wellness & EAP Overview ${companyName ? `for ${companyName}` : ''}`;
  const emailBody = `Hi ${recipientName || '{{Recipient Name}}'},

Hope you're doing well.

I wanted to briefly introduce MantraCare, an organization I work with that provides comprehensive Employee Wellness and Employee Assistance Programs (EAPs) for growing companies.

MantraCare delivers an integrated platform covering emotional wellbeing, physical health, therapy sessions, chronic care management, and annual health check-ups. Many HR teams use MantraCare to support employee mental health while streamlining wellness operations.

I've attached our brief Corporate Overview Brochure for your review. If you think this would be valuable ${companyName ? `for ${companyName}` : 'for your organization'}, I'd be glad to connect you with our Business Development team for a quick discovery call.

Best regards,

${providerName}
${providerRole} | MantraCare Executive Partnerships
Email: ${providerEmail}
Phone: ${providerPhone}`;

  const openEmailClient = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const linkedinMsg = `Hi ${recipientName || '{{Recipient Name}}'},

Hope you're having a great week!

I noticed your work ${companyName ? `at ${companyName}` : ''} and wanted to share a quick introduction. I work with MantraCare to help organizations provide accessible Employee Wellness & EAP mental health support.

If employee wellbeing is a priority ${companyName ? `for ${companyName}` : 'for your company'} this quarter, I'd be happy to share our quick overview or connect you with our team.

Best regards,
${providerName}
${providerRole}`;

  const openLinkedIn = () => {
    window.open('https://www.linkedin.com/messaging/', '_blank', 'noopener,noreferrer');
  };

  const whatsappMsg = `Hi ${recipientName || '{{Recipient Name}}'}! 👋 Hope you're doing well.

Quick note — I work with MantraCare to provide companies with Employee Assistance Programs (EAP) and mental health wellness solutions.

Thought this might be helpful ${companyName ? `for ${companyName}` : 'for your team'}. Let me know if you'd like me to share a 1-page overview or connect you with our team!

- ${providerName}`;

  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank', 'noopener,noreferrer');
  };

  const inPersonGuide = `IN-PERSON CONVERSATION FRAMEWORK:

1. CONVERSATION STARTER:
"How is your company handling employee wellness or burnout support this year?"

2. NATURAL TRANSITION:
"I work with MantraCare to provide integrated EAP & wellness platforms for companies."

3. WHEN TO STOP TALKING:
As soon as they express interest, offer to connect them with our BD team for full details.

4. HAND-OFF TO BD TEAM:
Pass their contact info to MantraCare. Our BD team handles all meetings, proposals, and agreements.`;

  const TABS = [
    { id: 'email', label: 'Email', icon: Mail, color: '#2563eb' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0a66c2' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: '#16a34a' },
    { id: 'inperson', label: 'In-Person', icon: Users, color: '#7c3aed' }
  ];

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #cbd5e1', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
      {copyToast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999,
          background: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontSize: '0.84rem', fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: '8px', animation: 'scaleUp 0.15s ease-out'
        }}>
          <CheckCircle2 size={18} color="#4ade80" /> {copyToast}
        </div>
      )}

      {/* Dynamic Personalizer */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          ⚡ Dynamic Template Personalizer
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>Your Name</label>
            <input type="text" value={userFullName} onChange={(e) => setUserFullName(e.target.value)} placeholder="Enter your full name" style={{ width: '100%', padding: '6px 10px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', background: '#ffffff' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>Recipient Name</label>
            <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Enter name (e.g. John)" style={{ width: '100%', padding: '6px 10px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', background: '#ffffff' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>Target Company</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company (e.g. Acme)" style={{ width: '100%', padding: '6px 10px', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', background: '#ffffff' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px', borderRadius: '9px', border: 'none',
                background: isActive ? tab.color : '#f8fafc',
                color: isActive ? '#ffffff' : '#64748b',
                fontWeight: isActive ? 800 : 600, fontSize: '0.76rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                transition: 'all 0.15s ease', boxShadow: isActive ? '0 3px 10px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <Icon size={14} color={isActive ? '#ffffff' : tab.color} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'email' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '10px 12px', fontSize: '0.76rem', color: '#1e4ed8', fontWeight: 700 }}>
            📌 <strong>Best for:</strong> HR Leaders, Founders & formal executive outreach.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPreviewModal({ title: 'Email Template Preview', subject: emailSubject, content: emailBody, onCopy: () => handleCopyDirect(`Subject: ${emailSubject}\n\n${emailBody}`, 'Email Template') })} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Eye size={14} /> Preview Email
            </button>
            <button onClick={() => handleCopyDirect(`Subject: ${emailSubject}\n\n${emailBody}`, 'Email Template')} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Copy size={14} /> Copy Template
            </button>
          </div>
        </div>
      )}

      {activeTab === 'linkedin' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#f0f7ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '10px 12px', fontSize: '0.76rem', color: '#0a66c2', fontWeight: 700 }}>
            📌 <strong>Best for:</strong> 1st-degree LinkedIn connections & InMail messages.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPreviewModal({ title: 'LinkedIn Message Preview', content: linkedinMsg, onCopy: () => handleCopyDirect(linkedinMsg, 'LinkedIn Template') })} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Eye size={14} /> Preview Message
            </button>
            <button onClick={() => handleCopyDirect(linkedinMsg, 'LinkedIn Template')} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#0a66c2', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Copy size={14} /> Copy Template
            </button>
          </div>
        </div>
      )}

      {activeTab === 'whatsapp' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 12px', fontSize: '0.76rem', color: '#16a34a', fontWeight: 700 }}>
            📌 <strong>Best for:</strong> Warm professional contacts & former colleagues.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPreviewModal({ title: 'WhatsApp Message Preview', content: whatsappMsg, onCopy: () => handleCopyDirect(whatsappMsg, 'WhatsApp Template') })} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Eye size={14} /> Preview Message
            </button>
            <button onClick={() => handleCopyDirect(whatsappMsg, 'WhatsApp Template')} style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <Copy size={14} /> Copy Template
            </button>
          </div>
        </div>
      )}

      {activeTab === 'inperson' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '10px 12px', fontSize: '0.76rem', color: '#7c3aed', fontWeight: 700 }}>
            📌 <strong>Best for:</strong> Conferences, networking events & coffee meetings.
          </div>
          <button onClick={() => setPreviewModal({ title: 'In-Person Conversation Framework', content: inPersonGuide, onCopy: () => handleCopyDirect(inPersonGuide, 'Conversation Guide') })} style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e9d5ff', background: '#faf5ff', color: '#7c3aed', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Eye size={14} /> View Conversation Framework Modal
          </button>
        </div>
      )}

      <TemplatePreviewModal isOpen={Boolean(previewModal)} onClose={() => setPreviewModal(null)} title={previewModal?.title} subject={previewModal?.subject} content={previewModal?.content} onCopy={previewModal?.onCopy} openAction={previewModal?.openAction} />
    </div>
  );
}

// ─── COURSERA-STYLE MULTI-MODULE ACADEMY DATA ────────────────────────────────

const OUTREACH_ACADEMY_MODULES = [
  {
    id: 'mod_welcome',
    title: '1. Program Welcome & Role Overview',
    duration: '2 min read',
    icon: Sparkles,
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '16px', padding: '24px 20px', color: '#ffffff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', border: '2px solid rgba(59, 130, 246, 0.5)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} />
          </div>
          <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(37, 99, 235, 0.25)', padding: '3px 10px', borderRadius: '20px' }}>
            Congratulations & Welcome!
          </span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.3 }}>
            You're now part of the Corporate Growth Partner Program.
          </h2>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '540px' }}>
            As a Corporate Growth Partner, you are <strong>not expected to sell or negotiate</strong>. Your role is simply to open doors by making warm introductions wherever possible.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { title: 'Make a Light Intro', desc: 'Connect us with a decision-maker or HR lead in your network.' },
            { title: 'Refer an Organization', desc: 'Spot companies that could benefit from comprehensive employee wellness.' },
            { title: 'Introduce via Email / LinkedIn', desc: 'Send a quick warm intro email or LinkedIn note using our template.' }
          ].map((card, idx) => (
            <div key={idx} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{card.title}</h4>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'mod_journey',
    title: '2. The Referral Journey & Process',
    duration: '3 min read',
    icon: Layers,
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
        <div>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Step-by-Step Workflow</div>
          <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>What Happens After You Introduce a Company</h3>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { step: '01', title: 'You Introduce Company', desc: 'Share a quick warm introduction with an HR contact or company lead.' },
              { step: '02', title: 'BD Team Takes Over', desc: 'MantraCare’s Business Development team reaches out to schedule a meeting.' },
              { step: '03', title: 'Discovery Call', desc: 'Our corporate specialists present employee wellness solutions tailored to their needs.' },
              { step: '04', title: 'Proposal & Agreement', desc: 'We handle all customized proposals, pricing, contract terms, and negotiations.' },
              { step: '05', title: 'Implementation', desc: 'The corporate wellness platform is deployed to support their workforce.' },
              { step: '06', title: 'You Receive Rewards', desc: 'Earn competitive commission rewards (subject to applicable program terms).' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '8px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#2563eb', color: '#ffffff', fontWeight: 900, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 1px', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                </div>
                {idx < 5 && <div style={{ width: '2px', height: '8px', background: '#bfdbfe', margin: '0 0 0 23px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'mod_toolkit',
    title: '3. Multi-Channel Outreach Toolkit',
    duration: '4 min read',
    icon: FileText,
    render: (props) => <OutreachToolkitTabbedSection {...props} />
  },
  {
    id: 'mod_video_training',
    title: '4. Corporate Outreach Training Video',
    duration: '3 min watch',
    icon: Video,
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
        <div>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>Video Training</div>
          <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Corporate Outreach Training Video</h3>
        </div>

        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
          <iframe
            src="https://www.youtube.com/embed/zyNIDFHDbrI"
            title="Corporate Outreach Training Video"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  },
  {
    id: 'mod_collateral',
    title: '5. Corporate Brochure & Resources',
    duration: '1 min read',
    icon: Download,
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
        <div>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>Official Collateral</div>
          <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Corporate Overview Brochure</h3>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 2px', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>MantraCare Corporate Brochure (PDF)</h4>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Share whenever someone asks for platform overview details</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="https://app.mantracare.org/wp-content/uploads/gf-uploads/MantraCare_Brief_Brochure.pdf" target="_blank" rel="noopener noreferrer" style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 800, fontSize: '0.76rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Download size={13} /> Download PDF
            </a>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'mod_safeguards',
    title: '6. Best Practices & Safeguards',
    duration: '2 min read',
    icon: ShieldCheck,
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
        <div>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Key Safeguards</div>
          <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>Common Mistakes to Avoid (Do's & Don'ts)</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 800, fontSize: '0.86rem', marginBottom: '10px' }}>
              <XCircle size={16} /> Don'ts (Avoid These)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#991b1b', lineHeight: 1.4 }}>
              <div>❌ Don't promise specific pricing or discounts.</div>
              <div>❌ Don't attempt to negotiate contract terms.</div>
              <div>❌ Don't oversell clinical guarantees.</div>
              <div>❌ Don't pressure companies into meetings.</div>
              <div>❌ Don't make formal commercial commitments.</div>
            </div>
          </div>

          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 800, fontSize: '0.86rem', marginBottom: '10px' }}>
              <CheckCircle2 size={16} /> Do's (Best Practices)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#065f46', lineHeight: 1.4 }}>
              <div>✅ Warmly introduce MantraCare solutions.</div>
              <div>✅ Share the official corporate overview brochure.</div>
              <div>✅ Connect HR leads with the Business Team.</div>
              <div>✅ Follow up politely after a warm intro.</div>
              <div>✅ Build authentic, long-term relationships.</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px', marginTop: '6px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>Corporate Outreach Tips</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {[
              'Understand company culture before approaching HR.',
              'Focus conversations on employee mental health & burnout.',
              'Avoid overly lengthy messages — keep it concise.',
              'Always personalize the recipient name and company name.',
              'Mention mutual connections whenever applicable.',
              'Keep every interaction genuine and professional.'
            ].map((tip, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '8px 10px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <Sparkles size={13} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
];

// ─── COURSERA-STYLE MAIN ACADEMY COMPONENT ────────────────────────────────────

export default function CorporateOutreachLearningModule({ onBack, onComplete }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set([0]));
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = getCurrentUserId();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectModule = (index) => {
    setActiveModuleIndex(index);
    setCompletedModules(prev => new Set(prev).add(index));
  };

  const handleNextModule = () => {
    if (activeModuleIndex < OUTREACH_ACADEMY_MODULES.length - 1) {
      const nextIdx = activeModuleIndex + 1;
      setActiveModuleIndex(nextIdx);
      setCompletedModules(prev => new Set(prev).add(nextIdx));
    } else {
      handleGoToReferralPage();
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
    }
  };

  const handleGoToReferralPage = async () => {
    try {
      setIsSubmitting(true);
      await completeLesson('corporate-eap');
      await fetch(`${API_BASE}/api/corporate-program/learning/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId: 'outreach_intro_module',
          timeSpentSeconds
        })
      });
    } catch (err) {
      console.error('[OutreachModule] Error marking complete in DB:', err);
    } finally {
      setIsSubmitting(false);
      window.open('https://provider.mantracare.com/refer-earn', '_blank', 'noopener,noreferrer');
      if (onComplete) onComplete();
    }
  };

  const activeModule = OUTREACH_ACADEMY_MODULES[activeModuleIndex];
  const progressPercent = Math.round(((activeModuleIndex + 1) / OUTREACH_ACADEMY_MODULES.length) * 100);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">
      
      {/* Header Bar */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e2e8f0',
        padding: '10px 16px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <img
              src="https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg"
              alt="Mantra Logo"
              style={{ height: '24px', width: 'auto', display: 'block', flexShrink: 0 }}
            />
            <div style={{ height: '18px', width: '1px', background: '#cbd5e1', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Partner Academy</div>
              <h1 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25 }}>Getting Started with Corporate Introductions</h1>
            </div>
          </div>

          <button
            onClick={() => goBack(onBack)}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }}
          >
            <ArrowLeft size={13} /> Exit
          </button>
        </div>
      </div>

      {/* Coursera-Style Main Grid Container */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '16px 12px', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Progress Bar Header */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a' }}>Course Progress:</span>
            <div style={{ width: '120px', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#2563eb', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563eb' }}>{progressPercent}% Complete</span>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
            Lesson {activeModuleIndex + 1} of {OUTREACH_ACADEMY_MODULES.length}
          </div>
        </div>

        {/* Coursera Layout (Sidebar + Main Content View) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Coursera Module Navigation Sidebar */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px' }}>
              Course Syllabus
            </div>

            {OUTREACH_ACADEMY_MODULES.map((mod, idx) => {
              const Icon = mod.icon;
              const isActive = activeModuleIndex === idx;
              const isDone = completedModules.has(idx);

              return (
                <button
                  key={mod.id}
                  onClick={() => handleSelectModule(idx)}
                  style={{
                    padding: '10px 12px', borderRadius: '10px', border: 'none',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1d4ed8' : '#334155',
                    fontWeight: isActive ? 800 : 600, fontSize: '0.78rem',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                    transition: 'all 0.15s ease', width: '100%', boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    {isDone ? (
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                    ) : (
                      <Icon size={16} color={isActive ? '#2563eb' : '#64748b'} style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{mod.title}</span>
                  </div>
                  <ChevronRight size={14} color={isActive ? '#1d4ed8' : '#cbd5e1'} style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>

          {/* Main Active Module Screen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
            
            {/* Active Module View */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px 14px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', wordBreak: 'break-word' }}>{activeModule.title}</h2>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                  {activeModule.duration}
                </span>
              </div>

              {activeModule.render()}
            </div>

            {/* Bottom Next/Prev Action Controls Bar */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 14px', display: 'flex', justifyContent: activeModuleIndex > 0 ? 'space-between' : 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {activeModuleIndex > 0 && (
                <button
                  onClick={handlePrevModule}
                  style={{
                    padding: '8px 16px', borderRadius: '8px',
                    border: '1px solid #cbd5e1', background: '#ffffff',
                    color: '#334155',
                    fontWeight: 800, fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} /> Previous
                </button>
              )}

              <button
                onClick={handleNextModule}
                disabled={isSubmitting}
                style={{
                  padding: '9px 18px', borderRadius: '8px', border: 'none',
                  background: activeModuleIndex === OUTREACH_ACADEMY_MODULES.length - 1 ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {activeModuleIndex === OUTREACH_ACADEMY_MODULES.length - 1 ? (
                  isSubmitting ? 'Opening Referral Portal...' : <>Complete & Refer a Corporate <ArrowRight size={16} /></>
                ) : (
                  <>Next Module <ArrowRight size={16} /></>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
