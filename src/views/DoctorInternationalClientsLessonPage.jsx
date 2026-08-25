import React from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button
} from '../components';
import { 
  CheckCircle2, Clock, Award, Globe, Stethoscope, AlertTriangle, FileText, ShieldAlert
} from 'lucide-react';

const LESSON_ID = 'doctor-international-clients';
const LESSON_TITLE = 'Clients from Other Countries';
const REWARD_POINTS = 5;

const CARDS = [
  {
    icon: Globe,
    badgeColor: '#eff6ff',
    iconColor: '#2563eb',
    title: '1. Second Opinion Consultations',
    description: 'Clients from other countries may come to you seeking a second opinion on their diagnosis, treatment plan, or medical concerns.'
  },
  {
    icon: Stethoscope,
    badgeColor: '#f0fdf4',
    iconColor: '#16a34a',
    title: '2. Professional & Clinical Guidance',
    description: 'Provide professional guidance, emotional support, and clinical insights as usual to support their overall health journey.'
  },
  {
    icon: AlertTriangle,
    badgeColor: '#fef2f2',
    iconColor: '#dc2626',
    title: '3. Do Not Prescribe Medications',
    description: 'Do not prescribe medications for international clients, as prescriptions issued cross-border may not be legally valid or recognized in their home region.'
  },
  {
    icon: FileText,
    badgeColor: '#fff7ed',
    iconColor: '#ea580c',
    title: '4. Focus on General Recommendations',
    description: 'Focus on sharing general recommendations, lifestyle adjustments, coping strategies, and clinical perspectives without issuing formal prescriptions.'
  }
];

export default function DoctorInternationalClientsLessonPage({ onBack }) {
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
            INTERNATIONAL CONSULTATIONS & COMPLIANCE
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
            Guidelines for managing international consultations, second opinions, and cross-border prescription regulations.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3 min read</span></span>
          </div>
        </div>

        {/* ── Grid of Guidelines ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {CARDS.map((item, idx) => (
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

        {/* ── Warning Callout Box ──────────────────────────────────── */}
        <div style={{
          background: '#fff1f2',
          borderRadius: '14px',
          border: '1px solid #fecdd3',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginTop: '8px'
        }}>
          <ShieldAlert size={22} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 700, color: '#9f1239' }}>Important Prescription Notice</h4>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#be123c', lineHeight: '1.5' }}>
              Cross-border medical prescribing is legally restricted. Always limit international consultations to clinical guidance, second opinions, and recommendations.
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
                You now understand the compliance guidelines for managing clients from other countries.
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
