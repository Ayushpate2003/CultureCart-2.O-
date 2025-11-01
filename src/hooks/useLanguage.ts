// import { useTranslation } from 'react-i18next'; // Disabled - i18n not configured
import { useCallback } from 'react';

export const useLanguage = () => {
  // const { i18n, t } = useTranslation(); // Disabled - i18n not configured

  const changeLanguage = useCallback(async (language: string) => {
    try {
      // Store language preference in localStorage
      localStorage.setItem('culturecart_language', language);
      console.log('Language changed to:', language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, []);

  const getCurrentLanguage = useCallback(() => {
    return localStorage.getItem('culturecart_language') || 'en';
  }, []);

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
    // t, // Disabled - i18n not configured
    // i18n, // Disabled - i18n not configured
  };
};
