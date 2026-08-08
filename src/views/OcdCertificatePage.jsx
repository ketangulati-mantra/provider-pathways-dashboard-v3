import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'ocd-certificate';
const REWARD_POINTS = 0;

const ocdConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'OCDMantra Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'OCD Provider Pathway',
  quote: '"Empower minds with Evidence-Based ERP & CBT therapy. Your specialization and dedication bring hope, healing, and freedom to individuals living with OCD."',
  authorizedBy: 'MantraCare',
  signatureText: 'OCDMantra',
  stampText: 'OCDMantra Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785929926/ocdmantraicon_cnxa03.png',
  footer: 'Specialized OCD & ERP Therapy. | ocdmantra.com',
  certificateIdPrefix: 'OM-OPP',
  congratsBadge: '🎉 OCD PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the OCD Provider Pathway demonstrates dedication to specialized care. Enter your name to receive your official certificate.',
};

export default function OcdCertificatePage({ onBack }) {
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
        certificateConfig={ocdConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen 
          points={REWARD_POINTS} 
          title="Certificate Generated!" 
          subtitle="You have successfully downloaded your OCD Provider Pathway Certificate." 
          onClose={handleCloseCelebration} 
        />
      )}
    </>
  );
}
