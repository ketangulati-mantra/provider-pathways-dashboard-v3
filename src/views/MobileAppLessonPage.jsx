import React, { useState } from 'react';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import {
  Header,
  Button,
  CompletionScreen,
  useToast
} from '../components';
import { completeLesson, goToDashboard } from '../mantra';
import {
  Smartphone, Calendar, Users, Award, Star, CheckCircle2
} from 'lucide-react';
import './MobileAppLessonPage.css';

export default function MobileAppLessonPage({ onBack }) {
  const lessonId = 'mobile-app';



  const {
    lessonProgress,
    showCelebrate,
    handleCloseCelebration,
    handleActionComplete
  } = useLessonCompletion(lessonId, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });
  const rewardPoints = 5;

  // Factual product overview steps using MantraPartner App branding
  const steps = [
    {
      number: 1,
      title: 'Download the App',
      desc: 'Search "MantraPartner" on the iOS App Store or Google Play Store to install the application on your mobile device.'
    },
    {
      number: 2,
      title: 'Log In Securely',
      desc: 'Sign in with your existing provider credentials registered during your clinic setup.'
    },
    {
      number: 3,
      title: 'Enable Push Notifications',
      desc: 'Allow notification permissions to receive instant booking alerts and respond within the 2-hour SLA.'
    }
  ];

  // Triggers completion celebration overlay
  // Triggers actual database updates and navigation through integration layer
  return (
    <div className="mobile-app-lesson-container animate-fade-in">
      <Header
        title="Download & Review MantraPartner App"
        onBack={onBack}
        progress={lessonProgress}
        points={rewardPoints}
      />

      <div className="lesson-wrapper">

        {/* 1. Hero Section */}
        <section className="app-hero-section">
          <div className="hero-content">
            <div className="app-icon-badge">
              <Smartphone size={22} />
            </div>
            <div className="hero-title-container">
              <span className="hero-pretitle">App Introduction</span>
              <h1 className="hero-main-title">Download & Review MantraPartner App</h1>
            </div>
            <p className="hero-desc">
              Stay connected with your clients and manage your sessions anytime, anywhere. Take your practice on the go with the native MantraPartner App.
            </p>
            <div className="hero-badges-row">
              <div className="hero-badge-item">⏱️ 1 Min Read</div>
              <div className="hero-badge-item points">🏆 +5 Reward Points</div>
            </div>
          </div>
          <div className="abstract-phone-visual">
            <div className="glow-backdrop" />
            <div className="abstract-phone-container">
              <img src="https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg" alt="Mantra Partner Logo" className="phone-brand-logo" />
            </div>
          </div>
        </section>

        {/* 2. Benefits Feature Cards */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="section-header">
            <span className="section-label">Core Benefits</span>
            <h2 className="section-title">Why Use the App?</h2>
          </div>
          <div className="benefit-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Users size={18} />
              </div>
              <h3 className="benefit-title">Manage Clients Efficiently</h3>
              <p className="benefit-desc">
                View, schedule and update client sessions in real time.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Calendar size={18} />
              </div>
              <h3 className="benefit-title">Track Sessions with Ease</h3>
              <p className="benefit-desc">
                Monitor progress, attendance and engagement.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Award size={18} />
              </div>
              <h3 className="benefit-title">Earn Rewards & Stay Connected</h3>
              <p className="benefit-desc">
                Access your provider points, referrals and insights anytime, anywhere.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Product Overview (Informational Guide) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="section-header">
            <span className="section-label">Setup Guide</span>
            <h2 className="section-title">Product Overview</h2>
          </div>
          <div className="steps-container">
            {steps.map((step, idx) => (
              <div key={idx} className="step-card-item">
                <div className="step-left-block">
                  <div className="step-number-badge">
                    {step.number}
                  </div>
                  <div className="step-title-text">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Review Section (Compact) */}
        <section className="review-callout-card">
          <div className="review-left-col">
            <Star className="review-star-icon" size={16} fill="currentColor" />
            <div className="review-text-block">
              <h4>Enjoying the app?</h4>
              <p>If you find MantraPartner App useful, consider leaving a brief review on the App Store or Google Play Store.</p>
            </div>
          </div>
        </section>

        {/* 5. Custom Download and Completion Section */}
        <section className="accurate-download-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 className="accurate-download-title">Download the MantraPartner App</h3>
            <p className="accurate-download-desc">
              Download the official MantraPartner provider application to manage clients, track sessions and stay connected from anywhere.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%', marginTop: '4px' }}>
            <div className="accurate-store-badges-row">
              {/* Google Play Store Badge Link */}
              <a
                href="https://play.google.com/store/apps/details?id=org.mantracare.partner.app&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
                className="official-badge-link"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  style={{ height: '40px', display: 'block' }}
                />
              </a>

              {/* Apple App Store Badge Link */}
              <a
                href="https://apps.apple.com/in/app/mantracare-partner/id1603403683"
                target="_blank"
                rel="noopener noreferrer"
                className="official-badge-link"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  style={{ height: '40px', display: 'block' }}
                />
              </a>
            </div>

            <Button
              variant="primary"
              onClick={handleActionComplete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 24px',
                fontSize: '0.85rem',
                marginTop: '4px'
              }}
            >
              <CheckCircle2 size={14} />
              <span>✔ I've Reviewed the App – Mark Complete</span>
            </Button>
          </div>
        </section>

      </div>

      {/* 6. Celebration Overlay Screen */}
      {showCelebrate && (
        <CompletionScreen
          points={rewardPoints}
          title="Lesson Complete"
          subtitle="Ready for the next lesson"
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
