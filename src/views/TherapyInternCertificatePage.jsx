import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';

const internCertificateConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'Therapy Intern Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Therapy Intern Provider Pathway',
  quote: '"The journey of a therapist begins with learning, listening, and practicing with deep empathy. Your dedication to your professional growth and to your clients is highly valued."',
  authorizedBy: 'MantraCare Therapy Program',
  signatureText: 'TherapyMantra',
  stampText: 'MantraCare Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785828110/therapymantraIcon_kie5d3.png',
  footer: 'Growing in skill, empathy, and professional care. | mantracare.org',
  certificateIdPrefix: 'MC-TIP',
  congratsHeading: 'Congratulations!',
  congratsBadge: 'Therapy Intern Program',
  congratsDescription: 'You have completed the Therapy Intern Provider Pathway. Enter your name exactly as you want it to appear on your official certificate.'
};

export default function TherapyInternCertificatePage({ onBack }) {
  return <CertificateDownloadPage onBack={onBack} certificateConfig={internCertificateConfig} />;
}
