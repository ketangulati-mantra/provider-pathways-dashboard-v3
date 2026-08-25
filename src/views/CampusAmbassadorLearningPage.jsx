import React from 'react';
import { Header, Button } from '../components';
import { goToLesson, goBack } from '../mantra';
import { GraduationCap, ArrowLeft, Clock, Award } from 'lucide-react';

const LESSON_ID = 'campus-ambassador-learning';
const LESSON_TITLE = 'Campus Ambassador Learning';

export default function CampusAmbassadorLearningPage({ onBack }) {
  const handleBackToLanding = () => {
    if (onBack) {
      onBack();
    } else {
      goToLesson('/task/campus-awareness');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-app)' }} className="animate-fade-in">
      <Header title={LESSON_TITLE} onBack={handleBackToLanding} progress={0} />

      <main style={{
        flex: 1,
        padding: '40px 24px 80px',
        maxWidth: '750px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '48px 32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={32} />
          </div>

          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0369a1',
            background: '#e0f2fe',
            borderRadius: '20px',
            padding: '4px 12px'
          }}>
            EDUCATIONAL MODULE
          </span>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0
          }}>
            {LESSON_TITLE}
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            lineHeight: '1.6',
            maxWidth: '500px',
            margin: 0
          }}>
            Page 1 coming soon...
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 24px',
            fontSize: '0.9rem',
            color: '#475569',
            marginTop: '8px'
          }}>
            This educational module will guide you step-by-step on how to successfully introduce mental health initiatives in your institution.
          </div>

          <Button
            variant="secondary"
            onClick={handleBackToLanding}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Campus Ambassador Program</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
