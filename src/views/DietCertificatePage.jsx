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
  courseName: 'Diet Provider Pathway',
  quote: '"Nourishing the body is an act of care. Thank you for guiding clients toward healthier lifestyles, balanced nutrition, and lifelong wellness."',
  authorizedBy: 'Mantra Fit Program',
  signatureText: 'Mantra Fit',
  stampText: 'Mantra Fit Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785998748/mantra_fit_logo_tjacxh.png',
  footer: 'Empowering health through nutrition. | mantracare.org',
  certificateIdPrefix: 'MF-DPP',
  congratsBadge: '🎉 DIET PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Diet Provider Pathway takes real courage. Enter your name to receive your certificate.',
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
          subtitle="Congratulations on completing the Diet Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
