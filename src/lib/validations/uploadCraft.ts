import { z } from 'zod';

// Step 1: Image Upload Validation
export const imageUploadSchema = z.object({
  images: z.array(z.instanceof(File))
    .min(1, 'Please upload at least 1 image')
    .max(5, 'Maximum 5 images allowed'),
});

// Step 2: Voice Description Validation
export const voiceDescriptionSchema = z.object({
  voiceDescription: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  audioBlob: z.instanceof(Blob).nullable(),
  language: z.enum(['en', 'hi', 'bn', 'ta', 'te', 'mr']),
});

// Step 3: Basic Details Validation
export const basicDetailsSchema = z.object({
  price: z.string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
    .refine((val) => parseFloat(val) > 0, 'Price must be greater than 0'),
  quantity: z.string()
    .min(1, 'Quantity is required')
    .regex(/^\d+$/, 'Quantity must be a whole number')
    .refine((val) => parseInt(val) > 0, 'Quantity must be greater than 0'),
  length: z.string()
    .min(1, 'Length is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid length format'),
  width: z.string()
    .min(1, 'Width is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid width format'),
  height: z.string()
    .min(1, 'Height is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid height format'),
  weight: z.string()
    .min(1, 'Weight is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid weight format'),
  customizable: z.boolean(),
});

// Step 4: AI Preview Validation
export const aiPreviewSchema = z.object({
  aiGeneratedTitle: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  aiGeneratedStory: z.string()
    .min(50, 'Story must be at least 50 characters')
    .max(2000, 'Story must not exceed 2000 characters'),
  aiGeneratedTags: z.array(z.string())
    .min(3, 'Please add at least 3 tags')
    .max(10, 'Maximum 10 tags allowed'),
});

export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
export type VoiceDescriptionFormData = z.infer<typeof voiceDescriptionSchema>;
export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;
export type AIPreviewFormData = z.infer<typeof aiPreviewSchema>;
