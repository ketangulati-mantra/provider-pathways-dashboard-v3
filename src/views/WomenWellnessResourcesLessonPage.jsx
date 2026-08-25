import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Search, BookOpen, MessageSquare, Users, TrendingUp, Sparkles, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'women-wellness-resources';
const LESSON_TITLE = 'Sharing specialized resources';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: Search,
    badgeColor: '#fdf2f8',
    iconColor: '#db2777',
    title: '1. Identify Client Needs',
    description: 'Understand what your client is navigating—pregnancy, postpartum recovery, PCOS management, menopause, fertility, or other women\'s health concerns.'
  },
  {
    icon: BookOpen,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '2. Show Them the Resources',
    description: 'Walk your client through the MantraCare app\'s resource library relevant to their specific condition.'
  },
  {
    icon: MessageSquare,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '3. Nudge Them to Explore',
    description: 'In chat or sessions, encourage them to browse articles, videos, and guides that address their specific concerns.'
  },
  {
    icon: Users,
    badgeColor: '#f5f3ff',
    iconColor: '#7c3aed',
    title: '4. Discuss & Apply',
    description: 'Review key takeaways from the resources during your next session and help them apply the guidance to their situation.'
  },
  {
    icon: TrendingUp,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '5. Track Implementation',
    description: 'Ask clients how they\'re using the resources and what\'s working best for their ongoing wellness routine.'
  }
];

const TOPICS = [
  'Pregnancy & Pre-natal Care',
  'Postpartum Recovery',
  'PCOS & Metabolic Health',
  'Menopause Transition',
  'Fertility & Ovulation',
  'Hormonal Balance & Mood'
];

export default function WomenWellnessResourcesLessonPage({ onBack }) {
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
            WOMEN'S HEALTH EDUCATION & RESOURCES
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
            Guide clients to the specialized resources available on MantraCare that support their specific health needs.
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

        {/* ── Topics Cloud ────────────────────────────────────────── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#db2777' }}>
            <Sparkles size={18} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Specialized Resource Library Categories
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TOPICS.map((topic, idx) => (
              <span key={idx} style={{
                background: '#fdf2f8',
                color: '#be185d',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid #fbcfe8'
              }}>
                {topic}
              </span>
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
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>Pro Tip</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', lineHeight: '1.5' }}>
              Recommending a specific article or video right after a consultation keeps client engagement high between sessions.
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
                You now know how to guide clients to specialized Women's Wellness resources in the app.
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
