import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  state?: string;
  city?: string;
  country?: string;
  detectedLanguage?: string;
}

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  locationData: LocationData | null;
  selectedLanguage: string | null;
  isLocationLoading: boolean;
  isLanguageLoading: boolean;
  locationError: string | null;
  languageError: string | null;
  isCompleted: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setLocationData: (data: LocationData | null) => void;
  setSelectedLanguage: (language: string) => void;
  setLocationLoading: (loading: boolean) => void;
  setLanguageLoading: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setLanguageError: (error: string | null) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  totalSteps: 2, // Location detection + Language selection
  locationData: null,
  selectedLanguage: null,
  isLocationLoading: false,
  isLanguageLoading: false,
  locationError: null,
  languageError: null,
  isCompleted: false,

  setCurrentStep: (step: number) => set({ currentStep: step }),

  setLocationData: (data: LocationData | null) => set({ locationData: data }),

  setSelectedLanguage: (language: string) => set({ selectedLanguage: language }),

  setLocationLoading: (loading: boolean) => set({ isLocationLoading: loading }),

  setLanguageLoading: (loading: boolean) => set({ isLanguageLoading: loading }),

  setLocationError: (error: string | null) => set({ locationError: error }),

  setLanguageError: (error: string | null) => set({ languageError: error }),

  completeOnboarding: async () => {
    const { locationData, selectedLanguage } = get();
    const { user, updateUser } = useAuthStore.getState();

    if (!user) {
      throw new Error('No user found');
    }

    try {
      // Update user preferences with location and language
      await updateUser({
        onboardingCompleted: true,
        preferences: {
          ...user.preferences,
          language: selectedLanguage || 'en',
          location: locationData ? {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            state: locationData.state,
            city: locationData.city,
            country: locationData.country,
          } : undefined,
        },
      });

      set({ isCompleted: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  resetOnboarding: () => set({
    currentStep: 1,
    locationData: null,
    selectedLanguage: null,
    isLocationLoading: false,
    isLanguageLoading: false,
    locationError: null,
    languageError: null,
    isCompleted: false,
  }),
}));
