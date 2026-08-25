import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header, SubmissionForm
} from '../components';
import { 
  Users, Share2, UserCheck, Mail, Award, Clock, ChevronDown, ChevronUp, Lightbulb, UserPlus, Headset, PhoneCall, School, Heart
} from 'lucide-react';

const LESSON_ID = 'recruit-interns';
const LESSON_TITLE = 'Help Recruit New Therapy Interns & Listeners';
const REWARD_POINTS = 10;

const WHO_TO_REFER = [
  { icon: UserPlus, title: 'Therapy Interns' },
  { icon: Headset, title: 'Listeners' },
  { icon: PhoneCall, title: 'Hotline Volunteers' },
  { icon: School, title: 'Campus Ambassadors' },
  { icon: Heart, title: 'Fundraising Partners' }
];

const STEPS = [
  {
    icon: Share2,
    title: 'Invite Someone',
    content: 'Share your referral or registration link with students or graduates interested in mental health.'
  },
  {
    icon: UserCheck,
    title: 'They Register',
    content: 'Ensure they complete their registration on MantraCare using your referral link.'
  },
  {
    icon: Mail,
    title: 'Inform Mantra by Email',
    content: 'Email provider@mantra.care from your registered email ID with: Referral Name, Registered Email, and supporting details.'
  },
  {
    icon: Award,
    title: 'Earn Credits',
    content: 'Credits and provider engagement points are awarded once registration is successfully verified by our clinical team.'
  }
];

export default function RecruitInternsLessonPage({ onBack }) {
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
            REFERRAL PROGRAM
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--text-main)', margin: '0 0 12px' }}>
            {LESSON_TITLE}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: '0 auto 16px', lineHeight: '1.5', maxWidth: '650px' }}>
            Help grow Mantra's mental health impact by inviting passionate therapy interns, listeners, and hotline volunteers to join our mission.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span className="overview-meta-badge"><Clock size={12} /><span>5 min task</span></span>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
          
          {/* LEFT: Accordion Steps & Referral Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Who can you refer? Chips */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #eef0f3', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="var(--color-primary)" /> Who Can You Refer?
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {WHO_TO_REFER.map((item, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px' }}>
                    <item.icon size={13} color="var(--color-primary)" />
                    {item.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Accordion Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', margin: '4px 0' }}>
                How it works
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

          {/* RIGHT: Submission Form & Pro Tip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #eef0f3', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <SubmissionForm 
                lessonId={LESSON_ID}
                activityTitle={LESSON_TITLE}
                submissionType="recruit_interns_proof"
                onSuccess={handleActionComplete} 
                title="Submit Referral Proof" 
                successTitle="Proof Submitted Successfully" 
                successMessage="Your referral details have been submitted. Credits will automatically credit to your profile after clinical verification." 
                buttonText="Submit Proof"
              />
            </div>

            <div style={{ background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', padding: '18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }}>
                <Lightbulb size={22} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#15803d' }}>Earn Bonus Points</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: '1.5' }}>
                  Share the internship program on LinkedIn, Instagram, or Facebook to encourage more applicants and boost your provider score!
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
