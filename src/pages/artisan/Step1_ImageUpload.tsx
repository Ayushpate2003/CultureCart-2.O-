import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ImageUploadZone } from '@/components/upload/ImageUploadZone';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { ArrowRight } from 'lucide-react';

export function Step1_ImageUpload() {
  const { formData, updateFormData, nextStep } = useUploadCraftStore();

  const handleImagesChange = (images: File[], previews: string[]) => {
    updateFormData({ images, imagePreviews: previews });
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

      <div className="flex justify-end">
        <Button
          size="lg"
          className="bg-gradient-hero"
          disabled={!canProceed}
          onClick={nextStep}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
