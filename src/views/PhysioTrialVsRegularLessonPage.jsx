import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  CompletionScreen,
  Button
} from '../components';
import {
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Target,
  FileText,
  Activity,
  CheckSquare,
  ShieldCheck,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  HeartPulse
} from 'lucide-react';

const LESSON_ID = 'physio-trial-vs-regular';
const LESSON_TITLE = 'Trial Session vs Regular Sessions';
const REWARD_POINTS = 5;

const TRIAL_PURPOSES = [
  { prefix: "Identify the client's ", highlight: 'pain points and root cause', suffix: '' },
  { prefix: 'Do a ', highlight: 'quick assessment', suffix: '' },
  { prefix: 'Explain a ', highlight: 'clear recovery pathway', suffix: '' },
  { prefix: 'Show the value of ', highlight: 'structured physiotherapy', suffix: '' },
  { prefix: 'Guide the client toward a ', highlight: 'full therapy plan', suffix: '' }
];

const CLOSING_SCRIPTS = [
  '"Full recovery needs structured sessions. Would a 4- or 8-week plan work for you?"',
  '"Weekly follow-ups help ensure long-term relief."',
  '"Clients committing to 6–12 weeks see lasting results."'
];

const REGULAR_INCLUSIONS = [
  { title: 'Detailed Assessments', desc: 'Detailed assessments and progress tracking' },
  { title: 'Personalized Rehab', desc: 'Personalized exercises and posture corrections' },
  { title: 'Ongoing Guidance', desc: 'Ongoing guidance and plan adjustments' }
];

const REGULAR_OUTCOMES = [
  { title: 'Long-term Pain Relief', desc: 'Sustained relief from chronic discomfort and musculoskeletal pain' },
  { title: 'Improved Movement', desc: 'Enhanced joint mobility, functional strength, and prevention of recurrence' }
];

export default function PhysioTrialVsRegularLessonPage({ onBack }) {
  const {
    lessonProgress,
    showCelebrate,
    handleCloseCelebration,
    handleActionComplete,
    actionDone
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }} className="animate-fade-in">
      <Header
        title={LESSON_TITLE}
        onBack={onBack}
        progress={lessonProgress}
        points={REWARD_POINTS}
      />

      <main className="academy-main-container" style={{
        flex: 1,
        padding: '24px 24px 60px',
        maxWidth: '850px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* ── Top Hero / Intro Card ────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 14px rgba(37,99,235,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Physiotherapy Pathway
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>
              <Clock size={14} />
              <span>3 min read</span>
            </div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#1e3a8a',
            margin: '0 0 8px 0',
            lineHeight: '1.3'
          }}>
            Trial Session vs Regular Sessions
          </h1>

          <p style={{
            fontSize: '0.92rem',
            color: '#1e40af',
            margin: 0,
            lineHeight: '1.55'
          }}>
            Learn the core differences between a quick introductory trial session and ongoing regular therapy sessions to build trust and convert clients into long-term recovery plans.
          </p>
        </div>

        {/* ── SECTION 1: Trial Session ─────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Target size={22} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0
              }}>
                Trial Session
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Introductory clarity & initial evaluation
              </p>
            </div>
          </div>

          <p style={{
            fontSize: '0.93rem',
            color: '#334155',
            lineHeight: '1.6',
            marginBottom: '20px',
            background: '#f8fafc',
            padding: '12px 16px',
            borderRadius: '10px',
            borderLeft: '4px solid #0284c7'
          }}>
            A trial session is a <strong>short introductory session</strong> that helps the client understand how structured physiotherapy works.
          </p>

          {/* Purpose list */}
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} color="#0284c7" />
            Purpose
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {TRIAL_PURPOSES.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#faf5ff',
                border: '1px solid #f3e8ff',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <CheckSquare size={16} color="#9333ea" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.89rem', color: '#4c1d95', lineHeight: '1.45' }}>
                  {item.prefix}<strong>{item.highlight}</strong>{item.suffix}
                </span>
              </div>
            ))}
          </div>

          {/* How to Close */}
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MessageSquare size={16} color="#2563eb" />
            How to Close
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CLOSING_SCRIPTS.map((script, idx) => (
              <div key={idx} style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '0.89rem',
                color: '#1e40af',
                fontStyle: 'italic',
                fontWeight: 600,
                lineHeight: '1.45'
              }}>
                {script}
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 2: Regular Sessions ──────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Activity size={22} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0
              }}>
                Regular Sessions
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Complete rehabilitation & long-term results
              </p>
            </div>
          </div>

          <p style={{
            fontSize: '0.93rem',
            color: '#334155',
            lineHeight: '1.6',
            marginBottom: '20px',
            background: '#f0fdf4',
            padding: '12px 16px',
            borderRadius: '10px',
            borderLeft: '4px solid #16a34a'
          }}>
            Regular sessions are <strong>longer and more in-depth</strong>, focused on complete recovery.
          </p>

          {/* What They Include */}
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FileText size={16} color="#16a34a" />
            What They Include
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {REGULAR_INCLUSIONS.map((inc, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#faf7ed',
                border: '1px solid #fef3c7',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <CheckCircle2 size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <div style={{ fontSize: '0.89rem', fontWeight: 700, color: '#92400e' }}>{inc.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#b45309' }}>{inc.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Outcome */}
          <h3 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <TrendingUp size={16} color="#16a34a" />
            Outcome
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {REGULAR_OUTCOMES.map((out, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '12px 16px'
              }}>
                <HeartPulse size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#14532d' }}>{out.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>{out.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Summary Callout Box (In Short) ───────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(15,23,42,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Sparkles size={24} color="#38bdf8" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.98rem', lineHeight: '1.5' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8' }}>In short: </span>
            <span>Trial sessions build clarity. Regular sessions deliver results.</span>
          </div>
        </div>

        {/* ── Pro Tip Card ───────────────────────────────────────────── */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: '14px',
          border: '1px solid #bbf7d0',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <Lightbulb size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip for Physiotherapists</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Use the short trial session to listen actively, identify root causes quickly, and present a structured 4- to 12-week regular treatment plan so clients feel confident committing to full recovery.
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
                You now know how to leverage trial sessions for clarity and regular sessions for lasting therapy outcomes.
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

      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Lesson Complete!"
          subtitle="You have successfully completed this lesson and earned 5 points."
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
