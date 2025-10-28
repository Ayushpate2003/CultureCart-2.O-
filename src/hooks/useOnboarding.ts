import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const {
    currentStep,
    totalSteps,
    locationData,
    selectedLanguage,
    isLocationLoading,
    isLanguageLoading,
    locationError,
    languageError,
    isCompleted,
    setCurrentStep,
    setLocationData,
    setSelectedLanguage,
    setLocationLoading,
    setLanguageLoading,
    setLocationError,
    setLanguageError,
    completeOnboarding,
    resetOnboarding,
  } = useOnboardingStore();

  // Redirect logic
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (user?.onboardingCompleted) {
      navigate('/dashboard');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Initialize onboarding if user exists but hasn't completed onboarding
  useEffect(() => {
    if (user && !user.onboardingCompleted && !isCompleted) {
      // Onboarding can start
    }
  }, [user, isCompleted]);

  return {
    // State
    currentStep,
    totalSteps,
    locationData,
    selectedLanguage,
    isLocationLoading,
    isLanguageLoading,
    locationError,
    languageError,
    isCompleted,
    user,
    isAuthenticated,

    // Actions
    setCurrentStep,
    setLocationData,
    setSelectedLanguage,
    setLocationLoading,
    setLanguageLoading,
    setLocationError,
    setLanguageError,
    completeOnboarding,
    resetOnboarding,
  };
};
