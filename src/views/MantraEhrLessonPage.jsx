import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  CompletionScreen,
  useToast
} from '../components';
import {
  Calendar,
  CreditCard,
  Video,
  BarChart3,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Loader2,
  Stethoscope,
  FileCheck2,
  MessageSquare,
  CheckCircle2,
  LayoutDashboard,
  ArrowDown,
  ChevronRight,
  Zap,
  Layers,
  Sparkle,
  XCircle,
  CheckCircle
} from 'lucide-react';

import { navigateToClientsPage } from '../mantra/navigation';

const LESSON_ID = 'ehr-mantra-ai';
const REWARD_POINTS = 10;
const MANTRA_PRACTICE_URL = 'https://provider.mantracare.com/clients';

export default function MantraEhrLessonPage({ onBack, onNavigateToClients }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionError, setCompletionError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);

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

  const handleMarkCompleted = async () => {
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

  const handleStartAddingClients = () => {
    if (onNavigateToClients) {
      onNavigateToClients();
    } else {
      navigateToClientsPage();
    }
  };

  const capabilities = [
    {
      id: 'ehr',
      shortName: 'EHR & Records',
      title: 'EHR & Clinical Records',
      icon: Stethoscope,
      color: '#006FF5',
      badge: 'Centralized Records',
      desc: 'Keep client information, clinical notes, treatment plans, assessments, and documentation organized in one place.',
      highlights: ['HIPAA-compliant notes', 'Custom templates', 'History tracking']
    },
    {
      id: 'scheduling',
      shortName: 'Smart Scheduling',
      title: 'Smart Scheduling',
      icon: Calendar,
      color: '#4F46E5',
      badge: 'Automated Reminders',
      desc: 'Let clients book appointments, manage your calendar, and send automated appointment reminders to reduce no-shows.',
      highlights: ['SMS & email reminders', 'Availability windows', 'Calendar sync']
    },
    {
      id: 'telehealth',
      shortName: 'Telehealth',
      title: 'Telehealth',
      icon: Video,
      color: '#0284C7',
      badge: 'Secure Video Sessions',
      desc: 'Conduct secure online consultations directly through MantraPractice without switching between different tools.',
      highlights: ['1-click HD video join', 'Screen sharing', 'In-session notes']
    },
    {
      id: 'billing',
      shortName: 'Billing & Payments',
      title: 'Billing & Payments',
      icon: CreditCard,
      color: '#D97706',
      badge: 'Instant Invoicing',
      desc: 'Create invoices, collect payments, and keep your practice finances organized from one dashboard.',
      highlights: ['Credit card processing', 'Superbill generation', 'Financial reports']
    },
    {
      id: 'insurance',
      shortName: 'Insurance',
      title: 'Insurance & Credentialing',
      icon: ShieldCheck,
      color: '#059669',
      badge: 'Claims Support',
      desc: 'Manage insurance-related workflows and get support with credentialing and claims where available.',
      highlights: ['Eligibility verification', 'Claim tracking', 'Credentialing help']
    },
    {
      id: 'analytics',
      shortName: 'Analytics',
      title: 'Practice Analytics',
      icon: BarChart3,
      color: '#7C6CFF',
      badge: 'Live Metrics',
      desc: 'See revenue, appointments, client activity, and other key practice metrics in one place.',
      highlights: ['Client retention metrics', 'Revenue tracking', 'Session stats']
    },
    {
      id: 'forms',
      shortName: 'Assessments & Forms',
      title: 'Assessments, Forms & Resources',
      icon: FileCheck2,
      color: '#EC4899',
      badge: 'Digital Intake',
      desc: 'Use digital assessments, intake forms, consent forms, and other resources to streamline the client journey.',
      highlights: ['Paperless intake', 'Clinical assessments', 'Digital signatures']
    },
    {
      id: 'portal',
      shortName: 'Client Portal',
      title: 'Client Portal',
      icon: MessageSquare,
      color: '#8B5CF6',
      badge: 'Self-Service Portal',
      desc: 'Make it easier for clients to access appointments, forms, communication, and other important information from one place.',
      highlights: ['Secure client messaging', 'Self-service booking', 'Document sharing']
    }
  ];

  const activeCapability = capabilities[activeCapabilityIndex];
  const ActiveIcon = activeCapability.icon;

  const growthBenefits = [
    { num: '01', title: 'Manage more clients', desc: 'Manage more clients without adding administrative work' },
    { num: '02', title: 'Automate reminders', desc: 'Reduce missed appointments with automated reminders' },
    { num: '03', title: 'Organize clinical info', desc: 'Keep clinical information organized in one place' },
    { num: '04', title: 'Simplify client access', desc: 'Make it easier for clients to book and communicate with you' },
    { num: '05', title: 'Online payments', desc: 'Accept online payments seamlessly' },
    { num: '06', title: 'Care delivery', desc: 'Deliver care online directly through telehealth' },
    { num: '07', title: 'Performance tracking', desc: 'Track your practice performance with live analytics' },
    { num: '08', title: 'Client discovery', desc: 'Discover new client opportunities through Mantra' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FAFCFF 0%, #F0F7FF 100%)',
        color: '#0F172A',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingBottom: '64px'
      }}
    >
      {/* PRESERVED TOP NAVIGATION HEADER */}
      <Header
        title="One Platform for Your Entire Practice"
        onBack={onBack}
        progress={lessonProgress}
        points={REWARD_POINTS}
      />

      <main
        style={{
          maxWidth: '1120px',
          width: '92%',
          margin: '0 auto',
          padding: isMobile ? '16px 8px' : '36px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '36px' : '56px'
        }}
      >
        {/* ==================================================================== */}
        {/* 1. HERO SECTION */}
        {/* ==================================================================== */}
        <section
          style={{
            background: '#FFFFFF',
            borderRadius: isMobile ? '18px' : '28px',
            border: '1px solid rgba(0, 111, 245, 0.16)',
            padding: isMobile ? '20px 16px' : '40px 40px',
            boxShadow: '0 12px 36px -12px rgba(0, 111, 245, 0.12)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
            gap: isMobile ? '24px' : '36px',
            alignItems: 'center'
          }}
        >
          {/* Hero Left Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '999px',
                background: '#E0F2FE',
                color: '#0284C7',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                width: 'fit-content'
              }}
            >
              <Sparkles size={13} /> MANTRAPRACTICE
            </div>

            <h1
              style={{
                fontSize: isMobile ? '1.85rem' : '3.1rem',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: 0
              }}
            >
              Your Practice.<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #006FF5 0%, #4F46E5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                One Platform.
              </span><br />
              Free to Start.
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p
                style={{
                  fontSize: isMobile ? '0.94rem' : '1.02rem',
                  color: '#1E293B',
                  lineHeight: 1.5,
                  fontWeight: 600,
                  margin: 0
                }}
              >
                Everything you need to run your practice, now available free with Mantra.
              </p>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  margin: 0
                }}
              >
                Already a provider on Mantra? You can use MantraPractice at no cost for core practice-management features.
              </p>
            </div>

            {/* Small capability pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
              {['EHR', 'Scheduling', 'Telehealth', 'Billing', 'Payments', 'Client Portal'].map((cap) => (
                <span
                  key={cap}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#006FF5',
                    background: '#F0F7FF',
                    border: '1px solid rgba(0, 111, 245, 0.2)',
                    padding: '4px 10px',
                    borderRadius: '999px'
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>

            {/* Hero Supporting Message */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid rgba(0, 111, 245, 0.15)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginTop: '4px'
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.45 }}>
                Manage your clients, appointments, clinical records, telehealth sessions, payments, and more, all from one secure platform.
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} /> No separate software. No complicated setup.
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Clean Light SaaS Mockup */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: isMobile ? '16px' : '22px',
              border: '1px solid rgba(0, 111, 245, 0.2)',
              boxShadow: '0 16px 40px -12px rgba(0, 111, 245, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#006FF5', marginLeft: '4px' }}>MANTRAPRACTICE OS</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '999px', border: '1px solid #A7F3D0', whiteSpace: 'nowrap' }}>
                ● Active System
              </span>
            </div>

            {/* Dashboard Mock Body */}
            <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.04em' }}>TODAY'S PRACTICE SUMMARY</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '8px 6px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>12</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>Appointments</div>
                </div>
                <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '8px 6px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>8</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>Active Clients</div>
                </div>
                <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '8px 6px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>$1,240</div>
                  <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 600 }}>Revenue</div>
                </div>
              </div>

              {/* Status Modules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
                {[
                  { module: 'EHR & Documentation', icon: Stethoscope },
                  { module: 'Smart Calendar', icon: Calendar },
                  { module: 'Telehealth Sessions', icon: Video },
                  { module: 'Billing & Invoicing', icon: CreditCard }
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.module} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.74rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ItemIcon size={13} color="#006FF5" />
                        <span style={{ color: '#1E293B', fontWeight: 700 }}>{item.module}</span>
                      </div>
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>✓ Active</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ==================================================================== */}
        {/* 2. PROBLEM / SOLUTION TRANSFORMATION (HIGH-IMPACT BEFORE VS AFTER) */}
        {/* ==================================================================== */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px'
          }}
        >
          <div style={{ maxWidth: '660px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.08em' }}>
              THE PROBLEM & SOLUTION
            </div>
            <h2
              style={{
                fontSize: isMobile ? '1.45rem' : '2.1rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Stop Managing Your Practice Across Multiple Tools
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: '#334155',
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0
              }}
            >
              You shouldn't need one tool for your EHR, another for video calls, another for scheduling, another for payments, and another for client communication. MantraPractice brings it together in one platform.
            </p>
          </div>

          {/* SIDE-BY-SIDE TRANSFORMATION CANVAS */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1.1fr',
              gap: isMobile ? '16px' : '20px',
              alignItems: 'center'
            }}
          >
            {/* BEFORE CARD */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
                borderRadius: '20px',
                border: '1px solid #FECDD3',
                padding: '22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#E11D48', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  BEFORE MANTRAPRACTICE
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#BE123C', background: '#FFE4E6', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  Disconnected
                </span>
              </div>

              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#881337', margin: 0 }}>
                6 Disconnected Software Tools
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { name: 'EHR Tool', icon: Stethoscope },
                  { name: 'Scheduling App', icon: Calendar },
                  { name: 'Video App', icon: Video },
                  { name: 'Billing Portal', icon: CreditCard },
                  { name: 'Payment Processor', icon: Zap },
                  { name: 'Paper Intake', icon: MessageSquare }
                ].map((t) => {
                  const TIcon = t.icon;
                  return (
                    <div
                      key={t.name}
                      style={{
                        padding: '8px 10px',
                        background: '#FFFFFF',
                        border: '1px solid #FDA4AF',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#9F1239',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <TIcon size={13} color="#E11D48" />
                      {t.name}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.76rem', color: '#9F1239', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px', borderTop: '1px solid #FECDD3' }}>
                <XCircle size={14} color="#E11D48" style={{ flexShrink: 0 }} /> Multiple logins, higher monthly costs, scattered data
              </div>
            </div>

            {/* TRANSFORM ARROW */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#006FF5', padding: isMobile ? '6px 0' : '0 8px' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#E0F2FE',
                  border: '1px solid #38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 111, 245, 0.15)'
                }}
              >
                {isMobile ? <ArrowDown size={18} color="#006FF5" /> : <ArrowRight size={18} color="#006FF5" />}
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                CONVERGES INTO
              </span>
            </div>

            {/* AFTER CARD */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%)',
                borderRadius: '20px',
                border: '2px solid #006FF5',
                padding: '22px 20px',
                boxShadow: '0 12px 32px -8px rgba(0, 111, 245, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  AFTER MANTRAPRACTICE
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '6px', border: '1px solid #A7F3D0', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} color="#059669" /> 1 Unified Platform
                </span>
              </div>

              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Everything Connected in One Place
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { name: 'EHR & Records', icon: Stethoscope },
                  { name: 'Smart Scheduling', icon: Calendar },
                  { name: 'HD Telehealth', icon: Video },
                  { name: 'Billing & Payments', icon: CreditCard },
                  { name: 'Insurance Claims', icon: ShieldCheck },
                  { name: 'Client Portal', icon: MessageSquare }
                ].map((t) => {
                  const TIcon = t.icon;
                  return (
                    <div
                      key={t.name}
                      style={{
                        padding: '8px 10px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(0, 111, 245, 0.25)',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <TIcon size={13} color="#006FF5" />
                      {t.name}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
                <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0 }} /> Single login, zero extra fees, 100% synchronized
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 3. EVERYTHING YOU NEED */}
        {/* ==================================================================== */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ fontSize: isMobile ? '1.4rem' : '2.0rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Everything You Need to Run Your Practice
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
              Manage your clients, appointments, clinical records, telehealth sessions, payments, and more, all from one secure platform.
            </p>
          </div>

          {/* FLEX-WRAP WRAPPING TABS */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {capabilities.map((cap, idx) => {
              const isSelected = idx === activeCapabilityIndex;
              const CapIcon = cap.icon;
              return (
                <button
                  key={cap.id}
                  onClick={() => setActiveCapabilityIndex(idx)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: isSelected ? `2px solid ${cap.color}` : '1px solid #CBD5E1',
                    background: isSelected ? '#FFFFFF' : '#F8FAFC',
                    color: isSelected ? cap.color : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isSelected ? '0 4px 14px rgba(0, 111, 245, 0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CapIcon size={14} color={isSelected ? cap.color : '#64748B'} />
                  <span>{cap.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* HIGH-CONTRAST FEATURED SHOWCASE CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCapability.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: isMobile ? '20px 16px' : '32px 36px',
                border: `2px solid ${activeCapability.color}`,
                boxShadow: '0 12px 36px -8px rgba(0, 111, 245, 0.12)',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Feature Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: activeCapability.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${activeCapability.color}35`,
                      flexShrink: 0
                    }}
                  >
                    <ActiveIcon size={22} color="#FFFFFF" />
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: activeCapability.color,
                        background: `${activeCapability.color}15`,
                        padding: '3px 10px',
                        borderRadius: '999px'
                      }}
                    >
                      {activeCapability.badge}
                    </span>
                    <h3 style={{ fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: 800, color: '#0F172A', margin: '4px 0 0 0' }}>
                      {activeCapability.title}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.94rem', color: '#1E293B', lineHeight: 1.55, margin: 0, fontWeight: 600 }}>
                  {activeCapability.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                  {activeCapability.highlights.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#0F172A', fontWeight: 700 }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} /> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live OS Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F0F7FF 100%)',
                  borderRadius: '18px',
                  padding: '22px 20px',
                  border: '1px solid rgba(0, 111, 245, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  textAlign: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.04em' }}>
                  BUILT INTO MANTRAPRACTICE OS
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                  {activeCapability.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800, background: '#ECFDF5', padding: '6px 14px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
                  ✓ Core Feature Included Free
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ==================================================================== */}
        {/* 4. BUILT TO HELP YOU GROW */}
        {/* ==================================================================== */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ fontSize: isMobile ? '1.4rem' : '2.0rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Built to Help You Grow
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
              MantraPractice doesn't just help you manage your practice, it helps you run it more efficiently and create a better client experience.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '14px'
            }}
          >
            {growthBenefits.map((item) => (
              <div
                key={item.num}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#006FF5',
                    background: '#E0F2FE',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    flexShrink: 0
                  }}
                >
                  {item.num}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>{item.title}</div>
                  <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.45, fontWeight: 500 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 5. MANTRA PROFILE + PRACTICE WORKING TOGETHER */}
        {/* ==================================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, #F0F7FF 0%, #EEF2FF 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(0, 111, 245, 0.2)',
            padding: isMobile ? '24px 16px' : '40px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.08em' }}>
              WORKING TOGETHER
            </div>
            <h2 style={{ fontSize: isMobile ? '1.4rem' : '2.0rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Your Mantra Profile + Your Practice
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
              MantraPractice helps you manage the clients you already have. Your Mantra provider profile helps you discover new ones. Use both together to build and grow your practice on Mantra.
            </p>
          </div>

          {/* Clean Flow */}
          <div
            style={{
              width: '100%',
              maxWidth: '880px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            {[
              { title: 'YOUR MANTRA PROFILE', sub: 'Get discovered' },
              { title: 'NEW CLIENTS', sub: 'Expand reach' },
              { title: 'MANTRAPRACTICE', sub: 'Manage your practice' },
              { title: 'BETTER CARE', sub: 'Deliver excellence' }
            ].map((step, index) => (
              <React.Fragment key={step.title}>
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 111, 245, 0.2)',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    flex: 1,
                    width: isMobile ? '100%' : 'auto',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0, 111, 245, 0.05)'
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#006FF5', letterSpacing: '0.04em' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    ↓ {step.sub}
                  </div>
                </div>
                {index < 3 && !isMobile && (
                  <ArrowRight size={18} color="#006FF5" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* 6. FREE FOR MANTRA PROVIDERS */}
        {/* ==================================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1px solid #10B981',
            borderRadius: '24px',
            padding: isMobile ? '24px 18px' : '32px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 6px 20px -4px rgba(16, 185, 129, 0.12)'
          }}
        >
          <span
            style={{
              padding: '4px 14px',
              borderRadius: '999px',
              background: '#059669',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em'
            }}
          >
            FREE FOR MANTRA PROVIDERS
          </span>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
            Start Using MantraPractice Today
          </h2>

          <p style={{ fontSize: '0.88rem', color: '#047857', margin: 0, fontWeight: 600, maxWidth: '620px', lineHeight: 1.55 }}>
            Already listed on Mantra? Your core MantraPractice features are free. You can start using MantraPractice to manage your practice without paying for basic practice-management tools.
          </p>
        </section>

        {/* ==================================================================== */}
        {/* 7. FINAL CTA */}
        {/* ==================================================================== */}
        <section
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E0F2FE 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(0, 111, 245, 0.25)',
            padding: isMobile ? '32px 20px' : '48px 44px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 32px -6px rgba(0, 111, 245, 0.12)'
          }}
        >
          <h2 style={{ fontSize: isMobile ? '1.45rem' : '2.1rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Ready to Manage Your Practice?
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#334155', margin: 0, fontWeight: 600, maxWidth: '520px', lineHeight: 1.55 }}>
            Start adding your clients to MantraPractice and bring your practice workflows together in one place.
          </p>

          {completionError && (
            <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, background: '#FEF2F2', padding: '6px 14px', borderRadius: '8px' }}>
              {completionError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', paddingTop: '8px', width: '100%' }}>
            {/* Action Buttons Row */}
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              {/* Primary CTA: Mark Activity as Completed */}
              <button
                onClick={handleMarkCompleted}
                disabled={isSubmitting}
                style={{
                  padding: '15px 36px',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #006FF5 0%, #0056C6 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 25px -4px rgba(0, 111, 245, 0.35)',
                  opacity: isSubmitting ? 0.85 : 1,
                  transition: 'all 0.2s ease',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Completing Activity...
                  </>
                ) : (
                  <>
                    Mark Activity as Completed <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Secondary CTA: Start Adding Clients */}
              <button
                onClick={handleStartAddingClients}
                disabled={isSubmitting}
                style={{
                  padding: '14px 32px',
                  borderRadius: '999px',
                  border: '1.5px solid #006FF5',
                  background: '#FFFFFF',
                  color: '#006FF5',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0, 111, 245, 0.08)',
                  transition: 'all 0.2s ease',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Start Adding Clients <ArrowRight size={18} />
              </button>
            </div>

            {/* Small Supporting Text */}
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B' }}>
              Complete the activity to earn your points, or start adding clients now.
            </span>
          </div>
        </section>
      </main>

      {/* PRESERVED CELEBRATION OVERLAY & POINTS COMPLETION */}
      {showCelebrate && (
        <CompletionScreen
          lessonId={LESSON_ID}
          points={REWARD_POINTS}
          rewardPoints={REWARD_POINTS}
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
