import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Lock, MessageSquare, Heart, HelpCircle, Shield, Smile, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'women-wellness-sensitive-discussions';
const LESSON_TITLE = 'Tips for handling sensitive women\'s health discussions on the platform';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: Lock,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '1. Create Privacy & Confidentiality',
    description: 'Remind clients that all conversations are private and secure. Never discuss sensitive details in public or group settings.'
  },
  {
    icon: MessageSquare,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '2. Use Respectful Language',
    description: 'Use clinical, non-judgmental terminology when discussing menstruation, hormones, sexual health, or reproductive issues.'
  },
  {
    icon: Heart,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '3. Validate Their Experiences',
    description: 'Acknowledge that women\'s health concerns are real and often misunderstood. Normalize conversations around periods, menopause, sexual dysfunction, or fertility.'
  },
  {
    icon: HelpCircle,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '4. Ask Permission Before Probing',
    description: 'Before asking detailed questions about intimate topics, ask: "Is it okay if we discuss this in more detail?" Respect their comfort level at all times.'
  },
  {
    icon: Shield,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '5. Maintain Professional Boundaries',
    description: 'Stay within your professional scope of practice. If a client discloses something requiring specialized medical or psychological intervention, refer them appropriately.'
  },
  {
    icon: Smile,
    badgeColor: '#ecfeff',
    iconColor: '#0891b2',
    title: '6. Address Shame & Stigma',
    description: 'Many women feel embarrassed discussing their bodies. Normalize these conversations and help them see their health as worthy of attention, respect, and care.'
  }
];

export default function WomenWellnessSensitiveDiscussionsLessonPage({ onBack }) {
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
            color: '#db2777',
            background: '#fdf2f8',
            borderRadius: '4px',
            padding: '4px 10px',
            marginBottom: '10px'
          }}>
            PATIENT PRIVACY & COMPASSIONATE CARE
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
            Create a safe, confidential, and supportive environment for discussing intimate health concerns.
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
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Healthcare Providers</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Validating emotions first—such as saying <em>"Your symptoms and experiences are completely valid"</em>—helps clients feel safe opening up about sensitive health topics.
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
                You now know best practices for conducting sensitive women's health discussions with empathy and confidentiality.
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
