import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Building2, Send, CheckCircle2 } from 'lucide-react';

export default function CorporateApplicationModal({ isOpen, onClose, onSubmit, isUpdating, initialData }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.full_name || 'Dr. Ketan Gulati',
    email: initialData?.email || 'ketan.gulati@mantra.care',
    countryCode: initialData?.country_code || '+1',
    phone: initialData?.phone || '5550199',
    city: initialData?.city || 'San Francisco',
    companyConnections: initialData?.company_connections || '',
    industries: initialData?.industries || 'Healthcare, Technology, Finance',
    linkedinUrl: initialData?.linkedin_url || '',
    previousExperience: initialData?.previous_experience || '',
    motivation: initialData?.motivation || '',
    availability: initialData?.availability || 'Part-Time (5-10 hrs/wk)',
    termsAccepted: true
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
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
          maxWidth: '560px',
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
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Complete your application to join Mantra's Corporate Partner initiative</div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Full Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* City & LinkedIn */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>City / Location *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Company Connections */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Corporate / Company Connections</label>
              <textarea
                name="companyConnections"
                rows={2}
                placeholder="Mention companies, HR contacts, or executive networks you have connections with..."
                value={formData.companyConnections}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {/* Target Industries & Availability */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Primary Target Industries</label>
                <input
                  type="text"
                  name="industries"
                  placeholder="e.g. Tech, Healthcare, Finance"
                  value={formData.industries}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Weekly Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', background: '#ffffff' }}
                >
                  <option value="Part-Time (2-5 hrs/wk)">Part-Time (2-5 hrs/wk)</option>
                  <option value="Part-Time (5-10 hrs/wk)">Part-Time (5-10 hrs/wk)</option>
                  <option value="Flexible (10+ hrs/wk)">Flexible (10+ hrs/wk)</option>
                </select>
              </div>
            </div>

            {/* Previous Corporate Experience */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Previous Corporate / Wellness Experience</label>
              <textarea
                name="previousExperience"
                rows={2}
                placeholder="Briefly describe any prior B2B, consulting, corporate training, or EAP experience..."
                value={formData.previousExperience}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {/* Motivation */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '4px' }}>Motivation & Goals *</label>
              <textarea
                name="motivation"
                rows={2}
                placeholder="Why would you like to join Mantra as a Corporate Growth Partner?"
                value={formData.motivation}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
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
                I agree to the Corporate Growth Partner Program terms & conditions, understanding that referral commissions (1-20%) are subject to applicable terms and finalized corporate agreements.
              </label>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '6px 18px',
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
