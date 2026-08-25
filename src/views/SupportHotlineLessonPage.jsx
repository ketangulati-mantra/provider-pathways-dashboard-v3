import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, InterestForm
} from '../components';
import { 
  Headset, HeartHandshake, PhoneCall, GraduationCap, ShieldCheck, 
  MessageSquare, UserCheck, PlayCircle, Clock, Award, ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';

const LESSON_ID = 'support-hotline';
const LESSON_TITLE = 'Support Our Mental Health Hotline';
const REWARD_POINTS = 5;

const RESPONSIBILITIES = [
  { icon: Headset, title: 'Active Listening' },
  { icon: PhoneCall, title: 'Crisis De-escalation' },
  { icon: HeartHandshake, title: 'Resource Navigation' }
];

const STEPS = [
  {
    icon: UserCheck,
    title: 'Application Review',
    content: 'Our clinical team reviews your background and provider profile.'
  },
  {
    icon: PlayCircle,
    title: 'Training Module',
    content: 'Complete a 2-hour mandatory crisis intervention training video at your own pace.'
  },
  {
    icon: MessageSquare,
    title: 'Shadowing Sessions',
    content: 'Listen in on 3 live hotline calls with a senior responder for practical guidance.'
  },
  {
    icon: Headset,
    title: 'Active Shift',
    content: 'Take your first live shift with a clinical supervisor on standby for support.'
  }
];

export default function SupportHotlineLessonPage({ onBack }) {
  const { 
    lessonProgress, handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
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
            COMMUNITY INITIATIVE
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Join Mantra's Mental Health Support Hotline and help provide immediate, compassionate emotional support to individuals in distress.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>2 min read</span></span>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Responsibilities & Onboarding Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Key Responsibilities Chips */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #eef0f3', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Headset size={16} color="var(--color-primary)" /> Key Responsibilities
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {RESPONSIBILITIES.map((item, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px' }}>
                    <item.icon size={13} color="var(--color-primary)" />
                    {item.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Accordion Onboarding Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', margin: '4px 0' }}>
                Onboarding Process
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

          {/* RIGHT: Interest Form & Benefits Callout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <InterestForm 
              initiative="Support Hotline" 
              onSuccess={handleActionComplete} 
              title="Apply to be a Responder"
              description="Complete this form to express your interest in joining the hotline team."
            />

            <div style={{ background: '#f3e8ff', borderRadius: '16px', border: '1px solid #e9d5ff', padding: '18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ color: '#9333ea', flexShrink: 0, marginTop: '2px' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#6b21a8' }}>Benefits of Joining</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#7e22ce', lineHeight: '1.5' }}>
                  Earn 5 credits per completed shift, gain supervised crisis communication experience, and make a direct difference in someone's life.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
