import React from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function CorporateApplicationSuccessModal({ isOpen, onClose, onStartOutreachModule }) {
  if (!isOpen) return null;

  const handleStartModule = () => {
    if (onStartOutreachModule) {
      onStartOutreachModule();
    } else if (onClose) {
      onClose();
    }
  };

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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '460px',
          padding: '32px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={36} />
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Referral Interest Submitted
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
            Thanks for sharing your referral opportunity!
          </h3>
        </div>

        <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.55 }}>
          Your information has been received. Our team will review the opportunity and follow up regarding next steps with the organization.
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>
            Next Steps
          </div>
          <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
            Access our corporate overview kit and sample outreach templates to help introduce Mantra to decision-makers.
          </div>
        </div>

        <button
          onClick={handleStartModule}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
          }}
        >
          <span>View Outreach Toolkit</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}
