import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  CompletionScreen,
  useToast
} from '../components';
import {
  Calendar,
  FileText,
  CreditCard,
  Video,
  BarChart3,
  Bot,
  ArrowRight,
  Sparkles,
  Check,
  MessageSquare,
  Cpu,
  Loader2,
  ExternalLink,
  Users,
  Building2,
  TrendingUp,
  Zap
} from 'lucide-react';

const LESSON_ID = 'ehr-mantra-ai';
const REWARD_POINTS = 10;
const MANTRA_PRACTICE_EXPLORE_URL = 'https://mantrapractice.com/';

export default function MantraEhrLessonPage({ onBack }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    lessonProgress,
    showCelebrate,
    handleCloseCelebration,
    handleActionComplete
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const handleCompleteActivity = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setCompletionError(null);

    try {
      await handleActionComplete();
    } catch (err) {
      console.error('[MantraPractice] Completion error:', err);
      setCompletionError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAFCFF',
        color: '#0F172A',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: '48px'
      }}
    >
      {/* Top Activity Navigation Bar */}
      <Header
        title="One Platform for Your Entire Practice"
        onBack={onBack}
        progress={lessonProgress}
        points={REWARD_POINTS}
      />

      <main
        style={{
          maxWidth: '900px',
          width: '92%',
          margin: '0 auto',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* ==================================================================== */}
        {/* CARD 1: HERO / INTRO */}
        {/* ==================================================================== */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            padding: isMobile ? '20px 18px' : '28px 32px',
            boxShadow: '0 4px 20px -6px rgba(0, 111, 245, 0.06)'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            {/* Left Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(0, 111, 245, 0.08)',
                  color: '#006FF5',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  width: 'fit-content'
                }}
              >
                <Sparkles size={12} /> PRACTICE MANAGEMENT
              </div>

              <h1
                style={{
                  fontSize: isMobile ? '1.4rem' : '2.0rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.18,
                  letterSpacing: '-0.025em',
                  margin: 0
                }}
              >
                One Platform for Your Entire Practice
              </h1>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#475569',
                  lineHeight: 1.45,
                  fontWeight: 500,
                  margin: 0
                }}
              >
                Scheduling, patient records, billing, telehealth, and AI-powered automation — spend less time switching systems and more time with patients.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '2px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '999px', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', fontSize: '0.74rem', fontWeight: 700 }}>
                  • AI-Powered
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '999px', background: '#F1F5F9', color: '#334155', fontSize: '0.74rem', fontWeight: 700 }}>
                  • All-in-One Platform
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '999px', background: 'rgba(5, 150, 105, 0.1)', color: '#059669', fontSize: '0.74rem', fontWeight: 700 }}>
                  • Free Forever
                </span>
              </div>
            </div>

            {/* Right SaaS OS Preview */}
            <div
              style={{
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #1E293B',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1E293B', fontSize: '0.72rem' }}>
                <span style={{ fontWeight: 800, color: '#60A5FA' }}>MantraPractice OS</span>
                <span style={{ fontSize: '0.64rem', color: '#34D399', fontWeight: 700, background: 'rgba(6, 78, 59, 0.6)', padding: '2px 6px', borderRadius: '999px' }}>
                  ● Connected
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                <div style={{ background: '#1E293B', borderRadius: '8px', padding: '7px 10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="#60A5FA" />
                    <span style={{ fontWeight: 700 }}>Smart Scheduling</span>
                  </div>
                  <span style={{ color: '#34D399', fontSize: '0.66rem' }}>Active</span>
                </div>

                <div style={{ background: '#1E293B', borderRadius: '8px', padding: '7px 10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={13} color="#34D399" />
                    <span style={{ fontWeight: 700 }}>EHR Patient Charts</span>
                  </div>
                  <span style={{ color: '#60A5FA', fontSize: '0.66rem' }}>Organized</span>
                </div>

                <div style={{ background: 'rgba(88, 28, 135, 0.4)', borderRadius: '8px', padding: '7px 10px', border: '1px solid rgba(147, 51, 234, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={13} color="#C084FC" />
                    <span style={{ fontWeight: 700, color: '#F3E8FF' }}>AI Scribe & Receptionist</span>
                  </div>
                  <span style={{ color: '#D8B4FE', fontSize: '0.66rem' }}>Automated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CARD 2: CORE PLATFORM CAPABILITIES */}
        {/* ==================================================================== */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            padding: isMobile ? '20px 18px' : '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 2px 12px -4px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                Everything You Need. In One Place.
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: 500 }}>
                Stop piecing together disconnected tools.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7C6CFF', background: 'rgba(124, 108, 255, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>Telehealth</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>Credentialing</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', background: 'rgba(2, 132, 199, 0.08)', padding: '2px 8px', borderRadius: '6px' }}>Analytics</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '10px'
            }}
          >
            {[
              { title: 'AI Scribe', desc: 'Turn clinical chats into structured notes automatically.', icon: Bot, color: '#4F46E5' },
              { title: 'AI Receptionist', desc: 'Automate booking, patient communication & follow-ups.', icon: MessageSquare, color: '#C084FC' },
              { title: 'EHR', desc: 'Centralized, accessible patient records & progress notes.', icon: FileText, color: '#059669' },
              { title: 'CRM', desc: 'Manage patient relationships & history in one place.', icon: Users, color: '#006FF5' },
              { title: 'RCM', desc: 'Streamline revenue workflows & practice visibility.', icon: TrendingUp, color: '#0284C7' },
              { title: 'Billing & Claims', desc: 'Simplify invoicing, payments, and claim tracking.', icon: CreditCard, color: '#D97706' }
            ].map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={15} color={cap.color} />
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>{cap.title}</div>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.35, fontWeight: 500 }}>
                    {cap.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scannable Practice Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', paddingTop: '4px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Built for:</span>
            {[
              'Therapy & Mental Health',
              'Dental & Eye Clinics',
              'Dermatology & Wellness',
              'Women’s Health',
              'Multi-Specialty Practices'
            ].map((practice) => (
              <span
                key={practice}
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                {practice}
              </span>
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CARD 3: MANTRAAI AUTOMATION */}
        {/* ==================================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: isMobile ? '20px 18px' : '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 14px 28px -8px rgba(15, 23, 42, 0.35)'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(192, 132, 252, 0.15)',
                color: '#C084FC',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}
            >
              <Bot size={12} /> MANTRAAI WORKFLOWS
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 2px 0' }}>
              Bring AI Into Your Everyday Workflow
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#C7D2FE', margin: 0, fontWeight: 500 }}>
              Automation handles repetitive admin work so your team can focus on delivering care.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '10px'
            }}
          >
            {[
              { title: 'AI Scribe', desc: 'Spend less time writing notes and more time with patients.', icon: FileText, color: '#C084FC' },
              { title: 'AI Receptionist', desc: 'Help manage routine patient interactions & booking workflows.', icon: MessageSquare, color: '#60A5FA' },
              { title: 'AI-Powered Automation', desc: 'Reduce repetitive paperwork across practice operations.', icon: Cpu, color: '#34D399' }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(51, 65, 85, 0.8)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Icon size={15} color={card.color} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{card.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#CBD5E1', lineHeight: 1.35, fontWeight: 500 }}>
                    {card.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CARD 4: FREE POSITIONING & FINAL CTA */}
        {/* ==================================================================== */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            padding: isMobile ? '24px 18px' : '28px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 4px 16px -4px rgba(0, 0, 0, 0.03)'
          }}
        >
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '999px',
              background: '#059669',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.06em'
            }}
          >
            FREE FOREVER
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Ready to Simplify Your Practice?
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, fontWeight: 500, maxWidth: '460px' }}>
              Bring your practice workflows together with MantraPractice — available free forever for healthcare providers.
            </p>
          </div>

          {completionError && (
            <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, background: '#FEF2F2', padding: '6px 14px', borderRadius: '8px' }}>
              {completionError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
            {/* Primary Action Button: Complete Activity */}
            <button
              onClick={handleCompleteActivity}
              disabled={isSubmitting}
              style={{
                padding: '13px 34px',
                borderRadius: '999px',
                border: 'none',
                background: '#006FF5',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px -4px rgba(0, 111, 245, 0.35)',
                opacity: isSubmitting ? 0.85 : 1
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Completing...
                </>
              ) : (
                <>
                  Complete Activity <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Direct External Link: Explore MantraPractice */}
            <a
              href={MANTRA_PRACTICE_EXPLORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#006FF5',
                fontSize: '0.84rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Explore MantraPractice <ExternalLink size={13} />
            </a>
          </div>

          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748B', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span>30-day free trial available</span>
            <span>•</span>
            <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={13} /> Free forever for healthcare providers</span>
          </div>
        </section>
      </main>

      {/* Completion Modal Celebration & Back Navigation */}
      {showCelebrate && (
        <CompletionScreen
          lessonId={LESSON_ID}
          rewardPoints={REWARD_POINTS}
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
