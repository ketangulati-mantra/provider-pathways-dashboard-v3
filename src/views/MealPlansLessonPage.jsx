import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, MessageCircle, User, MoreHorizontal, Utensils, Edit3, Smartphone, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'meal-plans';
const LESSON_TITLE = 'Build Personalized Meal Plans';
const REWARD_POINTS = 10;

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Step 1: Open Chats',
    description: 'Open the Chats section inside your MantraCare Provider Dashboard.'
  },
  {
    icon: User,
    title: 'Step 2: Choose Your Client',
    description: 'Open the conversation of the client for whom you want to create a meal plan.'
  },
  {
    icon: MoreHorizontal,
    title: 'Step 3: Open More Options',
    description: 'Click the three-dot menu in the top-right corner.'
  },
  {
    icon: Utensils,
    title: 'Step 4: Track User\'s Meals',
    description: 'Select "Track User\'s Meals".'
  },
  {
    icon: Edit3,
    title: 'Step 5: Create the Plan',
    description: 'Build a personalized meal plan with breakfast, lunch, dinner and snacks. You may use templates or create one from scratch.'
  },
  {
    icon: Smartphone,
    title: 'Step 6: Client Receives the Plan',
    description: 'The client can immediately access the meal plan inside their MantraCare app, log meals, monitor progress and stay engaged with your recommendations.'
  }
];

const KEY_TAKEAWAYS = [
  'Personalized meal plans improve adherence and client outcomes.',
  'Clients can track meals and progress directly inside the app.',
  'Regularly updating meal plans keeps clients engaged and motivated.'
];

export default function MealPlansLessonPage({ onBack }) {
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
            NUTRITION PLANNING
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
            Learn how to create personalized meal plans for your clients directly from the MantraCare provider dashboard. These plans help clients follow structured nutrition guidance while allowing you to monitor their progress.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min read</span></span>
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
          How it works
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

        {/* ── Key Takeaways Card ─────────────────────────────────── */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1e40af' }}>
            <Lightbulb size={22} color="#2563eb" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Key Takeaways
            </h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e3a8a', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {KEY_TAKEAWAYS.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
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
                You now know how to build personalized meal plans to help your clients achieve their nutrition goals.
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
