import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X, Building2, Send, Search, ChevronDown, Check, AlertCircle } from 'lucide-react';

// Country codes list with flags & dial codes
const COUNTRY_CODES = [
  { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+86', country: 'China', flag: '🇨🇳' }
];

// Disposable / fake email domain blacklist for strict validation
const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'trashmail.com', 'yopmail.com', 'getairmail.com', 'dispostable.com',
  'throwawaymail.com', 'sharklasers.com', 'fakeinbox.com'
];

const INDUSTRIES_LIST = [
  'Technology & Software',
  'Healthcare, Biotech & Life Sciences',
  'Finance, Banking & Fintech',
  'Education & EdTech',
  'Consulting & Professional Services',
  'Manufacturing, Supply Chain & Logistics',
  'Retail, E-Commerce & Consumer Goods',
  'Media, Entertainment & Telecommunications',
  'Real Estate & Construction',
  'Non-Profit, NGO & Government',
  'Hospitality, Travel & Leisure',
  'Energy, Utilities & Sustainability',
  'Other / Diverse Industries'
];

const NETWORK_CONNECTIONS_LIST = [
  'HR Leaders & People Operations Officers',
  'C-Suite Executives & Business Founders',
  'Corporate Wellness & EAP Managers',
  'Mid-Level Corporate & Enterprise Managers',
  'Healthcare Professionals & Hospital Staff',
  'Higher Education & Alumni Networks',
  'Professional Association & B2B Networks',
  'Startup Incubators & Coworking Communities',
  'General Professional Network'
];

// Searchable Select Component for Cities (All Global Cities via Nominatim API + Local Search)
function CitySearchSelect({ label, value, onChange, error, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities worldwide dynamically from OpenStreetMap Nominatim API
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&addressdetails=1&featuretype=settlement&limit=10`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const cities = data.map(item => {
            const addr = item.address || {};
            const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.state_district || item.name || '';
            const countryName = addr.country || '';
            
            if (cityName && countryName && cityName.toLowerCase() !== countryName.toLowerCase()) {
              return `${cityName}, ${countryName}`;
            }
            // Fallback: clean up display_name by taking first and last non-duplicate parts
            const parts = item.display_name.split(',').map((s) => s.trim());
            const uniqueParts = Array.from(new Set(parts));
            if (uniqueParts.length >= 2) {
              return `${uniqueParts[0]}, ${uniqueParts[uniqueParts.length - 1]}`;
            }
            return uniqueParts[0] || item.display_name;
          });
          setSearchResults(Array.from(new Set(cities.filter(Boolean))));
        }
      } catch (err) {
        console.error('[CitySearchSelect] API search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
        {label} {required && '*'}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          fontSize: '0.8rem',
          boxSizing: 'border-box',
          background: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: value ? '#0f172a' : '#94a3b8'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
          {value || 'Search and select city...'}
        </span>
        <ChevronDown size={15} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </div>

      {error && (
        <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{error}</div>
      )}

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          zIndex: 10000,
          maxHeight: '230px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Search Bar Input */}
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc' }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Type city name (e.g. London, Chicago, Tokyo, Mumbai)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.78rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          {/* Results List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
            {loading && (
              <div style={{ padding: '8px 12px', fontSize: '0.74rem', color: '#64748b' }}>Searching worldwide cities API...</div>
            )}

            {searchTerm.length < 2 && !loading && (
              <div style={{ padding: '8px 12px', fontSize: '0.74rem', color: '#94a3b8' }}>
                Type at least 2 characters to search any city worldwide...
              </div>
            )}

            {!loading && searchResults.length === 0 && searchTerm.length >= 2 && (
              <div
                onClick={() => {
                  onChange(searchTerm);
                  setIsOpen(false);
                }}
                style={{ padding: '8px 12px', fontSize: '0.74rem', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
              >
                + Select custom location "{searchTerm}"
              </div>
            )}

            {searchResults.map((city) => (
              <div
                key={city}
                onClick={() => {
                  onChange(city);
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: value === city ? '#2563eb' : '#334155',
                  background: value === city ? '#eff6ff' : 'transparent',
                  fontWeight: value === city ? 700 : 500,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2px'
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>{city}</span>
                {value === city && <Check size={14} color="#2563eb" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Searchable Select for Industries & Networks
function SimpleSearchSelect({ label, value, onChange, options, placeholder, required, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>
        {label} {required && '*'}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '8px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          fontSize: '0.8rem',
          boxSizing: 'border-box',
          background: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: value ? '#0f172a' : '#94a3b8'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={15} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
      </div>

      {error && (
        <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{error}</div>
      )}

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          zIndex: 10000,
          maxHeight: '210px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc' }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.78rem', outline: 'none', color: '#0f172a' }}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '4px' }}>
            {filteredOptions.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  color: value === opt ? '#2563eb' : '#334155',
                  background: value === opt ? '#eff6ff' : 'transparent',
                  fontWeight: value === opt ? 700 : 500,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '2px'
                }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>{opt}</span>
                {value === opt && <Check size={14} color="#2563eb" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CorporateApplicationModal({ isOpen, onClose, onSubmit, isUpdating, initialData }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.full_name || '',
    email: initialData?.email || '',
    countryCode: initialData?.country_code || '+1',
    phone: initialData?.phone || '',
    city: initialData?.city || '',
    industries: initialData?.industries || '',
    companyConnections: initialData?.company_connections || '',
    motivation: initialData?.motivation || 'Introduce corporate wellness solutions',
    availability: initialData?.availability || 'Part-Time (2-5 hrs/wk)',
    termsAccepted: true
  });

  const [errors, setErrors] = useState({});

  // Auto-detect Country Code & Country Name via IP geolocation on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data) {
          if (data.country_calling_code) {
            const detectedCode = data.country_calling_code.startsWith('+') ? data.country_calling_code : `+${data.country_calling_code}`;
            const match = COUNTRY_CODES.find(c => c.code === detectedCode);
            if (match) {
              setFormData(prev => ({ ...prev, countryCode: match.code, city: data.country_name || prev.city }));
            } else if (detectedCode) {
              setFormData(prev => ({ ...prev, countryCode: detectedCode, city: data.country_name || prev.city }));
            }
          }
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
        city: initialData.city || initialData.country || prev.city,
        industries: initialData.industries || prev.industries,
        companyConnections: initialData.company_connections || prev.companyConnections,
        motivation: initialData.motivation || prev.motivation,
        availability: initialData.availability || prev.availability
      }));
    }
  }, [initialData]);

  if (!isOpen) return null;

  // Strict Validation Logic for Email and Phone
  const validate = () => {
    const errs = {};

    // 1. Full Name Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your real full name.';
    }

    // 2. Strict Email Validation (RFC 5322 pattern + Disposable Email Filter)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailTrimmed = formData.email.trim().toLowerCase();
    if (!emailTrimmed) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = 'Please enter a valid work or personal email address.';
    } else {
      const domain = emailTrimmed.split('@')[1];
      if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
        errs.email = 'Temporary or disposable email addresses are not permitted.';
      }
    }

    // 3. Strict Phone Validation (7-15 digits only, no alphabets/symbols)
    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (!digitsOnly) {
      errs.phone = 'Phone number is required.';
    } else if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      errs.phone = 'Please enter a valid phone number (7-15 digits).';
    } else if (/^(\d)\1+$/.test(digitsOnly)) {
      errs.phone = 'Please enter a genuine phone number.';
    }

    // 4. Required Select Validations
    if (!formData.industries) errs.industries = 'Target industry selection is required.';
    if (!formData.companyConnections) errs.companyConnections = 'Network connections selection is required.';

    setErrors(errs);
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

  const handleSelectChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && onSubmit) {
      onSubmit(formData);
    }
  };

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
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Building2 size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                Corporate Partner Application
              </h3>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Provide verified contact details to join Mantra's Corporate Program</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: `1px solid ${errors.fullName ? '#ef4444' : '#cbd5e1'}`, fontSize: '0.8rem', boxSizing: 'border-box', outline: 'none' }}
              />
              {errors.fullName && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.fullName}</div>}
            </div>

            {/* Email Address & Phone Number with Country Code Dropdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: `1px solid ${errors.email ? '#ef4444' : '#cbd5e1'}`, fontSize: '0.8rem', boxSizing: 'border-box', outline: 'none' }}
                />
                {errors.email && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.email}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Phone Number *</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    style={{
                      width: '88px',
                      padding: '0 8px',
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                      flexShrink: 0,
                      fontWeight: 700,
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      flex: 1,
                      minWidth: 0,
                      height: '38px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: `1px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}`,
                      fontSize: '0.8rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                      color: '#0f172a'
                    }}
                  />
                </div>
                {errors.phone && <div style={{ fontSize: '0.68rem', color: '#ef4444', marginTop: '3px', fontWeight: 600 }}>{errors.phone}</div>}
              </div>
            </div>



            {/* Target Industry Search Select */}
            <SimpleSearchSelect
              label="Primary Target Industry"
              placeholder="Search or select industry..."
              value={formData.industries}
              onChange={(val) => handleSelectChange('industries', val)}
              options={INDUSTRIES_LIST}
              error={errors.industries}
              required
            />

            {/* Network Connections Search Select */}
            <SimpleSearchSelect
              label="Primary Network Connections"
              placeholder="Search or select network type..."
              value={formData.companyConnections}
              onChange={(val) => handleSelectChange('companyConnections', val)}
              options={NETWORK_CONNECTIONS_LIST}
              error={errors.companyConnections}
              required
            />

            {/* Weekly Availability & Primary Goal Dropdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Weekly Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  <option value="Part-Time (2-5 hrs/wk)">Part-Time (2-5 hrs/wk)</option>
                  <option value="Part-Time (5-10 hrs/wk)">Part-Time (5-10 hrs/wk)</option>
                  <option value="Flexible (10+ hrs/wk)">Flexible (10+ hrs/wk)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Primary Goal *</label>
                <select
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  <option value="Introduce corporate wellness solutions">Introduce corporate wellness solutions</option>
                  <option value="Expand clinical practice through corporate referrals">Expand clinical practice through corporate referrals</option>
                  <option value="Deliver corporate wellness workshops & seminars">Deliver corporate wellness workshops & seminars</option>
                  <option value="Earn commission on corporate partnerships">Earn commission on corporate partnerships</option>
                </select>
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingTop: '4px' }}>
              <input
                type="checkbox"
                id="corporate-terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                style={{ marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="corporate-terms" style={{ fontSize: '0.74rem', color: '#475569', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the Corporate Growth Partner Program terms & conditions and referral guidelines.
              </label>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.76rem',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isUpdating ? 'Submitting...' : <>Submit Application <Send size={13} /></>}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
