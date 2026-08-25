import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Home, Stethoscope, Dumbbell, Activity, MessageSquare, ShieldCheck, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'physio-how-it-works';
const LESSON_TITLE = 'How PhysioMantra Works';
const REWARD_POINTS = 10;

const FEATURES = [
  {
    icon: Home,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '1. Accessible Anywhere',
    description: 'PhysioMantra is a digital physiotherapy platform designed for people who face difficulty or hassle visiting a clinic, bringing care directly to their home.'
  },
  {
    icon: Stethoscope,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '2. Online Consultations',
    description: 'As an expert physiotherapist, you conduct live online sessions and guide clients through personalized recovery using in-app tools.'
  },
  {
    icon: Dumbbell,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '3. Exercise Library & Reports',
    description: 'Access features such as comprehensive exercise libraries, progress reports, and chat support to guide clients throughout their recovery.'
  },
  {
    icon: Activity,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '4. Root Cause & Rehab Plans',
    description: 'Identify the client\'s root cause, assign targeted rehab exercises, monitor progress, and support them through their therapy journey.'
  },
  {
    icon: MessageSquare,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '5. Ongoing Progress Tracking',
    description: 'Stay connected via chat to answer questions, monitor exercise logs, celebrate recovery wins, and make plan adjustments.'
  },
  {
    icon: ShieldCheck,
    badgeColor: '#ecfeff',
    iconColor: '#0891b2',
    title: '6. Safe & Structured Care',
    description: 'Provide professional, safe, and structured physiotherapy care using digital tools designed to enhance recovery outcomes.'
  }
];

export default function PhysioHowItWorksLessonPage({ onBack }) {
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
            PLATFORM OVERVIEW
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
            How PhysioMantra Works & How You Support Clients.
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

        {/* ── Grid of Features ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {FEATURES.map((item, idx) => (
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
              Assigning clear video-guided exercise routines and monitoring daily logs ensures higher client adherence, safer form, and faster recovery.
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
                You now understand how PhysioMantra works and how to support your clients digitally.
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
