import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { useArtisanProductsStore } from '@/stores/artisanProductsStore';
import { ArrowLeft, Send, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessModal } from '@/components/upload/SuccessModal';
import { useToast } from '@/hooks/use-toast';
import { ProductReviewSkeleton } from '@/components/upload/UploadSkeleton';

export function Step5_FinalReview() {
  const { formData, prevStep, resetForm } = useUploadCraftStore();
  const { addProduct } = useArtisanProductsStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedProductId, setUploadedProductId] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Mock submission - simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add product to store
      const productId = addProduct({
        title: formData.aiGeneratedTitle,
        price: formData.price,
        thumbnail: formData.imagePreviews[0] || '',
      });
      
      setUploadedProductId(productId);
      
      toast({
        title: 'Craft Submitted!',
        description: 'Your craft has been submitted for review',
      });
      
      setShowSuccess(true);
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit craft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    resetForm();
    navigate('/dashboard/artisan');
  };

  if (isSubmitting) {
    return <ProductReviewSkeleton />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">Final Review</h2>
          <p className="text-muted-foreground">
            Review all details before submitting your craft for approval.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Images Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Images ({formData.imagePreviews.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {formData.imagePreviews.map((preview, index) => (
                <div key={preview} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <Badge className="absolute top-1 left-1 text-xs">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Product Information</h3>
              <div className="space-y-3 bg-card p-4 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{formData.aiGeneratedTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">₹{formData.price}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{formData.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{formData.weight} kg</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-medium">
                    {formData.length} × {formData.width}
                    {formData.height && ` × ${formData.height}`} cm
                  </p>
                </div>
                {formData.customizable && (
                  <Badge variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    Customizable
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Description</h3>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm leading-relaxed">{formData.aiGeneratedStory}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {formData.aiGeneratedTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Audio Recording Info */}
        {formData.audioUrl && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Voice Description</h3>
            <div className="bg-card p-4 rounded-lg border flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Audio recording attached</p>
                <p className="text-sm text-muted-foreground">Language: {formData.language}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" size="lg" onClick={prevStep}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            size="lg"
            className="bg-gradient-hero"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit for Approval
                <Check className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {showSuccess && (
        <SuccessModal 
          onClose={handleCloseSuccess} 
          productId={uploadedProductId}
        />
      )}
    </>
  );
}
