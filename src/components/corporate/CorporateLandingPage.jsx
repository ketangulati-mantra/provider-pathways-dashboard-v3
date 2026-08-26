import React, { useState } from 'react';
import {
  Building2, HeartHandshake, ShieldCheck, TrendingUp, Users, Award,
  CheckCircle2, ArrowRight, ArrowLeft, HelpCircle, Briefcase, Network, Sparkles, ChevronDown,
  Info, XCircle, Check, DollarSign, Target
} from 'lucide-react';
import { goBack } from '../../mantra';

// ─── Step Page Data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'intro',
    title: 'Know a Company That Could Benefit From Mantra?',
    badge: 'Referral Overview • Page 1 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.55, fontWeight: 600 }}>
          Refer a company or organization to Mantra for EAP and corporate wellness solutions. If they become a Mantra corporate client, you may be eligible to earn 15–20% of the contract value and may have an opportunity to become their preferred provider.
        </p>

        {/* Visual Workflow: Provider -> Referral -> Contract -> 15-20% Earn */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          borderRadius: '14px',
          border: '1.5px solid #bfdbfe',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HOW THE REFERRAL OPPORTUNITY WORKS
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '8px',
            alignItems: 'stretch'
          }}>
            {[
              { step: 'YOU', sub: 'Know a company', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
              { step: 'INTRODUCE MANTRA', sub: 'Make the connection', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
              { step: 'MANTRA', sub: 'Handles the corporate conversation', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
              { step: 'COMPANY', sub: 'Signs a qualifying contract', bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
              { step: 'YOU', sub: 'Earn 15–20% + preferred-provider opportunity', bg: '#fef3c7', color: '#b45309', border: '#fcd34d' }
            ].map((node, i) => (
              <div key={i} style={{
                background: node.bg,
                border: `1.5px solid ${node.border}`,
                borderRadius: '10px',
                padding: '10px 8px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '72px'
              }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 900, color: node.color, lineHeight: 1.2 }}>{node.step}</div>
                <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: '4px', lineHeight: 1.25 }}>{node.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.55 }}>
          If you already have a genuine relationship with a company, HR team, founder, business owner, organization, or other relevant decision-maker, you can introduce them to Mantra.
        </p>

        <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.55 }}>
          You make the introduction. Mantra's corporate team handles the conversation and next steps from there.
        </p>

        {/* Prominent Disclaimer Card */}
        <div style={{
          background: '#fefce8',
          border: '1.5px solid #fef08a',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Info size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
              THIS IS NOT A JOB APPLICATION
            </div>
            <div style={{ fontSize: '0.78rem', color: '#713f12', lineHeight: 1.45 }}>
              This is a referral partnership opportunity for Mantra providers who want to introduce companies or organizations to Mantra's EAP and corporate wellness services.
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'benefits',
    title: 'Why Refer a Company to Mantra?',
    badge: 'Partner Advantages • Page 2 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
          Your existing professional relationships can create opportunities beyond individual client referrals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            {
              icon: Building2,
              title: '01. Refer Companies',
              desc: 'Introduce Mantra to companies or organizations you already know or have access to.'
            },
            {
              icon: Award,
              title: '02. Earn From Successful Referrals',
              desc: 'Receive 15–20% of the contract value when a referred company signs a qualifying Mantra contract.'
            },
            {
              icon: Sparkles,
              title: '03. Become a Preferred Provider',
              desc: 'A successful corporate referral may create an opportunity for you to serve that organization\'s employees as a preferred or primary provider, subject to the applicable arrangement.'
            },
            {
              icon: TrendingUp,
              title: '04. Grow Beyond Individual Referrals',
              desc: 'Corporate relationships can create opportunities to support employees through Mantra\'s EAP and wellness programs.'
            }
          ].map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                background: '#ffffff', borderRadius: '12px', padding: '14px',
                border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Icon size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{b.title}</h4>
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
    title: 'How the Referral Process Works',
    badge: 'Process Overview • Page 3 of 4',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
          Your role is simple: make the introduction and let Mantra handle the corporate conversation.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { step: '01', title: 'Know a Potential Company', desc: 'Think about companies, organizations, startups, schools, businesses, clinics, or other organizations where you already have a genuine professional connection.' },
            { step: '02', title: 'Make the Introduction', desc: 'Connect Mantra with the appropriate HR leader, business owner, decision-maker, leadership team, or other relevant contact.' },
            { step: '03', title: 'Mantra Takes It Forward', desc: 'Mantra\'s corporate team handles the EAP discussion, proposal, commercial conversation, and onboarding.' },
            { step: '04', title: 'Earn & Grow', desc: 'If the company signs a qualifying contract with Mantra, you may be eligible to earn 15–20% of the contract value and may have an opportunity to become their preferred or primary provider, subject to the applicable arrangement.' }
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
              {idx < 3 && <div style={{ width: '2px', height: '8px', background: '#bfdbfe', margin: '0 0 0 28px' }} />}
            </div>
          ))}
        </div>

        {/* Roles Breakdown Box: Your Part is Simple vs You do NOT need to */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '6px' }}>
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#065f46', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={16} color="#059669" /> YOUR PART IS SIMPLE
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#047857', lineHeight: 1.5 }}>
              <li>Identify a company you have a genuine connection with</li>
              <li>Make the introduction to Mantra</li>
              <li>Help make the initial connection</li>
              <li>Let Mantra's corporate team handle the EAP conversation and next steps</li>
            </ul>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#991b1b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <XCircle size={16} color="#dc2626" /> YOU DO NOT NEED TO
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: '#b91c1c', lineHeight: 1.5 }}>
              <li>Apply for a job</li>
              <li>Become a Mantra employee</li>
              <li>Become a corporate salesperson</li>
              <li>Negotiate the EAP contract</li>
              <li>Manage the corporate implementation</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'Have a Company You Can Refer?',
    badge: 'Referral Submission • Page 4 of 4',
    content: (
      <FaqAndApplyStep />
    )
  }
];

function FaqAndApplyStep() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'Is this a job opportunity?',
      a: 'No. This is a referral partnership opportunity for Mantra providers who can introduce companies or organizations to Mantra.'
    },
    {
      q: 'What am I referring?',
      a: 'You are referring a company or organization that may be interested in Mantra\'s EAP and corporate wellness solutions.'
    },
    {
      q: 'Do I need to sell Mantra\'s services?',
      a: 'No. Your primary role is to make the introduction. Mantra\'s corporate team handles the EAP discussion and next steps.'
    },
    {
      q: 'How much can I earn?',
      a: 'Eligible referrals may earn 15–20% of the contract value when the referred company enters into a qualifying contract with Mantra.'
    },
    {
      q: 'Can I become the provider for that company?',
      a: 'You may have the opportunity to become the organization\'s preferred or primary provider, depending on the corporate arrangement and applicable requirements.'
    },
    {
      q: 'Will every referral result in a contract?',
      a: 'No. A referral does not guarantee that the company will choose Mantra or enter into a contract.'
    },
    {
      q: 'Do I become a Mantra employee?',
      a: 'No. This is a referral partnership opportunity and does not create an employment relationship with Mantra.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
        Do you already know a company, organization, HR team, or business decision-maker who may be interested in Mantra's EAP or corporate wellness solutions?
      </p>

      {/* Prominent Informational Box */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
            THIS FORM IS FOR REFERRALS
          </div>
          <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.45 }}>
            Submit this form if you would like to introduce a company to Mantra. This is not a job application and does not mean you are applying to work for Mantra.
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '2px' }}>
            WHAT HAPPENS AFTER YOU REFER?
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
            Mantra's corporate team will review the referral and handle the EAP discussion and next steps with the company.
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', marginBottom: '2px' }}>
            YOUR POTENTIAL BENEFIT
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45 }}>
            If your referred company signs a qualifying contract with Mantra, you may be eligible to receive 15–20% of the contract value. You may also have an opportunity to become a preferred or primary provider for that organization, subject to the applicable arrangement.
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Frequently Asked Questions
        </div>
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
        <button onClick={() => { if (onOptOut) onOptOut(); else goBack(onBack); }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer' }}>
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
            Mantra Corporate Referral Program
          </div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25 }}>
            Refer Companies & Earn 15–20% Contract Value
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
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${((currentStep + 1) / totalSteps) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step Content Card */}
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
                    flex: '1 1 200px', padding: '10px 18px', borderRadius: '9px', border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '0.86rem', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}
                >
                  Refer a Company to Mantra <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
