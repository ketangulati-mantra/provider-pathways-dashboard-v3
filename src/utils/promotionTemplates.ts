/**
 * Promotion Templates Store
 * 
 * Placeholders: {{providerName}}, {{specialization}}, {{profileUrl}}
 */

export interface PromotionTemplateItem {
  id: string;
  title: string;
  category?: string;
  content: string;
  notes?: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  webUrl: string;
  templates: PromotionTemplateItem[];
}

export type BrandService = 'TherapyMantra' | 'OCDMantra' | 'PhysioMantra' | 'PrideMantra' | 'NutritionMantra' | 'YogaMantra' | string;

const DEFAULT_TEMPLATES: Record<string, PlatformConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking & thought leadership',
    iconName: 'Share2',
    color: '#0a66c2',
    webUrl: 'https://www.linkedin.com/feed/',
    templates: [
      {
        id: 'li-1',
        title: '1. Professional Announcement',
        category: 'Announcement',
        content: `I'm pleased to share that I'm now accepting online consultations through TherapyMantra.

My name is {{providerName}} and I specialize in {{specialization}}. Partnering with TherapyMantra allows me to connect seamlessly with individuals looking for specialized support.

If you or someone in your network is seeking professional guidance, feel free to review my credentials or schedule a session directly:

{{profileUrl}}

Looking forward to continuing this work and supporting client well-being.`
      },
      {
        id: 'li-2',
        title: '2. Educational Thought Leadership',
        category: 'Thought Leadership',
        content: `Consistent health care is fundamental to long-term well-being. Yet, many individuals delay seeking guidance until distress becomes overwhelming.

As a {{specialization}}, I focus on helping clients develop effective coping strategies, foster emotional resilience, and maintain balanced relationships.

I have opened dedicated consultation slots on TherapyMantra for individuals seeking structured guidance.

You can learn more about my work or schedule an appointment here:

{{profileUrl}}`
      },
      {
        id: 'li-3',
        title: '3. Storytelling & Client Care',
        category: 'Storytelling',
        content: `One of the most rewarding aspects of working in {{specialization}} is witnessing a client move from feeling stuck to rebuilding confidence and clarity.

My name is {{providerName}}, and I believe establishing a safe, trusting therapeutic alliance is where meaningful progress begins.

If you are navigating personal challenges or preparing for a new life transition, I am here to assist.

View my professional profile and current availability on TherapyMantra:

{{profileUrl}}`
      }
    ]
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual stories, captions, reels & bio',
    iconName: 'Globe',
    color: '#c026d3',
    webUrl: 'https://www.instagram.com/',
    templates: [
      {
        id: 'ig-1',
        title: 'Feed Caption',
        category: 'Feed',
        content: `Taking the first step toward personal growth requires clarity and support. 

As a {{specialization}}, I'm now accepting consultations through TherapyMantra 💙

If you're looking for support with {{specialization}}, I'd be happy to help.

Book here 👇
{{profileUrl}}`
      },
      {
        id: 'ig-2',
        title: 'Story Text',
        category: 'Story',
        content: `Mental well-being is an ongoing journey ✨
I'm {{providerName}} and I'm now accepting online consultation sessions on TherapyMantra.

🔗 Tap here to view profile & book:
{{profileUrl}}`
      },
      {
        id: 'ig-3',
        title: 'Bio Example',
        category: 'Bio',
        content: `{{providerName}} | {{specialization}}
🤝 Online Consultations on TherapyMantra
👇 Book a session below
{{profileUrl}}`
      },
      {
        id: 'ig-4',
        title: 'Reel Caption',
        category: 'Reels',
        content: `Small, consistent daily habits build long-term resilience. If you've been feeling overwhelmed lately, professional guidance in {{specialization}} can make all the difference.

I provide virtual sessions through TherapyMantra. 

🔗 Link in bio to get started:
{{profileUrl}}`
      }
    ]
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Community-oriented updates & family reach',
    iconName: 'Share2',
    color: '#2563eb',
    webUrl: 'https://www.facebook.com/',
    templates: [
      {
        id: 'fb-1',
        title: 'Community Announcement',
        category: 'Community',
        content: `Hello everyone,

I wanted to share a quick update regarding my practice. My name is {{providerName}} and I am currently offering confidential online consultations in {{specialization}} through TherapyMantra.

If you or someone in your community could benefit from structured support, please feel free to share this post or view my profile details here:

{{profileUrl}}

Wishing you all health and peace.`
      }
    ]
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Direct status updates & business profile info',
    iconName: 'MessageSquare',
    color: '#16a34a',
    webUrl: 'https://web.whatsapp.com/',
    templates: [
      {
        id: 'wa-1',
        title: 'Business About / Description',
        category: 'Profile Info',
        content: `{{providerName}} — {{specialization}}. Online consultations available on TherapyMantra: {{profileUrl}}`
      },
      {
        id: 'wa-2',
        title: 'Status Update',
        category: 'Status',
        content: `Now accepting appointments through TherapyMantra.

{{specialization}}

Book here:
{{profileUrl}}`
      },
      {
        id: 'wa-3',
        title: 'Availability Message',
        category: 'Direct Update',
        content: `Hello! Virtual consultation slots are currently open for {{specialization}} with {{providerName}}. You can review my bio and reserve a time at {{profileUrl}}`
      }
    ]
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    description: 'Short insights & direct profile links',
    iconName: 'FileText',
    color: '#0284c7',
    webUrl: 'https://x.com/',
    templates: [
      {
        id: 'tw-1',
        title: '1. Professional Short Post',
        category: 'Short Post',
        content: `Prioritizing well-being is a sign of strength, not weakness. As a {{specialization}}, I'm now conducting online consultations on TherapyMantra.

Book a session here: {{profileUrl}}`
      },
      {
        id: 'tw-2',
        title: '2. Healthcare Insight',
        category: 'Insight',
        content: `Effective care isn't about giving advice—it's about empowering individuals with tools for clarity and resilience. My name is {{providerName}} and my virtual sessions in {{specialization}} are now open on TherapyMantra: {{profileUrl}}`
      }
    ]
  },
  email: {
    id: 'email',
    name: 'Email Signature',
    description: 'Professional email footer & booking link',
    iconName: 'Mail',
    color: '#4f46e5',
    webUrl: 'https://mail.google.com/',
    templates: [
      {
        id: 'em-1',
        title: 'Standard Email Signature Footer',
        category: 'Signature',
        content: `--
{{providerName}}
{{specialization}}

Book Appointment & Online Consultations:
{{profileUrl}}`
      }
    ]
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    description: 'Educational answers & value-first participation',
    iconName: 'MessageSquare',
    color: '#ea580c',
    webUrl: 'https://www.reddit.com/',
    templates: [
      {
        id: 'rd-1',
        title: 'Educational Ending (Value-First Guidelines)',
        category: 'Guidelines & Ending',
        content: `[DO NOT POST PROMOTIONAL SPAM. ANSWER THE USER'S QUESTION IN DETAIL FIRST.]

---
GOOD EXAMPLE ENDING:
"Hope this breakdown helps clarify your question! 

My name is {{providerName}}, and as a {{specialization}}, I regularly address these challenges. If you'd like to explore structured support, you can find my professional profile here: {{profileUrl}}"`
      }
    ]
  },
  quora: {
    id: 'quora',
    name: 'Quora',
    description: 'In-depth answers with natural profile attribution',
    iconName: 'HelpCircle',
    color: '#b91c1c',
    webUrl: 'https://www.quora.com/',
    templates: [
      {
        id: 'qr-1',
        title: 'In-Depth Answer Attribution',
        category: 'Attribution',
        content: `[PROVIDE A COMPREHENSIVE, HIGH-VALUE CLINICAL ANSWER FIRST.]

---
RECOMMENDED CLOSING ATTRIBUTION:
"Building resilience is a continuous process that improves with evidence-based guidance. 

My name is {{providerName}} and as a {{specialization}}, I regularly address these topics in my practice. For more details or to schedule a virtual consultation, you are welcome to visit my TherapyMantra profile: {{profileUrl}}"`
      }
    ]
  }
};

/**
 * Replace placeholders in template text strictly without fake fallbacks
 */
export function interpolateTemplate(
  templateText: string,
  vars: { providerName?: string; specialization?: string; profileUrl?: string; brandName?: string }
): string {
  const {
    providerName = '',
    specialization = '',
    profileUrl = '',
    brandName = 'TherapyMantra'
  } = vars;

  let result = templateText
    .replaceAll('{{providerName}}', providerName)
    .replaceAll('{{name}}', providerName)
    .replaceAll('{{specialization}}', specialization)
    .replaceAll('{{profileUrl}}', profileUrl);

  // Replace default brand name if a specific brand like OCDMantra or PhysioMantra is requested
  if (brandName && brandName !== 'TherapyMantra') {
    result = result.replaceAll('TherapyMantra', brandName);
  }

  return result;
}

/**
 * Get all available promotion platform configurations
 */
export function getPromotionPlatforms(): PlatformConfig[] {
  return Object.values(DEFAULT_TEMPLATES);
}
