import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  X, Building2, Send, Search, ChevronDown, Check, AlertCircle,
  ArrowRight, ArrowLeft, Globe, Users, Briefcase, UserCheck, ShieldCheck, Info, MapPin
} from 'lucide-react';
import { COUNTRY_LIST, detectCountryCodeByIP } from '../../utils/countryData';

// Disposable / fake email domain blacklist for strict validation
const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'trashmail.com', 'yopmail.com', 'getairmail.com', 'dispostable.com',
  'throwawaymail.com', 'sharklasers.com', 'fakeinbox.com'
];

const INDUSTRIES_LIST = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Consulting',
  'Retail',
  'Manufacturing',
  'Hospitality',
  'Professional Services',
  'Nonprofit',
  'Government',
  'Other'
];

const RELATIONSHIP_OPTIONS = [
  'I work with them',
  'I have a professional relationship with them',
  "I'm connected to the leadership team",
  "I'm connected to HR / People team",
  "I'm a consultant or advisor to them",
  'Other'
];

const CONNECTION_REACH_OPTIONS = [
  'I can contact the decision-maker directly',
  'I can get a warm introduction',
  'I can reach someone through my professional network',
  'I have an indirect connection'
];

const COMPANY_SIZE_OPTIONS = [
  '1–25 employees',
  '26–100',
  '101–500',
  '501–1,000',
  '1,000+'
];

const DECISION_MAKER_OPTIONS = [
  'HR / People Team',
  'Founder / Owner',
  'CEO / Executive',
  'Operations / Administration',
  'Benefits / Wellness Team',
  'Procurement / Business Team',
  'Other'
];

const INTRO_METHOD_OPTIONS = [
  'Direct introduction',
  'Email introduction',
  'Connect us with the right person',
  "I'm not sure yet"
];

const COMPANY_NEEDS_OPTIONS = [
  'Employee Assistance Program (EAP)',
  'Mental health & wellness',
  'Telehealth',
  'Employee counseling',
  'Corporate wellness programs',
  "I'm not sure"
];

// Searchable Select Component for Country Code & Flag
function CountryCodeSearchSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const selectedCountry = COUNTRY_LIST.find(c => c.dialCode === value) || {
    code: 'IN',
    name: 'India',
    dialCode: value || '+91',
    flag: '🇮🇳'
  };

  const filtered = COUNTRY_LIST.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: '42px',
          minWidth: '94px',
          padding: '0 8px',
          borderRadius: '8px',
          border: '1.5px solid #cbd5e1',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#0f172a',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{selectedCountry.flag}</span>
        <span style={{ fontSize: '0.8rem' }}>{selectedCountry.dialCode}</span>
        <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: 'min(280px, 85vw)',
            maxHeight: '260px',
            background: '#ffffff',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.25)',
            zIndex: 9999999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '0.8rem',
                outline: 'none',
                color: '#0f172a'
              }}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '4px', WebkitOverflowScrolling: 'touch' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
                No countries found
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.dialCode === value && item.code === selectedCountry.code;
                return (
                  <div
                    key={`${item.code}-${item.dialCode}`}
                    onClick={() => {
                      onChange(item.dialCode);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      background: isSelected ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#1d4ed8' : '#334155',
                      fontWeight: isSelected ? 800 : 500,
                      marginBottom: '1px',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', minWidth: 0 }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.flag}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, marginLeft: '8px', flexShrink: 0 }}>
                      {item.dialCode}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Full Country Name Search Select Component for Company Country
function CompanyCountrySearchSelect({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const selected = COUNTRY_LIST.find(c => c.name.toLowerCase() === (value || '').toLowerCase()) || {
    code: 'IN',
    name: value || 'India',
    flag: '🇮🇳'
  };

  const filtered = COUNTRY_LIST.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
        Country *
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          minHeight: '42px',
          padding: '0 12px',
          borderRadius: '8px',
          border: `1.5px solid ${error ? '#ef4444' : isOpen ? '#2563eb' : '#cbd5e1'}`,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontSize: '0.82rem',
          color: '#0f172a',
          fontWeight: 700,
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{selected.flag}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.name}</span>
        </div>
        <ChevronDown size={15} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </div>

      {error && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{error}</div>}

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 999999,
            background: '#ffffff',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.25)',
            maxHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc' }}>
            <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search company country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.8rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '4px', WebkitOverflowScrolling: 'touch' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.74rem', color: '#94a3b8' }}>
                No countries found
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.code}
                  onClick={() => {
                    onChange(item.name);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: value === item.name ? '#2563eb' : '#334155',
                    background: value === item.name ? '#eff6ff' : 'transparent',
                    fontWeight: value === item.name ? 800 : 500,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.flag}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                  </div>
                  {value === item.name && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Searchable Select for Industry & Decision Maker
function SimpleSearchSelect({ label, value, onChange, options, placeholder, required, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
        {label} {required && '*'}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          minHeight: '42px',
          padding: '0 12px',
          borderRadius: '8px',
          border: `1.5px solid ${error ? '#ef4444' : isOpen ? '#2563eb' : '#cbd5e1'}`,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          fontSize: '0.82rem',
          color: value ? '#0f172a' : '#94a3b8',
          fontWeight: value ? 700 : 400,
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '6px' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={15} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </div>

      {error && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{error}</div>}

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 999999,
            background: '#ffffff',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 12px 28px -5px rgba(0, 0, 0, 0.25)',
            maxHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc' }}>
            <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.8rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '4px', WebkitOverflowScrolling: 'touch' }}>
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={{
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  color: value === opt ? '#2563eb' : '#334155',
                  background: value === opt ? '#eff6ff' : 'transparent',
                  fontWeight: value === opt ? 800 : 500,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2px',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>{opt}</span>
                {value === opt && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CorporateApplicationModal({ isOpen, onClose, onSubmit, isUpdating, initialData }) {
  const [step, setStep] = useState(1); // Step 1: Your Details, Step 2: Company Details
  
  const [formData, setFormData] = useState({
    // Step 1: Referrer Details
    fullName: initialData?.full_name || '',
    email: initialData?.email || '',
    countryCode: initialData?.country_code || '+91',
    phone: initialData?.phone || '',
    relationship: initialData?.relationship || '',
    connectionReach: initialData?.connection_reach || initialData?.connectionStrength || '',

    // Step 2: Company Details
    companyName: initialData?.company_name || initialData?.companyName || '',
    companyCountry: initialData?.company_country || initialData?.companyCountry || 'India',
    companyCity: initialData?.company_city || initialData?.companyCity || initialData?.city || '',
    website: initialData?.company_website || initialData?.website || '',
    industry: initialData?.company_industry || initialData?.industry || initialData?.industries || '',
    companySize: initialData?.company_size || initialData?.companySize || '',
    
    // Introduction Details
    decisionMaker: initialData?.decision_maker || initialData?.company_connections || '',
    introMethod: initialData?.intro_method || '',
    companyNeeds: initialData?.company_needs || ['Employee Assistance Program (EAP)'],
    directContactPerson: initialData?.direct_contact_person || '',
    referralContext: initialData?.referral_context || initialData?.motivation || '',
    termsAccepted: true
  });

  const [errors, setErrors] = useState({});
  const modalBodyRef = useRef(null);

  // Auto-detect Country Code via IP geolocation on mount
  useEffect(() => {
    (async () => {
      try {
        const detected = await detectCountryCodeByIP();
        if (detected) {
          setFormData(prev => ({ ...prev, countryCode: detected }));
        }
      } catch (err) {
        console.log('[CorporateApplicationModal] IP Geolocation fallback:', err);
      }
    })();
  }, []);

  // Sync initialData if provided dynamically
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.full_name || prev.fullName,
        email: initialData.email || prev.email,
        countryCode: initialData.country_code || prev.countryCode,
        phone: initialData.phone || prev.phone,
        relationship: initialData.relationship || prev.relationship,
        connectionReach: initialData.connection_reach || initialData.connection_strength || prev.connectionReach,
        
        companyName: initialData.company_name || prev.companyName,
        companyCountry: initialData.company_country || prev.companyCountry,
        companyCity: initialData.company_city || initialData.city || prev.companyCity,
        website: initialData.company_website || initialData.website || prev.website,
        industry: initialData.company_industry || initialData.industry || initialData.industries || prev.industry,
        companySize: initialData.company_size || prev.companySize,
        
        decisionMaker: initialData.decision_maker || prev.decisionMaker,
        introMethod: initialData.intro_method || prev.introMethod,
        companyNeeds: initialData.company_needs || prev.companyNeeds,
        directContactPerson: initialData.direct_contact_person || prev.directContactPerson,
        referralContext: initialData.referral_context || initialData.motivation || prev.referralContext
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Validation for Step 1
  const validateStep1 = () => {
    const errs = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailTrimmed = formData.email.trim().toLowerCase();
    if (!emailTrimmed) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address.';
    } else {
      const domain = emailTrimmed.split('@')[1];
      if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
        errs.email = 'Disposable email addresses are not permitted.';
      }
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!digitsOnly) {
      errs.phone = 'Phone number is required.';
    } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      errs.phone = 'Please enter a valid phone number (7-15 digits).';
    }

    if (!formData.relationship) {
      errs.relationship = 'Please select your relationship with this company.';
    }

    if (!formData.connectionReach) {
      errs.connectionReach = 'Please select how you can reach the company.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0 && modalBodyRef.current) {
      modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return Object.keys(errs).length === 0;
  };

  // Validation for Step 2
  const validateStep2 = () => {
    const errs = {};

    if (!formData.companyName.trim()) {
      errs.companyName = 'Company / Organization name is required.';
    }

    if (!formData.companyCountry || !formData.companyCountry.trim()) {
      errs.companyCountry = 'Company country is required.';
    }

    if (!formData.industry) {
      errs.industry = 'Industry selection is required.';
    }

    if (!formData.decisionMaker) {
      errs.decisionMaker = 'Please select who you can connect Mantra with.';
    }

    if (!formData.introMethod) {
      errs.introMethod = 'Please select how you can introduce Mantra.';
    }

    if (!formData.termsAccepted) {
      errs.termsAccepted = 'You must agree to the referral terms.';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0 && modalBodyRef.current) {
      modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectOption = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleNeed = (need) => {
    setFormData(prev => {
      const current = prev.companyNeeds || [];
      if (need === "I'm not sure") {
        return { ...prev, companyNeeds: ["I'm not sure"] };
      }
      const filtered = current.filter(item => item !== "I'm not sure");
      if (filtered.includes(need)) {
        const next = filtered.filter(item => item !== need);
        return { ...prev, companyNeeds: next.length > 0 ? next : [] };
      } else {
        return { ...prev, companyNeeds: [...filtered, need] };
      }
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2() && onSubmit) {
      const payload = {
        // Referrer
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        country_code: formData.countryCode,
        phone: `${formData.countryCode} ${formData.phone.trim()}`,
        relationship: formData.relationship,
        connection_reach: formData.connectionReach,
        connection_strength: formData.connectionReach,

        // Company
        company_name: formData.companyName.trim(),
        company_country: formData.companyCountry.trim(),
        company_city: formData.companyCity.trim(),
        company_website: formData.website.trim(),
        company_industry: formData.industry,
        company_size: formData.companySize,

        // Introduction
        decision_maker: formData.decisionMaker,
        intro_method: formData.introMethod,
        direct_contact_person: formData.directContactPerson.trim(),
        company_needs: formData.companyNeeds,
        referral_context: formData.referralContext.trim(),
        terms_accepted: formData.termsAccepted,

        // Backward compatibility mappings
        city: formData.companyCity.trim() || formData.companyCountry.trim(),
        industries: formData.industry,
        company_connections: formData.decisionMaker,
        motivation: formData.referralContext.trim() || 'Corporate Referral Introduction',
        availability: formData.introMethod || 'Direct introduction'
      };
      onSubmit(payload);
    }
  };

  const isStep2Valid =
    formData.companyName.trim() &&
    formData.companyCountry.trim() &&
    formData.industry &&
    formData.decisionMaker &&
    formData.introMethod &&
    formData.termsAccepted;

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Progress Step Indicator */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                <Building2 size={17} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Refer a Company to Mantra
                </h3>
                <div style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Tell us about a company you can introduce to Mantra for EAP & wellness solutions.
                </div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0, marginLeft: '8px' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '2px' }}>
            <div style={{ fontSize: '0.66rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              STEP {step} OF 2: {step === 1 ? 'Your Details' : 'Company Details'}
            </div>
            <div style={{ display: 'flex', gap: '4px', width: '80px' }}>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#2563eb', transition: 'all 0.2s' }} />
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: step === 2 ? '#2563eb' : '#e2e8f0', transition: 'all 0.2s' }} />
            </div>
          </div>
        </div>

        {/* Form Container (Scrollable) */}
        <div ref={modalBodyRef} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          {/* Notice */}
          <div style={{ margin: '12px 16px 0', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '9px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Info size={15} color="#ca8a04" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.72rem', color: '#713f12', lineHeight: 1.4 }}>
              <strong>REFERRAL PARTNERSHIP - NOT A JOB:</strong> You're referring a company or organization to Mantra. You are not applying for employment or a corporate sales role.
            </div>
          </div>

          {/* ══════════════════ STEP 1: YOUR DETAILS ══════════════════ */}
          {step === 1 && (
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  First, tell us about you
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  We'll use these details to contact you about the referral.
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: `1.5px solid ${errors.fullName ? '#ef4444' : '#cbd5e1'}`, fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                />
                {errors.fullName && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.fullName}</div>}
              </div>

              {/* Email & Phone in 1-column on mobile, 2-col on desktop */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: `1.5px solid ${errors.email ? '#ef4444' : '#cbd5e1'}`, fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                  {errors.email && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.email}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Phone Number *</label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
                    <CountryCodeSearchSelect
                      value={formData.countryCode}
                      onChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: '42px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}`,
                        fontSize: '0.82rem',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                  {errors.phone && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.phone}</div>}
                </div>
              </div>

              {/* What is your relationship with this company? */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  What is your relationship with this company? *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '6px' }}>
                  {RELATIONSHIP_OPTIONS.map(opt => {
                    const isSelected = formData.relationship === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleSelectOption('relationship', opt)}
                        style={{
                          padding: '9px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        <span style={{ paddingRight: '4px' }}>{opt}</span>
                        {isSelected && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
                {errors.relationship && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.relationship}</div>}
              </div>

              {/* How can you reach the company? */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  How can you reach the company? *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '6px' }}>
                  {CONNECTION_REACH_OPTIONS.map(opt => {
                    const isSelected = formData.connectionReach === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleSelectOption('connectionReach', opt)}
                        style={{
                          padding: '9px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        <span style={{ paddingRight: '4px' }}>{opt}</span>
                        {isSelected && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
                {errors.connectionReach && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.connectionReach}</div>}
              </div>
            </div>
          )}

          {/* ══════════════════ STEP 2: COMPANY DETAILS ══════════════════ */}
          {step === 2 && (
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  Tell us about the company
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Help us understand who you'd like to introduce to Mantra.
                </div>
              </div>

              {/* 1. Company Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme Corporation"
                  value={formData.companyName}
                  onChange={handleChange}
                  style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: `1.5px solid ${errors.companyName ? '#ef4444' : '#cbd5e1'}`, fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                />
                {errors.companyName && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.companyName}</div>}
              </div>

              {/* 2. Country & City in 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <CompanyCountrySearchSelect
                  value={formData.companyCountry}
                  onChange={(countryName) => setFormData(prev => ({ ...prev, companyCountry: countryName }))}
                  error={errors.companyCountry}
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
                    City / Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyCity"
                    placeholder="e.g. Bengaluru, Mumbai, London"
                    value={formData.companyCity}
                    onChange={handleChange}
                    style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>

              {/* 3. Website & Industry in 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Website (Optional)</label>
                  <input
                    type="text"
                    name="website"
                    placeholder="e.g. acme.com"
                    value={formData.website}
                    onChange={handleChange}
                    style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <SimpleSearchSelect
                  label="Industry"
                  placeholder="Search or select industry..."
                  value={formData.industry}
                  onChange={(val) => handleSelectOption('industry', val)}
                  options={INDUSTRIES_LIST}
                  error={errors.industry}
                  required
                />
              </div>

              {/* 4. Company Size (Selectable Cards) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  Company Size (Optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))', gap: '6px' }}>
                  {COMPANY_SIZE_OPTIONS.map(size => {
                    const isSelected = formData.companySize === size;
                    return (
                      <div
                        key={size}
                        onClick={() => handleSelectOption('companySize', isSelected ? '' : size)}
                        style={{
                          padding: '9px 6px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.76rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Who can you connect Mantra with? */}
              <SimpleSearchSelect
                label="Who can you connect Mantra with?"
                placeholder="Select decision-maker / contact role..."
                value={formData.decisionMaker}
                onChange={(val) => handleSelectOption('decisionMaker', val)}
                options={DECISION_MAKER_OPTIONS}
                error={errors.decisionMaker}
                required
              />

              {/* 6. How can you introduce Mantra? */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  How can you introduce Mantra? *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '6px' }}>
                  {INTRO_METHOD_OPTIONS.map(opt => {
                    const isSelected = formData.introMethod === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleSelectOption('introMethod', opt)}
                        style={{
                          padding: '9px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        <span style={{ paddingRight: '4px' }}>{opt}</span>
                        {isSelected && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
                {errors.introMethod && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.introMethod}</div>}
              </div>

              {/* 7. What do you think the company may need? */}
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  What do you think the company may need? (Select all that apply)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px' }}>
                  {COMPANY_NEEDS_OPTIONS.map(need => {
                    const isSelected = (formData.companyNeeds || []).includes(need);
                    return (
                      <div
                        key={need}
                        onClick={() => handleToggleNeed(need)}
                        style={{
                          padding: '9px 10px',
                          borderRadius: '8px',
                          border: `1.5px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontWeight: isSelected ? 800 : 500,
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s',
                          WebkitTapHighlightColor: 'transparent'
                        }}
                      >
                        <span style={{ paddingRight: '4px' }}>{need}</span>
                        {isSelected && <Check size={14} color="#2563eb" style={{ flexShrink: 0 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Direct Contact Field */}
              {formData.introMethod === 'Direct introduction' && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    Who can we expect to connect with? (Optional)
                  </label>
                  <input
                    type="text"
                    name="directContactPerson"
                    placeholder="e.g. Sarah — HR Director"
                    value={formData.directContactPerson}
                    onChange={handleChange}
                    style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              )}

              {formData.introMethod === "I'm not sure yet" && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 12px', fontSize: '0.74rem', color: '#1e40af' }}>
                  No problem. Mantra's team can help you understand the best next step.
                </div>
              )}

              {/* 8. Additional Referral Context */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>Why do you think this company may be interested? (Optional)</label>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{formData.referralContext.length}/500</span>
                </div>
                <textarea
                  name="referralContext"
                  maxLength={500}
                  rows={2}
                  placeholder="Briefly tell us why you think this company may be interested in Mantra."
                  value={formData.referralContext}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* Compact Expectation Panel */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', marginBottom: '6px' }}>
                  WHAT HAPPENS NEXT?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { num: '01', text: 'You introduce Mantra to the company.' },
                    { num: '02', text: 'Mantra handles the corporate conversation.' },
                    { num: '03', text: 'If the company signs a qualifying contract, you may be eligible for 15–20% of the contract value.' },
                    { num: '04', text: 'You may also have an opportunity to serve the organization as a preferred or primary provider, subject to the applicable arrangement.' }
                  ].map((stepItem) => (
                    <div key={stepItem.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.74rem', color: '#475569', lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 800, color: '#2563eb', flexShrink: 0 }}>{stepItem.num}</span>
                      <span>{stepItem.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. Referral Terms Confirmation Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingTop: '2px' }}>
                <input
                  type="checkbox"
                  id="corporate-terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  style={{ marginTop: '3px', cursor: 'pointer', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <label htmlFor="corporate-terms" style={{ fontSize: '0.74rem', color: '#475569', cursor: 'pointer', lineHeight: 1.45 }}>
                  I confirm that I am submitting a genuine company/organization referral and understand that this is a referral partnership, not an employment application.
                </label>
              </div>
              {errors.termsAccepted && <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>{errors.termsAccepted}</div>}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', flexShrink: 0, gap: '8px' }}>
          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                if (modalBodyRef.current) modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', flexShrink: 0 }}
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                minHeight: '40px'
              }}
            >
              <span>Continue to Company Details</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating || !isStep2Valid}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: isStep2Valid ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#cbd5e1',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: isStep2Valid && !isUpdating ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: isStep2Valid ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
                minHeight: '40px'
              }}
            >
              {isUpdating ? 'Submitting...' : <><span>Submit Company Referral</span> <Send size={13} /></>}
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
