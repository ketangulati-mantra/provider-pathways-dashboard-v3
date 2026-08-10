import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Header, Button, useToast } from '../components';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { downloadCertificate, sanitizeFilename } from '../utils/certificateDownloadService';

/* ==========================================================================
   1. Downloadable Certificate (Fixed 900px Landscape for HD PNG Generation)
   ========================================================================== */
const PremiumCertificate = ({ userName, innerRef, certificateId, config }) => {
  return (
    <div 
      ref={innerRef}
      style={{
        width: '900px',
        minHeight: '650px',
        margin: '0 auto',
        background: '#faf9f6',
        position: 'relative',
        padding: '24px',
        boxSizing: 'border-box',
        color: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Outer Border (1.5px Gold) */}
      <div style={{
        position: 'absolute',
        top: '16px', left: '16px', right: '16px', bottom: '16px',
        border: '1.5px solid #d4af37',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: 1
      }} />

      {/* Inner Border (1px Navy) */}
      <div style={{
        position: 'absolute',
        top: '22px', left: '22px', right: '22px', bottom: '22px',
        border: '1px solid #0f172a',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: 1
      }}>
        {/* Corner Ornaments */}
        <div style={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, border: '1px solid #d4af37', background: '#faf9f6' }} />
        <div style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, border: '1px solid #d4af37', background: '#faf9f6' }} />
        <div style={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, border: '1px solid #d4af37', background: '#faf9f6' }} />
        <div style={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, border: '1px solid #d4af37', background: '#faf9f6' }} />
      </div>

      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '36px 48px 48px',
        boxSizing: 'border-box',
        textAlign: 'center',
        zIndex: 2
      }}>
        <div style={{
          background: '#ffffff',
          padding: '6px 18px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f5f9',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <img 
            src={config?.logoUrl || "https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg"} 
            alt={config?.programName || "MantraCare"} 
            style={{ height: '36px', maxWidth: '180px', objectFit: 'contain' }} 
          />
        </div>

        <div style={{ 
          fontSize: '0.8rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.14em', 
          color: '#475569',
          marginBottom: '16px',
          fontWeight: 600
        }}>
          {config.programName}
        </div>

        <h1 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '1.85rem', 
          fontWeight: 400,
          color: '#0f172a',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: '0 0 14px 0'
        }}>
          {config.certificateTitle}
        </h1>
        
        <p style={{
          fontSize: '0.95rem',
          color: '#475569',
          margin: '0 0 12px 0'
        }}>
          {config.awardText}
        </p>

        <h2 style={{
          fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
          fontSize: '3.8rem',
          fontWeight: 400,
          color: '#0f172a',
          margin: '0 0 16px 0',
          borderBottom: '2px solid #d4af37',
          paddingBottom: '2px',
          paddingLeft: '30px',
          paddingRight: '30px',
          minWidth: '320px',
          maxWidth: '650px',
          wordBreak: 'break-word',
          lineHeight: '1.1'
        }}>
          {userName || 'Your Name'}
        </h2>

        <div style={{
          fontSize: '0.95rem',
          color: '#334155',
          margin: '0 0 18px 0',
          maxWidth: '75%',
          lineHeight: '1.5'
        }}>
          {config.completionText}<br/>
          <strong>{config.courseName}</strong>
        </div>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 24px',
          marginBottom: '26px', 
          fontStyle: 'italic',
          color: '#475569',
          fontSize: '0.88rem',
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: '85%'
        }}>
          {config.quote}
        </div>

        {/* Footer (3 Columns Side-by-Side) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '78%',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '180px' }}>
            <div style={{
              fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
              fontSize: '1.5rem',
              color: '#0f172a',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '6px',
              width: '100%',
              lineHeight: '1'
            }}>
              {config.signatureText || 'MantraCare'}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Authorized By
            </span>
            <span style={{ fontSize: '0.76rem', color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>
              {config.authorizedBy}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#0f172a',
              fontFamily: 'monospace',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '6px',
              width: '100%'
            }}>
              {certificateId}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Certificate ID
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
            <div style={{
              fontSize: '0.88rem',
              color: '#0f172a',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '6px',
              width: '100%'
            }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date of Completion
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '0.62rem',
          color: '#94a3b8',
          letterSpacing: '0.02em'
        }}>
          {config.footer}
        </div>
      </div>

      {/* Corporate Verification Seal */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        right: '36px',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#ffffff',
        border: '2.5px solid #1e40af',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: '1px solid #93c5fd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc'
        }}>
          <ShieldCheck size={18} color="#1e40af" style={{ marginBottom: '2px' }} />
          <span style={{ fontSize: '0.45rem', fontWeight: 800, color: '#1e40af', letterSpacing: '0.05em' }}>VERIFIED</span>
          <span style={{ fontSize: '0.35rem', color: '#475569', marginTop: '1px', textAlign: 'center', lineHeight: '1.2', fontWeight: 600 }}>{config.stampText || 'MantraCare Stamp'}</span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. On-Screen Preview (Fluid, Beautiful & Responsive on Mobile/Tablet)
   ========================================================================== */
const OnScreenCertificatePreview = ({ userName, certificateId, config }) => {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '750px',
        margin: '0 auto',
        background: '#faf9f6',
        position: 'relative',
        padding: '16px',
        borderRadius: '12px',
        boxSizing: 'border-box',
        color: '#0f172a',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');`}
      </style>

      {/* Outer Border */}
      <div style={{
        position: 'absolute',
        top: '10px', left: '10px', right: '10px', bottom: '10px',
        border: '1.5px solid #d4af37',
        borderRadius: '6px',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: 1
      }} />

      {/* Inner Border */}
      <div style={{
        position: 'absolute',
        top: '15px', left: '15px', right: '15px', bottom: '15px',
        border: '1px solid #0f172a',
        borderRadius: '4px',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: 1
      }} />

      {/* Content Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 16px 36px',
        boxSizing: 'border-box',
        textAlign: 'center',
        zIndex: 2
      }}>
        <div style={{
          background: '#ffffff',
          padding: '4px 14px',
          borderRadius: '10px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f1f5f9',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <img 
            src={config?.logoUrl || "https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg"} 
            alt={config?.programName || "MantraCare"} 
            style={{ height: 'clamp(24px, 4.5vw, 34px)', maxWidth: '160px', objectFit: 'contain' }} 
          />
        </div>

        <div style={{ 
          fontSize: 'clamp(0.65rem, 1.8vw, 0.78rem)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em', 
          color: '#475569',
          marginBottom: '14px',
          fontWeight: 600
        }}>
          {config.programName}
        </div>

        <h1 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 'clamp(1.2rem, 3.8vw, 1.75rem)', 
          fontWeight: 400,
          color: '#0f172a',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          margin: '0 0 10px 0'
        }}>
          {config.certificateTitle}
        </h1>
        
        <p style={{
          fontSize: 'clamp(0.8rem, 2.2vw, 0.92rem)',
          color: '#475569',
          margin: '0 0 10px 0'
        }}>
          {config.awardText}
        </p>

        <h2 style={{
          fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
          fontSize: 'clamp(2.4rem, 7vw, 3.6rem)',
          fontWeight: 400,
          color: '#0f172a',
          margin: '0 0 12px 0',
          borderBottom: '2px solid #d4af37',
          paddingBottom: '2px',
          paddingLeft: '16px',
          paddingRight: '16px',
          maxWidth: '90%',
          wordBreak: 'break-word',
          lineHeight: '1.1'
        }}>
          {userName || 'Your Name'}
        </h2>

        <div style={{
          fontSize: 'clamp(0.8rem, 2.2vw, 0.92rem)',
          color: '#334155',
          margin: '0 0 14px 0',
          maxWidth: '88%',
          lineHeight: '1.45'
        }}>
          {config.completionText}<br/>
          <strong>{config.courseName}</strong>
        </div>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '20px', 
          fontStyle: 'italic',
          color: '#475569',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: '92%'
        }}>
          {config.quote}
        </div>

        {/* Footer info grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          gap: '12px',
          width: '100%',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <div style={{
              fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              color: '#0f172a',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '4px',
              width: '100px',
              lineHeight: '1'
            }}>
              {config.signatureText || 'MantraCare'}
            </div>
            <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase' }}>
              Authorized By
            </span>
            <span style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 600 }}>
              {config.authorizedBy}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.82rem)',
              color: '#0f172a',
              fontFamily: 'monospace',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '4px',
              width: '100px'
            }}>
              {certificateId}
            </div>
            <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase' }}>
              Certificate ID
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <div style={{
              fontSize: 'clamp(0.7rem, 2vw, 0.82rem)',
              color: '#0f172a',
              borderBottom: '1px solid #cbd5e1',
              paddingBottom: '2px',
              marginBottom: '4px',
              width: '100px'
            }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <span style={{ fontSize: '0.62rem', color: '#64748b', textTransform: 'uppercase' }}>
              Date of Completion
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>
          {config.footer}
        </div>
      </div>

      {/* Verified Seal Badge */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: 'clamp(52px, 10vw, 70px)',
        height: 'clamp(52px, 10vw, 70px)',
        borderRadius: '50%',
        background: '#ffffff',
        border: '2px solid #1e40af',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        zIndex: 10
      }}>
        <ShieldCheck size={16} color="#1e40af" />
        <span style={{ fontSize: '0.4rem', fontWeight: 800, color: '#1e40af' }}>VERIFIED</span>
        <span style={{ fontSize: '0.3rem', color: '#475569', textAlign: 'center', fontWeight: 600 }}>{config.stampText || 'MantraCare'}</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   Page Component
   ========================================================================== */

const DEFAULT_CONFIG = {
  certificateTitle: 'Therapy Intern Provider Pathway',
  programName: 'MANTRACARE THERAPY INTERN PROVIDER PROGRAM',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Therapy Intern Provider Pathway',
  quote: '"Therapy is a sacred collaboration of self-discovery and healing. Your presence, guidance, and compassion support others in navigating life\'s challenges and finding their strength."',
  authorizedBy: 'MantraCare Therapy Intern Program',
  footer: 'Guiding minds and healing hearts. | mantracare.org',
  certificateIdPrefix: 'MC-TIPP',
  congratsHeading: 'Congratulations!',
  congratsBadge: null,
  congratsDescription: null
};

export default function CertificateDownloadPage({ onBack, certificateConfig, onDownload }) {
  const config = certificateConfig || DEFAULT_CONFIG;
  const { showToast } = useToast();
  const [step, setStep] = useState('form'); // 'form' | 'preview'
  const [userName, setUserName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileSaveImage, setMobileSaveImage] = useState(null); // { url, filename }
  const certificateRef = useRef(null);

  // Generate ID once per page load to remain stable
  const certificateId = useMemo(() => {
    const prefix = config.certificateIdPrefix || 'MC-CERT';
    return `${prefix}-${Math.floor(Math.random() * 9000000) + 1000000}`;
  }, [config.certificateIdPrefix]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      showToast('Please enter your name.', 'warning');
      return;
    }
    setStep('preview');
  };

  const [generatedImg, setGeneratedImg] = useState(null);

  // Auto pre-render PNG when entering preview step so download link is instant & native HTML5
  useEffect(() => {
    if (step === 'preview' && certificateRef.current) {
      let isMounted = true;
      const prepareImage = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 400));
          const dataUrl = await toPng(certificateRef.current, {
            pixelRatio: 2,
            cacheBust: false,
            backgroundColor: '#faf9f6'
          });
          if (isMounted) setGeneratedImg(dataUrl);
        } catch (err) {
          console.warn('Auto PNG pre-render fallback:', err);
          try {
            const dataUrl2 = await toPng(certificateRef.current, {
              pixelRatio: 1,
              cacheBust: false,
              backgroundColor: '#faf9f6'
            });
            if (isMounted) setGeneratedImg(dataUrl2);
          } catch (err2) {}
        }
      };
      prepareImage();
      return () => { isMounted = false; };
    }
  }, [step, userName]);

  const [downloadState, setDownloadState] = useState('idle'); // 'idle' | 'downloading' | 'success' | 'error'

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadState('downloading');
      let dataUrl = generatedImg;

      if (!dataUrl && certificateRef.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
        try {
          dataUrl = await toPng(certificateRef.current, {
            pixelRatio: 2,
            cacheBust: false,
            backgroundColor: '#faf9f6'
          });
        } catch (e) {
          dataUrl = await toPng(certificateRef.current, {
            pixelRatio: 1,
            cacheBust: false,
            backgroundColor: '#faf9f6'
          });
        }
        setGeneratedImg(dataUrl);
      }

      // PDF / PNG Response Validation
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        if (import.meta.env?.DEV || process.env.NODE_ENV !== 'production') {
          console.error('[DevLog] Certificate Generation Failed: Response is empty or invalid format.', {
            userName: userName.trim(),
            certificateId,
            receivedType: typeof dataUrl,
            dataLength: dataUrl ? dataUrl.length : 0
          });
        }
        setDownloadState('error');
        showToast('Unable to download certificate. Please try again.', 'error');
        return;
      }

      const fileName = sanitizeFilename(`TherapyMantra_Certificate_${userName.trim().replace(/\s+/g, '_')}_${certificateId}.pdf`);

      const success = await downloadCertificate({
        dataUrl,
        fileName,
        userName,
        certificateId,
        showToast
      });

      const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile && dataUrl) {
        setMobileSaveImage({ url: dataUrl, filename: fileName });
      }

      if (success) {
        setDownloadState('success');
        if (onDownload) {
          onDownload();
        }
      } else {
        setDownloadState('error');
      }
    } catch (err) {
      console.error('[CertificateDownloadPage] Error downloading certificate:', err);
      setDownloadState('error');
      showToast('Unable to download your certificate. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-app)' }} className="animate-fade-in">
      {step === 'form' ? (
        <>
          <Header title="Get Your Certificate" onBack={onBack} progress={100} points={0} />
          <main className="academy-main-container" style={{
            flex: 1,
            padding: '48px 24px',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '40px 32px',
              border: '1px solid #eef0f3',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: '#d97706'
              }}>
                <CheckCircle2 size={32} />
              </div>
              
              {config.congratsBadge && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', borderRadius: '20px',
                  padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  marginBottom: '20px'
                }}>
                  {config.congratsBadge}
                </div>
              )}

              <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
                {config.congratsHeading || 'Congratulations!'}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0 0 32px', lineHeight: '1.5' }}>
                {config.congratsDescription || `You've completed the ${config.courseName}. Enter your name exactly as you want it to appear on your official certificate.`}
              </p>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="E.g. Dr. Jane Doe"
                    required
                    style={{ 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      border: '1px solid #e5e7eb', 
                      background: '#ffffff', 
                      color: '#1f2937', 
                      fontSize: '1rem', 
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <Button
                  className="academy-btn-full"
                  variant="primary"
                  type="submit"
                  style={{ padding: '14px', fontSize: '1rem', width: '100%', marginTop: '8px' }}
                >
                  Generate My Certificate
                </Button>
              </form>
            </div>
          </main>
        </>
      ) : (
        <>
          {/* Sticky Header for Preview */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <button 
              onClick={() => setStep('form')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant="primary"
                onClick={handleDownload}
                disabled={isDownloading || downloadState === 'downloading'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: 800
                }}
              >
                {isDownloading || downloadState === 'downloading' ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Downloading...</span>
                  </>
                ) : downloadState === 'success' ? (
                  <>
                    <ShieldCheck size={16} />
                    <span>Open / Share Certificate</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Certificate</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <main style={{
            flex: 1,
            padding: '24px 16px 40px',
            background: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <OnScreenCertificatePreview 
              userName={userName} 
              certificateId={certificateId} 
              config={config} 
            />
          </main>

          {/* High resolution 900px landscape certificate capture target */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '900px',
            minHeight: '650px',
            opacity: 0.001,
            pointerEvents: 'none',
            zIndex: -999,
            overflow: 'hidden'
          }}>
            <PremiumCertificate 
              userName={userName} 
              innerRef={certificateRef} 
              certificateId={certificateId} 
              config={config} 
            />
          </div>

          {/* Mobile Phone Save Certificate Modal Overlay */}
          {mobileSaveImage && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999999,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              boxSizing: 'border-box'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '480px',
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid #cbd5e1'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    🎓 Certificate Ready
                  </div>
                  <button
                    onClick={() => setMobileSaveImage(null)}
                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={16} color="#64748b" />
                  </button>
                </div>

                <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '14px', background: '#faf9f6' }}>
                  <img
                    src={mobileSaveImage.url}
                    alt="Certificate"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      WebkitTouchCallout: 'default',
                      WebkitUserSelect: 'auto',
                      userSelect: 'auto',
                      pointerEvents: 'auto'
                    }}
                  />
                </div>

                <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.78rem', color: '#1e40af', fontWeight: 700, marginBottom: '14px' }}>
                  📱 Phone App Note: Tap & Hold the image above to save directly to your Photos / Camera Roll!
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={mobileSaveImage.url}
                    download={mobileSaveImage.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={16} /> Download PNG
                  </a>
                  <button
                    onClick={() => setMobileSaveImage(null)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
