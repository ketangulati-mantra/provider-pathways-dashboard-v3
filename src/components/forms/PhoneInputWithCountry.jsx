import React, { useState, useEffect } from 'react';
import { COUNTRY_LIST, detectCountryCodeByIP } from '../../utils/countryData';

export default function PhoneInputWithCountry({
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  placeholder = 'Phone Number',
  onBlur,
  error
}) {
  useEffect(() => {
    // Auto-detect device country code by IP if not set
    if (!countryCode) {
      detectCountryCodeByIP().then(code => {
        if (setCountryCode) {
          setCountryCode(code);
        }
      });
    }
  }, []);

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^\d\s-]/g, '');
    if (setPhoneNumber) {
      setPhoneNumber(val);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
        borderRadius: '8px',
        background: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        transition: 'all 0.15s ease'
      }}>
        {/* Country Dial Code Dropdown */}
        <select
          value={countryCode || '+91'}
          onChange={(e) => setCountryCode && setCountryCode(e.target.value)}
          style={{
            padding: '10px 8px 10px 12px',
            border: 'none',
            borderRight: '1px solid #cbd5e1',
            background: '#f8fafc',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#334155',
            outline: 'none',
            cursor: 'pointer',
            height: '42px',
            maxWidth: '120px'
          }}
        >
          {COUNTRY_LIST.map((c) => (
            <option key={c.code} value={c.dialCode}>
              {c.code} {c.dialCode}
            </option>
          ))}
        </select>

        {/* Number Input Field */}
        <input
          type="tel"
          placeholder={placeholder}
          value={phoneNumber || ''}
          onChange={handleNumberChange}
          onBlur={onBlur}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: 'none',
            fontSize: '0.88rem',
            color: '#0f172a',
            outline: 'none',
            background: 'transparent',
            height: '42px'
          }}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  );
}
