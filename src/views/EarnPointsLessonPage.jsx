import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, SubmissionForm
} from '../components';
import { 
  Clock, Award, PlayCircle, Monitor, Upload, Repeat, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, ShieldAlert
} from 'lucide-react';

const LESSON_ID = 'earn-points';
const LESSON_TITLE = 'Earn Points for Every Session';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: PlayCircle,
    title: 'Conduct Therapy Session',
    content: 'Conduct a genuine therapy session with your client through the MantraCare platform.'
  },
  {
    icon: Monitor,
    title: 'Complete Session on Mantra',
    content: 'Ensure the session is recorded and completed using the official Mantra web or mobile platform.'
  },
  {
    icon: Upload,
    title: 'Submit Screenshot Proof',
    content: 'Take a screenshot of the completed session confirmation and upload it within 7 days using the Activity Submission Form.'
  },
  {
    icon: Repeat,
    title: 'Conduct Repeat Sessions',
    content: 'Continue holding regular sessions to earn points. For repeat submissions, email your proof to provider@mantra.care with subject "Provider Activity Submission Proof".'
  },
  {
    icon: CheckCircle2,
    title: 'Points Verification & Credit',
    content: 'After manual verification by our team, engagement points will automatically credit to your provider profile to boost your visibility.'
  }
];

export default function EarnPointsLessonPage({ onBack }) {
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

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', background: '#f0f9ff', borderRadius: '4px', padding: '4px 10px', marginBottom: '12px' }}>
            ENGAGEMENT REWARDS
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Earn Mantra Engagement Points for every session you conduct through the platform to boost your profile ranking and unlock client opportunities.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min task</span></span>
          </div>
        </div>

        {/* Split Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordion Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 8px' }}>
              How to earn points
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
                        color: isOpen ? '#fff' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
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
                    <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{s.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: Submission Form & Rules Callout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <SubmissionForm 
                lessonId={LESSON_ID}
                activityTitle={LESSON_TITLE}
                submissionType="earn_points_proof"
                onSuccess={handleActionComplete} 
                title="Activity Submission Form" 
                successTitle="Proof Submitted Successfully" 
                successMessage="Your session proof has been sent for manual verification. After approval, Provider Engagement Points will automatically credit to your profile." 
                buttonText="Submit Activity"
              />
            </div>

            {/* Pro Tip & Rules */}
            <div style={{ background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }}>
                <Lightbulb size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700, color: '#1e40af' }}>Important Submission Rules</h4>
                <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                  • Submit proof within <strong>7 days</strong> of completing the session.
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                  • For repeat session proofs, email <strong>provider@mantra.care</strong> with subject <em>"Provider Activity Submission Proof"</em>.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
