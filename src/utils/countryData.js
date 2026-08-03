// Comprehensive country code data list with ISO codes, flags, and calling codes
export const COUNTRY_LIST = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' }
];

/**
 * Accurately detects country code from device IP using high-precision IP geolocation APIs.
 */
let cachedCountryCode = null;

export const detectCountryCodeByIP = async () => {
  if (cachedCountryCode) return cachedCountryCode;

  try {
    const sessionSaved = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('mantra_ip_country') : null;
    if (sessionSaved) {
      cachedCountryCode = sessionSaved;
      return sessionSaved;
    }
  } catch (e) {}

  // Attempt 1: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        const found = COUNTRY_LIST.find(c => c.code === data.country_code);
        const dial = found ? found.dialCode : (data.country_calling_code || '+91');
        cachedCountryCode = dial;
        try { sessionStorage.setItem('mantra_ip_country', dial); } catch(e){}
        return dial;
      }
    }
  } catch (err) {}

  // Attempt 2: ipwho.is fallback
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.country_code) {
        const found = COUNTRY_LIST.find(c => c.code === data.country_code);
        const dial = found ? found.dialCode : (data.calling_code ? `+${data.calling_code}` : '+91');
        cachedCountryCode = dial;
        try { sessionStorage.setItem('mantra_ip_country', dial); } catch(e){}
        return dial;
      }
    }
  } catch (err) {}

  // Attempt 3: Timezone heuristic fallback
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('India')) return '+91';
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) return '+1';
    if (tz.includes('London')) return '+44';
  } catch (e) {}

  return '+91';
};
