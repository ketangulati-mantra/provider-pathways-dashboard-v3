import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

i18n
  // Configure language detection to check querystring ?lang=xx
  .use(LanguageDetector)
  // Enable dynamic imports for namespaces using Vite's dynamic import
  .use(resourcesToBackend((language, namespace) => import(`./locales/${namespace}/${language}.json`)))
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    
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
      useSuspense: true,
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
