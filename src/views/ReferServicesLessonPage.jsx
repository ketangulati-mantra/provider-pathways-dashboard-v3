import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, StepTimeline,
  InfoCallout,
  Button
} from '../components';
import { 
  Brain, Activity, ClipboardList, Leaf, Dumbbell, Compass,
  Search, MessageSquare, CreditCard, Coins, Briefcase, CheckCircle2,
  Gift, ShieldAlert, ArrowRight, ListChecks
} from 'lucide-react';

const LESSON_ID = 'refer-services';
const LESSON_TITLE = 'Refer Other Services & Earn';
const REWARD_POINTS = 10;

const SERVICES_TO_REFER = [
  { icon: Brain, title: 'Psychiatry', description: 'Medication evaluation and psychiatric consultations.' },
  { icon: Activity, title: 'OCD Care', description: 'Structured treatment for OCD and related conditions.' },
  { icon: ClipboardList, title: 'Clinical Assessments', description: 'Diagnostic assessments for better treatment planning.' },
  { icon: Leaf, title: 'Yoga & Mindfulness', description: 'Stress reduction and emotional well-being.' },
  { icon: Dumbbell, title: 'Fitness & Nutrition', description: 'Lifestyle coaching and healthy habit support.' },
  { icon: Compass, title: 'Life Coaching', description: 'Career, confidence and personal growth guidance.' }
];

const TIMELINE = [
  { icon: Search, title: 'Identify Need', description: 'Understand what additional support the client requires.' },
  { icon: MessageSquare, title: 'Recommend Service', description: 'Use Auto-Responses or the Refer & Earn section.' },
  { icon: CreditCard, title: 'Client Purchases', description: 'The client books the recommended service.' },
  { icon: Coins, title: 'Earn Commission', description: 'Receive your referral commission after verification.' }
];

export default function ReferServicesLessonPage({ onBack }) {
  const { 
    lessonProgress, handleActionComplete,
    actionDone
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [activeTab, setActiveTab] = useState('services'); // 'services', 'how-it-works', 'rewards'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '24px 24px 80px', maxWidth: '900px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ 
            display: 'inline-flex', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', 
            color: '#059669', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
            marginBottom: '16px', alignItems: 'center', gap: '6px'
          }}>
            <Briefcase size={14} /> Referral Commission Available
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Help clients access the right holistic care while earning up to 10% referral commissions for successful recommendations.
          </p>
        </div>

        {/* Custom Tab Navigation */}
        <div style={{ 
          display: 'flex', background: '#fff', padding: '8px', borderRadius: '16px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', gap: '8px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'services', label: 'Services to Refer', icon: ListChecks },
            { id: 'how-it-works', label: 'How It Works', icon: ArrowRight },
            { id: 'rewards', label: 'Rewards & Rules', icon: Gift }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: '1 1 200px', padding: '12px 16px', borderRadius: '10px',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#fff' : '#64748b',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div style={{ 
          background: '#fff', borderRadius: '20px', padding: '32px', 
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          minHeight: '400px'
        }}>
          
          {/* TAB 1: SERVICES */}
          {activeTab === 'services' && (
            <div className="animate-fade-in">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 20px', color: '#0f172a' }}>
                Services You Can Refer
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {SERVICES_TO_REFER.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px',
                    background: '#f8fafc', borderRadius: '12px', border: '1px solid #eef2f6',
                    transition: 'all 0.2s', cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                    e.currentTarget.style.background = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#eef2f6';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                  >
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe',
                      color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HOW IT WORKS */}
          {activeTab === 'how-it-works' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 24px', color: '#0f172a' }}>
                  The Referral Process
                </h2>
                <StepTimeline steps={TIMELINE} />
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS & RULES */}
          {activeTab === 'rewards' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Rewards */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Coins size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#166534', margin: 0 }}>
                      Earn Commission
                    </h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '24px', color: '#166534', fontSize: '0.95rem', lineHeight: '1.8', fontWeight: 500 }}>
                    <li>Referral commissions are different for every service</li>
                    <li>Commissions are automatically tracked</li>
                    <li>Boosts your Provider Engagement Score</li>
                  </ul>
                  <Button 
                    onClick={() => window.open('https://provider.mantracare.com/refer-earn', '_blank')}
                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
                  >
                    Explore Referral Options <ArrowRight size={16} />
                  </Button>
                </div>

                {/* When to Refer */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', margin: 0 }}>
                      When to Refer?
                    </h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      'Client requires specialized medication',
                      'Client needs formal diagnostic testing',
                      'Client requests fitness or lifestyle coaching'
                    ].map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', fontSize: '0.95rem' }}>
                        <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                <ShieldAlert size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309', lineHeight: '1.5' }}>
                  <strong>Important:</strong> Commissions are credited only after the referred client's purchase is verified. Only genuine recommendations driven by client needs will qualify.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <section style={{ textAlign: 'center', paddingTop: '10px' }}>
          <Button 
            variant={actionDone ? 'secondary' : 'primary'} 
            onClick={handleActionComplete} 
            disabled={actionDone}
            style={{ padding: '14px 40px', fontSize: '1.05rem', fontWeight: 700 }}
          >
            {actionDone ? 'Lesson Completed' : 'Mark Lesson as Complete'}
          </Button>
        </section>

      </main>
    </div>
  );
}
