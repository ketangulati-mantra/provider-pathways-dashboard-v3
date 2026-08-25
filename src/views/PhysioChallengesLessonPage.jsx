import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Target, Compass, Edit3, Share2, RefreshCw, Activity, Footprints, Flame, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'physio-challenges';
const LESSON_TITLE = 'Challenges To Motivate Physical Recovery';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: Target,
    title: '1. Discuss Goals in Session',
    description: 'Talk to your client about realistic mobility and rehab targets—daily posture stretches, step distance, range-of-motion drills, or session consistency.'
  },
  {
    icon: Compass,
    title: '2. Guide Them to the App',
    description: 'Show your client how to access the Challenges section, Activity Tracker, and Mobility Tracker in their MantraCare app.'
  },
  {
    icon: Edit3,
    title: '3. Client Sets Goals',
    description: 'They create personalized targets based on your therapy plan (e.g. 15 mins daily mobility routine, 6,000 steps, 3 rehab sessions weekly).'
  },
  {
    icon: Share2,
    title: '4. Track & Share Progress',
    description: 'Your client logs their progress in the app and shares screenshots/updates with you via chat to show consistency and celebrate recovery milestones.'
  },
  {
    icon: RefreshCw,
    title: '5. Review in Sessions',
    description: 'Discuss progress during your next session and adjust physical therapy targets based on what\'s working.'
  }
];

const SUGGESTED_GOALS = [
  {
    icon: Footprints,
    title: 'Step & Mobility Goal',
    quote: '"Let\'s aim for 6,000 steps daily. Track it on the app and show me your progress."'
  },
  {
    icon: Activity,
    title: 'Rehab Routine Goal',
    quote: '"Complete 15 minutes of daily home stretches. Use the activity tracker to stay consistent."'
  },
  {
    icon: Flame,
    title: 'Consistency Goal',
    quote: '"Complete 3 guided physio sessions this week. Log your sessions in the challenges section."'
  }
];

export default function PhysioChallengesLessonPage({ onBack }) {
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
            REHAB & MOBILITY GOALS
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
            Guide your clients to set and track physical therapy, mobility, and recovery goals using the app's built-in features.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3 min read</span></span>
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

        {/* ── Goals You Can Suggest ────────────────────────────── */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-main)',
          margin: '16px 0 0'
        }}>
          Goals You Can Suggest:
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {SUGGESTED_GOALS.map((goal, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #eef0f3',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                <goal.icon size={18} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  {goal.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
                {goal.quote}
              </p>
            </div>
          ))}
        </div>

        {/* ── Tip Card ───────────────────────────────────────────── */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '14px',
          border: '1px solid #bbf7d0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginTop: '8px'
        }}>
          <Lightbulb size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', fontStyle: 'italic', lineHeight: '1.5' }}>
            <strong>Tip:</strong> Start with achievable physical targets to build momentum. Celebrate progress through chat and use it as motivation for the next recovery goal.
          </p>
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
                You now know how to guide clients to set and track physical recovery goals in the app.
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
