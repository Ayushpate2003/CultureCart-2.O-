import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next'; // Disabled - i18n not configured
import { motion } from 'framer-motion';
import { MapPin, Languages, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/hooks/useLanguage';
import { reverseGeocode, getCurrentLocation, getLanguageName, getStateLanguages } from '@/api/geocode';

const LocationLanguage: React.FC = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation(); // Disabled - i18n not configured
  const t = (key: string, options?: any) => {
    // Fallback translations
    const translations: Record<string, string> = {
      'onboarding.welcome': 'onboarding.welcome',
      'onboarding.locationPermission': 'Location Permission',
      'onboarding.detectingLanguage': 'onboarding.languageDetected',
      'onboarding.chooseLanguage': 'onboarding.chooseLanguage',
      'onboarding.skipLocation': 'Skip Location',
      'onboarding.setupComplete': 'onboarding.setupComplete',
      'onboarding.languageDetected': 'onboarding.languageDetected'
    };
    return translations[key] || key;
  };
  const {
    currentStep,
    totalSteps,
    locationData,
    selectedLanguage,
    isLocationLoading,
    isLanguageLoading,
    locationError,
    languageError,
    setCurrentStep,
    setLocationData,
    setSelectedLanguage,
    setLocationLoading,
    setLanguageLoading,
    setLocationError,
    setLanguageError,
    completeOnboarding,
  } = useOnboardingStore();

  const { changeLanguage, getAvailableLanguages } = useLanguage();
  const { user } = useAuthStore();
  const [isCompleting, setIsCompleting] = useState(false);

  // Step 1: Detect Location
  const detectLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    try {
      const coords = await getCurrentLocation();
      const locationInfo = await reverseGeocode(coords.latitude, coords.longitude);

      setLocationData({
        ...coords,
        ...locationInfo,
      });

      // Auto-detect language based on location
      if (locationInfo.detectedLanguage && !selectedLanguage) {
        setSelectedLanguage(locationInfo.detectedLanguage);
      }

      setCurrentStep(2);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : 'Location detection failed');
    } finally {
      setLocationLoading(false);
    }
  };

  // Step 2: Handle Language Selection
  const handleLanguageSelect = async (languageCode: string) => {
    setLanguageLoading(true);
    setLanguageError(null);

    try {
      setSelectedLanguage(languageCode);
      await changeLanguage(languageCode);
    } catch (error) {
      setLanguageError('Failed to set language preference');
    } finally {
      setLanguageLoading(false);
    }
  };

  // Complete Onboarding
  const handleComplete = async () => {
    console.log('Onboarding completion started');
    console.log('Selected language:', selectedLanguage);
    console.log('Current user:', user);
    
    if (!selectedLanguage) {
      setLanguageError('Please select a language to continue');
      return;
    }

    setIsCompleting(true);
    try {
      console.log('Calling completeOnboarding...');
      await completeOnboarding();
      console.log('Onboarding completed successfully');
      
      // Navigate to role-specific dashboard
      const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' :
                           user?.role === 'artisan' ? '/dashboard/artisan' :
                           '/dashboard/buyer';
      
      console.log('Navigating to:', dashboardPath);
      navigate(dashboardPath);
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      setLanguageError(`Failed to complete setup: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsCompleting(false);
    }
  };

  // Auto-detect location on mount
  useEffect(() => {
    if (currentStep === 1 && !locationData && !isLocationLoading) {
      detectLocation();
    }
  }, [currentStep, locationData, isLocationLoading]);

  const availableLanguages = getAvailableLanguages();
  const stateLanguages = locationData?.state ? getStateLanguages(locationData.state) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {t('onboarding.welcome')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-600"
          >
            Step {currentStep} of {totalSteps}: {currentStep === 1 ? 'Location Detection' : 'Language Selection'}
          </motion.p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
              <Languages className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Step 1: Location Detection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  {t('onboarding.locationPermission')}
                </CardTitle>
                <CardDescription>
                  {t('onboarding.detectingLanguage')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {isLocationLoading && (
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-gray-600">Detecting your location...</p>
                  </div>
                )}

                {locationData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Location detected!</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                      <p className="font-medium text-gray-900">
                        {locationData.city}, {locationData.state}
                      </p>
                      <p className="text-sm text-gray-600">
                        Detected language: {getLanguageName(locationData.detectedLanguage || 'en')}
                      </p>
                    </div>
                    <Button onClick={() => setCurrentStep(2)} className="w-full">
                      Continue
                    </Button>
                  </motion.div>
                )}

                {locationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}

                {!isLocationLoading && !locationData && (
                  <div className="space-y-4">
                    <Button onClick={detectLocation} variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button onClick={() => setCurrentStep(2)} variant="ghost" className="w-full">
                      {t('onboarding.skipLocation')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Language Selection */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Languages className="w-6 h-6 text-primary" />
                  {t('onboarding.chooseLanguage')}
                </CardTitle>
                <CardDescription>
                  {locationData?.state
                    ? t('onboarding.languageDetected', {
                        state: locationData.state,
                        language: getLanguageName(locationData.detectedLanguage || 'en')
                      })
                    : 'Select your preferred language'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recommended Languages */}
                {stateLanguages.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Recommended for your region:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {stateLanguages.map((langCode) => {
                        const lang = availableLanguages.find(l => l.code === langCode);
                        if (!lang) return null;

                        return (
                          <Button
                            key={langCode}
                            variant={selectedLanguage === langCode ? "default" : "outline"}
                            onClick={() => handleLanguageSelect(langCode)}
                            disabled={isLanguageLoading}
                            className="justify-start h-auto p-4"
                          >
                            <div className="text-left">
                              <div className="font-medium">{lang.nativeName}</div>
                              <div className="text-sm opacity-75">{lang.name}</div>
                            </div>
                            {selectedLanguage === langCode && (
                              <CheckCircle className="w-4 h-4 ml-auto" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Available Languages */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">All languages:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableLanguages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={selectedLanguage === lang.code ? "default" : "outline"}
                        onClick={() => handleLanguageSelect(lang.code)}
                        disabled={isLanguageLoading}
                        className="justify-start h-auto p-4"
                      >
                        <div className="text-left">
                          <div className="font-medium">{lang.nativeName}</div>
                          <div className="text-sm opacity-75">{lang.name}</div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <CheckCircle className="w-4 h-4 ml-auto" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {languageError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{languageError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={!selectedLanguage || isCompleting}
                    className="flex-1"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Completing...
                      </>
                    ) : (
                      t('onboarding.setupComplete')
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LocationLanguage;
