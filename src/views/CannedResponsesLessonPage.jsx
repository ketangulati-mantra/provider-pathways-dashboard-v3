import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button,
} from '../components';
import { CheckCircle2, Clock, Award, MessageCircle, ClipboardCheck, DollarSign, Link, Sparkles, Send, Bot, User } from 'lucide-react';

const LESSON_ID     = 'canned-responses';
const LESSON_TITLE  = 'Mantra Auto-Responses (Canned Responses)';
const REWARD_POINTS = 5;

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: 'Assessments',
    description: (
      <>
        Quickly send mental health assessments including:
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Anxiety</li>
          <li>Depression</li>
          <li>Anger</li>
          <li>Relationship assessments</li>
        </ul>
        <p style={{ margin: '8px 0 0' }}>Client results automatically appear in the <strong>Insights</strong> section.</p>
      </>
    )
  },
  {
    icon: DollarSign,
    title: 'Paid Assessments',
    description: (
      <>
        Providers can refer clients for clinical assessments:
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Referral commissions vary based on the specific assessment.</li>
          <li>You can explore referral options at <a href="https://provider.mantracare.com/refer-earn" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>provider.mantracare.com/refer-earn</a>.</li>
        </ul>
      </>
    )
  },
  {
    icon: Link,
    title: 'Other Resources',
    description: (
      <>
        You can instantly share:
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Therapy exercises and worksheets</li>
          <li>Referrals to specialists and wellness services</li>
          <li>Payment links & Renewal links</li>
          <li>Subscription information</li>
          <li>Helpful client resources</li>
        </ul>
      </>
    )
  },
  {
    icon: Sparkles,
    title: 'Benefits',
    description: (
      <>
        Using canned responses helps you:
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Save time replying to common questions</li>
          <li>Deliver consistent information</li>
          <li>Share resources in one click</li>
          <li>Improve the client communication experience</li>
        </ul>
      </>
    )
  }
];

export default function CannedResponsesLessonPage({ onBack }) {

  const { actionDone, lessonProgress, handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [activeTab, setActiveTab] = useState('how-it-works');

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
            CHAT TOOLS
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Learn how to use Mantra's built-in canned responses to quickly send helpful resources, assessments, referrals, exercises, and payment links to clients.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>2 min read</span></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '12px', padding: '4px', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('how-it-works')}
              style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none',
                background: activeTab === 'how-it-works' ? '#fff' : 'transparent',
                color: activeTab === 'how-it-works' ? 'var(--color-primary)' : '#64748b',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeTab === 'how-it-works' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none',
                background: activeTab === 'benefits' ? '#fff' : 'transparent',
                color: activeTab === 'benefits' ? 'var(--color-primary)' : '#64748b',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeTab === 'benefits' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Options & Benefits
            </button>
          </div>
        </div>

        {activeTab === 'how-it-works' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>
            
            {/* LEFT: Instructions */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#f0f9ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={20} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>
                  Accessing Auto-Responses
                </h2>
              </div>
              <ol style={{ margin: 0, paddingLeft: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Open the <strong>Chats</strong> section in your provider portal.</li>
                <li>Select the client conversation you want to reply to.</li>
                <li>Click the <strong>Canned Response / Zap</strong> button in the bottom-right corner of the chat window.</li>
                <li>Choose the specific response, assessment, or resource you want to send.</li>
              </ol>
            </div>

            {/* RIGHT: Image Mockup */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
              <img 
                src="https://res.cloudinary.com/hxbamdqf/image/upload/v1784700295/canned_responses_uqlnhp.png" 
                alt="Canned Responses UI Mockup" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }} 
              />
            </div>

          </div>
        )}

        {activeTab === 'benefits' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: '#f0f9ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <feature.icon size={20} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', margin: 0 }}>
                  {feature.title}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completion card */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #eef0f3', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 4px' }}>
              You're all set!
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              You now know how to quickly send automated resources and assessments to clients.
            </p>
          </div>
          <Button
            className="academy-btn-full"
            variant="primary"
            onClick={handleActionComplete}
            disabled={actionDone}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <CheckCircle2 size={16} />
            <span>{actionDone ? 'Complete' : 'Mark Lesson as Complete'}</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
