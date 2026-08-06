import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  TrendingUp, Award, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight,
  Globe, Share2, Search, FileText, MessageSquare, Link, Monitor, Mail,
  QrCode, Star, Gift, Target, Sparkles, BookOpen, Layers, Check, ExternalLink,
  Users, AlertCircle, Shield, Lightbulb, Zap, Rocket, HelpCircle, X, Download, Copy,
  Play, Clock, Compass, ChevronLeft, Video, Upload, Calendar, Eye, ThumbsUp, ThumbsDown, UserCheck, Wand2,
  ChevronDown, ChevronUp, Camera, Mic, Sun, VideoIcon, Info, HeartHandshake, Activity, Moon, MapPin, Phone, Megaphone
} from 'lucide-react';
import { getCurrentUserId, MANTRA_CONFIG, completeLesson, goToDashboard } from '../../mantra';
import { submitActivitySubmission } from '../../mantra/api';
import { PLATFORM_CONFIGS } from '../../config/platformConfig';
import ProviderContentStudio from './ProviderContentStudio';
import { COUNTRIES, GLOBAL_CITIES, fetchUserCountryByIP, searchGlobalCities, validateEmail, validatePhone } from '../../utils/locationData';
import { CompletionScreen } from '../index';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

// ─── PLATFORM PROMOTION METADATA SCHEMA (MODULE 3) ───────────────────────────
const getPlatformsData = (brand) => {
  const brandName = brand?.name || 'TherapyMantra';
  const baseUrl = brand?.listingBaseUrl || 'https://therapists.therapymantra.co';
  return [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: '#0a66c2',
      logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
      why: 'Primary professional network for corporate clients & healthcare peers.',
      location: 'Featured Section & Bio',
      benefit: 'High Trust & Corporate Leads',
      bestPractice: `Pin your ${brandName} listing URL in your profile Featured Section & Experience bio.`,
      url: 'https://linkedin.com'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#c026d3',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
      why: 'Visual platform ideal for sharing short mental health educational carousel tips & Reels.',
      location: 'Bio Link & Story Highlights',
      benefit: 'High Engagement & Young Adult Reach',
      bestPractice: `Place your ${brandName} profile link in your Instagram bio link.`,
      url: 'https://instagram.com'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#2563eb',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg',
      why: 'Reaches client communities, support groups, and family wellness demographics.',
      location: 'About Section & Pinned Post',
      benefit: 'Community & Family Client Reach',
      bestPractice: `Add your ${brandName} booking URL to your profile About section & pinned post.`,
      url: 'https://facebook.com'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: '#059669',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      why: 'Direct messaging channel for client inquiries and auto-reply scheduling.',
      location: 'Business About & Status',
      benefit: 'Immediate Direct Client Bookings',
      bestPractice: `Add your ${brandName} link to your WhatsApp Business About profile & Status updates.`,
      url: 'https://whatsapp.com'
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      color: '#0f172a',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
      why: 'Real-time mental health advocacy and healthcare community discussions.',
      location: 'Bio & Pinned Thread',
      benefit: 'Thought Leadership & Peer Network',
      bestPractice: `Add your ${brandName} link in your bio and pin a post about your consultation availability.`,
      url: 'https://x.com'
    },
    {
      id: 'email',
      name: 'Email Signature',
      color: '#0891b2',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
      why: 'Passive visibility across all everyday professional communications.',
      location: 'Email Footer Sign-off',
      benefit: 'Passive Recurring Visibility',
      bestPractice: `Add a hyperlinked line: "Schedule an online consultation: ${brandName} Profile".`,
      url: baseUrl
    }
  ];
};

// ─── WEEKLY GROWTH ROUTINE PLANNER DATA (MODULE 6) ───────────────────────────
const getWeeklyRoutine = (brand) => {
  const brandName = brand?.name || 'TherapyMantra';
  return [
    { day: 'Monday', action: `Share 1 educational post on LinkedIn linking to your ${brandName} profile.`, time: '5 min', icon: Share2 },
    { day: 'Tuesday', action: 'Post 1 Instagram Story highlighting your consultation availability.', time: '5 min', icon: Globe },
    { day: 'Wednesday', action: 'Answer 1 anxiety or wellness question on Reddit with thoughtful advice.', time: '10 min', icon: MessageSquare },
    { day: 'Thursday', action: 'Answer 1 mental health question on Quora with educational insights.', time: '10 min', icon: HelpCircle },
    { day: 'Friday', action: `Update your ${brandName} profile availability slots for the upcoming week.`, time: '5 min', icon: Calendar },
    { day: 'Saturday', action: 'Publish 1 short educational video (Reel or YouTube Short) on wellness.', time: '15 min', icon: Video },
    { day: 'Sunday', action: 'Review profile visits and respond to all client messages.', time: '5 min', icon: CheckCircle2 }
  ];
};

// ─── AUDIT CHECKLIST FOR MODULE 2 ───────────────────────────────────────────
const getProfileAuditItems = (brand) => {
  const brandName = brand?.name || 'TherapyMantra';
  const isOCD = brand?.id === 'ocdmantra';
  return [
    {
      key: 'photo',
      label: 'Profile Photo',
      poor: 'Blurry selfie, casual background, poor lighting',
      good: 'High-res professional headshot with warm expression & clean background',
      tip: 'Clients decide whether to trust a provider within 3 seconds of viewing their photo.'
    },
    {
      key: 'bio',
      label: 'Clinical Bio & Specialty Headline',
      poor: '"Doctor offering health consultations."',
      good: isOCD ? '"Licensed ERP Specialist • OCD & Anxiety Disorder Expert with 8+ Years Experience"' : '"Licensed Psychotherapist • Anxiety & Burnout Specialist with 8+ Years Experience"',
      tip: 'Clearly state who you help and what conditions you specialize in.'
    },
    {
      key: 'availability',
      label: 'Calendar Availability Slots',
      poor: 'Zero open calendar slots listed for the week',
      good: '5+ open recurring weekly slots refreshed every Friday',
      tip: 'Profiles with active open slots receive up to 3x higher instant bookings.'
    },
    {
      key: 'specialization',
      label: 'Focus Areas & Modalities',
      poor: 'Generic listing without explicit therapeutic approaches',
      good: isOCD ? 'Explicitly tagged Exposure & Response Prevention (ERP), CBT & I-CBT modalities' : 'Explicitly tagged CBT, EMDR, Mindfulness & Couples Therapy modalities',
      tip: `Helps ${brandName} recommendation engine match you with ideal clients.`
    },
    {
      key: 'credentials',
      label: 'Verified Credentials & Languages',
      poor: 'Missing license numbers or language proficiencies',
      good: 'Verified board license badge & all fluent languages listed',
      tip: 'Builds immediate clinical authority and cross-cultural reach.'
    }
  ];
};

export default function GrowYourPracticeAcademy({ onBack, brandKey = 'therapymantra' }) {
  const brand = PLATFORM_CONFIGS[brandKey] || PLATFORM_CONFIGS.therapymantra;

  // STEP MANAGEMENT WITH LOCALSTORAGE PERSISTENCE:
  // 0: Welcome
  // 1: Step 0.5 - Custom Profile URL Entry
  // 2: Mod 1 - Client Acquisition Funnel
  // 3: Mod 2 - Interactive Profile Audit Score
  // 4: Mod 3 - Where & How to Promote
  // 5: Mod 4 - Help First, Promote Second
  // 6: Mod 5 - Create Videos That Bring Clients
  // 7: Mod 6 - Weekly Growth Routine
  // 8: Completion Screen
  const storageKey = `growth_academy_step_${brand.lessonId || 'grow-your-practice'}`;

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 8) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load step index from localStorage', e);
    }
    return 0;
  });

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const userId = getCurrentUserId();
  const lessonId = brand.lessonId || 'grow-your-practice';
  const TOTAL_STEPS = 9;

  // 1. Fetch initial progress from DB on mount
  useEffect(() => {
    async function fetchDBProgress() {
      try {
        const res = await fetch(`${API_BASE}/api/activities/progress/${encodeURIComponent(userId)}/${encodeURIComponent(lessonId)}`);
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          const stepFromDB = json.data.current_step;
          if (stepFromDB !== undefined && stepFromDB !== null && stepFromDB >= 1 && stepFromDB <= 7) {
            setCurrentStepIndex(stepFromDB);
          }
        }
      } catch (e) {
        console.warn('[GrowYourPracticeAcademy] DB progress fetch notice:', e);
      }
    }
    fetchDBProgress();
  }, [userId, lessonId]);

  // 2. Save currentStepIndex to DB & localStorage whenever step changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, currentStepIndex.toString());
    } catch (e) { }

    async function syncDBProgress() {
      try {
        await fetch(`${API_BASE}/api/activities/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            lessonId,
            currentStep: currentStepIndex,
            totalSteps: TOTAL_STEPS
          })
        });
      } catch (e) {
        console.warn('[GrowYourPracticeAcademy] DB progress sync notice:', e);
      }
    }
    syncDBProgress();
  }, [currentStepIndex, storageKey, userId, lessonId]);

  // USER PROFILE URL INPUT & VALIDATION STATE
  const [customProfileUrl, setCustomProfileUrl] = useState('');
  const [urlValidationError, setUrlValidationError] = useState('');
  const [activeProfileUrl, setActiveProfileUrl] = useState('');

  // MODULE 2 AUDIT EXPANDED ITEMS
  const [expandedAuditKey, setExpandedAuditKey] = useState('photo');

  // Video Submission Form & Location State
  const [videoFormData, setVideoFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceOffered: brand.submissionService || 'therapy',
    city: '',
    videoFile: null,
    consent: false
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityOptions, setCityOptions] = useState(GLOBAL_CITIES);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef(null);

  const [validationErrors, setValidationErrors] = useState({});

  // Auto-detect country code by IP on mount
  useEffect(() => {
    fetchUserCountryByIP().then(c => {
      if (c) setSelectedCountry(c);
    });
  }, []);

  // Filter countries by query
  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
    c.dialCode.includes(countrySearchQuery) ||
    c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Search cities dynamically
  useEffect(() => {
    if (citySearchQuery.trim().length > 0) {
      searchGlobalCities(citySearchQuery).then(res => setCityOptions(res));
    } else {
      setCityOptions(GLOBAL_CITIES);
    }
  }, [citySearchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const progressPercent = Math.round(((currentStepIndex) / (TOTAL_STEPS - 1)) * 100);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentStepIndex < TOTAL_STEPS - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TOTAL_STEPS - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const validateAndSaveProfileUrl = (e) => {
    e.preventDefault();
    const clean = customProfileUrl.trim();
    if (!clean) {
      setUrlValidationError('Please paste a valid profile URL.');
      return;
    }
    const isTherapyMantra = brand.id === 'therapymantra' && (clean.includes('therapymantra.co') || clean.includes('therapists.therapymantra.co'));
    const isOCDMantra = brand.id === 'ocdmantra' && (clean.includes('ocdmantra.com') || clean.includes('ocdmantra.co'));
    const isValidDomain = isTherapyMantra || isOCDMantra || (brand.listingBaseUrl && clean.includes(new URL(brand.listingBaseUrl).hostname));

    if (!isValidDomain) {
      setUrlValidationError(`URL must start with ${brand.listingBaseUrl || 'https://ocdmantra.com/list/therapist/'}`);
      return;
    }
    setUrlValidationError('');
    setActiveProfileUrl(clean);
    handleNext();
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    // 1. Email & Phone Validations
    const emailVal = validateEmail(videoFormData.email);
    const fullPhone = `${selectedCountry.dialCode} ${videoFormData.phone.trim()}`;
    const phoneVal = validatePhone(videoFormData.phone);

    const errors = {};
    if (!emailVal.isValid) errors.email = emailVal.message;
    if (!phoneVal.isValid) errors.phone = phoneVal.message;
    if (!videoFormData.consent) {
      alert('Please check the consent checkbox before submitting your video.');
      return;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    try {
      setIsSubmitting(true);

      let videoUrl = '';
      let videoPublicId = '';

      // 2. Cloudinary Video Upload via POST /api/uploads
      if (videoFormData.videoFile) {
        const uploadData = new FormData();
        uploadData.append('file', videoFormData.videoFile);
        uploadData.append('folder', 'provider_intro_videos');

        const uploadRes = await fetch(`${API_BASE}/api/uploads`, {
          method: 'POST',
          body: uploadData
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.success && uploadJson.data) {
          videoUrl = uploadJson.data.secure_url || uploadJson.data.url || '';
          videoPublicId = uploadJson.data.public_id || '';
        } else {
          console.error('❌ Cloudinary Upload Failed:', uploadJson);
          alert(`Video upload failed: ${uploadJson.error || 'Unknown error'}`);
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Record in DB via POST /api/activity-submissions (via submitActivitySubmission)
      const fullPhone = `${selectedCountry.dialCode} ${videoFormData.phone}`;
      await submitActivitySubmission({
        userId,
        lessonId: brand.lessonId || 'grow-your-practice',
        activityTitle: brand.name || 'Grow Your Practice Video Submission',
        submissionType: 'video_introduction',
        formData: {
          name: videoFormData.name,
          email: videoFormData.email,
          phone: fullPhone,
          country: selectedCountry.name,
          countryCode: selectedCountry.dialCode,
          profileUrl: activeProfileUrl,
          videoUrl: videoUrl,
          videoPublicId: videoPublicId,
          service: brand.submissionService || 'therapy',
          consent: videoFormData.consent,
          submittedAt: new Date().toISOString()
        }
      });

      // Also trigger /api/activities/complete endpoint
      await fetch(`${API_BASE}/api/activities/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          service: brand.submissionService || 'therapy',
          activityId: brand.activityId,
          lessonId: brand.lessonId,
          metadata: {
            name: videoFormData.name,
            email: videoFormData.email,
            phone: fullPhone,
            country: selectedCountry.name,
            profileUrl: activeProfileUrl,
            videoUrl: videoUrl
          }
        })
      });

      setIsCompleted(true);
      setShowCompletionModal(true);
    } catch (err) {
      console.error('[GrowYourPracticeAcademy] Video Submission Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="animate-fade-in">

      {/* Top Header Bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '10px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={brand.logo} alt={brand.name} style={{ height: '26px', width: 'auto' }} />
            <div style={{ height: '16px', width: '1px', background: '#cbd5e1' }} />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>Grow Your Practice</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setIsStudioOpen(true)} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
              <Megaphone size={13} /> Promotion Toolkit
            </button>

            <button onClick={() => { if (onBack) onBack(); else goToDashboard(); }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={13} /> Continue Later
            </button>
          </div>
        </div>
      </div>

      {/* Progress Line Bar */}
      {currentStepIndex > 0 && currentStepIndex < TOTAL_STEPS - 1 && (
        <div style={{ width: '100%', height: '4px', background: '#e2e8f0' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: brand.primaryColor, transition: 'width 0.3s ease' }} />
        </div>
      )}

      {/* Main Learning Workspace Container */}
      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', padding: '24px 16px', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* MODULE 1 - ANIMATED CLIENT JOURNEY */}
        {(currentStepIndex <= 2) && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODULE 1 OF 6</div>
              <h2 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>How {brand.name || 'TherapyMantra'} Gets You Clients</h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Interactive client acquisition funnel breakdown.</p>
            </div>

            {/* Interactive Step-by-Step Funnel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
              {[
                { step: '1', title: 'Client Searches Google', desc: `Clients search for specialists or wellness support online.`, icon: Search, color: '#2563eb' },
                { step: '2', title: `${brand.name || 'TherapyMantra'} Hub`, desc: `${brand.name || 'TherapyMantra'} surfaces verified provider directories.`, icon: Globe, color: '#059669' },
                { step: '3', title: 'Your Listing', desc: 'Client lands directly on your personalized listing page.', icon: UserCheck, color: '#c026d3' },
                { step: '4', title: 'Direct Booking', desc: 'Client schedules a 1-on-1 online consultation session.', icon: Calendar, color: '#dc2626' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.2s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ffffff', color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.84rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>{item.step}</div>
                      <Icon size={18} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#0f172a' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', lineHeight: 1.35 }}>{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Embedded Learning Video */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', aspectRatio: '16/9', background: '#000000', position: 'relative' }}>
              <video
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                poster={brand?.youtubeVideos?.gettingClientsPoster || 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785830152/thumnail_2_YT_ubtbev.jpg'}
                src={brand?.youtubeVideos?.gettingClients || brand?.videos?.gettingClients || 'https://res.cloudinary.com/hxbamdqf/video/upload/v1785829768/vidssave.com_Getting_Clients_from_Mantra_Business_Growth_through_Platform_Visibility_1080P_o0lhmj.mp4'}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>



            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MODULE 2 - INTERACTIVE PROFILE AUDIT SCORE */}
        {currentStepIndex === 3 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODULE 2 OF 6</div>
              <h2 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Optimize Your Listing (Profile Audit)</h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Interactive profile completion audit & conversion checklist.</p>
            </div>

            {/* Expandable Accordion Profile Audit Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getProfileAuditItems(brand).map(item => {
                const isExpanded = expandedAuditKey === item.key;
                return (
                  <div key={item.key} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                    <div
                      onClick={() => setExpandedAuditKey(isExpanded ? null : item.key)}
                      style={{ padding: '14px 16px', background: isExpanded ? '#eff6ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={14} />
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{item.label}</span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ fontSize: '0.64rem', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase' }}>Poor Example</div>
                            <div style={{ fontSize: '0.78rem', color: '#991b1b', marginTop: '2px', fontWeight: 700 }}>{item.poor}</div>
                          </div>
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ fontSize: '0.64rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase' }}>Good Example</div>
                            <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '2px', fontWeight: 700 }}>{item.good}</div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#475569', background: '#fffbe8', border: '1px solid #ffe58f', borderRadius: '8px', padding: '8px 12px', fontWeight: 700 }}>
                          💡 <strong>Clinical Audit Tip:</strong> {item.tip}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Embedded Video: Market Your Profile */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', aspectRatio: '16/9', background: '#000000', position: 'relative' }}>
              <video
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                poster={brand?.youtubeVideos?.marketProfilePoster || 'https://res.cloudinary.com/hxbamdqf/image/upload/v1785830152/thumbnail_1_YT_t5egvr.jpg'}
                src={brand?.youtubeVideos?.marketProfile || brand?.videos?.marketProfile || 'https://res.cloudinary.com/hxbamdqf/video/upload/v1785829769/Market_Your_Profile_1080P_v6wtcx.mp4'}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MODULE 3 - WHERE & HOW TO PROMOTE (WITH AI CONTENT STUDIO CTA) */}
        {currentStepIndex === 4 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODULE 3 OF 6</div>
              <h2 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Where & How to Promote Your Profile</h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Platform placement guide with best practices and expected clinical benefits.</p>
            </div>

            {/* Platform Grid with Real Brand Logos & No Durations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {getPlatformsData(brand).map(plat => (
                <div key={plat.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '6px', boxSizing: 'border-box' }}>
                        <img src={plat.logoUrl} alt={plat.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a' }}>{plat.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📍</span> {plat.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    {plat.why}
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800 }}>
                    <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🎯</span> {plat.benefit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlighted AI Content Studio Call-to-Action Section */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', boxShadow: '0 4px 14px rgba(15,23,42,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                  <Wand2 size={16} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>Ready to Create Your Posts?</h4>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.3 }}>
                    Instantly generate LinkedIn, Instagram & Reddit posts with Promotion Toolkit.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStudioOpen(true)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 800, fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
              >
                <Wand2 size={14} /> Open Promotion Toolkit
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: MODULE 4 - HELP FIRST, PROMOTE SECOND */}
        {currentStepIndex === 5 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODULE 4 OF 6</div>
              <h2 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Help First. Promote Second.</h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Build genuine clinical authority on Reddit and Quora through helpful responses.</p>
            </div>

            {/* Conversation Mockups Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <X size={16} /> Wrong (Spammy & Self-Promotional)
                </div>
                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '10px', fontSize: '0.76rem', color: '#991b1b', border: '1px solid #fca5a5', lineHeight: 1.4 }}>
                  "Book a therapy session with me right now on {brand.name}! Click here for 20% off direct consultation slots!"
                </div>
                <div style={{ fontSize: '0.72rem', color: '#7f1d1d', fontWeight: 600 }}>
                  ⚠️ Zero educational value, breaks community guidelines, and leads to account bans.
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#059669', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={16} /> Right (Helpful & Educational)
                </div>
                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '10px', fontSize: '0.76rem', color: '#166534', border: '1px solid #86efac', lineHeight: 1.4 }}>
                  "When managing acute stress, try grounding exercises like 5-4-3-2-1 breathing. As a licensed provider practicing on {brand.name}, I often recommend..."
                </div>
                <div style={{ fontSize: '0.72rem', color: '#14532d', fontWeight: 600 }}>
                  ✅ Establishes clinical expertise first, builds trust, and mentions profile only when relevant.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: MODULE 5 - CREATE VIDEOS THAT BRING CLIENTS */}
        {currentStepIndex === 6 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 12px 36px rgba(15, 23, 42, 0.04)' }} className="animate-fade-in">
            {/* Header Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '18px', padding: '20px 22px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(37, 99, 235, 0.2)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'inline-block' }}>
                  MODULE 5 OF 6 • VIDEO CONTENT GUIDE
                </span>
                <h2 style={{ margin: '8px 0 4px', fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  Create Videos That Bring Clients
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Educational short-form videos build trust fast, turning profile views into booked consultations.
                </p>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0, boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                <Video size={24} />
              </div>
            </div>

            {/* SECTION 1: WHY VIDEOS MATTER */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color={brand.primaryColor} /> 1. WHY SHORT VIDEOS WORK
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  { title: 'Record Once', icon: Video, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
                  { title: 'Post Everywhere', icon: Share2, color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
                  { title: 'More Visits', icon: Eye, color: '#c026d3', bg: '#fae8ff', border: '#f5d0fe' },
                  { title: 'More Bookings', icon: Calendar, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} style={{ background: '#ffffff', border: `1px solid ${item.border}`, borderRadius: '12px', padding: '12px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={17} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#0f172a' }}>{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: IDEAS & RECORDING SETUP */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Popular Topics */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HeartHandshake size={14} color="#2563eb" /> 2. POPULAR CLINICAL TOPICS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { topic: 'Anxiety & Overthink', icon: HeartHandshake, color: '#2563eb', bg: '#eff6ff', border: '#dbeafe' },
                    { topic: 'Healthy Boundaries', icon: Users, color: '#c026d3', bg: '#fae8ff', border: '#f5d0fe' },
                    { topic: 'Stress & Burnout', icon: Activity, color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
                    { topic: 'Sleep & Relaxation', icon: Moon, color: '#059669', bg: '#f0fdf4', border: '#dcfce7' }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={16} color={item.color} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.76rem', fontWeight: 800, color: item.color }}>{item.topic}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recording Setup */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={14} color="#059669" /> 3. EASY RECORDING SETUP
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { title: 'Camera', sub: 'Eye-level phone camera', icon: Camera, color: '#2563eb', bg: '#eff6ff' },
                    { title: 'Lighting', sub: 'Facing soft window light', icon: Sun, color: '#d97706', bg: '#fffbe8' },
                    { title: 'Audio', sub: 'Quiet room or mic', icon: Mic, color: '#059669', bg: '#f0fdf4' },
                    { title: 'Smile', sub: 'Warm, natural posture', icon: UserCheck, color: '#7c3aed', bg: '#f3e8ff' }
                  ].map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '0.76rem', display: 'block', lineHeight: 1.2 }}>{s.title}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.66rem', lineHeight: 1.25, display: 'block', marginTop: '2px' }}>{s.sub}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: 45-SECOND FORMULA */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 900, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={14} color={brand.primaryColor} /> 4. THE 45-SECOND VIDEO FORMULA
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>0-5s</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>1. Hook</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>State the problem</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#059669', background: '#f0fdf4', padding: '2px 8px', borderRadius: '10px' }}>5-15s</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>2. Intro</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>Name & clinical focus</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#d97706', background: '#fffbe8', padding: '2px 8px', borderRadius: '10px' }}>15-35s</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>3. Actionable Tip</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>One clear strategy</div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #f5d0fe', borderRadius: '12px', padding: '12px 10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.66rem', fontWeight: 900, color: '#c026d3', background: '#fae8ff', padding: '2px 8px', borderRadius: '10px' }}>35-45s</span>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>4. Call to Action</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>Link to profile in bio</div>
                </div>
              </div>
            </div>

            {/* SECTION 4: PLATFORMS BANNER */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>📲 Cross-post to:</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '3px 8px', borderRadius: '6px' }}>Shorts</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c026d3', background: '#fae8ff', padding: '3px 8px', borderRadius: '6px' }}>Reels</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0a66c2', background: '#eff6ff', padding: '3px 8px', borderRadius: '6px' }}>LinkedIn</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '3px 8px', borderRadius: '6px' }}>WhatsApp Status</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="#059669" /> Consistency beats perfection
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next Module <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: MODULE 6 - WEEKLY GROWTH ROUTINE PLANNER */}
        {currentStepIndex === 7 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            <div>
              <div style={{ fontSize: '0.64rem', fontWeight: 800, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MODULE 6 OF 6</div>
              <h2 style={{ margin: '4px 0 2px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Weekly Growth Routine Planner</h2>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>Consistency beats intensity. Doing a little every week produces better results than posting heavily once a month.</p>
            </div>

            {/* Weekly Routine Planner List with Time Icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getWeeklyRoutine(brand).map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#eff6ff', color: brand.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.74rem', fontWeight: 900, color: brand.primaryColor, marginRight: '6px' }}>{item.day}:</span>
                        <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>{item.action}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', background: '#ffffff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', whiteSpace: 'nowrap' }}>
                      ⏱️ {item.time}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={handlePrev} style={{ padding: '9px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button onClick={handleNext} style={{ padding: '9px 20px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Complete Academy <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: COMPLETION & PROVIDER INTRO VIDEO SUBMISSION */}
        {currentStepIndex === 8 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }} className="animate-fade-in">
            {isCompleted ? (
              <div style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Growth Academy Completed!</h2>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
                    Congratulations! You have completed the {brand.name} Growth Academy and earned <strong>+15 Reward Points</strong>.
                  </p>
                </div>
                <button onClick={onBack} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: brand.primaryColor, color: '#ffffff', fontWeight: 900, fontSize: '0.86rem', cursor: 'pointer' }}>
                  Return to Provider Dashboard
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: '0.64rem', fontWeight: 900, color: brand.primaryColor, textTransform: 'uppercase', letterSpacing: '0.08em', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>
                    FINAL STEP • VIDEO SUBMISSION
                  </div>
                  <h2 style={{ margin: '8px 0 4px', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Submit Your Introduction Video</h2>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                    Submit a 30-60 second video introducing yourself. Selected videos may be featured on official {brand.name} platforms.
                  </p>
                </div>

                <form onSubmit={handleVideoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>

                    {/* Provider Name */}
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>Provider Name</label>
                      <input
                        type="text"
                        required
                        value={videoFormData.name}
                        placeholder="Enter full name (e.g. Dr. Sarah Watson)"
                        onChange={e => setVideoFormData({ ...videoFormData, name: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>

                    {/* Email Address with Validation */}
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>Email Address</label>
                      <input
                        type="email"
                        required
                        value={videoFormData.email}
                        placeholder="e.g. provider@example.com"
                        onChange={e => {
                          setVideoFormData({ ...videoFormData, email: e.target.value });
                          if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: validationErrors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                      />
                      {validationErrors.email && (
                        <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>⚠️ {validationErrors.email}</div>
                      )}
                    </div>

                    {/* Phone Number with Searchable Country Code Dropdown */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Country Code Trigger */}
                        <div ref={countryDropdownRef} style={{ position: 'relative' }}>
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(prev => !prev)}
                            style={{
                              padding: '9px 10px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              background: '#f8fafc',
                              color: '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap',
                              height: '100%'
                            }}
                          >
                            <span>{selectedCountry.flag}</span>
                            <span>{selectedCountry.dialCode}</span>
                            <ChevronDown size={14} color="#64748b" />
                          </button>

                          {/* Country Search Dropdown Menu */}
                          {isCountryDropdownOpen && (
                            <div style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              marginTop: '4px',
                              width: '240px',
                              maxHeight: '220px',
                              background: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '10px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                              zIndex: 1000,
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: 'hidden'
                            }}>
                              <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                <input
                                  type="text"
                                  placeholder="Search country or code..."
                                  value={countrySearchQuery}
                                  onChange={e => setCountrySearchQuery(e.target.value)}
                                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.74rem', boxSizing: 'border-box' }}
                                />
                              </div>
                              <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                                {filteredCountries.map(c => (
                                  <div
                                    key={c.code}
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearchQuery('');
                                    }}
                                    style={{
                                      padding: '7px 12px',
                                      fontSize: '0.76rem',
                                      fontWeight: selectedCountry.code === c.code ? 800 : 600,
                                      color: selectedCountry.code === c.code ? '#2563eb' : '#334155',
                                      background: selectedCountry.code === c.code ? '#eff6ff' : 'transparent',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <span>{c.flag} {c.name}</span>
                                    <span style={{ color: '#64748b', fontWeight: 800 }}>{c.dialCode}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Phone Input */}
                        <input
                          type="tel"
                          required
                          value={videoFormData.phone}
                          placeholder="e.g. 9876543210"
                          onChange={e => {
                            setVideoFormData({ ...videoFormData, phone: e.target.value });
                            if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: undefined });
                          }}
                          style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: validationErrors.phone ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                        />
                      </div>
                      {validationErrors.phone && (
                        <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>⚠️ {validationErrors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Video File Upload */}
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                      Video File Upload
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={e => setVideoFormData({ ...videoFormData, videoFile: e.target.files?.[0] || null })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', background: '#f8fafc' }}
                    />
                    {videoFormData.videoFile && (
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Selected video: {videoFormData.videoFile.name} ({(videoFormData.videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </div>
                    )}
                  </div>

                  {/* Marketing Consent */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="consentCheck" checked={videoFormData.consent} onChange={e => setVideoFormData({ ...videoFormData, consent: e.target.checked })} style={{ cursor: 'pointer' }} />
                    <label htmlFor="consentCheck" style={{ fontSize: '0.76rem', color: '#334155', fontWeight: 700, cursor: 'pointer' }}>
                      I agree that my video may be featured on official {brand.name} websites and social marketing channels.
                    </label>
                  </div>

                  {/* Form Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '14px', marginTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                    <button type="button" onClick={handlePrev} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                      <ChevronLeft size={15} /> Previous
                    </button>
                    <button type="submit" disabled={isSubmitting} style={{ padding: '9px 16px', borderRadius: '8px', border: 'none', background: brand.gradient, color: '#ffffff', fontWeight: 800, fontSize: '0.8rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', opacity: isSubmitting ? 0.7 : 1, boxShadow: '0 4px 12px rgba(37,99,235,0.25)', flexShrink: 0 }}>
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Video & Finish'}</span> <CheckCircle2 size={15} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

      </div>

      {/* PROVIDER CONTENT STUDIO MODAL */}
      <ProviderContentStudio
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onUpdateProviderAssets={({ name, specialization, profileUrl }) => {
          if (name) setVideoFormData(prev => ({ ...prev, name }));
          if (specialization) setVideoFormData(prev => ({ ...prev, serviceOffered: specialization }));
          if (profileUrl) setActiveProfileUrl(profileUrl);
        }}
        brandName={brand.name}
        providerAssets={{
          name: videoFormData.name,
          specialization: videoFormData.serviceOffered,
          profileUrl: activeProfileUrl
        }}
      />

      {/* COMPLETION CELEBRATION MODAL */}
      {showCompletionModal && (
        <CompletionScreen
          points={15}
          title="Congratulations!"
          subtitle="You completed the lesson and boosted your provider score."
          onClose={async () => {
            setShowCompletionModal(false);
            await completeLesson(lessonId);
            if (onBack) {
              onBack();
            } else {
              goToDashboard();
            }
          }}
        />
      )}

    </div>
  );
}
