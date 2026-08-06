import React from 'react';
import CertificateDownloadPage from './CertificateDownloadPage';

const providerConfig = {
  certificateTitle: 'Certificate of Completion',
  programName: 'Therapy Provider Program',
  awardText: 'This certificate is proudly awarded to',
  completionText: 'for successfully completing the',
  courseName: 'Therapy Provider Pathway',
  quote: '"Therapy is a sacred collaboration of self-discovery and healing. Your presence, guidance, and compassion support others in navigating life’s challenges and finding their strength."',
  authorizedBy: 'MantraCare',
  signatureText: 'TherapyMantra',
  stampText: 'TherapyMantra Stamp Verified',
  logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785828110/therapymantraIcon_kie5d3.png',
  footer: 'Guiding minds and healing hearts. | mantracare.org',
  certificateIdPrefix: 'MC-TPP',
  congratsHeading: 'Congratulations!',
  congratsBadge: 'Therapy Provider Program',
  congratsDescription: 'You have completed the Therapy Provider Pathway. Enter your name exactly as you want it to appear on your official certificate.'
};

export default function TherapyProviderCertificatePage({ onBack }) {
  return <CertificateDownloadPage onBack={onBack} certificateConfig={providerConfig} />;
}
