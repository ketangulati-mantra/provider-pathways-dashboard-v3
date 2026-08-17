import React from 'react';
import {
  Header,
  OverviewCard,
  VideoSection,
  ExpandableCard,
  QuizCard,
  CompletionScreen,
  useToast
} from '../components';
import { useLessonCompletion } from '../hooks/useLessonCompletion';

// ── Lesson constants ─────────────────────────────────────────────────────────
const LESSON_ID     = 'getting-clients';
const LESSON_TITLE  = 'Getting Clients from Mantra';
const REWARD_POINTS = 5;
const DURATION      = '4 min';

const VIDEO = {
  title:    'Getting Clients from Mantra - Provider Visibility & Profile Optimisation',
  duration: '4 min',
  posterUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784699055/Using_mantra_for_your_clients_mgsnll.avif',
  videoUrl:  'https://res.cloudinary.com/hxbamdqf/video/upload/v1785829768/vidssave.com_Getting_Clients_from_Mantra_Business_Growth_through_Platform_Visibility_1080P_o0lhmj.mp4'
};

const ACCORDIONS = [
  {
    title: 'Optimising Your Provider Profile',
    content:
      'Your Mantra profile is your primary discovery surface. Providers with complete profiles — including a professional photo, detailed specialties, session formats and a clear bio — consistently receive more client enquiries. Keep your availability calendar current so clients can book without friction.'
  },
  {
    title: 'How Clients Find You on Mantra',
    content:
      'Clients discover providers through Mantra listing pages and search results. The platform surfaces profiles based on specialty match, availability, rating and engagement score. Maintaining a high engagement score by completing Academy lessons and portal tasks increases your visibility in search rankings.'
  }
];

const QUIZ_QUESTIONS = [
  {
    question: 'Where are clients most likely to discover your Mantra provider profile?',
    options: [
      { text: 'Inside the provider earnings dashboard',  isCorrect: false },
      { text: 'On Mantra listing pages and search results', isCorrect: true  },
      { text: 'Only through customer support',           isCorrect: false },
      { text: 'Only after provider verification',        isCorrect: false }
    ]
  },
  {
    question: 'What helps increase your chances of getting more client enquiries on Mantra?',
    options: [
      { text: 'Keeping your provider profile complete and updated', isCorrect: true  },
      { text: 'Logging in multiple times a day',                    isCorrect: false },
      { text: 'Installing the app on multiple devices',             isCorrect: false },
      { text: 'Changing your password frequently',                  isCorrect: false }
    ]
  }
];

// ── Component ────────────────────────────────────────────────────────────────
export default function GettingClientsLessonPage({ onBack }) {
  const {
    videoWatched,
    quizDone,
    lessonProgress,
    showCelebrate,
    handleVideoComplete,
    handleQuizComplete,
    handleCloseCelebration
  } = useLessonCompletion(LESSON_ID, onBack);

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
        points={REWARD_POINTS}
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
          description="Learn how providers attract new clients through the Mantra platform, improve visibility, build trust, and increase bookings by optimizing their provider profile and engagement."
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
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Lesson Complete!"
          subtitle="You have finished this lesson and boosted your provider score."
          onClose={handleCloseCelebration}
        />
      )}
    </div>
  );
}
