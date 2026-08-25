import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, MessageSquare, UserCheck, User, Pill, FileText, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'doctor-prescription';
const LESSON_TITLE = 'How to create a prescription in the app';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: MessageSquare,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '1. Go to Chats',
    description: 'Open the MantraCare Provider App on your device and navigate to the Chats tab.'
  },
  {
    icon: UserCheck,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '2. Select the Client',
    description: 'Find and select the specific client you want to create a prescription for from your active chat list.'
  },
  {
    icon: User,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '3. Tap Client\'s Name',
    description: 'Click on the client\'s name at the top of the chat window to open their profile menu.'
  },
  {
    icon: Pill,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '4. Tap on "Prescription"',
    description: 'Select the "Prescription" option from the menu to open the digital prescription creator.'
  },
  {
    icon: FileText,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '5. Add Details & Save',
    description: 'Enter the required medication details, dosage, instructions, and save the prescription to send it directly to the client.'
  }
];

export default function DoctorPrescriptionLessonPage({ onBack }) {
  const {
    lessonProgress, handleActionComplete,
    actionDone
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
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1,
        padding: '28px 24px 48px',
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <div>
          <span style={{
            display: 'inline-block',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            background: '#f0f9ff',
            borderRadius: '4px',
            padding: '4px 10px',
            marginBottom: '10px'
          }}>
            MEDICAL PRESCRIPTIONS & CLINICAL TOOLS
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.75rem',
            color: 'var(--text-main)',
            margin: '0 0 8px'
          }}>
            {LESSON_TITLE}
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            margin: '0 0 14px',
            lineHeight: '1.6',
            maxWidth: '650px'
          }}>
            Doctors can create and share digital prescriptions directly through the app with a few simple taps.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3 min read</span></span>
          </div>
        </div>

        {/* ── Section Title ──────────────────────────────────────── */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-main)',
          margin: '12px 0 0'
        }}>
          To do this:
        </h2>

        {/* ── Grid of Steps ──────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STEPS.map((step, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #eef0f3',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: step.badgeColor, color: step.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <step.icon size={18} />
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  color: 'var(--text-main)',
                  margin: '0 0 4px'
                }}>
                  {step.title}
                </h3>
                <div style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tip Card ───────────────────────────────────────────── */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '14px',
          border: '1px solid #bbf7d0',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginTop: '8px'
        }}>
          <Lightbulb size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Doctors</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Prescriptions created in the app are automatically attached to the client's medical history tab, making future refill requests quick and seamless.
            </p>
          </div>
        </div>

        {/* ── Completion Footer Card ───────────────────────────────── */}
        <div className="academy-completion-footer-card">
          <div className="completion-footer-icon-text">
            <div className="completion-footer-icon">
              <CheckCircle2 size={20} color="#fff" />
            </div>
            <div>
              <p className="completion-footer-title">
                You're all set!
              </p>
              <p className="completion-footer-desc">
                You now know how to issue and share digital prescriptions directly through the MantraCare Provider App.
              </p>
            </div>
          </div>
          <Button
            className="academy-btn-full"
            variant="primary"
            onClick={handleActionComplete}
            disabled={actionDone}
          >
            <CheckCircle2 size={16} />
            <span>{actionDone ? 'Complete' : 'Mark as Completed'}</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
