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
  });

export default i18n;
