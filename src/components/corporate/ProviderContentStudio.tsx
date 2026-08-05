import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Copy, Check, ExternalLink, X, Share2, Globe, MessageSquare,
  HelpCircle, FileText, Mail, Megaphone, ShieldCheck, Edit3, ArrowRight, Save,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  getPromotionPlatforms,
  interpolateTemplate,
  PlatformConfig,
  PromotionTemplateItem
} from '../../utils/promotionTemplates';
import { getCurrentUserId, MANTRA_CONFIG } from '../../mantra';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

interface ProviderAssets {
  name?: string;
  specialization?: string;
  profileUrl?: string;
}

interface PromotionToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProviderAssets?: (assets: { name: string; specialization: string; profileUrl: string }) => void;
  brandName?: string;
  providerAssets?: ProviderAssets;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Share2,
  Globe,
  MessageSquare,
  HelpCircle,
  FileText,
  Mail
};

const SPECIALIZATION_SUGGESTIONS = [
  'Clinical Psychologist',
  'Counselling Psychologist',
  'Nutritionist',
  'Yoga Therapist',
  'Physiotherapist',
  'Relationship Counselor',
  'Mental Health Coach'
];

type MobileStep = 'platforms' | 'templates' | 'preview';

export default function ProviderContentStudio({
  isOpen,
  onClose,
  onUpdateProviderAssets,
  brandName = 'TherapyMantra',
  providerAssets
}: PromotionToolkitModalProps) {
  if (!isOpen) return null;

  const userId = getCurrentUserId();
  const platforms = getPromotionPlatforms();

  const STORAGE_KEY = `pp_promotion_toolkit_${userId}`;

  const sanitizeSpecialization = (val?: string) => {
    const clean = (val || '').trim();
    if (clean.toLowerCase() === 'corporate' || clean.toLowerCase() === 'therapy') return '';
    return clean;
  };

  // State for form fields
  const [formData, setFormData] = useState<ProviderAssets>(() => {
    let saved = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) saved = JSON.parse(stored);
    } catch (e) { }

    return {
      name: (saved?.name || providerAssets?.name || '').trim(),
      specialization: sanitizeSpecialization(saved?.specialization || providerAssets?.specialization),
      profileUrl: (saved?.profileUrl || providerAssets?.profileUrl || '').trim()
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('linkedin');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mobile Navigation Stack state ('platforms' | 'templates' | 'preview')
  const [mobileStep, setMobileStep] = useState<MobileStep>('platforms');
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync external providerAssets if passed & not editing
  useEffect(() => {
    if (!isEditing) {
      setFormData(prev => ({
        name: (providerAssets?.name || prev.name || '').trim(),
        specialization: sanitizeSpecialization(providerAssets?.specialization) || prev.specialization || '',
        profileUrl: (providerAssets?.profileUrl || prev.profileUrl || '').trim()
      }));
    }
  }, [providerAssets?.name, providerAssets?.specialization, providerAssets?.profileUrl]);

  // Fetch DB saved user details on mount if local is empty
  useEffect(() => {
    async function fetchSavedUserData() {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(userId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.promotion_toolkit_data) {
            const dbData = json.data.promotion_toolkit_data;
            if (dbData.name || dbData.specialization || dbData.profileUrl) {
              const updated = {
                name: dbData.name || formData.name || '',
                specialization: sanitizeSpecialization(dbData.specialization || dbData.designation) || formData.specialization || '',
                profileUrl: dbData.profileUrl || formData.profileUrl || ''
              };
              setFormData(updated);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              } catch (e) { }
            }
          }
        }
      } catch (e) {
        console.warn('[Promotion Toolkit] DB fetch notice:', e);
      }
    }
    fetchSavedUserData();
  }, [userId]);

  const hasAllFields =
    Boolean(formData.name && formData.name.trim()) &&
    Boolean(formData.specialization && formData.specialization.trim()) &&
    Boolean(formData.profileUrl && formData.profileUrl.trim());

  const showPersonalizationForm = !hasAllFields || isEditing;

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    const cleanName = (formData.name || '').trim();
    const cleanSpec = (formData.specialization || '').trim();
    const cleanUrl = (formData.profileUrl || '').trim();

    if (!cleanName) errors.name = 'Provider Name is required';
    if (!cleanSpec) errors.specialization = 'Designation / Specialization is required';
    if (!cleanUrl) errors.profileUrl = 'TherapyMantra Profile URL is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const payload = {
      name: cleanName,
      specialization: cleanSpec,
      profileUrl: cleanUrl
    };

    // 1. Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) { }

    // 2. Save to Backend DB
    try {
      await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: cleanName,
          service: cleanSpec,
          promotionToolkitData: payload
        })
      });
    } catch (e) {
      console.warn('[Promotion Toolkit] DB save notice:', e);
    }

    // 3. Update Parent State & Close Form View
    setFormData(payload);
    if (onUpdateProviderAssets) {
      onUpdateProviderAssets(payload);
    }

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const selectedPlatform: PlatformConfig =
    platforms.find(p => p.id === selectedPlatformId) || platforms[0];

  const selectedTemplate: PromotionTemplateItem =
    selectedPlatform.templates.find(t => t.id === selectedTemplateId) || selectedPlatform.templates[0];

  const activeInterpolatedContent = interpolateTemplate(selectedTemplate.content, {
    providerName: formData.name,
    specialization: formData.specialization,
    profileUrl: formData.profileUrl,
    brandName
  });

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '20px'
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: isMobile ? '0' : '24px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '1050px',
          height: isMobile ? '100vh' : 'auto',
          maxHeight: isMobile ? '100vh' : '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: isMobile ? 'none' : '1px solid #e2e8f0'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: isMobile ? '14px 16px' : '18px 24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #334155',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            {/* Mobile Stack Back Navigation Button */}
            {isMobile && !showPersonalizationForm && mobileStep !== 'platforms' && (
              <button
                onClick={() => {
                  if (mobileStep === 'preview') setMobileStep('templates');
                  else if (mobileStep === 'templates') setMobileStep('platforms');
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  flexShrink: 0,
                  touchAction: 'manipulation'
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div
              style={{
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '36px' : '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                flexShrink: 0
              }}
            >
              <Megaphone size={isMobile ? 18 : 20} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ margin: 0, fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isMobile && mobileStep === 'templates' ? selectedPlatform.name : isMobile && mobileStep === 'preview' ? 'Template Preview' : 'Promotion Toolkit'}
                </h2>
              </div>
              {!isMobile && (
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Professionally crafted marketing templates to help you promote your {brandName} profile across different platforms.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {!showPersonalizationForm && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: isMobile ? '8px 12px' : '6px 12px',
                  minHeight: isMobile ? '44px' : 'auto',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={15} /> {!isMobile && 'Edit Profile'}
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* STEP 1 - INLINE QUICK PERSONALIZATION FORM */}
        {showPersonalizationForm ? (
          <div
            style={{
              padding: isMobile ? '20px 16px' : '32px 28px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: '#ffffff',
              flex: 1
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: isMobile ? '1.15rem' : '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                Let's personalize your marketing templates
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                We'll use these details to generate ready-to-copy promotional content for your {brandName} profile.
              </p>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
              {/* Provider Name */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Provider Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Sarah Watson"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '48px',
                    borderRadius: '12px',
                    border: formErrors.name ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                {formErrors.name && (
                  <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
                    ⚠️ {formErrors.name}
                  </div>
                )}
              </div>

              {/* Designation / Specialization */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  Designation / Specialization *
                </label>
                <input
                  type="text"
                  value={formData.specialization || ''}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g. Clinical Psychologist"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '48px',
                    borderRadius: '12px',
                    border: formErrors.specialization ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                {formErrors.specialization && (
                  <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
                    ⚠️ {formErrors.specialization}
                  </div>
                )}

                {/* Quick Suggestion Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {SPECIALIZATION_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, specialization: sug })}
                      style={{
                        padding: '6px 12px',
                        minHeight: '36px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: formData.specialization === sug ? '#eff6ff' : '#f8fafc',
                        color: formData.specialization === sug ? '#2563eb' : '#475569',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* TherapyMantra Profile URL */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  TherapyMantra Profile URL *
                </label>
                <input
                  type="url"
                  value={formData.profileUrl || ''}
                  onChange={e => setFormData({ ...formData, profileUrl: e.target.value })}
                  placeholder="https://therapists.therapymantra.co/list/therapist/your-profile"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '48px',
                    borderRadius: '12px',
                    border: formErrors.profileUrl ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
                {formErrors.profileUrl && (
                  <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
                    ⚠️ {formErrors.profileUrl}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px' }}>
                {hasAllFields && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 22px',
                      minHeight: '48px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '12px 28px',
                    minHeight: '48px',
                    flex: isMobile ? 1 : 'none',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                  }}
                >
                  <Save size={18} /> {isSaving ? 'Saving Details...' : 'Continue to Toolkit'}
                </button>
              </div>
            </form>
          </div>
        ) : isMobile ? (
          /* =========================================================================
             DEDICATED NATIVE MOBILE EXPERIENCE (<768px) WITH STACK NAVIGATION
             Flow: Platform List -> Template List -> Template Preview -> Copy & Open
             ========================================================================= */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#f8fafc' }}>
            {/* STEP 1: PLATFORM LIST SCREEN */}
            {mobileStep === 'platforms' && (
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }} className="animate-fade-in">
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', paddingLeft: '4px' }}>
                  Select Platform to Promote
                </div>

                {platforms.map(platform => {
                  const IconComp = ICON_MAP[platform.iconName] || Share2;
                  return (
                    <div
                      key={platform.id}
                      onClick={() => {
                        setSelectedPlatformId(platform.id);
                        setMobileStep('templates');
                      }}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        minHeight: '64px',
                        touchAction: 'manipulation'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: `${platform.color}15`,
                            color: platform.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <IconComp size={22} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#0f172a' }}>
                            {platform.name}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {platform.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: platform.color, background: `${platform.color}12`, padding: '4px 10px', borderRadius: '12px' }}>
                          {platform.templates.length} templates
                        </span>
                        <ChevronRight size={18} color="#94a3b8" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: TEMPLATE LIST SCREEN */}
            {mobileStep === 'templates' && (
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Select Template ({selectedPlatform.name})
                  </div>
                  <button
                    onClick={() => setMobileStep('platforms')}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', padding: '4px 8px' }}
                  >
                    Change Platform
                  </button>
                </div>

                {selectedPlatform.templates.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      setSelectedTemplateId(tpl.id);
                      setMobileStep('preview');
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a' }}>
                        {tpl.title}
                      </span>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>

                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {interpolateTemplate(tpl.content, {
                        providerName: formData.name,
                        specialization: formData.specialization,
                        profileUrl: formData.profileUrl,
                        brandName
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: TEMPLATE PREVIEW & BOTTOM STICKY ACTION BAR */}
            {mobileStep === 'preview' && selectedTemplate && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="animate-fade-in">
                <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                        {selectedTemplate.title}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                        Personalized for {formData.name}
                      </p>
                    </div>
                    {selectedTemplate.category && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: '6px' }}>
                        {selectedTemplate.category}
                      </span>
                    )}
                  </div>

                  {/* Full Text Content Preview Box */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '16px',
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                      fontFamily: 'inherit',
                      userSelect: 'all'
                    }}
                  >
                    {activeInterpolatedContent}
                  </div>
                </div>

                {/* BOTTOM STICKY ACTION BAR (Min 54px touch targets) */}
                <div
                  style={{
                    padding: '14px 16px',
                    background: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    gap: '10px',
                    boxShadow: '0 -4px 16px rgba(0,0,0,0.06)'
                  }}
                >
                  <button
                    onClick={() => handleCopy(activeInterpolatedContent, selectedTemplate.id)}
                    style={{
                      flex: 1,
                      minHeight: '52px',
                      borderRadius: '14px',
                      border: copiedId === selectedTemplate.id ? '1px solid #10b981' : 'none',
                      background: copiedId === selectedTemplate.id ? '#ecfdf5' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: copiedId === selectedTemplate.id ? '#059669' : '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                      touchAction: 'manipulation'
                    }}
                  >
                    {copiedId === selectedTemplate.id ? <Check size={18} color="#059669" /> : <Copy size={18} />}
                    {copiedId === selectedTemplate.id ? 'Copied!' : 'Copy Template'}
                  </button>

                  <a
                    href={selectedPlatform.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      minHeight: '52px',
                      padding: '0 18px',
                      borderRadius: '14px',
                      border: `1px solid ${selectedPlatform.color}40`,
                      background: `${selectedPlatform.color}10`,
                      color: selectedPlatform.color,
                      fontWeight: 900,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      touchAction: 'manipulation'
                    }}
                  >
                    Open <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             DESKTOP SPLIT-VIEW VIEW (>768px) - REMAINS UNCHANGED
             ========================================================================= */
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Grid: Platform Cards */}
            <div
              style={{
                width: '320px',
                background: '#f8fafc',
                borderRight: '1px solid #e2e8f0',
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flexShrink: 0
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px', paddingLeft: '4px' }}>
                Select Platform
              </div>

              {platforms.map(platform => {
                const isSelected = platform.id === selectedPlatformId;
                const IconComp = ICON_MAP[platform.iconName] || Share2;

                return (
                  <div
                    key={platform.id}
                    onClick={() => setSelectedPlatformId(platform.id)}
                    style={{
                      background: isSelected ? '#ffffff' : '#ffffff',
                      border: isSelected ? `2px solid ${platform.color}` : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? `0 4px 14px ${platform.color}20` : '0 2px 4px rgba(0,0,0,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isSelected ? `${platform.color}15` : '#f1f5f9',
                        color: platform.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconComp size={18} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 800, color: isSelected ? '#0f172a' : '#334155' }}>
                          {platform.name}
                        </span>
                        <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#94a3b8' }}>
                          {platform.templates.length}
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {platform.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Panel: Template Previews & Copy Controls */}
            <div
              style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                background: '#ffffff'
              }}
            >
              {/* Selected Platform Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                      {selectedPlatform.name} Templates
                    </h3>
                    <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> Ready to Copy & Post
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                    Personalized for <strong>{formData.name}</strong> ({formData.specialization})
                  </p>
                </div>

                <a
                  href={selectedPlatform.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${selectedPlatform.color}40`,
                    background: `${selectedPlatform.color}0a`,
                    color: selectedPlatform.color,
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Open {selectedPlatform.name} <ExternalLink size={14} />
                </a>
              </div>

              {/* Templates List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedPlatform.templates.map((tpl: PromotionTemplateItem) => {
                  const interpolatedContent = interpolateTemplate(tpl.content, {
                    providerName: formData.name,
                    specialization: formData.specialization,
                    profileUrl: formData.profileUrl,
                    brandName
                  });

                  const isCopied = copiedId === tpl.id;

                  return (
                    <div
                      key={tpl.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                            {tpl.title}
                          </h4>
                          {tpl.category && (
                            <span style={{ fontSize: '0.66rem', fontWeight: 800, background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              {tpl.category}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(interpolatedContent, tpl.id)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '8px',
                            border: isCopied ? '1px solid #10b981' : '1px solid #cbd5e1',
                            background: isCopied ? '#ecfdf5' : '#ffffff',
                            color: isCopied ? '#059669' : '#0f172a',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isCopied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                          {isCopied ? 'Copied Successfully!' : 'Copy Template'}
                        </button>
                      </div>

                      {/* Non-editable Content Preview Box */}
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          fontSize: '0.84rem',
                          color: '#334155',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-line',
                          fontFamily: 'inherit',
                          userSelect: 'all'
                        }}
                      >
                        {interpolatedContent}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        💡 Copy and customize directly after pasting into {selectedPlatform.name}.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
