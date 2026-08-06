import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

// Normalize language codes (e.g. 'en-US' -> 'en', 'es-ES' -> 'es') while preserving 'zh-Hans' and 'zh-Hant'
const normalizeLanguage = (lng) => {
  if (!lng) return 'en';
  if (lng === 'zh-TW' || lng === 'zh-Hant') return 'zh-Hant';
  if (lng === 'zh-CN' || lng === 'zh-Hans' || lng === 'zh') return 'zh-Hans';
  return lng.split('-')[0];
};

i18n
  // Configure language detection to check querystring ?lang=xx
  .use(LanguageDetector)
  // Enable dynamic imports for namespaces using Vite's dynamic import with automatic fallback
  .use(
    resourcesToBackend((language, namespace) => {
      const normLang = normalizeLanguage(language);
      return import(`./locales/${namespace}/${normLang}.json`).catch(() => {
        return import(`./locales/${namespace}/en.json`);
      });
    })
  )
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly',
    
    // We will let LanguageDetector handle querystring resolution
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    
    // Default namespace
    ns: ['shared'],
    defaultNS: 'shared',

    interpolation: {
      escapeValue: false, // React already safeguards from XSS
    },

    react: {
      useSuspense: false, // Prevent blank screen hangs if dynamic imports load asynchronously
    }
  });

const RTL_LANGUAGES = ['ar', 'he', 'ur'];

const updateDocumentDirection = (lng) => {
  if (typeof document !== 'undefined') {
    const langCode = (lng || 'en').split('-')[0];
    const isRtl = RTL_LANGUAGES.includes(lng) || RTL_LANGUAGES.includes(langCode);
    const dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
    document.body.setAttribute('dir', dir);
  }
};

i18n.on('languageChanged', updateDocumentDirection);

// Initial call
if (i18n.language) {
  updateDocumentDirection(i18n.language);
}

export default i18n;
