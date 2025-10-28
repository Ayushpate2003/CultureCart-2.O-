import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback(async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      localStorage.setItem('culturecart_language', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n.language]);

  const getAvailableLanguages = useCallback(() => {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
      { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
      { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    ];
  }, []);

  const getLanguageName = useCallback((code: string) => {
    const languages = getAvailableLanguages();
    return languages.find(lang => lang.code === code)?.nativeName || code;
  }, [getAvailableLanguages]);

  return {
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    getLanguageName,
    t,
    i18n,
  };
};
