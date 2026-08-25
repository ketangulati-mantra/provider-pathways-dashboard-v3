import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button,
} from '../components';
import { CheckCircle2, Clock, Award, FileText, ClipboardList, Save, Activity, FolderOpen, User, Calendar, Plus, AlignLeft } from 'lucide-react';

const LESSON_ID = 'session-notes';
const LESSON_TITLE = 'Session Notes';
const REWARD_POINTS = 5;

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Choose the Right Template',
    description: 'Select from therapy note templates such as CBT, Psychodynamic, Solution-Focused, and other supported approaches.'
  },
  {
    icon: FileText,
    title: 'Document the Session',
    description: 'Record client progress, observations, goals, interventions, and follow-up plans using guided fields.'
  },
  {
    icon: Save,
    title: 'Save Securely',
    description: 'All session notes are securely stored and remain available for future sessions and treatment continuity.'
  },
  {
    icon: Activity,
    title: 'Track Progress',
    description: 'Review previous notes over time to monitor therapeutic outcomes and maintain consistent care.'
  }
];

export default function TherapyNotesLessonPage({ onBack }) {
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
            Therapy Documentation
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Learn how to document client sessions using structured therapy note templates to maintain accurate records and improve continuity of care.
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
              onClick={() => setActiveTab('features')}
              style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none',
                background: activeTab === 'features' ? '#fff' : 'transparent',
                color: activeTab === 'features' ? 'var(--color-primary)' : '#64748b',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeTab === 'features' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Features
            </button>
          </div>
        </div>

        {activeTab === 'how-it-works' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'center' }}>

            {/* LEFT: Instructions */}
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '32px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#f0f9ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderOpen size={20} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>
                  Accessing Session Notes
                </h2>
              </div>
              <ol style={{ margin: 0, paddingLeft: '24px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Open the <strong>Clients</strong> section in your portal.</li>
                <li>Select the specific client profile.</li>
                <li>Navigate to the <strong>Notes / Treatment</strong> tab.</li>
                <li>Choose the relevant session date from the timeline.</li>
                <li>Click <strong>Add Notes</strong> to begin documenting.</li>
              </ol>
            </div>

            {/* RIGHT: Notes UI Image */}
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
              <img 
                src="https://res.cloudinary.com/hxbamdqf/image/upload/v1784890504/Screenshot_2026-07-24_162330_qedzqb.png" 
                alt="Session Note UI Mockup" 
                style={{ width: '100%', height: 'auto', borderRadius: '12px' }} 
              />
            </div>

          </div>
        )}

        {activeTab === 'features' && (
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
              You now understand how to document client sessions and track therapeutic progress.
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
