import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';
import { useLessonCompletion } from '../hooks/useLessonCompletion';
import { CompletionScreen } from '../components';

const LESSON_ID = 'doctor-certificate';
const REWARD_POINTS = 0;

const doctorConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'Mantra Doc Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Doctor Provider Pathway',
  quote: '"Wherever the art of Medicine is loved, there is also a love of Humanity. Thank you for delivering compassionate, high-quality medical care to your patients."',
  authorizedBy: 'Mantra Doc Program',
  signatureText: 'Mantra Doc',
  stampText: 'Mantra Doc Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785998580/mantra_doc_logo_guq04e.png',
  footer: 'Healing and empowering health. | mantracare.org',
  certificateIdPrefix: 'MD-DocPP',
  congratsBadge: '🎉 DOCTOR PROVIDER PATHWAY COMPLETE',
  congratsHeading: 'You did it!',
  congratsDescription: 'Completing the Doctor Provider Pathway takes real courage. Enter your name to receive your certificate.',
};

export default function DoctorCertificatePage({ onBack }) {
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
        certificateConfig={doctorConfig}
        onDownload={handleActionComplete}
      />
      {showCelebrate && (
        <CompletionScreen
          points={REWARD_POINTS}
          title="Pathway Complete!"
          subtitle="Congratulations on completing the Doctor Provider Pathway."
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
}
