import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'women-wellness-certificate';
const REWARD_POINTS = 0;

const womenWellnessConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'HerMantra Women Wellness Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Women Wellness Provider Pathway',
  quote: '"Empowering women with compassionate care, holistic wellness, and specialized support. Thank you for guiding clients through every stage of their health journey."',
  authorizedBy: 'MantraCare',
  signatureText: 'HerMantra',
  stampText: 'HerMantra Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1786435596/MantraCare_logos_mecdt8.png',
  footer: 'Empowering women’s health & holistic well-being. | hermantra.com',
  certificateIdPrefix: 'HM-WWP',
  congratsBadge: '🎉 WOMEN WELLNESS PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Women Wellness Provider Pathway takes real dedication and empathy. Enter your name to receive your certificate.',
};

export default function WomenWellnessCertificatePage({ onBack }) {
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
        certificateConfig={womenWellnessConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Women Wellness Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
