import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'physio-certificate';
const REWARD_POINTS = 0;

const physioConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'PhysioMantra Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Physio Provider Pathway',
  quote: '"Restoring mobility is restoring independence. Thank you for guiding clients toward healing, physical strength, and lifelong recovery."',
  authorizedBy: 'PhysioMantra Program',
  signatureText: 'PhysioMantra',
  stampText: 'PhysioMantra Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785997703/physiomantra_logo_max8il.png',
  footer: 'Restoring movement and health. | physiomantra.com',
  certificateIdPrefix: 'PM-PPP',
  congratsBadge: '🎉 PHYSIO PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Physio Provider Pathway takes real courage. Enter your name to receive your certificate.',
};

export default function PhysioCertificatePage({ onBack }) {
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
        certificateConfig={physioConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Physio Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
