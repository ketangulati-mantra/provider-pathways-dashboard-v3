import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, QuizCard
} from '../components';
import { 
  Award, Clock, ChevronDown, ChevronUp, Lightbulb, Link, UserCheck, Mail, ShieldCheck,
  Brain, Stethoscope, Salad, Heart, Dumbbell, UserPlus, Activity, PlusSquare, Share2
} from 'lucide-react';

const LESSON_ID = 'refer-provider';
const LESSON_TITLE = 'Refer a Provider & Earn Rewards';
const REWARD_POINTS = 20;

const CATEGORIES = [
  { icon: Brain, title: 'Therapists & Counselors' },
  { icon: Stethoscope, title: 'Clinical Psychologists' },
  { icon: Salad, title: 'Dietitians & Nutritionists' },
  { icon: Heart, title: 'Yoga & Wellness Experts' },
  { icon: Dumbbell, title: 'Fitness Coaches' },
  { icon: UserPlus, title: 'Doctors' },
  { icon: Activity, title: 'Physiotherapists' },
  { icon: PlusSquare, title: 'Allied Health' }
];

const STEPS = [
  {
    icon: Link,
    title: 'Invite a Provider',
    content: 'Share the official MantraCare provider onboarding link with qualified healthcare or wellness professionals.'
  },
  {
    icon: UserCheck,
    title: 'Provider Registers',
    content: 'Ensure the provider completes their registration on MantraCare using your referral link.'
  },
  {
    icon: Mail,
    title: 'Send Details by Email',
    content: 'Email provider@mantra.care from your registered email with: Referred Provider Name and Registered Email Address.'
  },
  {
    icon: ShieldCheck,
    title: 'Verification',
    content: 'Our provider operations team verifies the new provider registration.'
  },
  {
    icon: Award,
    title: 'Earn 20 Points',
    content: '20 Mantra Points are automatically credited to your provider profile after successful verification.'
  }
];

const QUIZ_QUESTIONS = [
  {
    question: 'When are the 20 Mantra Points awarded for a successful provider referral?',
    options: [
      { text: 'Immediately after sending the referral email', isCorrect: false },
      { text: 'After the referred provider completes 10 sessions', isCorrect: false },
      { text: 'After the referred provider completes registration and the referral is verified', isCorrect: true },
      { text: 'As soon as the provider clicks the link', isCorrect: false }
    ],
    explanation: 'Points are awarded only after successful registration, verification by the Mantra team, and correct submission of referral details.'
  },
  {
    question: 'Which information should you include in your referral email?',
    options: [
      { text: 'A screenshot of their LinkedIn profile', isCorrect: false },
      { text: 'Your current points balance', isCorrect: false },
      { text: 'The referred provider\'s full name and registered email address', isCorrect: true },
      { text: 'A list of potential clients', isCorrect: false }
    ],
    explanation: 'You must provide the referred provider\'s full name and registered email address so our team can accurately match and verify your referral.'
  }
];

export default function ReferProviderLessonPage({ onBack }) {
  const { 
    lessonProgress, handleQuizComplete,
    handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: true,
    hasAction: false
  });

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '24px', maxWidth: '1000px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', background: '#f0f9ff', borderRadius: '4px', padding: '4px 10px', marginBottom: '12px' }}>
            REFERRAL PROGRAM
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Help grow the Mantra provider network by inviting fellow therapists, doctors, dietitians, or coaches and earn 20 Points per verified referral.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3 min task</span></span>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordion Steps & Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Categories */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #eef0f3', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={16} color="var(--color-primary)" /> Who Can You Refer?
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CATEGORIES.map((cat, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px' }}>
                    <cat.icon size={13} color="var(--color-primary)" />
                    {cat.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Accordion Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', margin: '4px 0' }}>
                How to refer
              </h2>
              {STEPS.map((s, idx) => {
                const isOpen = activeStep === idx;
                const Icon = s.icon;
                return (
                  <div 
                    key={idx}
                    style={{ 
                      background: '#fff', borderRadius: '14px', border: isOpen ? '1px solid var(--color-primary)' : '1px solid #eef0f3', 
                      boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'
                    }}
                    onClick={() => setActiveStep(isOpen ? -1 : idx)}
                  >
                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isOpen ? '#f0f9ff' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', background: isOpen ? 'var(--color-primary)' : '#f1f5f9',
                          color: isOpen ? '#fff' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Icon size={16} />
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', fontWeight: 700, margin: 0, color: isOpen ? 'var(--color-primary)' : '#334155' }}>
                          Step {idx + 1}: {s.title}
                        </h3>
                      </div>
                      {isOpen ? <ChevronUp size={18} color="var(--color-primary)" /> : <ChevronDown size={18} color="#9ca3af" />}
                    </div>
                    
                    {isOpen && (
                      <div style={{ padding: '14px 18px 18px', borderTop: '1px solid #eef0f3', background: '#fff' }}>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{s.content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT: Quiz & Callout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <QuizCard 
              id={LESSON_ID}
              questions={QUIZ_QUESTIONS}
              onComplete={handleQuizComplete}
              isCompleted={lessonProgress === 100}
              isMulti={true}
            />

            <div style={{ background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', padding: '18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }}>
                <Lightbulb size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#1e40af' }}>Referral Email Tip</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                  Always email <strong>provider@mantra.care</strong> with the full name and registered email of the provider you referred so we can attribute your +20 Points reward accurately.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
