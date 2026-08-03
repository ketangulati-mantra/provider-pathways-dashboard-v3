import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Send, GraduationCap, Search, ChevronDown, Check } from 'lucide-react';
import SearchableSelect from '../../ui/SearchableSelect';
import { MANTRA_CONFIG } from '../../../mantra';

const API_BASE = MANTRA_CONFIG.apiBaseUrl !== undefined && MANTRA_CONFIG.apiBaseUrl !== null ? MANTRA_CONFIG.apiBaseUrl : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'trashmail.com', 'yopmail.com', 'dispostable.com', 'fakeinbox.com',
  'test.com', 'example.com', 'asdf.com', 'qwerty.com', 'foo.com', 'bar.com'
]);

const COUNTRY_CODES = [
  { name: 'India', code: '+91', iso: 'IN', min: 10, max: 10, pattern: /^[6-9]\d{9}$/, hint: 'Must be a valid 10-digit mobile starting with 6-9' },
  { name: 'United States', code: '+1', iso: 'US', min: 10, max: 10, pattern: /^[2-9]\d{9}$/, hint: 'Must be a 10-digit number (area code cannot start with 0 or 1)' },
  { name: 'United Kingdom', code: '+44', iso: 'GB', min: 10, max: 11, pattern: /^\d{10,11}$/, hint: 'Must be 10 or 11 digits' },
  { name: 'Canada', code: '+1', iso: 'CA', min: 10, max: 10, pattern: /^[2-9]\d{9}$/, hint: 'Must be 10 digits' },
  { name: 'Australia', code: '+61', iso: 'AU', min: 9, max: 10, pattern: /^\d{9,10}$/, hint: 'Must be 9 or 10 digits' },
  { name: 'Germany', code: '+49', iso: 'DE', min: 10, max: 11, pattern: /^\d{10,11}$/, hint: 'Must be 10 or 11 digits' },
  { name: 'France', code: '+33', iso: 'FR', min: 9, max: 10, pattern: /^\d{9,10}$/, hint: 'Must be 9 or 10 digits' },
  { name: 'United Arab Emirates', code: '+971', iso: 'AE', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' },
  { name: 'Singapore', code: '+65', iso: 'SG', min: 8, max: 8, pattern: /^\d{8}$/, hint: 'Must be 8 digits' },
  { name: 'Brazil', code: '+55', iso: 'BR', min: 10, max: 11, pattern: /^\d{10,11}$/, hint: 'Must be 10 or 11 digits' },
  { name: 'Mexico', code: '+52', iso: 'MX', min: 10, max: 10, pattern: /^\d{10}$/, hint: 'Must be 10 digits' },
  { name: 'Japan', code: '+81', iso: 'JP', min: 10, max: 11, pattern: /^\d{10,11}$/, hint: 'Must be 10 or 11 digits' },
  { name: 'South Korea', code: '+82', iso: 'KR', min: 9, max: 10, pattern: /^\d{9,10}$/, hint: 'Must be 9 or 10 digits' },
  { name: 'Netherlands', code: '+31', iso: 'NL', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' },
  { name: 'Spain', code: '+34', iso: 'ES', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' },
  { name: 'Italy', code: '+39', iso: 'IT', min: 9, max: 10, pattern: /^\d{9,10}$/, hint: 'Must be 9 or 10 digits' },
  { name: 'Saudi Arabia', code: '+966', iso: 'SA', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' },
  { name: 'New Zealand', code: '+64', iso: 'NZ', min: 8, max: 10, pattern: /^\d{8,10}$/, hint: 'Must be 8 to 10 digits' },
  { name: 'Ireland', code: '+353', iso: 'IE', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' },
  { name: 'Pakistan', code: '+92', iso: 'PK', min: 10, max: 10, pattern: /^\d{10}$/, hint: 'Must be 10 digits' },
  { name: 'Bangladesh', code: '+880', iso: 'BD', min: 10, max: 10, pattern: /^\d{10}$/, hint: 'Must be 10 digits' },
  { name: 'Nigeria', code: '+234', iso: 'NG', min: 10, max: 10, pattern: /^\d{10}$/, hint: 'Must be 10 digits' },
  { name: 'South Africa', code: '+27', iso: 'ZA', min: 9, max: 9, pattern: /^\d{9}$/, hint: 'Must be 9 digits' }
];

const DEFAULT_COUNTRY = { name: 'International', code: '+1', iso: 'INTL', min: 7, max: 12, pattern: /^\d{7,12}$/, hint: 'Must be 7 to 12 digits' };

export default function CampusApplicationModal({ isOpen, onClose, onSubmitSuccess, initialProfile = {} }) {
  const [formData, setFormData] = useState({
    full_name: initialProfile.full_name || initialProfile.name || '',
    email: initialProfile.email || '',
    country_code: '+1',
    phone: initialProfile.phone || '',
    college: (initialProfile.college_name === 'Default University' ? '' : initialProfile.college_name) || '',
    course: '',
    year: '1st Year',
    city: '',
    motivation: '',
    availability: '3–5 hours/week',
    linkedin_url: '',
    instagram_url: '',
    previous_experience: '',
    terms_accepted: true,
    community_guidelines_accepted: true
  });

  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef(null);

  // Auto-detect country code from IP address on mount
  useEffect(() => {
    async function detectCountryByIP() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.country_calling_code) {
            const detectedCode = data.country_calling_code.startsWith('+') ? data.country_calling_code : `+${data.country_calling_code}`;
            const matched = COUNTRY_CODES.find(c => c.code === detectedCode || c.iso === data.country_code);
            if (matched) {
              setFormData(prev => ({ ...prev, country_code: matched.code }));
            }
          }
        }
      } catch (err) {
        console.warn('[CampusApplicationModal] IP detection fallback to default +1:', err);
      }
    }

    if (isOpen) {
      detectCountryByIP();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialProfile) {
      setFormData(prev => ({
        ...prev,
        full_name: prev.full_name || initialProfile.name || '',
        email: prev.email || initialProfile.email || ''
      }));
    }
  }, [initialProfile]);

  // Click outside to close country dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const selectedCountryObj = COUNTRY_CODES.find(c => c.code === formData.country_code) || DEFAULT_COUNTRY;
  const maxDigits = selectedCountryObj.max || 12;

  const filteredCountries = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch) ||
    c.iso.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Async Fetchers for Multi-Source Colleges, Courses, and Cities Master Data APIs
  const fetchColleges = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/master/colleges?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  };

  const fetchCourses = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/master/courses?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  };

  const fetchCities = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/api/campus-program/master/cities?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  };

  const handlePhoneChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, maxDigits);
    setFormData(prev => ({ ...prev, phone: rawDigits }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
  };

  const validate = () => {
    const errs = {};

    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      errs.full_name = 'Please enter your full name';
    }

    const cleanEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address';
    } else {
      const domain = cleanEmail.split('@')[1];
      const prefix = cleanEmail.split('@')[0];
      if (DISPOSABLE_DOMAINS.has(domain)) {
        errs.email = 'Temporary / disposable emails are not allowed';
      } else if (['test', 'asdf', 'qwerty', 'fake', 'junk', 'temp'].includes(prefix) || domain.includes('example')) {
        errs.email = 'Please enter a real working email address';
      }
    }

    const phoneDigits = formData.phone.trim().replace(/\D/g, '');
    if (!phoneDigits) {
      errs.phone = 'Phone number is required';
    } else if (phoneDigits.length < selectedCountryObj.min || phoneDigits.length > selectedCountryObj.max) {
      errs.phone = `Invalid phone length for ${selectedCountryObj.name} (${selectedCountryObj.hint || `Must be ${selectedCountryObj.min} digits`})`;
    } else if (/^(\d)\1+$/.test(phoneDigits)) {
      errs.phone = 'Please enter a valid phone number (repeating digits like 0000000000 are not allowed)';
    } else if (['1234567890', '0123456789'].includes(phoneDigits)) {
      errs.phone = 'Please enter a valid working phone number';
    } else if (selectedCountryObj.pattern && !selectedCountryObj.pattern.test(phoneDigits)) {
      errs.phone = `Invalid number pattern for ${selectedCountryObj.name} (${selectedCountryObj.hint})`;
    }

    if (!formData.college.trim() || formData.college.trim().length < 3) errs.college = 'College/Institution name is required';
    if (!formData.course.trim()) errs.course = 'Course/Degree is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.motivation.trim() || formData.motivation.trim().length < 15) {
      errs.motivation = 'Please share your motivation (at least 15 characters)';
    }

    if (!formData.terms_accepted) errs.terms_accepted = 'Must accept professional representation terms';
    if (!formData.community_guidelines_accepted) errs.community_guidelines_accepted = 'Must accept community guidelines';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmitSuccess(formData);
    } catch (err) {
      console.error('[CampusApplicationModal] Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} className="animate-fade-in">
      
      {/* Inline styles for custom rounded inset scrollbar */}
      <style>{`
        .modal-curved-wrapper {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid #e2e8f0;
          background: #ffffff;
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .modal-scrollable-body::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scrollable-body::-webkit-scrollbar-track {
          background: transparent;
          margin: 12px 0;
        }
        .modal-scrollable-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .modal-scrollable-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Main Outer Modal Box (Clips rounded 24px borders cleanly) */}
      <div className="modal-curved-wrapper animate-scale-in">
        
        {/* Modal Header (Sticky Top) */}
        <div style={{
          padding: '24px 30px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: '#ffffff',
          zIndex: 10,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>
                Campus Ambassador Registration
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                Official Campus Mental Health Initiative Application
              </div>
            </div>
          </div>

          {/* Close Button Pinned to Right Top */}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              flexShrink: 0,
              transition: 'background 0.15s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-scrollable-body" style={{ overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit} style={{ padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Personal Info with Standard Browser Autofill Attributes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter full name"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: errors.full_name ? '1.5px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600, boxSizing: 'border-box' }}
                />
                {errors.full_name && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>{errors.full_name}</div>}
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: errors.email ? '1.5px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600, boxSizing: 'border-box' }}
                />
                {errors.email && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>{errors.email}</div>}
              </div>
            </div>

            {/* Phone Number with Country Code Dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Phone Number *</label>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {formData.phone.length}/{maxDigits} digits
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  style={{
                    height: '44px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ color: '#2563eb', fontSize: '0.88rem', fontWeight: 800, background: '#dbeafe', padding: '2px 6px', borderRadius: '6px' }}>
                    {selectedCountryObj.iso}
                  </span>
                  <span style={{ color: '#0f172a', fontWeight: 800 }}>{selectedCountryObj.code}</span>
                  <ChevronDown size={15} color="#64748b" />
                </button>

                <input
                  type="tel"
                  name="tel"
                  autoComplete="tel-national"
                  placeholder={`Enter ${selectedCountryObj.min} digit number`}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={maxDigits}
                  style={{ flex: 1, height: '44px', padding: '0 14px', borderRadius: '10px', border: errors.phone ? '1.5px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>
              {errors.phone && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px', fontWeight: 600 }}>{errors.phone}</div>}

              {showCountryDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '340px',
                  maxHeight: '280px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '14px',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  zIndex: 99,
                  marginTop: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc' }}>
                    <Search size={16} color="#64748b" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)}
                      autoFocus
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                    {filteredCountries.map(c => (
                      <div
                        key={`${c.iso}-${c.code}`}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            country_code: c.code,
                            phone: prev.phone.slice(0, c.max)
                          }));
                          setShowCountryDropdown(false);
                          setCountrySearch('');
                        }}
                        style={{
                          padding: '9px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          background: formData.country_code === c.code ? '#eff6ff' : 'transparent',
                          color: formData.country_code === c.code ? '#2563eb' : '#0f172a',
                          fontWeight: formData.country_code === c.code ? 700 : 500
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {c.iso}
                          </span>
                          <span>{c.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#64748b', fontWeight: 700 }}>{c.code}</span>
                          {formData.country_code === c.code && <Check size={14} color="#2563eb" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Multi-Source Searchable Autocomplete Selectors Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              
              {/* 1. College / Institution Autocomplete */}
              <SearchableSelect
                label="College / Institution *"
                placeholder="e.g. Stanford University / Harvard / IIT / MAIT"
                value={formData.college}
                fetchOptions={fetchColleges}
                allowCustom={true}
                error={errors.college}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, college: val }));
                  if (errors.college) setErrors(prev => ({ ...prev, college: null }));
                }}
              />

              {/* 2. Course / Degree Autocomplete */}
              <SearchableSelect
                label="Course / Degree *"
                placeholder="e.g. B.A. Psychology / M.A. Clinical Psychology / B.Tech"
                value={formData.course}
                fetchOptions={fetchCourses}
                allowCustom={true}
                error={errors.course}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, course: val }));
                  if (errors.course) setErrors(prev => ({ ...prev, course: null }));
                }}
              />

              {/* 3. Current Year Dropdown with Custom Lucide ChevronDown Icon */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Current Year *</label>
                <div style={{ position: 'relative', marginTop: '4px' }}>
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 38px 0 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      boxSizing: 'border-box',
                      fontWeight: 600,
                      color: '#0f172a',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>

                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={16} color="#64748b" />
                  </div>
                </div>
              </div>

              {/* 4. City Autocomplete */}
              <SearchableSelect
                label="City *"
                placeholder="e.g. San Francisco / New Delhi"
                value={formData.city}
                fetchOptions={fetchCities}
                allowCustom={true}
                error={errors.city}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, city: val }));
                  if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                }}
              />

            </div>

            {/* Motivation & Availability */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Why do you want to join this initiative? *</label>
              <textarea
                rows={3}
                placeholder="Share your passion for student mental health advocacy..."
                value={formData.motivation}
                onChange={e => setFormData({ ...formData, motivation: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: errors.motivation ? '1.5px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.9rem', marginTop: '4px', resize: 'vertical', boxSizing: 'border-box' }}
              />
              {errors.motivation && <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>{errors.motivation}</div>}
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Weekly Availability *</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                {['1–2 hours/week', '3–5 hours/week', '5+ hours/week'].map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#334155', cursor: 'pointer', background: formData.availability === opt ? '#eff6ff' : '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: formData.availability === opt ? '1.5px solid #2563eb' : '1px solid #cbd5e1' }}>
                    <input
                      type="radio"
                      name="availability"
                      value={opt}
                      checked={formData.availability === opt}
                      onChange={e => setFormData({ ...formData, availability: e.target.value })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>LinkedIn Profile (Optional)</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedin_url}
                  onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>Instagram Profile (Optional)</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={formData.instagram_url}
                  onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.terms_accepted}
                  onChange={e => setFormData({ ...formData, terms_accepted: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <span>I agree to represent Mantra Foundation professionally and uphold clinical integrity. *</span>
              </label>
              {errors.terms_accepted && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.terms_accepted}</div>}

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.community_guidelines_accepted}
                  onChange={e => setFormData({ ...formData, community_guidelines_accepted: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <span>I agree to follow community guidelines and maintain student confidentiality. *</span>
              </label>
              {errors.community_guidelines_accepted && <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>{errors.community_guidelines_accepted}</div>}
            </div>

            {/* Modal Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                {isSubmitting ? 'Submitting Application...' : <><Send size={16} /> Submit Application</>}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>,
    document.body
  );
}
