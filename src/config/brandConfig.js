// Brand configuration for multi-platform reusability
export const BRAND_CONFIGS = {
  therapymantra: {
    id: 'therapymantra',
    name: 'TherapyMantra',
    tagline: 'TherapyMantra Growth Academy',
    subtitle: 'Learn how to increase your visibility, attract more clients, and grow your TherapyMantra listing through proven strategies.',
    logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg',
    primaryColor: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    demoProfileUrl: 'https://therapists.therapymantra.co/list/therapist/demo',
    sampleListingId: '229102/erica-khanna',
    submissionService: 'corporate',
    activityId: 'grow-your-practice',
    lessonId: 'market-yourself',
    videos: {
      gettingClients: 'https://www.youtube.com/embed/VMWKdPGYoN4',
      marketProfile: 'https://www.youtube.com/embed/PvvqTeCUmWE'
    },
    shareTemplates: {
      linkedin: (url) => `I am proud to offer online therapy & wellness consultations on TherapyMantra.\n\nSchedule a session directly on my profile:\n🔗 ${url}\n\n#MentalHealth #TherapyMantra #OnlineTherapy`,
      instagram: (url) => `Licensed Mental Health Professional ✨\nHelping you heal, grow, and thrive\n👇 Book a session on TherapyMantra:\n${url}`,
      facebook: (url) => `Book online therapy sessions directly on TherapyMantra. Direct calendar scheduling available: ${url}`,
      whatsapp: (url) => `Hello! You can view my available TherapyMantra consultation slots and book a direct session online here: ${url}`,
      twitter: (url) => `Online therapy and wellness consultations available on TherapyMantra. Schedule a direct session: ${url}`
    }
  },
  ocdmantra: {
    id: 'ocdmantra',
    name: 'OCDMantra',
    tagline: 'OCDMantra Growth Academy',
    subtitle: 'Learn how to increase your visibility, attract ERP clients, and grow your OCDMantra listing.',
    logoUrl: 'https://res.cloudinary.com/hxbamdqf/image/upload/v1784698269/Mantra_logo_yptwwe.svg',
    primaryColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    demoProfileUrl: 'https://ocdmantra.com/therapist/demo',
    sampleListingId: 'ocd-specialist',
    submissionService: 'corporate',
    activityId: 'ocd-growth',
    lessonId: 'ocd-market-yourself',
    videos: {
      gettingClients: 'https://www.youtube.com/embed/VMWKdPGYoN4',
      marketProfile: 'https://www.youtube.com/embed/PvvqTeCUmWE'
    },
    shareTemplates: {
      linkedin: (url) => `Specialized Exposure & Response Prevention (ERP) for OCD on OCDMantra.\n\nBook a consultation: ${url}`,
      instagram: (url) => `OCD Specialist & ERP Specialist ✨\n👇 Book a session on OCDMantra:\n${url}`,
      facebook: (url) => `Book specialized ERP therapy sessions on OCDMantra: ${url}`,
      whatsapp: (url) => `Hello! Book a direct OCD consultation here: ${url}`,
      twitter: (url) => `OCD therapy consultations available on OCDMantra: ${url}`
    }
  }
};
