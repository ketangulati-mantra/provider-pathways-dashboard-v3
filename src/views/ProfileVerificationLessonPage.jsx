import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  CompletionScreen,
  Button
} from '../components';
import SubmissionForm from '../components/forms/SubmissionForm';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

const LESSON_ID = 'profile-verification';
const LESSON_TITLE = 'Verify Your Profile';
const REWARD_POINTS = 10;

const STEPS = [
  'Open Profile Verification',
  'Complete Your Profile',
  'Submit For Verification',
  'Upload Email Screenshot'
];

export default function ProfileVerificationLessonPage({ onBack }) {
  const { 
    lessonProgress, 
    showCelebrate, 
    handleCloseCelebration, 
    handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}
      className="animate-fade-in"
    >
      <Header title={LESSON_TITLE} progress={lessonProgress} points={REWARD_POINTS} />

      <main style={{
        flex: 1,
        padding: '40px 20px',
        maxWidth: '560px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Main Sleek Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px 32px',
          width: '100%',
          border: '1px solid #eef0f3',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={24} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            Verify Your Profile
          </h1>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 32px', lineHeight: '1.5' }}>
            A verified profile builds trust and helps you receive more bookings. Complete verification, then upload a screenshot of your received verification email.
          </p>

          <Button 
            variant="primary" 
            onClick={() => window.open('https://provider.mantracare.com/verification', '_blank')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              padding: '12px 24px', fontSize: '1rem', width: '100%', 
              justifyContent: 'center', borderRadius: '10px',
              marginBottom: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            Open Profile Verification
            <ExternalLink size={18} />
          </Button>

          {/* Setup Stepper */}
          <div style={{ width: '100%', textAlign: 'left' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '20px' }}>
              Verification Process
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {STEPS.map((title, idx) => {
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ 
                        width: '26px', height: '26px', borderRadius: '50%', 
                        background: '#f1f5f9', color: '#64748b', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                        border: '1px solid #e2e8f0'
                      }}>
                        {idx + 1}
                      </div>
                      {!isLast && <div style={{ width: '1px', flex: 1, background: '#e2e8f0', margin: '6px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: isLast ? '0' : '24px', paddingTop: '3px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                        {title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #eef0f3' }}>
            <SubmissionForm 
              title="Upload Verification Email Screenshot"
              proofInstruction="Please upload a screenshot of the received email confirming your profile verification. Do NOT upload ID cards or identity documents."
              lessonId={LESSON_ID}
              activityTitle={LESSON_TITLE}
              onSuccess={handleActionComplete}
            />
          </div>

        </div>
      </main>

      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Verification Submitted!"
          subtitle="Your profile screenshot has been uploaded successfully."
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
