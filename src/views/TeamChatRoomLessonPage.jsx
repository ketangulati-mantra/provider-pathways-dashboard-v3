import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Users, MessageSquare, ShieldCheck, Mail, Smartphone, Layers, UserCheck, HelpCircle
} from 'lucide-react';

const LESSON_ID = 'team-chat-room';
const LESSON_TITLE = 'How to use the Team Chat Room for Comprehensive Plans';
const REWARD_POINTS = 5;

const HIGHLIGHTS = [
  {
    icon: Users,
    title: 'Multi-Specialty Alignment',
    description: 'Connects Dietitians, Fitness Coaches, and Endocrinologists in a single dedicated chat room per client.'
  },
  {
    icon: Layers,
    title: 'Unified Care Plan',
    description: 'Avoid conflicting advice by sharing progress, meal plans, and workout routines in real time.'
  },
  {
    icon: MessageSquare,
    title: 'Seamless Client Support',
    description: 'Clients communicate with all assigned experts together, improving motivation and clarity.'
  }
];

const ACCESS_STEPS = [
  {
    icon: Smartphone,
    title: '1. Open Provider App',
    description: 'Launch the MantraCare Provider App on your device.'
  },
  {
    icon: MessageSquare,
    title: '2. Tap "Chats" Section',
    description: 'Select the Chats tab from your home screen navigation bar.'
  },
  {
    icon: UserCheck,
    title: '3. Locate Care Team Room',
    description: 'Find the dedicated Care Team chat room created for that specific client.'
  },
  {
    icon: Users,
    title: '4. Collaborate & Message',
    description: 'Message the client and co-assigned providers, share updates, and align on nutrition & fitness plans.'
  }
];

export default function TeamChatRoomLessonPage({ onBack }) {
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
            CARE TEAM COLLABORATION
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
            Learn how to collaborate with multi-specialty care teams (Dietitians, Fitness Coaches, Endocrinologists) in dedicated client chat rooms.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3 min read</span></span>
          </div>
        </div>

        {/* ── Key Highlights Grid ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
          {HIGHLIGHTS.map((item, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #eef0f3',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: '#f0f9ff', color: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <item.icon size={18} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Access Steps Section ────────────────────────────────── */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--text-main)',
          margin: '12px 0 0'
        }}>
          How to access the Chat Room:
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ACCESS_STEPS.map((step, idx) => (
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

        {/* ── Support Callout Box ──────────────────────────────────── */}
        <div style={{
          background: '#eff6ff',
          borderRadius: '14px',
          border: '1px solid #bfdbfe',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
          marginTop: '8px'
        }}>
          <HelpCircle size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#1e40af' }}>
              Missing your Care Team chat room?
            </h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#1e3a8a', lineHeight: '1.5' }}>
              If you are unable to see the chat room for an active Comprehensive Plan client, please email us at <strong>provider@mantracare.com</strong> with the Client ID and our team will set it up for you immediately.
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
                You now know how to access and collaborate within Care Team chat rooms for comprehensive client plans.
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
