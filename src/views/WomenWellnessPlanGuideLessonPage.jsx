import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Stethoscope, ClipboardList, Send, Activity, Sparkles, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'women-wellness-plan-guide';
const LESSON_TITLE = 'Guide to creating plans for PCOS, menopause, maternity, or hormonal balance';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: Stethoscope,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '1. Assess the Client\'s Condition',
    description: 'Understand which hormonal challenge they\'re facing (PCOS, menopause, pregnancy, or general hormonal imbalance) and how it\'s affecting their daily life.'
  },
  {
    icon: ClipboardList,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '2. Create the Comprehensive Plan',
    description: 'Build a holistic plan covering condition-specific goals, nutrition guidelines, movement & lifestyle recommendations, tracking strategies, and educational resources.'
  },
  {
    icon: Send,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '3. Share in Chat',
    description: 'Send the completed plan to your client via chat. They can save it, refer back to it anytime, and follow your personalized guidance.'
  },
  {
    icon: Activity,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '4. Track Progress & Symptoms',
    description: 'Ask clients to share updates on symptoms, energy levels, mood, or metrics relevant to their condition during scheduled check-ins.'
  }
];

const PLAN_COMPONENTS = [
  'Condition-specific health goals',
  'Nutrition and meal guidelines',
  'Movement and lifestyle recommendations',
  'Tracking and monitoring strategies',
  'Educational resources and support'
];

export default function WomenWellnessPlanGuideLessonPage({ onBack }) {
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
            WOMEN'S WELLNESS & HORMONAL CARE
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
            Develop comprehensive wellness plans tailored to each woman's unique hormonal needs and share them with clients.
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

        {/* ── Plan Components Breakdown Card ──────────────────────── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #fbcfe8',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#db2777' }}>
            <Sparkles size={20} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, margin: 0, color: '#831843' }}>
              Key Elements of a Comprehensive Plan
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {PLAN_COMPONENTS.map((comp, i) => (
              <div key={i} style={{
                background: '#fdf2f8',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.86rem',
                color: '#9d174d',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={14} color="#db2777" />
                <span>{comp}</span>
              </div>
            ))}
          </div>
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
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Women's Wellness Providers</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Customizing recommendations around cycle phases or specific hormonal challenges (like PCOS flare-ups or postpartum recovery) builds deep client trust and speeds progress.
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
                You now know how to design and share tailored wellness plans for PCOS, menopause, and hormonal health.
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
