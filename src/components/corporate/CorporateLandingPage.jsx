import React, { useState } from 'react';
import { 
  Building2, HeartHandshake, ShieldCheck, TrendingUp, Users, Award, 
  CheckCircle2, ArrowRight, HelpCircle, Briefcase, Network, Sparkles, ChevronDown
} from 'lucide-react';

export default function CorporateLandingPage({ onExpressInterest, onOptOut, onBack }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const WHY_WELLNESS = [
    {
      icon: HeartHandshake,
      title: 'Workforce Mental Wellbeing',
      description: 'Over 65% of corporate employees report high stress and anxiety. Organizations need professional guidance to build proactive mental health initiatives.'
    },
    {
      icon: ShieldCheck,
      title: 'Burnout Prevention & Resilience',
      description: 'Structured corporate wellness programs significantly reduce absenteeism and prevent burnout among high-performing teams.'
    },
    {
      icon: TrendingUp,
      title: 'Enhanced Organizational Productivity',
      description: 'Companies that invest in comprehensive EAP & wellness witness up to 4x return on investment through increased focus and retention.'
    },
    {
      icon: Briefcase,
      title: 'Modern Workplace Culture',
      description: 'Forward-thinking corporations prioritize holistic care, integrating mental health counseling into their core employee benefit packages.'
    }
  ];

  const PARTNER_BENEFITS = [
    {
      icon: HeartHandshake,
      title: 'Improve Employee Wellbeing',
      description: 'Help organizations create healthier workplace environments and empower employees with expert mental health care.'
    },
    {
      icon: Award,
      title: 'Earn Program Commissions',
      description: 'Receive competitive commission rewards (1–20%, subject to applicable program terms and the finalized corporate agreement) for successful referrals.'
    },
    {
      icon: Sparkles,
      title: 'Preferred Provider Opportunities',
      description: 'Opportunity to become a preferred provider for organizations you help onboard, where appropriate, expanding your clinical practice.'
    },
    {
      icon: Briefcase,
      title: 'Business Development Skills',
      description: 'Learn strategic business development, executive communication, and B2B partnership skills guided by industry leaders.'
    },
    {
      icon: Network,
      title: 'Expand Professional Network',
      description: 'Connect with HR decision-makers, corporate wellness heads, and an elite network of fellow Corporate Growth Partners.'
    }
  ];

  const HOW_IT_WORKS = [
    {
      step: '01',
      title: 'Express Interest & Apply',
      description: 'Submit a simple application highlighting your professional background, industry connections, and availability.'
    },
    {
      step: '02',
      title: 'Review & Partner Orientation',
      description: 'Our corporate team reviews your profile and conducts a brief orientation on Mantra EAP offerings.'
    },
    {
      step: '03',
      title: 'Introduce Corporate Leads',
      description: 'Connect Mantra with HR executives or decision-makers at companies seeking employee wellness solutions.'
    },
    {
      step: '04',
      title: 'Collaborate & Grow',
      description: 'Earn referral rewards, deliver workshops if qualified, and build long-term corporate provider relationships.'
    }
  ];

  const FAQS = [
    {
      q: 'What is the role of a Corporate Growth Partner?',
      a: 'As a Corporate Growth Partner, you serve as a trusted bridge between MantraCare and corporate organizations. You facilitate introductions to HR leaders, help tailor wellness solutions, and position employee wellbeing as a strategic priority.'
    },
    {
      q: 'Do I need prior sales experience?',
      a: 'No prior sales experience is required. You are positioned strictly as a professional partner, not a salesperson. Mantra provides full collateral, enterprise presentations, and handles all proposal negotiations.'
    },
    {
      q: 'How does the commission structure work?',
      a: 'Corporate Growth Partners earn 1–20% commission on finalized corporate wellness contracts, subject to applicable program terms and the finalized agreement.'
    },
    {
      q: 'Can I provide clinical services to onboarded companies?',
      a: 'Yes! Where appropriate, Corporate Growth Partners receive priority opportunity to serve as preferred providers for therapy sessions, workshops, and webinars for companies they help onboard.'
    }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 60px' }} className="animate-fade-in">
      
      {/* Top Header Bar */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mantra Executive Partnerships
            </div>
            <h1 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
              Corporate Growth Partner Program
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onOptOut}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Not Right Now
          </button>
          <button
            onClick={onExpressInterest}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Yes, I'm Interested <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '40px 36px',
          color: '#ffffff',
          boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', padding: '4px 12px', borderRadius: '20px', width: 'fit-content' }}>
            <Sparkles size={14} color="#60a5fa" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Strategic Provider Partnership
            </span>
          </div>

          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.25, letterSpacing: '-0.01em', color: '#ffffff' }}>
            Empower Corporate Workplaces & Accelerate Professional Growth
          </h2>

          <p style={{ margin: 0, fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '780px' }}>
            Join Mantra's Corporate Growth Partner Program. Help organizations transform workforce mental health & EAP wellness solutions while expanding your professional practice and earning competitive referral rewards.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              onClick={onExpressInterest}
              style={{
                padding: '10px 22px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Yes, I'm Interested <ArrowRight size={16} />
            </button>

            <button
              onClick={onOptOut}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #475569',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              Not Right Now
            </button>
          </div>
        </div>

        {/* Section 1: Why Corporate Wellness Matters */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              The Impact
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              Why Corporate Wellness Matters
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {WHY_WELLNESS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Icon size={18} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{card.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Benefits of Joining (As Corporate Growth Partners) */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '28px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Partner Advantages
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              Benefits of Becoming a Corporate Growth Partner
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PARTNER_BENEFITS.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{b.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>{b.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: How It Works */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Step-by-Step
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              How It Works
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563eb', background: '#eff6ff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step.step}
                </div>
                <h4 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{step.title}</h4>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.5 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: FAQ */}
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '28px 24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Clear Answers
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '12px 16px', background: '#ffffff', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
              Ready to Become a Corporate Growth Partner?
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#dbeafe' }}>
              Apply now to connect with organizations and lead workplace wellness initiatives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onOptOut}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Not Right Now
            </button>
            <button
              onClick={onExpressInterest}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#ffffff',
                color: '#1d4ed8',
                fontWeight: 900,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              Yes, I'm Interested
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
