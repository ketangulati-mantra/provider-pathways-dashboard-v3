import React from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle2, Building2, ArrowRight } from 'lucide-react';

export default function CorporateApplicationSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Application Submitted
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
            Thank You for Applying!
          </h3>
        </div>

        <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.6 }}>
          Your application for the <strong>Corporate Growth Partner Program</strong> has been successfully submitted and is under review by our executive partnerships team. We will contact you shortly with next steps.
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>,
    document.body
  );
}
