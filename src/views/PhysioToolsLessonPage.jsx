import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Bot, Sparkles, ShieldCheck, HeartHandshake, Cpu, Home, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'physio-tools';
const LESSON_TITLE = 'Additional Tools & Features for Personalized Recovery';
const REWARD_POINTS = 5;

const TOOLS = [
  {
    icon: Bot,
    badgeColor: '#f0f9ff',
    iconColor: '#0284c7',
    title: '1. AI Physio Assistant (Form Correction)',
    description: 'Guides users during Home Exercise Programs (HEP) with real-time feedback, helping them maintain correct posture and alignment.'
  },
  {
    icon: Sparkles,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '2. Interactive Physio Assistant',
    description: 'Provides clear, step-by-step exercise guidance so clients know exactly how to execute every prescribed movement.'
  },
  {
    icon: ShieldCheck,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '3. Safe Home Practice',
    description: 'These advanced tools help clients perform exercises safely at home, avoiding incorrect posture and preventing secondary injuries.'
  },
  {
    icon: HeartHandshake,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '4. Provider Guidance & Role',
    description: 'As a provider, your role is to encourage clients to follow these tools between live sessions to build consistency and speed up recovery.'
  }
];

export default function PhysioToolsLessonPage({ onBack }) {
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
            REHAB TECHNOLOGY & AI ASSISTANTS
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
            Empower your clients with AI form correction and guided home exercise tools to accelerate recovery.
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

        {/* ── Grid of Tools ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {TOOLS.map((item, idx) => (
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
          marginTop: '8px'
        }}>
          <Lightbulb size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Physiotherapists</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Reminding clients to use the AI Physio Assistant during home practice ensures safe execution of prescribed routines between live appointments.
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
                You now know how to leverage AI Assistants and recovery tools to enhance client therapy outcomes.
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
