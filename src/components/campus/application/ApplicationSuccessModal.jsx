import React from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

export default function ApplicationSuccessModal({ isOpen, onContinue, onReturnDashboard }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }} className="animate-fade-in">

      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '440px',
        width: '100%',
        padding: '28px 24px',
        textAlign: 'center',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.18)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }} className="animate-scale-in">

        {/* Sleek Check Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#043263',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CheckCircle2 size={26} />
        </div>

        <div style={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em', background: '#eff6ff', border: '1px solid #dbeafe', padding: '3px 10px', borderRadius: '6px', display: 'inline-block' }}>
            Registration Received
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '10px 0 6px', width: '100%', textAlign: 'center' }}>
            Application Submitted
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0, width: '100%', textAlign: 'center' }}>
            Thank you for joining the Campus Initiative. Your application has been submitted successfully.
          </p>
        </div>

        <div style={{ width: '100%', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.45, textAlign: 'center' }}>
          Please proceed to complete the 3 orientation learning modules to finish your activity.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '4px' }}>
          <button
            onClick={onContinue}
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '10px',
              border: 'none',
              background: '#043263',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(4, 50, 99, 0.25)'
            }}
          >
            Proceed to Orientation Learning <ArrowRight size={15} />
          </button>

          <button
            onClick={onReturnDashboard}
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '6px'
            }}
          >
            <Home size={14} /> Return to Dashboard
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
