import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, MessageSquare, Target, Smartphone, BarChart3, RefreshCw
} from 'lucide-react';

const LESSON_ID = 'canned-responses';
const LESSON_TITLE = 'Auto Responses To Improve Diet';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: Target,
    title: '1. Discuss Goals in Session',
    description: 'Talk to your client about their diet challenges, lifestyle habits, and health metrics they want to improve.'
  },
  {
    icon: Smartphone,
    title: '2. Show Them the App Features',
    description: 'Walk them through the various tools available in the MantraCare app to support their progress.'
  },
  {
    icon: MessageSquare,
    title: '3. Client Uses Tools Independently',
    description: 'They access trackers, calculators, and resources between sessions to monitor their health and build awareness.'
  },
  {
    icon: BarChart3,
    title: '4. Track & Share Progress',
    description: 'Your client logs data in the app and shares insights with you via chat or brings results to the next session.'
  },
  {
    icon: RefreshCw,
    title: '5. Review Together',
    description: 'Discuss patterns, wins, and areas to adjust during your sessions.'
  }
];

export default function DietAutoResponsesLessonPage({ onBack }) {
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
        maxWidth: '800px',
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
            NUTRITION & CHAT TOOLS
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
            Guide your clients to leverage app features that support their nutrition and wellness goals.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>2 min read</span></span>
          </div>
        </div>

        {/* ── Steps Section ───────────────────────────────────────── */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-main)',
          margin: '12px 0 0'
        }}>
          Here's how it works:
        </h2>

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
                background: '#f0f9ff', color: 'var(--color-primary)',
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
                You now know how to guide your clients using auto responses to improve their diet.
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
