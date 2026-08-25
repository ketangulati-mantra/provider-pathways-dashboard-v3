import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, SubmissionForm
} from '../components';
import { Clock, Award, UserCheck, Share2, FileText, CheckCircle2, Mail, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const LESSON_ID     = 'yoga-market-profile';
const LESSON_TITLE  = 'Market Your Profile – Yoga Experts';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: UserCheck,
    title: 'Complete Your Profile',
    content: 'Before promoting yourself, ensure your YogaMantra profile is fully updated. A complete profile builds trust and improves conversions.',
    items: ['Professional profile photo', 'Qualifications & certifications', 'Experience & specializations', 'Services offered', 'Bio and expertise']
  },
  {
    icon: Share2,
    title: 'Promote Your Profile or Create Content',
    content: 'You may complete either of the following: Share your public YogaMantra profile on social media, OR share educational content (Yoga tips, breathing techniques, routines) and mention YogaMantra.',
    platforms: ['LinkedIn', 'Instagram', 'Facebook', 'X (Twitter)', 'Reddit', 'Quora']
  },
  {
    icon: FileText,
    title: 'Submit Your Proof',
    content: 'Take a screenshot of your post or profile share and upload it using the Activity Submission Form. Every valid submission earns engagement points after verification.'
  },
  {
    icon: Mail,
    title: 'Additional Submissions',
    content: 'This activity can be completed multiple times. For additional submissions, email your screenshots to Provider@mantra.care with subject "Provider Activity Submission Proof".'
  }
];

export default function YogaMarketProfileLessonPage({ onBack }) {
  const { 
    lessonProgress, handleActionComplete
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', background: '#f0f9ff', borderRadius: '4px', padding: '4px 10px', marginBottom: '12px' }}>
            MARKETING
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Increase your visibility and attract more clients by actively promoting your YogaMantra profile and sharing valuable yoga-related content online.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min task</span></span>
          </div>
        </div>

        {/* Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordion Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 8px' }}>
              How to complete this task
            </h2>
            {STEPS.map((s, idx) => {
              const isOpen = activeStep === idx;
              const Icon = s.icon;
              return (
                <div 
                  key={idx}
                  style={{ 
                    background: '#fff', borderRadius: '16px', border: isOpen ? '1px solid var(--color-primary)' : '1px solid #eef0f3', 
                    boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'
                  }}
                  onClick={() => setActiveStep(isOpen ? -1 : idx)}
                >
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? '#f0f9ff' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '10px', background: isOpen ? 'var(--color-primary)' : '#f1f5f9',
                        color: isOpen ? '#fff' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={18} />
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0, color: isOpen ? 'var(--color-primary)' : '#334155' }}>
                        Step {idx + 1}: {s.title}
                      </h3>
                    </div>
                    {isOpen ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
                  </div>
                  
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '16px 0 12px', lineHeight: '1.5' }}>{s.content}</p>
                      
                      {s.items && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

          {/* RIGHT: Submission Form Component & Pro Tip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <SubmissionForm 
                lessonId={LESSON_ID}
                activityTitle={LESSON_TITLE}
                submissionType="yoga_market_profile_proof"
                onSuccess={handleActionComplete} 
                title="Activity Submission Form" 
                successTitle="Proof Submitted Successfully" 
                successMessage="Your submission has been sent for manual verification. After approval, Provider Engagement Points will automatically be credited to your account." 
                buttonText="Submit Activity"
              />
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }}>
                <Lightbulb size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: '#047857' }}>Pro Tip</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#065f46', lineHeight: '1.5' }}>
                  Consistently sharing helpful yoga content builds credibility, improves discoverability, and attracts more clients than occasional promotional posts.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
