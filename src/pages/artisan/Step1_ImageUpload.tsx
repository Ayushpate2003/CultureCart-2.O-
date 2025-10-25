import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ImageUploadZone } from '@/components/upload/ImageUploadZone';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { imageUploadSchema } from '@/lib/validations/uploadCraft';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function Step1_ImageUpload() {
  const { formData, updateFormData, nextStep } = useUploadCraftStore();
  const { toast } = useToast();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleImagesChange = (images: File[], previews: string[]) => {
    updateFormData({ images, imagePreviews: previews });
    setValidationError(null);
  };

  const handleContinue = () => {
    try {
      imageUploadSchema.parse({ images: formData.images });
      nextStep();
      toast({
        title: 'Images uploaded',
        description: 'Proceeding to voice description',
      });
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Please upload at least 1 image';
      setValidationError(errorMessage);
      toast({
        title: 'Validation Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const canProceed = formData.images.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2">Upload Your Craft Images</h2>
        <p className="text-muted-foreground">
          Upload 1-5 high-quality images of your craft. The first image will be the primary photo.
        </p>
      </div>

      <ImageUploadZone
        images={formData.images}
        imagePreviews={formData.imagePreviews}
        onImagesChange={handleImagesChange}
        maxFiles={5}
      />

      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{validationError}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-gradient-hero"
          disabled={!canProceed}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
