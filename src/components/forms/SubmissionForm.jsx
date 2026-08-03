import React, { useState, useRef } from 'react';
import { Upload, X, ShieldCheck, CheckCircle2, User, Mail, Phone, FileText } from 'lucide-react';
import { useToast, Button } from '../index';
import { useActivitySubmission } from '../../hooks/useActivitySubmission';
import { isValidEmail, isValidPhoneNumber } from '../../mantra/validation';
import PhoneInputWithCountry from './PhoneInputWithCountry';

export default function SubmissionForm({ 
  onSuccess, 
  lessonId = "profile-verification",
  activityTitle = "Verify Your Profile",
  submissionType = "profile_verification",
  title = "Submit Your Proof",
  successTitle = "Submission received successfully.",
  successMessage = "Our team will review your proof shortly.",
  buttonText = "Submit Proof",
  successButtonText = "Mark Lesson as Complete"
}) {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const { submit, isSubmitting, isSuccess, reset } = useActivitySubmission({
    lessonId,
    activityTitle,
    submissionType,
    successTitle,
    successMessage,
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (validTypes.includes(selectedFile.type) && selectedFile.size <= 20 * 1024 * 1024) {
      setFile(selectedFile);
      reset();
    } else {
      showToast("Please upload a valid PNG, JPG, or PDF file under 20MB.", "warning");
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear errors
    setEmailError('');
    setPhoneError('');

    if (email.trim() && !isValidEmail(email)) {
      setEmailError('Please enter a valid, active email address.');
      showToast('Please enter a valid, non-disposable email address.', 'warning');
      return;
    }

    if (phone.trim() && !isValidPhoneNumber(phone, countryCode)) {
      setPhoneError('Invalid phone number for the selected country.');
      showToast('Please enter a valid phone number.', 'warning');
      return;
    }

    if (!file) {
      showToast('Please upload a screenshot or file.', 'warning');
      return;
    }

    const fullPhone = phone.trim() ? `${countryCode} ${phone.trim()}` : '';

    await submit({
      file,
      formData: {
        ...(fullName.trim() ? { fullName: fullName.trim() } : {}),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(fullPhone ? { phone: fullPhone } : {}),
        submittedAt: new Date().toISOString()
      }
    });
  };

  const handleCompleteClick = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div style={{
      width: '100%',
      marginTop: '16px',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      padding: '28px 24px',
      boxSizing: 'border-box'
    }}>
      {!isSuccess ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Card Title & Subtitle */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {title}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Fill in your contact details and attach your activity proof document.
            </p>
          </div>

          {/* Contact Input Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textAlign: 'left'
              }}>
                <User size={14} color="#0284c7" /> Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#f8fafc',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Email Address */}
            <div>
              <label style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textAlign: 'left'
              }}>
                <Mail size={14} color="#0284c7" /> Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: emailError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#f8fafc',
                  color: '#0f172a',
                  boxSizing: 'border-box'
                }}
              />
              {emailError && (
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                  {emailError}
                </span>
              )}
            </div>

            {/* Phone Number with Country Selector */}
            <div>
              <label style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textAlign: 'left'
              }}>
                <Phone size={14} color="#0284c7" /> Phone Number
              </label>
              <PhoneInputWithCountry
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                phoneNumber={phone}
                setPhoneNumber={(val) => {
                  setPhone(val);
                  if (phoneError) setPhoneError('');
                }}
                error={phoneError}
              />
            </div>
          </div>

          {/* File Drag & Drop Upload Container */}
          <div>
            <label style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textAlign: 'left'
            }}>
              <FileText size={14} color="#0284c7" /> Upload Proof Screenshot / Document
            </label>

            <div 
              onClick={triggerFileSelect}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ 
                border: file ? '2px solid #10b981' : isDragging ? '2px dashed #0284c7' : '2px dashed #cbd5e1',
                borderRadius: '12px',
                background: file ? '#f0fdf4' : isDragging ? '#f0f9ff' : '#f8fafc',
                padding: file ? '14px 18px' : '22px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: file ? 'space-between' : 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '68px'
              }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept=".png,.jpg,.jpeg,.pdf" 
                style={{ display: 'none' }} 
              />
              
              {!file ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '50%', display: 'flex' }}>
                    <Upload size={18} color="#0284c7" />
                  </div>
                  <span style={{ fontSize: '0.86rem', color: '#64748b' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Click to upload</span> or drag and drop PNG, JPG, PDF (Max 20MB)
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#065f46', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.name}
                    </span>
                  </div>
                  <button type="button" onClick={clearFile} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <X size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !file}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: (isSubmitting || !file) ? '#cbd5e1' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: (isSubmitting || !file) ? 'not-allowed' : 'pointer',
              boxShadow: (isSubmitting || !file) ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease',
              marginTop: '4px'
            }}
          >
            {isSubmitting ? 'Uploading & Submitting...' : buttonText}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0', background: '#f8fafc', borderRadius: '12px', border: '1px solid #eef0f3' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#d1fae5', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="#059669" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>{successTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>{successMessage}</p>
          <Button variant="primary" onClick={handleCompleteClick} style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
            {successButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
