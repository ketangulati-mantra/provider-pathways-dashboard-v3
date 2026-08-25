import React from 'react';
import {
  Header,
  OverviewCard,
  VideoSection,
  ExpandableCard,
  QuizCard, useToast
} from '../components';
import { useLessonCompletion } from '../hooks/useLessonCompletion';

// Lesson constants
const LESSON_ID     = 'using-mantra';
const LESSON_TITLE  = 'Using Mantra for Your Clients';
const REWARD_POINTS = 5;
const DURATION      = '4 min';

const VIDEO = {
  title:    'Using Mantra for Your Clients - Guide for Onboarding & Scheduling',
  duration: '4 min',
  posterUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784699055/Using_mantra_for_your_clients_mgsnll.avif',
  videoUrl:  'https://vimeo.com/1130777932?fl=pl&fe=cm'
};

const ACCORDIONS = [
  {
    title: 'Accepting Client Appointments',
    content:
      'When a client books a slot, you will receive a push notification. You have 2 hours to accept or reschedule the booking. Confirming promptly keeps your availability score high and ensures the client is served on time.'
  },
  {
    title: 'Managing Client Progress Records',
    content:
      'After each session, log brief notes, set weekly action checklists, and assign homework goals for clients. Clients view these goals directly on their Mantra mobile app, keeping them engaged between sessions.'
  }
];

const QUIZ_QUESTIONS = [
  {
    question: 'Where can you find your profile link in the Mantra Partner Mobile App?',
    options: [
      { text: 'Sessions overview section',           isCorrect: false },
      { text: 'Availability configuration calendar', isCorrect: false },
      { text: 'Profile & Settings section',          isCorrect: true  },
      { text: 'Laravel billing summary tab',         isCorrect: false }
    ]
  },
  {
    question: 'Why should providers serve clients via Mantra?',
    options: [
      { text: 'To avoid managing session notes manually',                         isCorrect: false },
      { text: 'To connect with clients, manage sessions and grow referral reach', isCorrect: true  },
      { text: 'Because it is mandatory for all licensed practitioners',           isCorrect: false },
      { text: 'Only for nutrition and fitness practitioners',                     isCorrect: false }
    ]
  }
];

export default function UsingMantraLessonPage({ onBack }) {
  const {
    videoWatched,
    quizDone,
    lessonProgress, handleVideoComplete,
    handleQuizComplete, } = useLessonCompletion(LESSON_ID, onBack);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-app)' }}
      className="animate-fade-in"
    >
      {/* Header — same as LessonTemplate, passes lessonProgress */}
      <Header
        title={LESSON_TITLE}
        onBack={onBack}
        progress={lessonProgress}
      />

      <main
        className="academy-main-container"
        style={{
          flex: '1',
          padding: '24px 20px 80px 20px',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}
      >
        {/* 1. Overview */}
        <OverviewCard
          description="Learn how to manage client appointments, track session progress and use Mantra's tools to deliver a great provider experience."
          duration={DURATION}
          points="+5"
        />

        {/* 2. Video — first play sets videoWatched → 50% */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Video Tutorial</span>
          </h3>
          <VideoSection
            title={VIDEO.title}
            duration={VIDEO.duration}
            posterUrl={VIDEO.posterUrl}
            videoUrl={VIDEO.videoUrl}
            onCompleted={handleVideoComplete}
            isCompleted={videoWatched}
          />
        </section>

        {/* 3. Step-by-Step Guide */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Step-by-Step Guide</span>
          </h3>
          <div>
            {ACCORDIONS.map((guide, idx) => (
              <ExpandableCard key={idx} title={guide.title} isOpenDefault={idx === 0}>
                <p style={{ lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {guide.content}
                </p>
              </ExpandableCard>
            ))}
          </div>
        </section>

        {/* 4. Knowledge Check
             Q1 first answer  → q1Answered → 75%
             Done after submit → quizDone  → 100% → 800ms → modal */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Knowledge Check</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'left', marginBottom: '4px' }}>
            Answer both questions and submit to complete this lesson.
          </p>
          <QuizCard
            id={LESSON_ID}
            questions={QUIZ_QUESTIONS}
            onComplete={handleQuizComplete}
            isCompleted={quizDone}
            hasVideo={true}
            videoWatched={videoWatched}
          />
        </section>
      </main>

      {/* Completion modal — same as LessonTemplate, triggered after 800ms delay */}
    </div>
  );
}
