import { create } from 'zustand';

export interface UploadFormData {
  images: File[];
  imagePreviews: string[];
  voiceDescription: string;
  audioBlob: Blob | null;
  audioUrl: string | null;
  language: string;
  price: string;
  quantity: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  customizable: boolean;
  aiGeneratedTitle: string;
  aiGeneratedStory: string;
  aiGeneratedTags: string[];
}

interface UploadCraftStore {
  currentStep: number;
  formData: UploadFormData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<UploadFormData>) => void;
  resetForm: () => void;
}

const initialFormData: UploadFormData = {
  images: [],
  imagePreviews: [],
  voiceDescription: '',
  audioBlob: null,
  audioUrl: null,
  language: 'en',
  price: '',
  quantity: '',
  length: '',
  width: '',
  height: '',
  weight: '',
  customizable: false,
  aiGeneratedTitle: '',
  aiGeneratedStory: '',
  aiGeneratedTags: [],
};

export const useUploadCraftStore = create<UploadCraftStore>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () => set({ currentStep: 1, formData: initialFormData }),
}));
