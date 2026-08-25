import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button,
  SubmissionForm,
  useToast
} from '../components';
import { completeLesson, goToDashboard } from '../mantra';
import { 
  Clock, Award, ExternalLink, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

const LESSON_ID = 'share-linkedin';
const LESSON_TITLE = 'Share on LinkedIn & Earn Points';
const REWARD_POINTS = 5;

const BENEFITS = [
  { icon: Award, title: 'Boost Score', desc: 'Earn 5 Engagement Points instantly.' },
  { icon: ExternalLink, title: 'Network', desc: 'Connect with other health professionals.' }
];

const GUIDELINES = [
  "Do NOT share sensitive patient information.",
  "Ensure your profile states your affiliation with MantraCare (optional but recommended).",
  "Posts should be public to allow manual verification by the community team."
];

const STEPS = [
  {
    step: 1,
    title: 'Create a LinkedIn post.',
    content: 'Suggestions:',
    items: ['Your experience with MantraCare', 'Mental health awareness', 'Helpful wellness tips', 'Professional success story (without revealing client information)']
  },
  {
    step: 2,
    title: 'Publish the post.',
    content: 'Share it on LinkedIn.',
    action: {
      label: 'Open LinkedIn',
      url: 'https://www.linkedin.com/feed/'
    }
  },
  {
    step: 3,
    title: 'Take a screenshot of your published LinkedIn post.',
    content: 'Capture proof of your post.'
  },
  {
    step: 4,
    title: 'Upload the screenshot below.',
    content: 'Use the form to submit your proof.'
  }
];

export default function ShareLinkedinLessonPage({ onBack }) {
  const { 
    lessonProgress, handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [activeAccordion, setActiveAccordion] = useState('how-it-works');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '28px 24px 60px', maxWidth: '1000px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Promote MantraCare by sharing your professional experience, success stories, or helpful mental health content on LinkedIn. Every verified submission helps increase your provider visibility while earning Provider Engagement Points.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min activity</span></span>
          </div>
        </div>

        {/* Split Layout: Accordions on Left, Form on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Accordion 1: Why This Matters */}
            <div 
              style={{ background: '#fff', borderRadius: '16px', border: activeAccordion === 'benefits' ? '1px solid var(--color-primary)' : '1px solid #eef0f3', boxShadow: activeAccordion === 'benefits' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onClick={() => setActiveAccordion(activeAccordion === 'benefits' ? '' : 'benefits')}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: activeAccordion === 'benefits' ? '#f0f9ff' : '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: activeAccordion === 'benefits' ? 'var(--color-primary)' : '#334155' }}>Why This Matters</h3>
                {activeAccordion === 'benefits' ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
              </div>
              {activeAccordion === 'benefits' && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    {BENEFITS.map((b, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#f0f9ff', color: 'var(--color-primary)', flexShrink: 0 }}>
                          <b.icon size={16} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-main)' }}>{b.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: How It Works */}
            <div 
              style={{ background: '#fff', borderRadius: '16px', border: activeAccordion === 'how-it-works' ? '1px solid var(--color-primary)' : '1px solid #eef0f3', boxShadow: activeAccordion === 'how-it-works' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onClick={() => setActiveAccordion(activeAccordion === 'how-it-works' ? '' : 'how-it-works')}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: activeAccordion === 'how-it-works' ? '#f0f9ff' : '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: activeAccordion === 'how-it-works' ? 'var(--color-primary)' : '#334155' }}>How It Works</h3>
                {activeAccordion === 'how-it-works' ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
              </div>
              {activeAccordion === 'how-it-works' && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    {STEPS.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                          {idx !== STEPS.length - 1 && <div style={{ width: '2px', flex: 1, background: '#eef0f3', marginTop: '4px' }}></div>}
                        </div>
                        <div style={{ paddingBottom: idx !== STEPS.length - 1 ? '16px' : '0' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 8px', color: 'var(--text-main)' }}>{s.title}</h4>
                          {s.action && (
                            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); window.open(s.action.url, '_blank'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.85rem', marginBottom: '12px' }}>
                              {s.action.label} <ExternalLink size={14} />
                            </Button>
                          )}
                          {s.items && (
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                              {s.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Important Guidelines */}
            <div 
              style={{ background: '#fff', borderRadius: '16px', border: activeAccordion === 'guidelines' ? '1px solid var(--color-primary)' : '1px solid #eef0f3', boxShadow: activeAccordion === 'guidelines' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
              onClick={() => setActiveAccordion(activeAccordion === 'guidelines' ? '' : 'guidelines')}
            >
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: activeAccordion === 'guidelines' ? '#f0f9ff' : '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0, color: activeAccordion === 'guidelines' ? 'var(--color-primary)' : '#334155' }}>Important Guidelines</h3>
                {activeAccordion === 'guidelines' ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
              </div>
              {activeAccordion === 'guidelines' && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {GUIDELINES.map((guide, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{guide}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Form Section */}
          <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <SubmissionForm 
              lessonId={LESSON_ID}
              activityTitle={LESSON_TITLE}
              submissionType="share_linkedin_proof"
              onSuccess={handleActionComplete} 
              title="Submit Your Proof" 
              successTitle="Proof Submitted Successfully" 
              successMessage="Your submission has been sent for manual verification. After approval, Provider Engagement Points will automatically be credited to your account." 
              buttonText="Submit Proof"
            />
          </div>

        </div>

      </main>
    </div>
  );
}
