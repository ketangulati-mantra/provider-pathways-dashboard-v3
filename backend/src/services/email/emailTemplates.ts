export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  defaultSubject: string;
  defaultText: string;
  defaultHtml: string;
}

export const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  application_received: {
    id: 'application_received',
    name: 'Application Received',
    description: 'Acknowledge receipt of the application and request college resource person contact details.',
    defaultSubject: 'We’ve Received Your Mantra Campus Ambassador Application',
    defaultText: `Dear {{applicantName}},

Thank you for applying to the Mantra Campus Ambassador Program (Application #{{applicationId}})! We appreciate your interest in joining us and contributing to mental health awareness and positive change on your campus.

We have received your application, and our team is currently reviewing your profile and statement of motivation.

What happens next?

To help us take your application forward, we request you to share the contact details of a relevant resource person from your college/university, such as a faculty member, placement officer, student affairs coordinator, or any other appropriate point of contact.

Please share the following details, if available:
- Name of the resource person
- Designation
- Official email address
- Contact number

This will help us connect with the concerned person and forward your application for further consideration.

Once we receive these details, our team will proceed with the next steps and keep you updated on your application status via email.

If you have any questions, feel free to reply to this email. We’ll be happy to assist you.

Thank you once again for your enthusiasm and interest in becoming a part of the Mantra Campus Ambassador Program!

Warm regards,
{{reviewerName}}
MantraCare`,
    defaultHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 1.4rem; font-weight: 800;">Mantra Campus Ambassador Program</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.95rem;">Application Received</p>
  </div>
  <p>Dear <strong>{{applicantName}}</strong>,</p>
  <p>Thank you for applying to the <strong>Mantra Campus Ambassador Program</strong> (Application <strong>#{{applicationId}}</strong>)! We appreciate your interest in joining us and contributing to mental health awareness and positive change on your campus.</p>
  <p>We have received your application, and our team is currently reviewing your profile and statement of motivation.</p>
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin: 0 0 10px; font-size: 0.95rem; color: #0f172a;">What happens next?</h3>
    <p style="margin: 0 0 12px; font-size: 0.9rem; color: #334155;">To help us take your application forward, we request you to share the contact details of a relevant resource person from your college/university, such as a faculty member, placement officer, student affairs coordinator, or any other appropriate point of contact.</p>
    <p style="margin: 0 0 6px; font-size: 0.9rem; font-weight: 600; color: #0f172a;">Please share the following details, if available:</p>
    <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: #475569;">
      <li>Name of the resource person</li>
      <li>Designation</li>
      <li>Official email address</li>
      <li>Contact number</li>
    </ul>
    <p style="margin: 12px 0 0; font-size: 0.9rem; color: #334155;">This will help us connect with the concerned person and forward your application for further consideration.</p>
  </div>
  <p>Once we receive these details, our team will proceed with the next steps and keep you updated on your application status via email.</p>
  <p>If you have any questions, feel free to reply to this email. We’ll be happy to assist you.</p>
  <p>Thank you once again for your enthusiasm and interest in becoming a part of the Mantra Campus Ambassador Program!</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
    Warm regards,<br />
    <strong>{{reviewerName}}</strong><br />
    MantraCare
  </p>
</div>`
  },

  application_approved: {
    id: 'application_approved',
    name: 'Application Approved',
    description: 'Congratulate the applicant on being selected and share next steps for onboarding.',
    defaultSubject: 'Your Mantra Campus Ambassador Application Has Been Approved! 🎉',
    defaultText: `Hi {{applicantName}},

Congratulations! 🎉

We’re excited to let you know that your application (Application #{{applicationId}}) to join the Mantra Campus Ambassador Program has been approved!

Your passion for student mental health advocacy stood out to our team, and we’re excited to have you join us in creating a positive impact on campus.

What’s next?
- Access your Campus Ambassador Dashboard to explore your referral tools and resources.
- Complete your onboarding and get familiar with the program.
- Start making an impact by promoting mental health awareness and organizing initiatives on your campus.
- Earn milestones and rewards as you grow your impact.

Welcome to the Mantra community! We’re excited to have you on board and look forward to the impact we can create together.

Warm regards,
{{reviewerName}}
MantraCare`,
    defaultHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 1.4rem; font-weight: 800;">Congratulations! 🎉</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.95rem;">Application Approved</p>
  </div>
  <p>Hi <strong>{{applicantName}}</strong>,</p>
  <p><strong>Congratulations! 🎉</strong></p>
  <p>We’re excited to let you know that your application (Application <strong>#{{applicationId}}</strong>) to join the <strong>Mantra Campus Ambassador Program</strong> has been approved!</p>
  <p>Your passion for student mental health advocacy stood out to our team, and we’re excited to have you join us in creating a positive impact on campus.</p>
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin: 0 0 8px; font-size: 0.95rem; color: #065f46;">What’s next?</h3>
    <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: #047857;">
      <li>Access your Campus Ambassador Dashboard to explore your referral tools and resources.</li>
      <li>Complete your onboarding and get familiar with the program.</li>
      <li>Start making an impact by promoting mental health awareness and organizing initiatives on your campus.</li>
      <li>Earn milestones and rewards as you grow your impact.</li>
    </ul>
  </div>
  <p>Welcome to the Mantra community! We’re excited to have you on board and look forward to the impact we can create together.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
    Warm regards,<br />
    <strong>{{reviewerName}}</strong><br />
    MantraCare
  </p>
</div>`
  },

  application_rejected: {
    id: 'application_rejected',
    name: 'Application Rejected',
    description: 'Politely inform the applicant that their application could not be accepted at this time.',
    defaultSubject: 'Update on Your Mantra Campus Ambassador Application',
    defaultText: `Hi {{applicantName}},

Thank you for taking the time to apply for the Mantra Campus Ambassador Program (Application #{{applicationId}}).

After carefully reviewing your application, we’re sorry to let you know that we’re unable to offer you a place in the current cohort due to the high number of applications we received.

We truly appreciate your interest in student mental health and wellness advocacy. While we can’t move forward with your application this time, we encourage you to continue making a difference on your campus and welcome you to apply again in a future cohort.

We wish you all the best in your academic journey and future endeavors.

Warm regards,
{{reviewerName}}
MantraCare`,
    defaultHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #475569 0%, #334155 100%); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 1.4rem; font-weight: 800;">Mantra Campus Ambassador Program</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.95rem;">Application Update</p>
  </div>
  <p>Hi <strong>{{applicantName}}</strong>,</p>
  <p>Thank you for taking the time to apply for the <strong>Mantra Campus Ambassador Program</strong> (Application <strong>#{{applicationId}}</strong>).</p>
  <p>After carefully reviewing your application, we’re sorry to let you know that we’re unable to offer you a place in the current cohort due to the high number of applications we received.</p>
  <p>We truly appreciate your interest in student mental health and wellness advocacy. While we can’t move forward with your application this time, we encourage you to continue making a difference on your campus and welcome you to apply again in a future cohort.</p>
  <p>We wish you all the best in your academic journey and future endeavors.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
    Warm regards,<br />
    <strong>{{reviewerName}}</strong><br />
    MantraCare
  </p>
</div>`
  },

  need_more_information: {
    id: 'need_more_information',
    name: 'Need More Information',
    description: 'Ask the applicant to provide additional details or clarification.',
    defaultSubject: 'Additional Information Needed for Your Campus Ambassador Application',
    defaultText: `Hi {{applicantName}},

Thank you for applying to the Mantra Campus Ambassador Program (Application #{{applicationId}}).

Our review team has gone through your application and needs a few additional details before we can complete the review.

Please log in to your Campus Ambassador Dashboard to provide the requested information. Alternatively, you can reply to this email with the details, and our team will review them.

Once we receive the information, we’ll continue with your application review.

Thank you for your time and cooperation. We look forward to hearing from you.

Warm regards,
{{reviewerName}}
MantraCare`,
    defaultHtml: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); padding: 24px; border-radius: 12px; color: #ffffff; text-align: center; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 1.4rem; font-weight: 800;">Action Required ℹ️</h1>
    <p style="margin: 6px 0 0; opacity: 0.9; font-size: 0.95rem;">Additional Information Needed</p>
  </div>
  <p>Hi <strong>{{applicantName}}</strong>,</p>
  <p>Thank you for applying to the <strong>Mantra Campus Ambassador Program</strong> (Application <strong>#{{applicationId}}</strong>).</p>
  <p>Our review team has gone through your application and needs a few additional details before we can complete the review.</p>
  <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; font-size: 0.9rem; color: #92400e;">Please log in to your Campus Ambassador Dashboard to provide the requested information. Alternatively, you can reply to this email with the details, and our team will review them.</p>
  </div>
  <p>Once we receive the information, we’ll continue with your application review.</p>
  <p>Thank you for your time and cooperation. We look forward to hearing from you.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="margin: 0; font-size: 0.85rem; color: #64748b;">
    Warm regards,<br />
    <strong>{{reviewerName}}</strong><br />
    MantraCare
  </p>
</div>`
  }
};

/**
 * Replaces mustache-style {{variables}} in a string.
 */
export function renderTemplateString(content: string, variables: Record<string, string>): string {
  let result = content;
  for (const [key, val] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, val || '');
  }
  return result;
}
