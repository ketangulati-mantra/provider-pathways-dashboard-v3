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

const OCD_TEMPLATES: Record<string, PlatformConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking & ERP clinical focus',
    iconName: 'Share2',
    color: '#0a66c2',
    webUrl: 'https://www.linkedin.com/feed/',
    templates: [
      {
        id: 'li-ocd-1',
        title: '1. ERP Practice Announcement',
        category: 'Announcement',
        content: `I am pleased to announce that I am now offering specialized Exposure and Response Prevention (ERP) consultations through OCDMantra.

My name is {{providerName}} and I specialize in {{specialization}}. OCD requires evidence-based, specialized care, and partnering with OCDMantra allows me to support individuals navigating Obsessive-Compulsive Disorder with structured ERP protocols.

If you or someone in your network is seeking specialized OCD therapy, view my profile & availability here:

{{profileUrl}}`
      },
      {
        id: 'li-ocd-2',
        title: '2. ERP & OCD Clinical Insight',
        category: 'Thought Leadership',
        content: `Standard talk therapy can often accidentally reinforce OCD compulsions. Evidence-based treatment like Exposure & Response Prevention (ERP) is the gold standard for long-term recovery.

As an OCD specialist focusing on {{specialization}}, I help clients systematically face anxiety triggers without engaging in compulsive rituals.

I have opened dedicated ERP consultation slots on OCDMantra. Learn more or schedule a session:

{{profileUrl}}`
      },
      {
        id: 'li-ocd-3',
        title: '3. Understanding Compulsions & ERP',
        category: 'Education',
        content: `Breaking free from the OCD cycle requires stepping away from reassurance-seeking and embracing uncertainty with ERP tools.

My name is {{providerName}}, and I am committed to delivering compassionate, evidence-based ERP therapy.

View my clinical bio and open ERP consultation slots on OCDMantra:

{{profileUrl}}`
      }
    ]
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual ERP tips, reels & OCD education',
    iconName: 'Globe',
    color: '#c026d3',
    webUrl: 'https://www.instagram.com/',
    templates: [
      {
        id: 'ig-ocd-1',
        title: 'Feed Caption - ERP Focus',
        category: 'Feed',
        content: `Recovery from OCD is possible with evidence-based Exposure & Response Prevention (ERP) 🧠✨

As an OCD specialist in {{specialization}}, I'm now accepting virtual ERP consultations on OCDMantra.

Book a direct 1-on-1 session below 👇
{{profileUrl}}`
      },
      {
        id: 'ig-ocd-2',
        title: 'Story Text - OCD Support',
        category: 'Story',
        content: `Struggling with intrusive thoughts or compulsions? 💭
I'm {{providerName}}, specializing in ERP therapy. Virtual consultations are open on OCDMantra.

🔗 Tap to view profile & book:
{{profileUrl}}`
      },
      {
        id: 'ig-ocd-3',
        title: 'Bio Example - OCD Specialist',
        category: 'Bio',
        content: `{{providerName}} | {{specialization}}
🧠 ERP Therapy for OCD on OCDMantra
👇 Schedule an online consultation
{{profileUrl}}`
      }
    ]
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'OCD community & family support posts',
    iconName: 'Share2',
    color: '#2563eb',
    webUrl: 'https://www.facebook.com/',
    templates: [
      {
        id: 'fb-ocd-1',
        title: 'OCD Support Announcement',
        category: 'Community',
        content: `Hello everyone,

I wanted to share that I am currently offering specialized online ERP therapy for Obsessive-Compulsive Disorder (OCD) through OCDMantra.

My name is {{providerName}} and I work with clients seeking evidence-based tools for intrusive thoughts, contamination fears, and compulsive behaviors.

View my profile and book a session directly here:

{{profileUrl}}`
      }
    ]
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Direct status updates & OCD client inquiries',
    iconName: 'MessageSquare',
    color: '#16a34a',
    webUrl: 'https://web.whatsapp.com/',
    templates: [
      {
        id: 'wa-ocd-1',
        title: 'Business About / Description',
        category: 'Profile Info',
        content: `{{providerName}} — {{specialization}} | ERP Therapy on OCDMantra: {{profileUrl}}`
      },
      {
        id: 'wa-ocd-2',
        title: 'Status Update',
        category: 'Status',
        content: `Now accepting online ERP therapy appointments for OCD on OCDMantra.

Book here:
{{profileUrl}}`
      }
    ]
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter / X',
    description: 'OCD advocacy & short ERP tips',
    iconName: 'FileText',
    color: '#0284c7',
    webUrl: 'https://x.com/',
    templates: [
      {
        id: 'tw-ocd-1',
        title: 'ERP & OCD Advocacy',
        category: 'Short Post',
        content: `Compulsions offer temporary relief, but ERP offers long-term recovery. As an OCD therapist specializing in {{specialization}}, my virtual consultation slots are open on OCDMantra:

{{profileUrl}}`
      }
    ]
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    description: 'r/OCD educational advice & ERP attribution',
    iconName: 'MessageSquare',
    color: '#ea580c',
    webUrl: 'https://www.reddit.com/',
    templates: [
      {
        id: 'rd-ocd-1',
        title: 'r/OCD Educational Response Ending',
        category: 'Guidelines & Ending',
        content: `[PROVIDE A DETAILED, HELPFUL ERP EXPLANATION FIRST - DO NOT SPAM.]

---
RECOMMENDED CLOSING ATTRIBUTION:
"Learning to sit with anxiety without executing compulsions takes guidance and practice.

My name is {{providerName}}, and as a {{specialization}}, I focus on ERP for OCD. If you're seeking structured virtual sessions, you can view my profile on OCDMantra: {{profileUrl}}"`
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
    .replaceAll('{{specialization}}', specialization || (brandName.toLowerCase().includes('ocd') ? 'OCD & ERP Specialist' : 'Specialist'))
    .replaceAll('{{profileUrl}}', profileUrl);

  if (brandName && brandName !== 'TherapyMantra' && !result.includes(brandName)) {
    result = result.replaceAll('TherapyMantra', brandName);
  }

  return result;
}

/**
 * Get all available promotion platform configurations for a brand
 */
export function getPromotionPlatforms(brandName: string = 'TherapyMantra'): PlatformConfig[] {
  const isOCD = brandName.toLowerCase().includes('ocd');
  if (isOCD) {
    return Object.values(OCD_TEMPLATES);
  }
  return Object.values(DEFAULT_TEMPLATES);
}
