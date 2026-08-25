import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, Button,
} from '../components';
import { CheckCircle2, Clock, Award, ClipboardList, PenTool, Sliders, Send, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

const LESSON_ID     = 'yoga-routine';
const LESSON_TITLE  = 'Create a Personalized Yoga Routine for Different Client Needs';
const REWARD_POINTS = 5;

const STEPS = [
  {
    icon: ClipboardList,
    title: 'Assess Client Needs',
    content: (
      <>
        <p style={{ margin: '0 0 12px' }}>Understand the client's goals and current condition before creating a routine.</p>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#475569' }}>Common objectives include:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {['Stress management', 'Flexibility', 'Back pain relief', 'Weight management', 'Strength building', 'Better posture', 'Improved mobility'].map((tag, i) => (
            <span key={i} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          * Also consider injuries, medical conditions, age, and physical limitations.
        </p>
      </>
    )
  },
  {
    icon: PenTool,
    title: 'Plan the Yoga Routine',
    content: (
      <>
        <p style={{ margin: '0 0 12px' }}>Create a structured routine that includes the following core elements:</p>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#475569', fontSize: '0.9rem' }}>
          <li>Routine name and objective</li>
          <li>Warm-up sequence</li>
          <li>Main yoga poses with duration/repetitions</li>
          <li>Modifications for beginners or limitations</li>
          <li>Breathing exercises (Pranayama)</li>
          <li>Relaxation / cool-down (Savasana)</li>
          <li>Weekly practice frequency</li>
        </ul>
      </>
    )
  },
  {
    icon: Sliders,
    title: 'Personalize for the Client',
    content: (
      <>
        <p style={{ margin: '0 0 12px' }}>Adjust the routine based on individual client factors to ensure safety and effectiveness:</p>
        <ul style={{ margin: '0 0 16px', paddingLeft: '20px', lineHeight: '1.8', color: '#475569', fontSize: '0.9rem' }}>
          <li>Experience level</li>
          <li>Fitness level</li>
          <li>Existing injuries</li>
          <li>Pregnancy (if applicable)</li>
          <li>Lifestyle</li>
          <li>Time available each day</li>
        </ul>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', color: '#166534' }}>
          <strong>Pro Tip:</strong> The more personalized the routine, the better the client's adherence and outcomes.
        </div>
      </>
    )
  },
  {
    icon: Send,
    title: 'Share with the Client',
    content: (
      <>
        <p style={{ margin: '0 0 12px' }}>Send the completed yoga routine through the MantraCare chat.</p>
        <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#475569' }}>This allows clients to:</p>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8', color: '#475569', fontSize: '0.9rem' }}>
          <li>View the routine anytime from their device</li>
          <li>Follow each session sequentially</li>
          <li>Save it for future practice</li>
          <li>Refer back whenever needed</li>
        </ul>
      </>
    )
  },
  {
    icon: TrendingUp,
    title: 'Monitor Progress',
    content: (
      <>
        <p style={{ margin: '0 0 12px' }}>Encourage clients to regularly share feedback to keep the routine optimal:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>✓ Progress updates</div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>✓ General feedback</div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>✓ Pain or discomfort</div>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>✓ Pose questions</div>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          Update the routine whenever their goals or condition changes.
        </p>
      </>
    )
  }
];

export default function YogaRoutineLessonPage({ onBack }) {

  const { 
    lessonProgress, handleActionComplete,
    actionDone
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  const [activeAccordion, setActiveAccordion] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={onBack} progress={lessonProgress} />

      <main className="academy-main-container" style={{
        flex: 1, padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)', background: '#f0f9ff', borderRadius: '4px', padding: '4px 10px', marginBottom: '12px' }}>
            CARE PLANNING
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Learn how to design personalized yoga routines tailored to each client's goals, physical condition, and wellness journey. Well-structured routines improve client engagement and long-term outcomes.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>3-5 min read</span></span>
          </div>
        </div>

        {/* Steps Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map((step, idx) => {
            const isActive = activeAccordion === idx;
            return (
              <div 
                key={idx}
                style={{ 
                  background: '#fff', 
                  borderRadius: '16px', 
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid #eef0f3', 
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', 
                  overflow: 'hidden', 
                  transition: 'all 0.2s', 
                  cursor: 'pointer' 
                }}
                onClick={() => setActiveAccordion(isActive ? -1 : idx)}
              >
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isActive ? '#f0f9ff' : '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '10px', 
                      background: isActive ? 'var(--color-primary)' : '#f8fafc', 
                      color: isActive ? '#fff' : 'var(--color-primary)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s', flexShrink: 0
                    }}>
                      <step.icon size={18} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, margin: 0, color: isActive ? 'var(--color-primary)' : '#334155' }}>
                      Step {idx + 1}: {step.title}
                    </h3>
                  </div>
                  {isActive ? <ChevronUp size={20} color="var(--color-primary)" /> : <ChevronDown size={20} color="#9ca3af" />}
                </div>
                
                {isActive && (
                  <div style={{ padding: '0 20px 20px 20px', background: '#fff' }}>
                    <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {step.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion card */}
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
                You now know how to design personalized yoga routines tailored to each client's goals.
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
            <span>{actionDone ? 'Complete' : 'Mark Lesson as Complete'}</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
