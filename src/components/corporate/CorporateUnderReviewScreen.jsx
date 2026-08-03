import React from 'react';
import { Clock, ArrowLeft, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { goToDashboard } from '../../mantra';

export default function CorporateUnderReviewScreen({ onBack, application }) {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }} className="animate-fade-in">
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <button
          onClick={onBack || goToDashboard}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#475569',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '36px 30px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={32} />
          </div>

          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Corporate Growth Partner Program
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Application Under Review
            </h2>
          </div>

          <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, maxWidth: '520px' }}>
            Thank you for applying! Your application to become a Corporate Growth Partner has been received and is currently being evaluated by our executive partnerships team.
          </p>

          {application && (
            <div style={{
              width: '100%',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '0.78rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Applicant:</span>
                <strong style={{ color: '#0f172a' }}>{application.full_name || 'Provider'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Submitted Date:</span>
                <strong style={{ color: '#0f172a' }}>{new Date(application.submitted_at || Date.now()).toLocaleDateString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Current Status:</span>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '1px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.7rem' }}>
                  Under Review (v{application.version || 1})
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.78rem', fontWeight: 700, background: '#ecfdf5', padding: '8px 14px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            <ShieldCheck size={16} /> No further action required at this time.
          </div>
        </div>

      </div>
    </div>
  );
}
