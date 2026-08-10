import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'diet-certificate';
const REWARD_POINTS = 0;

const dietConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'Mantra Fit Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Fitness Provider Pathway',
  quote: '"Empowering movement, strength, and physical well-being. Thank you for guiding clients toward active lifestyles, movement, and lifelong fitness."',
  authorizedBy: 'MantraCare',
  signatureText: 'Mantra Fit',
  stampText: 'Mantra Fit Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1786002234/mantra_fit_logo_r2dlj9.png',
  footer: 'Empowering health through fitness. | mantra.fit',
  certificateIdPrefix: 'MF-FPP',
  congratsBadge: '🎉 FITNESS PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Fitness Provider Pathway takes real courage. Enter your name to receive your certificate.',
};

export default function DietCertificatePage({ onBack }) {
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
        certificateConfig={dietConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Fitness Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
