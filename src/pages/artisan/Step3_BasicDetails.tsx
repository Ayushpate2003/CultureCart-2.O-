import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { basicDetailsSchema } from '@/lib/validations/uploadCraft';
import { useToast } from '@/hooks/use-toast';

export function Step3_BasicDetails() {
  const { formData, updateFormData, nextStep, prevStep } = useUploadCraftStore();
  const { toast } = useToast();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSuggestPrice = () => {
    // Mock AI price suggestion based on dimensions
    const basePrice = 500;
    const dimensionFactor = 
      (parseFloat(formData.length) || 0) * 
      (parseFloat(formData.width) || 0) * 
      (parseFloat(formData.height) || 1) / 100;
    const suggestedPrice = Math.round(basePrice + dimensionFactor * 100);
    updateFormData({ price: suggestedPrice.toString() });
    toast({
      title: 'AI Suggestion',
      description: `Suggested price: ₹${suggestedPrice}`,
    });
  };

  const handleContinue = () => {
    try {
      basicDetailsSchema.parse({
        price: formData.price,
        quantity: formData.quantity,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        weight: formData.weight,
        customizable: formData.customizable,
      });
      setValidationError(null);
      nextStep();
      toast({
        title: 'Details saved',
        description: 'Proceeding to AI preview',
      });
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Please fill all required fields';
      setValidationError(errorMessage);
      toast({
        title: 'Validation Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const canProceed = 
    formData.price && 
    formData.quantity && 
    formData.length && 
    formData.width && 
    formData.weight;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2">Product Details</h2>
        <p className="text-muted-foreground">
          Provide essential information about your craft's pricing, dimensions, and availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <div className="flex gap-2">
            <Input
              id="price"
              type="number"
              placeholder="2999"
              value={formData.price}
              onChange={(e) => updateFormData({ price: e.target.value })}
            />
            <Button
              variant="outline"
              onClick={handleSuggestPrice}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Suggest
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Available Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="10"
            value={formData.quantity}
            onChange={(e) => updateFormData({ quantity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Length (cm) *</Label>
          <Input
            id="length"
            type="number"
            step="0.1"
            placeholder="30"
            value={formData.length}
            onChange={(e) => updateFormData({ length: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">Width (cm) *</Label>
          <Input
            id="width"
            type="number"
            step="0.1"
            placeholder="20"
            value={formData.width}
            onChange={(e) => updateFormData({ width: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            placeholder="2"
            value={formData.height}
            onChange={(e) => updateFormData({ height: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            placeholder="0.5"
            value={formData.weight}
            onChange={(e) => updateFormData({ weight: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
        <div>
          <Label htmlFor="customizable" className="text-base font-medium cursor-pointer">
            Customizable Product
          </Label>
          <p className="text-sm text-muted-foreground">
            Can customers request custom variations?
          </p>
        </div>
        <Switch
          id="customizable"
          checked={formData.customizable}
          onCheckedChange={(checked) => updateFormData({ customizable: checked })}
        />
      </div>

      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{validationError}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={prevStep}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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
