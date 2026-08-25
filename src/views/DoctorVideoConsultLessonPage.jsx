import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, FileText, Video, Smile, ClipboardList, Eye, Edit3, Calendar, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'doctor-video-consult';
const LESSON_TITLE = 'How to provide an efficient initial video consult using the app (history, exam, advice).';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: FileText,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '1. Review Client History Before Session',
    description: 'Go to Chats, select your client, and review any medical history, previous notes, or information they\'ve shared on their profile.'
  },
  {
    icon: Video,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '2. Prepare Your Space',
    description: 'Ensure good lighting, clear audio, and a professional background. Test your camera and internet connection before launching.'
  },
  {
    icon: Smile,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '3. Start With Rapport',
    description: 'Greet the client warmly, confirm you can see and hear them clearly, and set expectations for the consultation duration.'
  },
  {
    icon: ClipboardList,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '4. Gather Comprehensive History',
    description: 'Ask about chief complaint, medical history, current medications, allergies, family history, and lifestyle factors relevant to their concern.'
  },
  {
    icon: Eye,
    badgeColor: '#ecfeff',
    iconColor: '#0891b2',
    title: '5. Conduct Virtual Exam',
    description: 'Use visual assessment and ask clients to demonstrate symptoms or areas of concern (e.g., movement for pain, skin conditions).'
  },
  {
    icon: CheckCircle2,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '6. Provide Clear Advice',
    description: 'Explain your assessment, recommendations, and any follow-up needed. Be specific, clear, and actionable.'
  },
  {
    icon: Edit3,
    badgeColor: '#f8fafc',
    iconColor: '#475569',
    title: '7. Document in App',
    description: 'Record consultation notes, diagnosis, recommendations, and any referrals directly in the app for continuity of care.'
  },
  {
    icon: Calendar,
    badgeColor: '#eff6ff',
    iconColor: '#1d4ed8',
    title: '8. Schedule Follow-up',
    description: 'If needed, book a follow-up consultation or refer to specialists using the built-in referral feature.'
  }
];

export default function DoctorVideoConsultLessonPage({ onBack }) {
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
            CLINICAL CONSULTATIONS & EFFICIENT CARE
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.65rem',
            color: 'var(--text-main)',
            margin: '0 0 8px',
            lineHeight: '1.3'
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
            Conduct thorough, professional medical consultations while maximizing your time and client experience.
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
          Here's how it works:
        </h2>

        {/* ── Grid of Steps ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {STEPS.map((item, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #eef0f3',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '12px',
                  background: item.badgeColor, color: item.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <item.icon size={20} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-main)',
                  margin: 0
                }}>
                  {item.title}
                </h3>
              </div>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {item.description}
              </p>
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
          marginTop: '4px'
        }}>
          <Lightbulb size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Medical Providers</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Documenting clinical notes during or immediately after the video call ensures zero data loss and seamless continuity of care for subsequent visits.
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
                You now know how to conduct efficient, thorough initial video consultations in the app.
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
