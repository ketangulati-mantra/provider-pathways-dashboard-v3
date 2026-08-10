import React, { useState, useRef } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  CompletionScreen,
  Button,
  useToast
} from '../components';
import { isValidEmail } from '../mantra/validation';
import { Upload, X, FileImage, CheckCircle2, Clock, Award, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const LESSON_ID = 'market-yourself';
const LESSON_TITLE = 'Market Yourself & Grow Faster';
const REWARD_POINTS = 5;

const STEPS = [
  {
    step: 'Step 1',
    title: 'Complete Your Profile',
    items: ['Add profile photo', 'Update qualifications', 'Add experience & services']
  },
  {
    step: 'Step 2',
    title: 'Promote Yourself',
    content: 'Share your MantraCare profile OR create useful content mentioning MantraCare.',
    platforms: ['LinkedIn', 'Instagram', 'Facebook', 'TikTok', 'Reddit', 'YouTube', 'Quora']
  },
  {
    step: 'Step 3',
    title: 'Capture Proof',
    content: 'Take a screenshot of:',
    items: ['your shared profile', 'or', 'your published content']
  },
  {
    step: 'Step 4',
    title: 'Submit',
    content: 'Upload your screenshot using the form below. Each valid submission earns engagement points. This task can be completed multiple times.'
  }
];

export default function MarketYourselfLessonPage({ onBack }) {
  const { 
    lessonProgress, 
    showCelebrate, 
    handleCloseCelebration, 
    handleActionComplete,
    setLessonProgress,
    setShowCelebrate
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const validateEmail = () => {
    if (!email) return true;
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }
    return true;
  };

  const handleEmailChange = (e) => setEmail(e.target.value.replace(/\s/g, ''));

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };
  const handleFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || selectedFile.type === 'application/pdf') {
      alert("PDF files are not allowed. Please upload an image proof (PNG, JPG, WEBP).");
      return;
    }
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if ((validTypes.includes(selectedFile.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(ext)) && selectedFile.size <= 20 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PNG, JPG, or WEBP image under 20MB.");
    }
  };
  const clearFile = (e) => {
    e.stopPropagation(); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const triggerFileSelect = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail() || !file) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleActionComplete();
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} points={REWARD_POINTS} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '600px' }}>
            Increase your visibility, attract more clients and earn engagement points by promoting your MantraCare profile online.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min task</span></span>
            <span className="overview-meta-badge points"><Award size={12} /><span>+{REWARD_POINTS} Points</span></span>
          </div>
        </div>

        {/* Split Layout: Steps on Left, Form on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordion Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 8px' }}>
              How to complete this task
            </h2>
            {STEPS.map((s, idx) => {
              const isOpen = activeStep === idx;
              return (
                <div 
                  key={idx}
                  style={{ 
                    background: '#fff', borderRadius: '16px', border: isOpen ? '1px solid var(--color-primary)' : '1px solid #eef0f3', 
                    boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => setActiveStep(isOpen ? -1 : idx)}
                >
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? '#f0f9ff' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '50%', background: isOpen ? 'var(--color-primary)' : '#f1f5f9',
                        color: isOpen ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 700
                      }}>
                        {idx + 1}
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0, color: isOpen ? 'var(--color-primary)' : '#334155' }}>
                        {s.title}
                      </h3>
                    </div>
                    {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
                  </div>
                  
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                      {s.content && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '16px 0 12px', lineHeight: '1.5' }}>{s.content}</p>}
                      
                      {s.items && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: s.content ? 0 : '16px' }}>
                          {s.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                              <CheckCircle2 size={16} color="#10b981" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {s.platforms && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                          {s.platforms.map((platform, i) => (
                            <span key={i} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px' }}>
                              {platform}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Form Section */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', margin: '0 0 24px' }}>
              Submit Your Proof
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Name</label>
                  <input type="text" placeholder="Your Name" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#1f2937', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Email</label>
                  <input type="email" value={email} onChange={handleEmailChange} onBlur={validateEmail} placeholder="Email Address" style={{ padding: '12px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#1f2937', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Screenshot Upload</label>
                <div 
                  onClick={triggerFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ 
                    border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed #cbd5e1',
                    borderRadius: '12px', background: isDragging ? '#f0f9ff' : '#f8fafc',
                    padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease', gap: '12px'
                  }}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" style={{ display: 'none' }} />
                  
                  {!file ? (
                    <>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <Upload size={20} color="var(--color-primary)" />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>Drag & drop your screenshot proof</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>or <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Browse Files</span></p>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>PNG, JPG, JPEG, WEBP up to 20MB (PDFs not allowed)</p>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                        <FileImage size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span onClick={triggerFileSelect} style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}>Replace</span>
                        <button type="button" onClick={clearFile} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af' }}><X size={16} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button variant="primary" type="submit" disabled={!file || isSubmitting} style={{ padding: '14px', fontSize: '0.95rem', width: '100%', marginTop: '8px' }}>
                {isSubmitting ? 'Submitting...' : 'Submit Activity'}
              </Button>
            </form>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f1f5f9', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
              <Mail size={16} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Trouble uploading? Email proofs to <a href="mailto:Provider@mantra.care" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Provider@mantra.care</a> using your registered email address.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {showCelebrate && (
        <CompletionScreen points={REWARD_POINTS} title="Activity Complete!" subtitle="Your submission has been received. Points have been added to your profile." onClose={handleCloseCelebration} />
      )}
    </div>
  );
}
