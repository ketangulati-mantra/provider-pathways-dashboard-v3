import React, { useState } from 'react';
import {
  Building2, HeartHandshake, ShieldCheck, TrendingUp, Users, Award,
  CheckCircle2, ArrowRight, ArrowLeft, HelpCircle, Briefcase, Network, Sparkles, ChevronDown
} from 'lucide-react';

// ─── Step Page Data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'why',
    title: 'Why Corporate Wellness Matters',
    badge: 'Educational Overview • Page 1 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
          Over 65% of corporate employees report high stress, anxiety, and burnout. Forward-thinking organizations are actively looking for professional wellness and EAP solutions to support their workforce.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            {
              icon: HeartHandshake,
              title: 'Workforce Mental Wellbeing',
              desc: 'Organizations need professional guidance to build proactive mental health & counseling initiatives.'
            },
            {
              icon: ShieldCheck,
              title: 'Burnout Prevention & Resilience',
              desc: 'Structured corporate wellness programs significantly reduce absenteeism and workplace stress.'
            },
            {
              icon: TrendingUp,
              title: 'Enhanced Organizational Productivity',
              desc: 'Companies investing in wellness witness up to 4x ROI through increased focus and talent retention.'
            },
            {
              icon: Briefcase,
              title: 'Modern Workplace Culture',
              desc: 'Corporations now integrate mental health counseling into their core employee benefit packages.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{
                background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
                padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Icon size={18} />
                </div>
                <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</h4>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '4px' }}>
          {[
            { stat: '87%', label: 'Employees valuing wellness benefits', color: '#2563eb' },
            { stat: '$3.27', label: 'Saved per $1 invested in wellness', color: '#059669' },
            { stat: '41%', label: 'Reduction in workplace absenteeism', color: '#7c3aed' }
          ].map((s, i) => (
            <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: s.color }}>{s.stat}</div>
              <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'benefits',
    title: 'Benefits of Joining the Program',
    badge: 'Partner Advantages • Page 2 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
          As a Corporate Growth Partner, you help organizations build healthier workplaces while expanding your own professional reach and earning rewards.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              icon: HeartHandshake,
              title: 'Help Organizations Improve Wellbeing',
              desc: 'Create healthier workplace environments and empower employees with expert mental health care.'
            },
            {
              icon: Award,
              title: 'Earn Program Commissions (15–20%)',
              desc: 'Receive competitive commission rewards on finalized corporate agreements for successful referrals.'
            },
            {
              icon: Sparkles,
              title: 'Preferred Provider Opportunities',
              desc: 'Get priority opportunity to serve as a preferred clinical provider for organizations you help onboard.'
            },
            {
              icon: Briefcase,
              title: 'Business & Partnership Skills',
              desc: 'Learn strategic business development, executive communication, and B2B partnership skills.'
            },
            {
              icon: Network,
              title: 'Expand Professional Network',
              desc: 'Connect with HR decision-makers, corporate wellness heads, and an elite network of fellow partners.'
            }
          ].map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                background: '#ffffff', borderRadius: '12px', padding: '12px 14px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Icon size={16} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{b.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  },
  {
    id: 'how',
    title: 'How Corporate Partnerships Work',
    badge: 'Process Overview • Page 3 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
          Understanding the complete process ensures a smooth collaboration between you and MantraCare's corporate team.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { step: '01', title: 'Express Interest & Apply', desc: 'Submit a simple application highlighting your background and availability.' },
            { step: '02', title: 'Review & Partner Orientation', desc: 'Our team reviews your profile and conducts a brief orientation on Mantra EAP solutions.' },
            { step: '03', title: 'Introduce Corporate Leads', desc: 'Connect MantraCare with HR executives or decision-makers seeking wellness solutions.' },
            { step: '04', title: 'Collaborate & Grow', desc: 'Earn referral rewards, deliver workshops if qualified, and build long-term provider relationships.' }
          ].map((s, idx) => (
            <div key={idx}>
              <div style={{
                background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
                padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '12px'
              }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', background: '#2563eb',
                  width: '30px', height: '30px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {s.step}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{s.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>{s.desc}</p>
                </div>
              </div>
              {idx < 3 && <div style={{ width: '2px', height: '10px', background: '#bfdbfe', margin: '0 0 0 28px' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46', marginBottom: '2px' }}>You are NOT expected to negotiate or sell</div>
            <div style={{ fontSize: '0.76rem', color: '#047857', lineHeight: 1.45 }}>Your role is simply to identify opportunities and make warm introductions. MantraCare's experienced corporate team handles proposals, negotiations, contracts, and implementation.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'Program Summary & Application',
    badge: 'Final Step • Page 4 of 4',
    content: (
      <FaqAndApplyStep />
    )
  }
];

function FaqAndApplyStep() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { q: 'What is the role of a Corporate Growth Partner?', a: 'As a Corporate Growth Partner, you serve as a trusted bridge between MantraCare and corporate organizations. You facilitate introductions to HR leaders, help tailor wellness solutions, and position employee wellbeing as a strategic priority.' },
    { q: 'Do I need prior sales experience?', a: 'No prior sales experience is required. You are positioned strictly as a professional partner, not a salesperson. Mantra provides full collateral, enterprise presentations, and handles all proposal negotiations.' },
    { q: 'How does the commission structure work?', a: 'Corporate Growth Partners earn 15–20% commission on finalized corporate wellness contracts, subject to applicable program terms and the finalized agreement.' },
    { q: 'Can I provide clinical services to onboarded companies?', a: 'Yes! Where appropriate, Corporate Growth Partners receive priority opportunity to serve as preferred providers for therapy sessions, workshops, and webinars for companies they help onboard.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
        Review common questions below before submitting your interest to join the Corporate Growth Partner Program.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#ffffff' }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                style={{
                  width: '100%', padding: '12px 14px', background: isOpen ? '#f8fafc' : '#ffffff',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textAlign: 'left', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a'
                }}
              >
                <span style={{ paddingRight: '8px' }}>{faq.q}</span>
                <ChevronDown size={15} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
              </button>
              {isOpen && (
                <div style={{ padding: '10px 14px 14px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.55, borderTop: '1px solid #f1f5f9' }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CorporateLandingPage({ onExpressInterest, onOptOut, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = STEPS.length;
  const isLastStep = currentStep === totalSteps - 1;
  const stepData = STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">

      {/* Clean Top Header Bar */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e2e8f0',
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <img
          src="https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg"
          alt="Mantra Logo"
          style={{ height: '28px', width: 'auto', display: 'block' }}
        />
        <button onClick={onOptOut} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer' }}>
          Exit
        </button>
      </div>

      {/* Main Educational Container */}
      <main style={{
        flex: 1, padding: '16px 12px 60px', maxWidth: '750px', margin: '0 auto', width: '100%',
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
      }}>
        {/* Program Title Banner */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
            Mantra Executive Partnerships
          </div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25 }}>
            Corporate Growth Partner Program
          </h1>
        </div>

        {/* Step Progress Header */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.66rem', fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase',
              color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '20px', border: '1px solid #bfdbfe'
            }}>
              {stepData.badge}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              height: '100%', background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
              borderRadius: '3px', transition: 'width 0.3s ease-in-out'
            }} />
          </div>
        </div>

        {/* Step Card */}
        <div style={{
          background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
          padding: '20px 16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, wordBreak: 'break-word' }}>
            {stepData.title}
          </h2>

          {/* Page Dynamic Educational Content */}
          {stepData.content}

          {/* Bottom Action Area inside Step Card */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '16px', borderTop: '1px solid #f1f5f9', marginTop: '8px', gap: '10px', flexWrap: 'wrap'
          }}>
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                style={{
                  padding: '9px 16px', borderRadius: '9px', border: '1px solid #cbd5e1',
                  background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.82rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0
                }}
              >
                <ArrowLeft size={15} /> Previous
              </button>
            ) : (
              <div />
            )}

            {!isLastStep ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '9px 20px', borderRadius: '9px', border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto'
                }}
              >
                Proceed / Next <ArrowRight size={15} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={onOptOut}
                  style={{
                    flex: '1 1 120px', padding: '10px 14px', borderRadius: '9px', border: '1px solid #cbd5e1',
                    background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', textAlign: 'center'
                  }}
                >
                  Not Right Now
                </button>
                <button
                  onClick={onExpressInterest}
                  style={{
                    flex: '1 1 180px', padding: '10px 18px', borderRadius: '9px', border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '0.86rem', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  Yes, I'm Interested <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
