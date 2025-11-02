import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import ta from './locales/ta.json';
import bn from './locales/bn.json';
import or from './locales/or.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import ur from './locales/ur.json';
import as from './locales/as.json';

// Language metadata for AI-based location detection
export const languageMetadata = {
  en: { name: 'English', nativeName: 'English', regions: ['Global'], rtl: false },
  hi: { name: 'Hindi', nativeName: 'हिंदी', regions: ['Delhi', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Haryana', 'Uttarakhand', 'Chhattisgarh', 'Jharkhand'], rtl: false },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', regions: ['Gujarat', 'Dadra and Nagar Haveli and Daman and Diu'], rtl: false },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', regions: ['Tamil Nadu', 'Puducherry'], rtl: false },
  bn: { name: 'Bengali', nativeName: 'বাংলা', regions: ['West Bengal', 'Tripura'], rtl: false },
  or: { name: 'Odia', nativeName: 'ଓଡ଼ିଆ', regions: ['Odisha'], rtl: false },
  te: { name: 'Telugu', nativeName: 'తెలుగు', regions: ['Telangana', 'Andhra Pradesh'], rtl: false },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', regions: ['Karnataka'], rtl: false },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', regions: ['Kerala', 'Lakshadweep'], rtl: false },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', regions: ['Punjab'], rtl: false },
  ur: { name: 'Urdu', nativeName: 'اردو', regions: ['Jammu and Kashmir', 'Delhi', 'Uttar Pradesh', 'Bihar'], rtl: true },
  as: { name: 'Assamese', nativeName: 'অসমীয়া', regions: ['Assam'], rtl: false },
};

// State to language mapping for AI location detection
export const stateToLanguage = {
  'Andhra Pradesh': 'te',
  'Arunachal Pradesh': 'en', // English as primary, Hindi secondary
  'Assam': 'as',
  'Bihar': 'hi',
  'Chhattisgarh': 'hi',
  'Goa': 'en', // English, Konkani, Marathi
  'Gujarat': 'gu',
  'Haryana': 'hi',
  'Himachal Pradesh': 'hi',
  'Jharkhand': 'hi',
  'Karnataka': 'kn',
  'Kerala': 'ml',
  'Madhya Pradesh': 'hi',
  'Maharashtra': 'hi', // Marathi, but Hindi widely spoken
  'Manipur': 'en', // English, Manipuri
  'Meghalaya': 'en', // English, Khasi, Garo
  'Mizoram': 'en', // English, Mizo
  'Nagaland': 'en', // English, Naga languages
  'Odisha': 'or',
  'Punjab': 'pa',
  'Rajasthan': 'hi',
  'Sikkim': 'en', // English, Nepali, Bhutia
  'Tamil Nadu': 'ta',
  'Telangana': 'te',
  'Tripura': 'bn',
  'Uttar Pradesh': 'hi',
  'Uttarakhand': 'hi',
  'West Bengal': 'bn',
  'Delhi': 'hi',
  'Jammu and Kashmir': 'ur',
  'Ladakh': 'en', // English, Ladakhi
  'Puducherry': 'ta',
  'Chandigarh': 'hi',
  'Dadra and Nagar Haveli and Daman and Diu': 'gu',
  'Lakshadweep': 'ml',
};

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  gu: {
    translation: gu,
  },
  ta: {
    translation: ta,
  },
  bn: {
    translation: bn,
  },
  or: {
    translation: or,
  },
  te: {
    translation: te,
  },
  kn: {
    translation: kn,
  },
  ml: {
    translation: ml,
  },
  pa: {
    translation: pa,
  },
  ur: {
    translation: ur,
  },
  as: {
    translation: as,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'culturecart_language',
      caches: ['localStorage'],
    },

    // RTL support for Urdu
    react: {
      useSuspense: false,
    },
  });

// Set document direction based on current language
i18n.on('languageChanged', (lng) => {
  const direction = languageMetadata[lng]?.rtl ? 'rtl' : 'ltr';
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
});

export default i18n;
