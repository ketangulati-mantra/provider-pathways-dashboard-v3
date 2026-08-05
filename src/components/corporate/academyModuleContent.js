import {
  Building2, HeartHandshake, ShieldCheck, TrendingUp, Users, Briefcase,
  Network, Sparkles, Award, Target, Lightbulb, MessageCircle, HelpCircle,
  Send, Shield, BookOpen, GraduationCap, Handshake, Search, UserCheck,
  MessageSquare, DollarSign, Scale
} from 'lucide-react';

/**
 * Corporate Growth Partner Academy – Module Content Registry
 * 
 * Architecture:
 * - Each module is a self-contained data object
 * - Supports: article sections, infographic cards, process flows, scenario cards, tips
 * - Future-ready: videoUrl, quizData, downloadables, assignments fields prepared
 */

const CORP_ACADEMY_MODULES = [
  // ────────────────────────────────────────────
  // MODULE 1: Understanding Corporate Wellness
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_1',
    moduleNumber: 1,
    title: 'Understanding Corporate Wellness',
    subtitle: 'What is employee wellness, why organizations invest in it, and the business case for EAPs.',
    icon: Building2,
    themeColor: '#2563eb',
    themeBg: '#eff6ff',
    themeBorder: '#bfdbfe',
    estimatedMinutes: 8,
    videoUrl: null,       // future: embedded video
    quizData: null,       // future: knowledge check
    downloadables: [],    // future: PDF guides
    objectives: [
      'Understand what Employee Wellness Programs and EAPs are',
      'Learn why organizations invest heavily in employee wellbeing',
      'Discover the business, employee, HR, and leadership benefits',
      'Build confidence in articulating the value of corporate wellness'
    ],
    sections: [
      {
        badge: 'SECTION 1 • FOUNDATIONS',
        heading: 'What is Employee Wellness?',
        callout: 'Employee wellness encompasses all initiatives that support the physical, mental, emotional, and financial wellbeing of a company\'s workforce.',
        points: [
          'Holistic Health Programs: Organizations design wellness strategies covering mental health counseling, stress management, fitness programs, nutrition guidance, and preventive health screenings.',
          'Proactive vs Reactive: Modern wellness is proactive — preventing burnout and disengagement before they become costly problems, rather than only responding to crises.',
          'Cultural Shift: Leading companies now view wellness as a core business strategy, not an optional HR benefit. It\'s tied directly to talent retention, innovation, and brand reputation.'
        ]
      },
      {
        badge: 'SECTION 2 • EAP EXPLAINED',
        heading: 'What is an EAP (Employee Assistance Program)?',
        callout: 'EAPs are employer-funded programs that provide confidential counseling, support services, and referrals to help employees manage personal and work-related challenges.',
        cards: [
          { title: 'Confidential Counseling', desc: 'Employees access licensed therapists and counselors for anxiety, depression, relationship issues, and workplace stress — all completely private from their employer.' },
          { title: 'Crisis Intervention', desc: 'EAPs provide immediate professional support during personal crises, substance use concerns, grief, or traumatic workplace events.' },
          { title: 'Work-Life Balance', desc: 'Programs include financial counseling, legal guidance, eldercare resources, childcare support, and relationship mediation services.' },
          { title: 'Manager Consultation', desc: 'HR and managers receive professional coaching on handling sensitive employee situations, team dynamics, and organizational health.' }
        ]
      },
      {
        badge: 'SECTION 3 • THE BUSINESS CASE',
        heading: 'Why Organizations Invest in Employee Wellbeing',
        callout: 'Companies investing in comprehensive wellness programs see up to 6:1 return on investment through reduced absenteeism, higher productivity, and lower healthcare costs.',
        infographicCards: [
          { stat: '87%', label: 'of employees consider wellness benefits when choosing employers', color: '#2563eb' },
          { stat: '$3.27', label: 'saved for every $1 invested in employee wellness programs', color: '#059669' },
          { stat: '41%', label: 'reduction in absenteeism through active EAP programs', color: '#7c3aed' },
          { stat: '67%', label: 'of high-performing companies offer EAP services', color: '#dc2626' }
        ]
      },
      {
        badge: 'SECTION 4 • STAKEHOLDER BENEFITS',
        heading: 'Benefits Across the Organization',
        callout: 'Corporate wellness creates a win-win-win scenario — employees thrive, HR operates efficiently, and leadership achieves business goals.',
        benefitGroups: [
          {
            groupTitle: 'For Employees',
            items: ['Access to free, confidential mental health support', 'Better work-life balance and stress management', 'Improved physical health through fitness and nutrition programs', 'Higher job satisfaction and sense of being valued']
          },
          {
            groupTitle: 'For HR Teams',
            items: ['Reduced employee turnover and recruitment costs', 'Fewer workplace conflicts and grievance cases', 'Data-driven insights into organizational health', 'Stronger employer branding and talent attraction']
          },
          {
            groupTitle: 'For Leadership',
            items: ['Higher workforce productivity and innovation', 'Reduced healthcare and insurance premiums', 'Stronger company culture and employee loyalty', 'Competitive advantage in talent-driven markets']
          }
        ]
      }
    ],
    takeaway: 'Corporate wellness isn\'t a luxury — it\'s a strategic business investment. As a Corporate Growth Partner, you\'ll help organizations unlock these benefits while building your own professional practice.',
    checklist: [
      'I can explain what Employee Wellness and EAP programs are',
      'I understand the business case for corporate wellness investment',
      'I know the benefits for employees, HR, and leadership'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 2: Understanding MantraCare Solutions
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_2',
    moduleNumber: 2,
    title: 'Understanding MantraCare Solutions',
    subtitle: 'A comprehensive overview of every MantraCare solution and when to recommend each one.',
    icon: Sparkles,
    themeColor: '#7c3aed',
    themeBg: '#f5f3ff',
    themeBorder: '#c4b5fd',
    estimatedMinutes: 10,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Understand every MantraCare corporate solution',
      'Know when to recommend each service type',
      'Speak confidently about MantraCare\'s offering portfolio',
      'Match organizational needs to the right solutions'
    ],
    sections: [
      {
        badge: 'SECTION 1 • SOLUTION PORTFOLIO',
        heading: 'MantraCare Corporate Solutions Overview',
        callout: 'MantraCare offers a comprehensive suite of 10+ wellness solutions, making it one of the most versatile corporate wellness providers in the market.',
        solutionCards: [
          { title: 'Therapy & Counseling', desc: 'Licensed therapists provide individual, couple, and group therapy sessions for anxiety, depression, stress, and relationship concerns. Available via video, chat, and in-person.', when: 'When employees report high stress, burnout, or mental health challenges.' },
          { title: 'Life & Executive Coaching', desc: 'Certified coaches help employees with career development, goal setting, leadership skills, work-life balance, and personal growth.', when: 'When organizations want proactive development, not just problem-solving.' },
          { title: 'Nutrition & Dietetics', desc: 'Registered dietitians create personalized meal plans, manage chronic conditions through diet, and conduct workplace nutrition workshops.', when: 'When companies prioritize physical wellness or have sedentary workforces.' },
          { title: 'Yoga & Mindfulness', desc: 'Certified yoga instructors offer online and on-site sessions including chair yoga, breathing exercises, meditation, and stress-reduction workshops.', when: 'When organizations want accessible, low-barrier wellness activities.' },
          { title: 'Fitness Programs', desc: 'Customized fitness plans, virtual group classes, step challenges, and corporate fitness challenges designed for desk-bound professionals.', when: 'When companies want to boost energy, reduce health insurance costs, or build team morale.' },
          { title: 'Medical Specialists', desc: 'Access to psychiatrists, dermatologists, gynecologists, and general physicians for employee health consultations and second opinions.', when: 'When employees need specialist medical guidance beyond primary care.' },
          { title: 'Employee Workshops', desc: 'Interactive workshops on stress management, emotional intelligence, DEI, mental health first aid, and workplace resilience.', when: 'When HR wants to train teams or create awareness during wellness months.' },
          { title: 'Assessments & Surveys', desc: 'Scientifically validated employee wellbeing assessments, burnout risk surveys, and organizational health dashboards.', when: 'When companies need data to understand workforce mental health trends.' },
          { title: 'Webinars & Seminars', desc: 'Expert-led webinars on topics like managing anxiety, financial wellness, parenting, and leadership burnout — delivered live or on-demand.', when: 'When organizations want scalable, low-cost wellness education.' },
          { title: 'Self-Help Resources', desc: 'Curated library of articles, guided meditations, journaling prompts, breathing exercises, and psychoeducation materials.', when: 'When companies want always-available wellness resources for employees.' }
        ]
      },
      {
        badge: 'SECTION 2 • MATCHING NEEDS',
        heading: 'How to Match Solutions to Client Needs',
        callout: 'You don\'t need to be a wellness expert. Simply understand the client\'s pain points, and MantraCare\'s business team will design the right package.',
        points: [
          'High Stress & Burnout? → Recommend Therapy + Yoga + Workshops',
          'Low Employee Engagement? → Recommend Coaching + Fitness Challenges + Assessments',
          'New to Wellness? → Recommend a comprehensive starter package with Assessments + Webinars + Self-Help',
          'Budget-Conscious? → Recommend Webinars + Self-Help + Group Yoga (scalable and affordable)',
          'Executive Wellbeing? → Recommend Executive Coaching + Therapy + Mindfulness'
        ]
      }
    ],
    takeaway: 'You don\'t need to sell specific solutions. Simply understand what the organization is facing, and MantraCare\'s corporate team will craft the perfect proposal.',
    checklist: [
      'I can describe each MantraCare solution confidently',
      'I understand when to recommend different services',
      'I know that the business team handles solution packaging'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 3: How Corporate Partnerships Work
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_3',
    moduleNumber: 3,
    title: 'How Corporate Partnerships Work',
    subtitle: 'The complete corporate partnership process from opportunity to launch — and your role in it.',
    icon: Handshake,
    themeColor: '#059669',
    themeBg: '#ecfdf5',
    themeBorder: '#a7f3d0',
    estimatedMinutes: 7,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Understand the end-to-end corporate partnership lifecycle',
      'Know exactly what you are and aren\'t responsible for',
      'Feel confident that MantraCare handles business negotiations',
      'Understand the handoff process clearly'
    ],
    sections: [
      {
        badge: 'SECTION 1 • THE PARTNERSHIP LIFECYCLE',
        heading: 'Complete Corporate Partnership Process',
        callout: 'Your role is to identify and introduce. MantraCare\'s corporate team handles everything from the first business meeting onward.',
        processFlow: [
          { step: '01', title: 'Provider Identifies Opportunity', desc: 'You notice a company, contact, or organization that could benefit from employee wellness services.', owner: 'You' },
          { step: '02', title: 'Provider Introduces Company', desc: 'You make a warm introduction via email, LinkedIn, or referral form — connecting the organization to MantraCare.', owner: 'You' },
          { step: '03', title: 'Business Team Connects', desc: 'MantraCare\'s corporate team reaches out to the organization, schedules a meeting, and starts the conversation.', owner: 'MantraCare' },
          { step: '04', title: 'Needs Assessment', desc: 'The corporate team conducts a thorough assessment of the organization\'s workforce size, challenges, and goals.', owner: 'MantraCare' },
          { step: '05', title: 'Custom Proposal', desc: 'A tailored wellness proposal is prepared based on the organization\'s unique requirements and budget.', owner: 'MantraCare' },
          { step: '06', title: 'Negotiation & Agreement', desc: 'Pricing, terms, and service scope are finalized between MantraCare and the organization\'s decision makers.', owner: 'MantraCare' },
          { step: '07', title: 'Implementation', desc: 'MantraCare sets up the platform, onboards employees, trains HR admins, and launches the wellness program.', owner: 'MantraCare' },
          { step: '08', title: 'Corporate Launch', desc: 'The program goes live. Employees gain access to all wellness services included in the agreement.', owner: 'MantraCare' }
        ]
      },
      {
        badge: 'SECTION 2 • YOUR ROLE DEFINED',
        heading: 'What You Are and Aren\'t Expected To Do',
        callout: 'You are a Corporate Growth Partner — not a salesperson. Your strength is your network, not negotiation.',
        cards: [
          { title: '✅ What You Do', desc: 'Identify companies that could benefit from wellness. Make warm introductions. Share your genuine experience as a provider. Submit referrals through the platform.' },
          { title: '❌ What You Don\'t Do', desc: 'You never negotiate contracts, discuss pricing, promise specific services, or pressure anyone. The corporate team handles all business conversations.' }
        ]
      }
    ],
    takeaway: 'Your job is simple: identify → introduce → hand off. MantraCare\'s experienced corporate team takes it from there. You stay informed and earn rewards when deals close.',
    checklist: [
      'I understand the 8-step corporate partnership process',
      'I know my role stops at introduction and referral',
      'I\'m confident that MantraCare handles negotiations'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 4: Finding Corporate Opportunities
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_4',
    moduleNumber: 4,
    title: 'Finding Corporate Opportunities',
    subtitle: 'Where to look for organizations that could benefit from wellness programs.',
    icon: Search,
    themeColor: '#ea580c',
    themeBg: '#fff7ed',
    themeBorder: '#fed7aa',
    estimatedMinutes: 6,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Identify 12+ sources of corporate wellness opportunities',
      'Think creatively about your existing network',
      'Understand which organizations benefit most from wellness',
      'Start building a personal opportunity pipeline'
    ],
    sections: [
      {
        badge: 'SECTION 1 • YOUR EXISTING NETWORK',
        heading: 'Start With Who You Already Know',
        callout: 'The best corporate opportunities often come from relationships you already have. You don\'t need to cold-call strangers.',
        opportunityCards: [
          { title: 'Existing Clients', desc: 'Many of your therapy or coaching clients work at companies that could benefit from an EAP. Ask if their organization offers wellness support.', example: '"I\'ve noticed workplace stress is a common theme. Does your company offer any employee wellness programs?"' },
          { title: 'Friends & Family', desc: 'People in your personal network work at organizations of all sizes. A casual conversation can uncover genuine opportunities.', example: '"My friend mentioned their company is growing fast but struggling with employee burnout. I mentioned MantraCare."' },
          { title: 'Previous Employers', desc: 'Companies where you\'ve worked before trust you already. If they don\'t have a wellness program, you\'re the perfect person to suggest one.', example: '"I used to work at XYZ Corp. I reached out to my former HR manager about employee wellness."' },
          { title: 'College Alumni Networks', desc: 'Alumni associations connect you to executives, founders, and HR professionals across industries.', example: '"Through my alumni WhatsApp group, I connected with a batchmate who\'s now VP of People at a tech startup."' }
        ]
      },
      {
        badge: 'SECTION 2 • BROADER OPPORTUNITIES',
        heading: 'Where Else To Look',
        callout: 'Opportunities exist everywhere — from LinkedIn to coworking spaces. Keep your eyes open.',
        opportunityCards: [
          { title: 'LinkedIn', desc: 'Follow HR leaders, comment on wellness posts, and share your expertise. Many opportunities start from a thoughtful LinkedIn comment.', example: 'Engaging with an HR Manager\'s post about employee burnout can naturally lead to a conversation about solutions.' },
          { title: 'Business Networking Events', desc: 'Industry meetups, BNI chapters, chamber of commerce events, and startup demo days are full of decision-makers.', example: 'A casual conversation at a networking event: "What does your company do for employee wellness?"' },
          { title: 'Coworking Spaces', desc: 'Growing startups in coworking spaces often lack formal HR infrastructure. They\'re perfect candidates for scalable wellness solutions.', example: 'Many coworking community managers are happy to facilitate introductions to member startups.' },
          { title: 'Hospitals & Clinics', desc: 'Healthcare organizations themselves have high burnout rates. Hospital administrators are increasingly investing in staff wellness.', example: 'Hospitals with 500+ staff frequently look for external EAP providers for nurses and administrative teams.' },
          { title: 'Schools & Universities', desc: 'Educational institutions need wellness support for faculty, administrative staff, and sometimes students.', example: 'A school with 100+ teachers and staff is a strong candidate for workshops, counseling, and yoga programs.' },
          { title: 'NGOs & Social Enterprises', desc: 'Social sector organizations face high compassion fatigue. They often have donor funding specifically for staff wellness.', example: 'NGOs working in humanitarian fields frequently budget for staff counseling and resilience programs.' }
        ]
      }
    ],
    takeaway: 'You don\'t need to "find" opportunities — you need to recognize them. They\'re already in your network, your city, and your professional circles. Just start noticing.',
    checklist: [
      'I\'ve identified at least 3 potential opportunities in my existing network',
      'I understand which types of organizations benefit most from wellness programs',
      'I feel confident spotting opportunities naturally, without forced selling'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 5: Identifying Decision Makers
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_5',
    moduleNumber: 5,
    title: 'Identifying Decision Makers',
    subtitle: 'Who to approach within organizations and what each role cares about.',
    icon: UserCheck,
    themeColor: '#0891b2',
    themeBg: '#ecfeff',
    themeBorder: '#a5f3fc',
    estimatedMinutes: 6,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Know which roles make wellness purchasing decisions',
      'Understand what each decision maker cares about',
      'Learn how to frame your conversation for each role',
      'Identify the right entry point at any organization'
    ],
    sections: [
      {
        badge: 'SECTION 1 • KEY DECISION MAKERS',
        heading: 'Who Makes Wellness Decisions?',
        callout: 'Different organizations have different structures. Here\'s who typically drives wellness purchasing decisions.',
        decisionMakerCards: [
          { role: 'HR Manager / HR Director', cares: 'Employee retention, compliance, workplace culture, reducing grievances', approach: 'Frame wellness as a retention and culture tool that reduces HR workload.' },
          { role: 'HR Business Partner (HRBP)', cares: 'Aligning people strategy with business goals, employee engagement metrics', approach: 'Position wellness as a strategic investment that directly impacts business KPIs.' },
          { role: 'People Operations Lead', cares: 'Employee experience, onboarding, benefits optimization, data-driven decisions', approach: 'Highlight MantraCare\'s assessment tools and reporting dashboards.' },
          { role: 'Learning & Development Head', cares: 'Professional growth, leadership development, team effectiveness', approach: 'Emphasize coaching, workshops, and skill-building webinars.' },
          { role: 'Founder / CEO', cares: 'Company culture, talent attraction, brand reputation, bottom-line impact', approach: 'Share the ROI case: $3.27 saved for every $1 invested in wellness.' },
          { role: 'COO / Operations Head', cares: 'Operational efficiency, absenteeism reduction, productivity metrics', approach: 'Focus on reducing sick days and improving team output through proactive wellness.' },
          { role: 'Employee Experience Manager', cares: 'End-to-end employee journey, satisfaction scores, benefits packages', approach: 'Show how MantraCare integrates seamlessly into the employee experience.' },
          { role: 'Office / Admin Manager', cares: 'Vendor management, employee requests, facility services', approach: 'Present wellness as an easy-to-manage service that employees actively request.' },
          { role: 'Student Welfare Officer (Education)', cares: 'Student and faculty mental health, campus safety, institutional reputation', approach: 'Highlight counseling, crisis support, and workshop capabilities.' }
        ]
      },
      {
        badge: 'SECTION 2 • FINDING THE RIGHT ENTRY POINT',
        heading: 'Tips for Identifying Your Contact',
        callout: 'You don\'t always need to reach the top. Sometimes the best path to a corporate partnership starts with someone you already know.',
        points: [
          'Start with whoever you know: A receptionist, a team lead, or an office manager can point you to the right person.',
          'Use LinkedIn: Search for "HR Manager at [Company Name]" or "People Operations" to identify contacts.',
          'Ask your client: If a therapy client mentions workplace stress, ask who handles employee wellness at their company.',
          'Don\'t overthink it: MantraCare\'s corporate team can navigate the organization once you make the initial introduction.'
        ]
      }
    ],
    takeaway: 'You don\'t need to reach the CEO. Any warm introduction to someone who cares about employee wellbeing is a valuable referral. MantraCare takes it from there.',
    checklist: [
      'I know the 9+ roles that make wellness decisions',
      'I understand what each decision-maker cares about',
      'I can identify the right entry point at an organization'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 6: How To Start Conversations
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_6',
    moduleNumber: 6,
    title: 'How To Start Conversations',
    subtitle: 'Professional, confident outreach techniques that feel natural — not salesy.',
    icon: MessageCircle,
    themeColor: '#4f46e5',
    themeBg: '#eef2ff',
    themeBorder: '#c7d2fe',
    estimatedMinutes: 8,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Master 6 different outreach approaches',
      'Learn conversation templates you can customize',
      'Build confidence without feeling like a salesperson',
      'Know how to transition from conversation to referral'
    ],
    sections: [
      {
        badge: 'SECTION 1 • OUTREACH METHODS',
        heading: 'Professional Outreach Approaches',
        callout: 'The goal isn\'t to sell. It\'s to share a genuine solution with someone who might benefit. Think of it as helping, not pitching.',
        conversationTemplates: [
          {
            method: 'Warm Introduction',
            scenario: 'You know someone at the company personally.',
            template: '"Hi [Name], I\'ve been working with MantraCare as a wellness provider. They have an incredible corporate wellness program that companies love. I thought it might be relevant for [Company]. Would you like me to connect you with their corporate team?"',
            tip: 'Keep it casual. You\'re sharing something valuable with someone you care about.'
          },
          {
            method: 'LinkedIn Outreach',
            scenario: 'You\'ve identified an HR professional on LinkedIn.',
            template: '"Hi [Name], I noticed your work in People Operations at [Company]. As a wellness professional, I\'ve seen firsthand how impactful structured employee wellness programs can be. I work with MantraCare, which offers comprehensive EAP solutions. Would you be open to a brief introduction?"',
            tip: 'Engage with their content first. Comment on their posts for a few days before reaching out.'
          },
          {
            method: 'Email Introduction',
            scenario: 'You have someone\'s email through a mutual connection.',
            template: '"Subject: Employee Wellness Program — Quick Introduction\n\nHi [Name], [Mutual connection] suggested I reach out. I\'m a wellness provider working with MantraCare, which offers corporate EAP and employee wellness programs for organizations like [Company]. I\'d love to connect you with our corporate team for a no-obligation conversation. Would that be helpful?"',
            tip: 'Always mention the mutual connection. Keep the email under 5 sentences.'
          },
          {
            method: 'WhatsApp Introduction',
            scenario: 'You have a personal connection\'s WhatsApp.',
            template: '"Hey [Name]! Quick question — does [Company] have an employee wellness or mental health program? I\'m working with MantraCare, which provides corporate EAP services. Happy to connect their team if it\'s relevant. No pressure at all!"',
            tip: 'WhatsApp is informal. Keep it friendly and zero-pressure.'
          },
          {
            method: 'Networking Event',
            scenario: 'You\'re at a professional event or conference.',
            template: '"What does your organization currently do for employee wellbeing? ... That\'s great. I work with a platform called MantraCare that provides therapy, coaching, yoga, and workshops to corporate employees. I\'d be happy to share more details or connect you with our team."',
            tip: 'Listen first. Ask about their challenges before introducing MantraCare.'
          },
          {
            method: 'Referral Conversation',
            scenario: 'A client or colleague mentions workplace stress.',
            template: '"That sounds really challenging. You know, MantraCare actually works with companies to set up employee wellness programs — therapy, coaching, workshops, all included. Do you think [Company] might be interested? I can make the introduction."',
            tip: 'This happens naturally. Don\'t force it — just be aware when the opportunity arises.'
          }
        ]
      },
      {
        badge: 'SECTION 2 • BUILDING CONFIDENCE',
        heading: 'Mindset for Professional Outreach',
        callout: 'You are not selling a product. You are sharing a solution that genuinely helps employees and organizations. That\'s something to feel proud of.',
        points: [
          'You\'re helping, not selling: Every organization benefits from better employee mental health. You\'re introducing a solution that creates real impact.',
          'Rejection is not personal: If someone says "not now," it doesn\'t mean "never." Many partnerships start months after the first conversation.',
          'Quality over quantity: One warm introduction from a trusted connection is worth more than 100 cold emails.',
          'Be yourself: Your authenticity as a wellness professional is your biggest asset. Don\'t try to sound like a corporate salesperson.'
        ]
      }
    ],
    takeaway: 'The best corporate partnerships start with genuine conversations, not sales pitches. Be natural, be helpful, and let MantraCare\'s team handle the rest.',
    checklist: [
      'I have at least one outreach template I feel comfortable using',
      'I understand the importance of warm introductions over cold outreach',
      'I feel confident starting conversations without feeling salesy'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 7: Common Questions & Objections
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_7',
    moduleNumber: 7,
    title: 'Common Questions & Objections',
    subtitle: 'How to respond professionally when organizations push back — and when to hand off.',
    icon: HelpCircle,
    themeColor: '#dc2626',
    themeBg: '#fef2f2',
    themeBorder: '#fecaca',
    estimatedMinutes: 7,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Handle the 5 most common objections confidently',
      'Know exactly when to stop and hand off to MantraCare',
      'Respond professionally without arguing or over-promising',
      'Turn objections into opportunities'
    ],
    sections: [
      {
        badge: 'SECTION 1 • OBJECTION HANDLING',
        heading: 'Common Objections & Professional Responses',
        callout: 'Objections are normal. They usually signal interest, not rejection. A good response shows understanding, not defensiveness.',
        objectionCards: [
          {
            objection: '"We already have health insurance."',
            response: 'That\'s great! Health insurance typically covers clinical treatment after problems arise. An EAP provides proactive wellness support — counseling, coaching, workshops — that prevents issues before they become costly claims. Many companies use both together.',
            handoff: 'If they want to compare coverage, hand off to MantraCare\'s corporate team for a detailed comparison.'
          },
          {
            objection: '"We don\'t have the budget right now."',
            response: 'I completely understand. The interesting thing is that wellness programs actually save money — studies show $3-6 saved for every $1 invested through reduced absenteeism and turnover. MantraCare also offers flexible plans that work within different budgets.',
            handoff: 'Let MantraCare\'s team discuss pricing options. Never quote specific prices yourself.'
          },
          {
            objection: '"We already use another wellness provider."',
            response: 'That\'s wonderful that you\'re already investing in wellness. Many organizations work with multiple providers to fill different gaps. MantraCare might complement your existing program with services your current provider doesn\'t offer.',
            handoff: 'This is a perfect scenario to hand off. MantraCare\'s corporate team can do a gap analysis.'
          },
          {
            objection: '"Our employees don\'t need therapy."',
            response: 'Absolutely — and that\'s not what this is about. Employee wellness includes coaching, nutrition, fitness, workshops, and stress management. It\'s about prevention and peak performance, not just therapy. The most successful programs are used by healthy employees who want to stay that way.',
            handoff: 'Suggest a no-obligation awareness webinar as a soft entry point. MantraCare can organize one.'
          },
          {
            objection: '"We\'re too small for this."',
            response: 'MantraCare works with organizations of all sizes — from 10-person startups to 10,000-employee enterprises. In fact, smaller companies often see the biggest impact because every employee matters even more.',
            handoff: 'MantraCare has specific starter packages designed for small and growing companies.'
          }
        ]
      },
      {
        badge: 'SECTION 2 • KNOWING WHEN TO HAND OFF',
        heading: 'When to Stop & Let MantraCare Take Over',
        callout: 'Your role is to open the door. MantraCare\'s experienced corporate team walks through it.',
        points: [
          'Hand off when they ask about pricing: Never quote prices. Say "Our corporate team can share the most accurate pricing based on your specific needs."',
          'Hand off when they want a formal proposal: This is great news! It means they\'re interested. Connect them with MantraCare immediately.',
          'Hand off when the conversation gets technical: If they ask about data security, compliance, or integration — those are questions for the corporate team.',
          'Hand off when you feel uncomfortable: If the conversation feels like a negotiation, it\'s time to bring in the experts. That\'s not your job.',
          'Always follow up: After handing off, check in with MantraCare to see how the conversation went. Stay informed and involved.'
        ]
      }
    ],
    takeaway: 'Objections aren\'t roadblocks — they\'re invitations to share more information. Respond with empathy, stay honest, and hand off to MantraCare when it\'s time for business talk.',
    checklist: [
      'I can respond to the top 5 objections professionally',
      'I know exactly when to hand off to MantraCare\'s corporate team',
      'I feel prepared for real-world conversations'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 8: How To Submit Corporate Referrals
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_8',
    moduleNumber: 8,
    title: 'How To Submit Corporate Referrals',
    subtitle: 'Step-by-step guide to submitting referrals through the MantraCare platform.',
    icon: Send,
    themeColor: '#059669',
    themeBg: '#ecfdf5',
    themeBorder: '#a7f3d0',
    estimatedMinutes: 5,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Know exactly how to submit a corporate referral',
      'Understand what information makes a referral successful',
      'Follow best practices for referral quality',
      'Track your referral status'
    ],
    sections: [
      {
        badge: 'SECTION 1 • STEP-BY-STEP GUIDE',
        heading: 'How to Submit a Corporate Referral',
        callout: 'Submitting a referral is simple. The more information you provide, the faster MantraCare can act on it.',
        stepByStep: [
          { step: 1, title: 'Navigate to Referrals', desc: 'Go to your MantraCare provider dashboard and find the "Refer a Corporate" section.' },
          { step: 2, title: 'Enter Company Details', desc: 'Provide the company name, industry, approximate employee count, and location.' },
          { step: 3, title: 'Add Contact Information', desc: 'Share the name, email, phone, and role of your contact at the organization.' },
          { step: 4, title: 'Describe the Opportunity', desc: 'Briefly explain how you know the contact, what challenges the company faces, and why they might benefit from wellness.' },
          { step: 5, title: 'Submit & Track', desc: 'Submit the referral and track its progress. You\'ll receive updates as MantraCare\'s team engages with the company.' }
        ]
      },
      {
        badge: 'SECTION 2 • BEST PRACTICES',
        heading: 'What Makes a Great Referral',
        callout: 'A quality referral with context is worth 10x more than a name dropped without information.',
        cards: [
          { title: 'Warm Over Cold', desc: 'A referral where you\'ve already had a conversation with the contact converts at 5-10x higher rates than a cold lead.' },
          { title: 'Provide Context', desc: 'Explain how you know the person, what prompted the conversation, and any challenges the company mentioned.' },
          { title: 'Set Expectations', desc: 'Let your contact know that MantraCare\'s corporate team will reach out. This way, they expect the call.' },
          { title: 'Follow Up', desc: 'After submitting, check in with your contact: "Did MantraCare\'s team reach out? How was the conversation?"' },
          { title: 'Be Patient', desc: 'Corporate partnerships can take 2-8 weeks to finalize. Large organizations have multiple approval layers.' }
        ]
      }
    ],
    takeaway: 'A great referral isn\'t just a name — it\'s a warm introduction with context. The better the information you provide, the faster MantraCare can turn it into a partnership.',
    checklist: [
      'I know the 5-step referral submission process',
      'I understand what information makes a referral valuable',
      'I\'ll set expectations with my contact before submitting'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 9: Commission & Preferred Provider
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_9',
    moduleNumber: 9,
    title: 'Commission & Preferred Provider Program',
    subtitle: 'Understanding your rewards, commission structure, and preferred provider opportunities.',
    icon: DollarSign,
    themeColor: '#ca8a04',
    themeBg: '#fefce8',
    themeBorder: '#fde68a',
    estimatedMinutes: 6,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Understand the commission structure honestly',
      'Know what makes a referral eligible for commission',
      'Learn about Preferred Provider opportunities',
      'Set realistic expectations for timelines and earnings'
    ],
    sections: [
      {
        badge: 'SECTION 1 • COMMISSION STRUCTURE',
        heading: 'How Commissions Work',
        callout: 'Commission rates range from 1-20% and depend on the opportunity, contract value, and agreement terms. MantraCare is transparent about every detail.',
        points: [
          'Variable Commission: Rates range from 1-20% and are determined by the size and nature of each corporate agreement. Larger, longer-term contracts may earn higher rates.',
          'Agreement-Based: Your specific commission percentage is confirmed when the corporate deal is finalized. It\'s documented in your partner agreement.',
          'Eligible Referrals: To earn commission, you must submit the referral through the platform BEFORE MantraCare engages with the company. Retroactive claims are not eligible.',
          'Payment Timeline: Commissions are processed after the corporate client completes their first payment cycle. This typically takes 30-90 days after the contract starts.',
          'Transparency: You\'ll have visibility into your referral status, deal progress, and commission calculations through your partner dashboard (coming soon).'
        ]
      },
      {
        badge: 'SECTION 2 • PREFERRED PROVIDER PROGRAM',
        heading: 'Becoming a Preferred Provider',
        callout: 'Where appropriate, Corporate Growth Partners who refer organizations may receive priority for providing services to those companies.',
        cards: [
          { title: 'What It Means', desc: 'As a preferred provider, you get priority assignment for therapy, coaching, or workshop sessions with companies you helped onboard. This can become a consistent source of clients.' },
          { title: 'How It Works', desc: 'When a corporate client needs providers in your area and specialty, MantraCare prioritizes partners who made the initial referral. It\'s a natural extension of your relationship with the company.' },
          { title: 'Not Guaranteed', desc: 'Preferred provider status depends on location, specialization, availability, and the specific needs of each corporate client. MantraCare makes these decisions based on what\'s best for employees.' },
          { title: 'Long-Term Value', desc: 'A single corporate partnership can provide you with a steady stream of sessions for months or years. This is one of the most valuable benefits of the program.' }
        ]
      }
    ],
    takeaway: 'Be honest with yourself and others about earnings. Commission is a real benefit, but the true value is in building long-term corporate relationships and expanding your practice.',
    checklist: [
      'I understand that commission rates vary by agreement (1-20%)',
      'I know I must submit referrals before MantraCare engages',
      'I have realistic expectations about timelines and earnings'
    ]
  },

  // ────────────────────────────────────────────
  // MODULE 10: Communication & Ethics
  // ────────────────────────────────────────────
  {
    moduleId: 'corp_mod_10',
    moduleNumber: 10,
    title: 'Communication & Ethics',
    subtitle: 'Professional conduct, privacy, responsible communication, and representing MantraCare.',
    icon: Scale,
    themeColor: '#0f172a',
    themeBg: '#f8fafc',
    themeBorder: '#e2e8f0',
    estimatedMinutes: 7,
    videoUrl: null,
    quizData: null,
    downloadables: [],
    objectives: [
      'Understand your ethical obligations as a Corporate Growth Partner',
      'Know what you should and should never promise',
      'Learn the escalation process and support channels',
      'Represent MantraCare professionally in all interactions'
    ],
    sections: [
      {
        badge: 'SECTION 1 • PROFESSIONAL CONDUCT',
        heading: 'Code of Professional Conduct',
        callout: 'As a Corporate Growth Partner, you represent MantraCare. Every interaction should reflect integrity, professionalism, and genuine care.',
        conductRules: [
          { rule: 'Honesty First', desc: 'Never exaggerate capabilities, guarantee specific outcomes, or make promises about service levels that haven\'t been confirmed by MantraCare\'s corporate team.' },
          { rule: 'Respect Boundaries', desc: 'If someone says "not interested," respect it immediately. Never pressure, follow up excessively, or use guilt tactics.' },
          { rule: 'Separate Roles', desc: 'Keep your clinical practice separate from your partnership role. Never use therapy sessions to prospect for corporate leads.' },
          { rule: 'Accurate Representation', desc: 'Only share information that is accurate and current. If you\'re unsure about a service or feature, say "Let me confirm with the corporate team" rather than guessing.' }
        ]
      },
      {
        badge: 'SECTION 2 • PRIVACY & CONFIDENTIALITY',
        heading: 'Privacy Standards',
        callout: 'Protecting client and organizational information is non-negotiable. Always err on the side of caution.',
        points: [
          'Never share employee data: If you provide services to employees through a corporate program, their personal and clinical data is strictly confidential.',
          'Protect company information: Details about corporate contracts, pricing, employee utilization, and organizational challenges shared with you during the partnership process must remain confidential.',
          'No public disclosure: Never post about specific corporate partnerships on social media or discuss client companies publicly without explicit written permission.',
          'Data handling: If you receive any documents, reports, or data from corporate clients, handle them according to MantraCare\'s data protection guidelines.'
        ]
      },
      {
        badge: 'SECTION 3 • WHAT TO NEVER PROMISE',
        heading: 'Commitments You Must Never Make',
        callout: 'These are red lines. Making unauthorized promises can damage relationships and put MantraCare\'s reputation at risk.',
        cards: [
          { title: '❌ Never Promise Pricing', desc: '"I\'ll get you a 50% discount" — Only MantraCare\'s corporate team can discuss or commit to pricing terms.' },
          { title: '❌ Never Promise Timelines', desc: '"You\'ll be set up within a week" — Implementation timelines depend on organizational size and complexity.' },
          { title: '❌ Never Promise Specific Providers', desc: '"I\'ll be your company\'s therapist" — Provider assignment is based on need, location, and availability.' },
          { title: '❌ Never Promise Outcomes', desc: '"Your employees will be happier in 30 days" — Wellness outcomes vary and cannot be guaranteed.' }
        ]
      },
      {
        badge: 'SECTION 4 • ESCALATION & SUPPORT',
        heading: 'Getting Help When You Need It',
        callout: 'You\'re never alone. MantraCare has dedicated support channels for Corporate Growth Partners.',
        supportChannels: [
          { channel: 'Email Support', detail: 'provider@mantra.care — For questions about the program, referrals, commissions, or any concerns.' },
          { channel: 'Corporate Team', detail: 'For any business conversation that goes beyond a simple introduction, escalate to the corporate partnerships team.' },
          { channel: 'Escalation Process', detail: 'If a corporate contact raises a complaint, concern, or urgent issue — immediately forward to provider@mantra.care with full context.' },
          { channel: 'Monthly Partner Updates', detail: 'MantraCare sends regular updates with program news, success stories, and tips for Corporate Growth Partners.' }
        ]
      }
    ],
    takeaway: 'Being a Corporate Growth Partner is a privilege built on trust. Protect that trust through honest communication, strict confidentiality, and professional conduct in every interaction.',
    checklist: [
      'I understand my ethical obligations as a Corporate Growth Partner',
      'I know the 4 things I should never promise',
      'I know how to escalate issues via provider@mantra.care'
    ]
  }
];

export default CORP_ACADEMY_MODULES;
