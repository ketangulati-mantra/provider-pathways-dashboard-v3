import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { CheckCircle2, Clock, Award, ChevronDown, ChevronUp, Star, ShieldCheck, Globe } from 'lucide-react';

const LESSON_ID     = 'premium-provider';
const LESSON_TITLE  = 'What is a Premium Provider?';
const REWARD_POINTS = 5;

const STAGES = [
  {
    badge: 'Stage 1',
    title: 'Listed Provider',
    icon: Globe,
    color: '#3b82f6', // blue
    bg: '#eff6ff',
    description: 'Your profile is visible across the MantraCare network and can receive organic client enquiries.',
    features: [
      { text: 'Profile is searchable on MantraCare.', highlight: true },
      { text: 'Clients can discover and contact you directly.' },
      { text: 'Acquire bookings organically (no auto-matching).' },
      { text: 'Build session history and client ratings.' }
    ]
  },
  {
    badge: 'Stage 2',
    title: 'Verified Provider',
    icon: ShieldCheck,
    color: '#10b981', // green
    bg: '#ecfdf5',
    description: 'Increase client trust by having your professional credentials reviewed and approved by Mantra.',
    features: [
      { text: 'Verified badge appears on your public profile.', highlight: true },
      { text: 'Higher client trust & improved conversion.' },
      { text: 'Requires manual credentials review by compliance team.' },
      { text: 'Upload licences (PDF/JPEG) for 1–2 day review.' }
    ]
  },
  {
    badge: 'Stage 3',
    title: 'Premium Provider',
    icon: Star,
    color: '#f59e0b', // amber/gold
    bg: '#fffbeb',
    description: 'Unlock automatic client referrals and become eligible for Mantra\'s internal client allocation engine.',
    features: [
      { text: 'Receive corporate and individual client referrals directly.', highlight: true },
      { text: 'Higher platform visibility and monthly earning opportunities.' },
      { text: 'Requires 500 Provider Engagement Points to activate.' },
      { text: 'Earn points via Academy lessons and platform activities.' }
    ]
  }
];

export default function PremiumProviderLessonPage({ onBack }) {
  const { actionDone, lessonProgress, handleActionComplete } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [expandedStage, setExpandedStage] = useState(0); // first one open by default

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '28px 24px 48px', maxWidth: '800px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="overview-meta-badge"><Clock size={11} /><span>3 min read</span></span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 8px' }}>
            The Provider Journey
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0', lineHeight: '1.6', maxWidth: '540px' }}>
            Understand the 3 tiers of MantraCare providers and how to unlock the benefits of Premium status.
          </p>
        </div>

        {/* ── Interactive Stage Cards ────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isExpanded = expandedStage === idx;
            
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: `1px solid ${isExpanded ? stage.color : '#eef0f3'}`,
                  boxShadow: isExpanded ? `0 4px 16px ${stage.color}15` : '0 1px 3px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedStage(isExpanded ? -1 : idx)}
              >
                {/* Header */}
                <div style={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: isExpanded ? stage.bg : '#ffffff',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: isExpanded ? stage.color : '#f3f4f6',
                    color: isExpanded ? '#fff' : '#9ca3af',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isExpanded ? stage.color : '#6b7280' }}>
                      {stage.badge}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', margin: '2px 0 0' }}>
                      {stage.title}
                    </h3>
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp size={20} color={stage.color} /> : <ChevronDown size={20} color="#9ca3af" />}
                  </div>
                </div>

                {/* Expanded Content */}
                <div style={{
                  maxHeight: isExpanded ? '500px' : '0px',
                  opacity: isExpanded ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: isExpanded ? '0 20px 24px' : '0 20px',
                  background: isExpanded ? stage.bg : '#ffffff',
                }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: '1.5' }}>
                    {stage.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stage.features.map((feature, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={16} color={stage.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ 
                          fontSize: '0.85rem', 
                          color: feature.highlight ? 'var(--text-main)' : 'var(--text-secondary)',
                          fontWeight: feature.highlight ? 600 : 400,
                          lineHeight: '1.5'
                        }}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Completion card ─────────────────────────────────────── */}
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          marginTop: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', margin: '0 0 6px' }}>
              You're all set!
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: '1.5', maxWidth: '400px' }}>
              You now understand how provider levels work and how to unlock Premium status to maximise your earning potential.
            </p>
          </div>
          <Button
            variant={actionDone ? 'secondary' : 'primary'}
            onClick={handleActionComplete}
            disabled={actionDone}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: actionDone ? 'rgba(255,255,255,0.2)' : '#fff',
              color: actionDone ? '#fff' : 'var(--color-primary)',
              border: 'none',
              boxShadow: actionDone ? 'none' : '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {actionDone ? <CheckCircle2 size={16} /> : null}
            <span>{actionDone ? 'Lesson Completed' : 'Mark Lesson as Complete'}</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
