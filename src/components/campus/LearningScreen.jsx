import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, ShieldCheck, Award, Sparkles, Send, ChevronRight, Lock, BookOpen, Layers, Clock, FileText, Target, Headphones, Sprout, Building2, Lightbulb } from 'lucide-react';
import { goToDashboard, completeLesson } from '../../mantra';
import { useToast } from '../Toast';
import { CompletionScreen } from '../index';

const MODULE_TEXT_CONTENT = [
  {
    moduleId: 'mod_1_advocacy',
    readTime: '4 min read',
    title: 'Student Mental Health Advocacy',
    subtitle: 'Understanding campus psychological dynamics and advocating for early peer support.',
    keyHighlights: [
      { label: 'Primary Focus', value: 'Peer Advocacy & Early Support', iconType: 'target' },
      { label: 'Estimated Time', value: '4 Min Read', iconType: 'clock' },
      { label: 'Core Objective', value: 'Reduce Campus Stigma', iconType: 'shield' }
    ],
    sections: [
      {
        sectionBadge: 'SECTION 1 • LANDSCAPE & STRESSORS',
        heading: 'The Campus Mental Health Landscape',
        callout: 'Over 60% of university students report experiencing overwhelming anxiety during their academic term.',
        points: [
          'Academic & Competition Pressure: Intense study schedules, exams, and career uncertainty.',
          'Financial & Social Strain: Managing tuition, living costs, and navigating peer relationships.',
          'Transition to Independence: Sleep disruption, lifestyle changes, and distance from family support networks.'
        ]
      },
      {
        sectionBadge: 'SECTION 2 • CORE RESPONSIBILITIES',
        heading: 'Core Responsibilities of a Campus Advocate',
        callout: 'You act as an informed, empathetic guide — bridging the gap between students and professional care.',
        cards: [
          { title: 'Fostering Stigma-Free Spaces', desc: 'Conducting open discussions in dorms and clubs to normalize mental health conversations.' },
          { title: 'Promoting Peer Check-Ins', desc: 'Encouraging students to look out for one another and form supportive study circles.' },
          { title: 'Navigating Care Options', desc: 'Educating students on accessing university counseling, helpline resources, and subsidized care.' }
        ]
      },
      {
        sectionBadge: 'SECTION 3 • DISTRESS SIGNALS',
        heading: 'Identifying Early Indicators of Distress',
        callout: 'Timely support relies on recognizing subtle behavioral shifts early before crises occur.',
        distressSignals: [
          { title: 'Academic Decline', desc: 'Uncharacteristic drop in grades, missed deadlines, or chronic absenteeism.' },
          { title: 'Social Isolation', desc: 'Sudden withdrawal from friend groups, campus clubs, or study sessions.' },
          { title: 'Burnout & Fatigue', desc: 'Visible exhaustion, extreme mood volatility, or neglect of personal care.' }
        ]
      }
    ],
    takeaway: 'As a Campus Advocate, you serve as a compassionate bridge. Your vigilance and empathetic support help students get the help they need early.',
    checklist: [
      'Establish a confidential student listening booth or mental health desk.',
      'Share verified peer-support resources and distress emergency helplines.',
      'Guide students requiring specialized care into subsidized therapy channels.'
    ]
  },
  {
    moduleId: 'mod_2_support',
    readTime: '5 min read',
    title: 'Free Listener Support Protocols',
    subtitle: 'Mastering active listening guidelines, confidentiality limits, and crisis handling.',
    keyHighlights: [
      { label: 'Primary Focus', value: 'Active Listening & Safe Spaces', iconType: 'headphones' },
      { label: 'Estimated Time', value: '5 Min Read', iconType: 'clock' },
      { label: 'Core Objective', value: 'Confidential Crisis Protocol', iconType: 'lock' }
    ],
    sections: [
      {
        sectionBadge: 'SECTION 1 • PEER LISTENER ROLE',
        heading: 'The Role of a Trained Peer Listener',
        callout: 'Peer listening provides an accessible, non-threatening entry point for students hesitant to seek formal therapy.',
        points: [
          'Safe Venting Environment: Listeners offer a calm, non-judgmental space for students to talk freely.',
          'De-escalation First: Helping students organize their thoughts and feel validated during stressful periods.',
          'Demystifying Counseling: Serving as a friendly liaison to formal mental health services.'
        ]
      },
      {
        sectionBadge: 'SECTION 2 • LISTENING GUIDELINES',
        heading: 'Core Active Listening & Communication Guidelines',
        callout: 'Active listening requires non-directive empathy, validation, and strict confidentiality.',
        cards: [
          { title: 'Unconditional Acceptance', desc: 'Accept student emotions without judgment, shame, or minimizing lived experiences.' },
          { title: 'Reflective Listening', desc: 'Use phrases like "It sounds like you are carrying a heavy burden right now" to validate feelings.' },
          { title: 'Avoid Unsolicited Advice', desc: 'Resist the urge to instantly "fix" problems. Allow students space to process organically.' },
          { title: 'Strict Confidentiality', desc: 'Keep all conversations private unless there is imminent risk of self-harm or harm to others.' }
        ]
      },
      {
        sectionBadge: 'SECTION 3 • CRISIS HANDLING',
        heading: 'Crisis Escalation & Emergency Protocols',
        callout: 'If a student displays acute distress or crisis signals, follow the 3-step escalation protocol immediately.',
        distressSignals: [
          { title: '1. Connect Immediately', desc: 'Dial the 24/7 Mantra Care Hotline or National Emergency Helpline.' },
          { title: '2. Stay Present', desc: 'Remain with the student in a quiet, safe space until emergency responders arrive.' },
          { title: '3. Notify Safety Team', desc: 'Inform campus safety coordinators while preserving student dignity and privacy.' }
        ]
      }
    ],
    takeaway: 'Confidentiality and active listening are your strongest tools. Always prioritize safety and follow escalation protocols when emergency signals appear.',
    checklist: [
      'Complete active listening training guidelines and boundary protocols.',
      'Keep 24/7 emergency hotline numbers readily accessible at all times.',
      'Maintain anonymous session logs for continuous quality improvement.'
    ]
  },
  {
    moduleId: 'mod_3_therapy',
    readTime: '5 min read',
    title: 'Subsidized Therapy & Campaign Execution',
    subtitle: 'Connecting students to subsidized clinical care and hosting effective awareness events.',
    keyHighlights: [
      { label: 'Primary Focus', value: 'Clinical Referrals & Workshops', iconType: 'sprout' },
      { label: 'Estimated Time', value: '5 Min Read', iconType: 'clock' },
      { label: 'Core Objective', value: 'Subsidized Therapy Access', iconType: 'building' }
    ],
    sections: [
      {
        sectionBadge: 'SECTION 1 • THERAPY REFERRALS',
        heading: 'Navigating Subsidized Therapy Referrals',
        callout: 'Through Mantra Care, eligible students access subsidized or fully sponsored sessions with licensed therapists.',
        points: [
          'Eligibility Verification: Assist students with quick 2-minute eligibility checks via the provider app.',
          'Matching Providers: Help students choose therapists based on language, specialty, and schedule.',
          'Ensuring Continuity: Conduct check-ins to ensure smooth onboarding and appointment attendance.'
        ]
      },
      {
        sectionBadge: 'SECTION 2 • CAMPAIGN EXECUTION',
        heading: 'Executing Impactful Campus Campaigns',
        callout: 'Proactive community outreach ensures mental health support reaches every corner of campus.',
        cards: [
          { title: 'Interactive Workshops', desc: 'Host quarterly events on stress management, mindfulness, exam anxiety, and sleep.' },
          { title: 'Digital & Print Flyers', desc: 'Display QR-code helpline posters in libraries, student halls, and cafeteria centers.' },
          { title: 'Union Partnerships', desc: 'Collaborate with student bodies and faculty to integrate wellness into major events.' }
        ]
      },
      {
        sectionBadge: 'SECTION 3 • IMPACT EVALUATION',
        heading: 'Program Evaluation & Impact Tracking',
        callout: 'Regularly measure outreach metrics to continuously refine campus mental health programs.',
        distressSignals: [
          { title: 'Outreach Reach', desc: 'Track total students engaged through listening desks and awareness workshops.' },
          { title: 'Referral Rates', desc: 'Monitor successful therapy referral completions via the partner dashboard.' },
          { title: 'Student Feedback', desc: 'Collect participant feedback ratings after events to improve future initiatives.' }
        ]
      }
    ],
    takeaway: 'Subsidized therapy removes financial barriers for students in need. Combining clinical access with vibrant campus campaigns creates lasting impact.',
    checklist: [
      'Distribute QR-code helpline posters across campus libraries and halls.',
      'Coordinate with student unions to host quarterly wellness workshops.',
      'Log referral conversions to track student access to professional care.'
    ]
  }
];

export default function LearningScreen({ statusData, onCompleteModule, onSubmitApp, isUpdating, onBack }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('content'); // 'content' | 'curriculum'
  const [showTaskCompletionModal, setShowTaskCompletionModal] = useState(false);

  const { showToast } = useToast();
  const topRef = useRef(null);

  const isSubmitted = statusData?.journeyStage === 'APPLICATION_SUBMITTED' || statusData?.journeyStage === 'UNDER_REVIEW';

  // Auto scroll to top when switching modules
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeModuleIndex]);

  if (!statusData) return null;

  const { availableModules = [], profile = {} } = statusData;
  const completedCount = availableModules.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / (availableModules.length || 1)) * 100);
  const allModulesCompleted = completedCount === availableModules.length;

  const currentModule = availableModules[activeModuleIndex] || availableModules[0];
  const activeContent = MODULE_TEXT_CONTENT[activeModuleIndex] || MODULE_TEXT_CONTENT[0];

  const renderIcon = (type) => {
    switch (type) {
      case 'target': return <Target size={20} color="#2563eb" />;
      case 'clock': return <Clock size={20} color="#2563eb" />;
      case 'shield': return <ShieldCheck size={20} color="#2563eb" />;
      case 'headphones': return <Headphones size={20} color="#2563eb" />;
      case 'lock': return <Lock size={20} color="#2563eb" />;
      case 'sprout': return <Sprout size={20} color="#2563eb" />;
      case 'building': return <Building2 size={20} color="#2563eb" />;
      default: return <BookOpen size={20} color="#2563eb" />;
    }
  };

  const handleReturnToDashboard = () => {
    if (onBack) {
      onBack();
    } else {
      goToDashboard();
    }
  };

  const handleNextModule = () => {
    if (activeModuleIndex < availableModules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(prev => prev - 1);
    }
  };

  const handleCompleteClick = async () => {
    await onCompleteModule(currentModule.moduleId);

    if (showToast) {
      showToast(`Module ${activeModuleIndex + 1} Completed ✓`, 'success', 3200);
    }

    if (activeModuleIndex < availableModules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
    }
  };

  return (
    <div ref={topRef} style={{ maxWidth: '1600px', margin: '0 auto', padding: '12px 24px 50px', width: '100%', boxSizing: 'border-box' }} className="animate-fade-in">

      {/* CSS Styles for Layout Stability & Mobile Responsiveness */}
      <style>{`
        html {
          scrollbar-gutter: stable;
          overflow-y: scroll;
        }

        .udemy-header-bar {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px 20px;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          width: 100%;
          box-sizing: border-box;
        }

        .udemy-grid-container {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .mobile-tab-bar {
          display: none;
        }

        @media (max-width: 900px) {
          .udemy-grid-container {
            grid-template-columns: 1fr;
          }
          .mobile-tab-bar {
            display: flex;
            background: #f1f5f9;
            padding: 4px;
            border-radius: 12px;
            margin-bottom: 16px;
            gap: 4px;
          }
          .mobile-tab-btn {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            border: none;
            font-weight: 800;
            font-size: 0.84rem;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .mobile-hide-content {
            display: none !important;
          }
          .mobile-hide-curriculum {
            display: none !important;
          }
          .udemy-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>

      {/* Minimal Completion Status Banner */}
      {allModulesCompleted && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.84rem',
          color: '#047857',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>Task has already been completed</span>
          </div>
        </div>
      )}

      {/* Enterprise Global Learning Top Control Bar (Clean Light Theme) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '14px 20px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={handleReturnToDashboard}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={15} color="#475569" /> Resume Later
          </button>

          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Campus Initiative Orientation
            </div>
            <h2 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>
              Campus Ambassador Training Program
            </h2>
          </div>
        </div>

        {/* Completion Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#ffffff', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>
            {completedCount}/3 Completed ({progressPercent}%)
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="mobile-tab-bar">
        <button
          className="mobile-tab-btn"
          onClick={() => setMobileTab('content')}
          style={{
            background: mobileTab === 'content' ? '#ffffff' : 'transparent',
            color: mobileTab === 'content' ? '#2563eb' : '#64748b',
            boxShadow: mobileTab === 'content' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <BookOpen size={15} /> Reading Module ({activeModuleIndex + 1}/3)
        </button>
        <button
          className="mobile-tab-btn"
          onClick={() => setMobileTab('curriculum')}
          style={{
            background: mobileTab === 'curriculum' ? '#ffffff' : 'transparent',
            color: mobileTab === 'curriculum' ? '#2563eb' : '#64748b',
            boxShadow: mobileTab === 'curriculum' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Layers size={15} /> Curriculum ({completedCount}/3 Completed)
        </button>
      </div>

      {/* Main Horizontal 2-Column Grid Layout */}
      <div className="udemy-grid-container">

        {/* Left Column: Structured Module Reader */}
        <div className={mobileTab === 'curriculum' ? 'mobile-hide-content' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>

          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Elegant Light Blue Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0f7ff 100%)',
              border: '1px solid #dbeafe',
              borderRadius: '14px',
              padding: '22px 24px',
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  Module {activeModuleIndex + 1} of 3 • Reading Material
                </span>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} color="#2563eb" /> {activeContent.readTime}
                </span>
              </div>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>
                {activeContent.title}
              </h2>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.55 }}>
                {activeContent.subtitle}
              </p>
            </div>

            {/* Quick Highlight Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {activeContent.keyHighlights.map((hl, hIdx) => (
                <div key={hIdx} style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eef2ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {renderIcon(hl.iconType)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {hl.label}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {hl.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Structured Section Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeContent.sections.map((sec, idx) => {
                const sectionColors = [
                  { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
                  { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
                  { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' }
                ];
                const badgeColor = sectionColors[idx % sectionColors.length];

                return (
                  <div key={idx} style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 900, color: badgeColor.text, background: badgeColor.bg, border: `1px solid ${badgeColor.border}`, padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.04em' }}>
                        {sec.sectionBadge}
                      </span>
                    </div>

                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      {sec.heading}
                    </h3>

                    {/* Highlight Callout Box */}
                    {sec.callout && (
                      <div style={{
                        background: '#f8fafc',
                        borderLeft: '4px solid #4f46e5',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '0.86rem',
                        color: '#1e293b',
                        fontWeight: 700,
                        lineHeight: 1.55,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        borderTop: '1px solid #f1f5f9',
                        borderRight: '1px solid #f1f5f9',
                        borderBottom: '1px solid #f1f5f9'
                      }}>
                        <Lightbulb size={18} color="#4f46e5" style={{ flexShrink: 0 }} />
                        <span>{sec.callout}</span>
                      </div>
                    )}

                    {/* Bullet Points Grid */}
                    {sec.points && (
                      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.6 }}>
                        {sec.points.map((pt, pIdx) => (
                          <li key={pIdx} style={{ color: '#334155' }}>{pt}</li>
                        ))}
                      </ul>
                    )}

                    {/* Sub Cards Grid */}
                    {sec.cards && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '4px' }}>
                        {sec.cards.map((card, cIdx) => (
                          <div key={cIdx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', marginBottom: '4px' }}>
                              {card.title}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                              {card.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Distress Signals Cards */}
                    {sec.distressSignals && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                        {sec.distressSignals.map((sig, sIdx) => (
                          <div key={sIdx} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#eef2ff', color: '#4f46e5', fontWeight: 900, fontSize: '0.78rem', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                              {sIdx + 1}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>{sig.title}</div>
                              <div style={{ fontSize: '0.81rem', color: '#64748b', marginTop: '2px', lineHeight: 1.45 }}>{sig.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Advocate Core Takeaway Box */}
            <div style={{
              background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
              border: '1px solid #c7d2fe',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#4f46e5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#312e81' }}>
                  Advocate Core Takeaway
                </div>
                <div style={{ fontSize: '0.83rem', color: '#3730a3', marginTop: '3px', lineHeight: 1.55, fontWeight: 600 }}>
                  {activeContent.takeaway}
                </div>
              </div>
            </div>

            {/* Ambassador Action Checklist */}
            <div style={{ background: '#ffffff', padding: '18px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.86rem', color: '#334155', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <h4 style={{ margin: '0 0 10px', color: '#0f172a', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#4f46e5" /> Ambassador Action Checklist:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                {activeContent.checklist.map((item, cIdx) => (
                  <li key={cIdx} style={{ color: '#334155' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Bottom Action Footer */}
            <div style={{ paddingTop: '16px', marginTop: '4px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: '14px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginLeft: 'auto' }}>
                {activeModuleIndex > 0 && (
                  <button
                    onClick={handlePrevModule}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Previous
                  </button>
                )}

                <button
                  onClick={handleCompleteClick}
                  disabled={currentModule.completed || isUpdating}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: currentModule.completed ? '#ecfdf5' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: currentModule.completed ? '#059669' : '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: currentModule.completed ? 'default' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: currentModule.completed ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  {currentModule.completed ? <>Completed ✓</> : (
                    activeModuleIndex === availableModules.length - 1 ? <>Mark Complete <CheckCircle2 size={15} /></> : <>Mark Complete & Continue <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Course Content Curriculum Accordion */}
        <div className={mobileTab === 'content' ? 'mobile-hide-curriculum' : ''} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={18} color="#4f46e5" /> Course Content
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>
                {completedCount}/3 Modules
              </span>
            </div>

            {/* Module Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableModules.map((mod, idx) => {
                const isActive = idx === activeModuleIndex;
                let bgStyle = '#f8fafc';
                let borderStyle = '1px solid #e2e8f0';
                let tagColor = '#64748b';

                if (mod.completed) {
                  bgStyle = '#f0fdf4';
                  borderStyle = '1px solid #bbf7d0';
                  tagColor = '#15803d';
                } else if (isActive) {
                  bgStyle = '#ffffff';
                  borderStyle = '2px solid #4f46e5';
                  tagColor = '#4f46e5';
                }

                return (
                  <div
                    key={mod.moduleId}
                    onClick={() => {
                      setActiveModuleIndex(idx);
                      setMobileTab('content');
                    }}
                    style={{
                      background: bgStyle,
                      border: borderStyle,
                      padding: '14px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.12)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {mod.completed ? (
                      <CheckCircle2 size={18} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                    ) : (
                      <Circle size={18} color={isActive ? "#4f46e5" : "#cbd5e1"} style={{ marginTop: '2px', flexShrink: 0 }} />
                    )}

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: tagColor }}>
                        Module {idx + 1} {mod.completed && '• Done'}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px', lineHeight: 1.3 }}>
                        {mod.title}
                      </div>
                    </div>

                    <ChevronRight size={16} color={isActive ? "#4f46e5" : "#94a3b8"} style={{ marginTop: '3px' }} />
                  </div>
                );
              })}
            </div>
            {/* Submission card when all completed */}
            {allModulesCompleted && (
              isSubmitted ? (
                <div style={{ marginTop: '16px', padding: '16px', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065f46', marginBottom: '4px' }}>
                    All Modules Completed
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '14px', lineHeight: 1.45 }}>
                    <strong>+20 Credits gained</strong>. You can continue with other provider tasks and check your application status by coming back after some time.
                  </div>
                  <button
                    onClick={() => {
                      if (typeof goToDashboard === 'function') {
                        goToDashboard();
                      } else {
                        window.location.href = '/';
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    Continue with Other Tasks <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '16px', padding: '16px', background: '#eef2ff', borderRadius: '12px', border: '1px solid #c7d2fe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#312e81', marginBottom: '4px' }}>
                    You have completed all modules successfully.
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#4338ca', marginBottom: '14px', lineHeight: 1.45 }}>
                    You can check your application status after some time.
                  </div>
                  <button
                    onClick={() => setShowTaskCompletionModal(true)}
                    disabled={isUpdating}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#043263',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(4, 50, 99, 0.25)'
                    }}
                  >
                    <CheckCircle2 size={16} /> Mark task as completed
                  </button>
                </div>
              )
            )}

          </div>

        </div>

      </div>

      {/* Task Completion Celebration Modal & Webhook Trigger */}
      {showTaskCompletionModal && (
        <CompletionScreen
          points={50}
          title="Campus Initiative Completed!"
          subtitle="You have completed all orientation modules. 50 points have been added to your profile."
          onClose={async () => {
            setShowTaskCompletionModal(false);
            try {
              await completeLesson('campus-awareness');
            } catch (err) {
              console.error('[Campus] Webhook complete error:', err);
            }
            if (onBack) {
              onBack();
            }
            goToDashboard();
          }}
        />
      )}

    </div>
  );
}
