import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'yoga-certificate';
const REWARD_POINTS = 0;

const yogaConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'YogaMantra Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Yoga Provider Pathway',
  quote: '"Yoga is the journey of the self, through the self, to the self. Thank you for guiding others toward balance, strength, and mindful living."',
  authorizedBy: 'MantraCare',
  signatureText: 'YogaMantra',
  stampText: 'YogaMantra Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1786001822/yoga_mantra_logo_xz7tpf.png',
  footer: 'Nurturing mind, body, and spirit. | yogamantra.co',
  certificateIdPrefix: 'YM-YPP',
  congratsBadge: '🧘 YOGA PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Yoga Provider Pathway takes dedication and commitment. Enter your name to generate your certificate.',
};

export default function YogaCertificatePage({ onBack }) {
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
        certificateConfig={yogaConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Yoga Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
