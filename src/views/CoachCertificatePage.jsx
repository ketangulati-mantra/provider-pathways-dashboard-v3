import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'coach-certificate';
const REWARD_POINTS = 0;

const coachConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'Mantra Coach Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Coach Provider Pathway',
  quote: '"Coaching is unlocking a person\'s potential to maximize their own performance. Thank you for empowering clients to achieve their highest goals."',
  authorizedBy: 'Mantra Coach Program',
  signatureText: 'Mantra Coach',
  stampText: 'Mantra Coach Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785998579/mantra_coach_logo_n0sv35.png',
  footer: 'Empowering potential and personal growth. | mantracare.org',
  certificateIdPrefix: 'MC-CPP',
  congratsBadge: '🎉 COACH PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Coach Provider Pathway takes real courage. Enter your name to receive your certificate.',
};

export default function CoachCertificatePage({ onBack }) {
  const { 
    showCelebrate, 
    handleCloseCelebration, 
    handleActionComplete 
  } = useLessonCompletion(LESSON_ID, onBack, {
    hasVideo: false,
    hasQuiz: false,
    hasAction: true
  });

  return (
    <>
      <CertificateDownloadPage 
        onBack={onBack} 
        certificateConfig={coachConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Coach Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
