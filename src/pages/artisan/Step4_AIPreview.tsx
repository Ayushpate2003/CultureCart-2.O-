import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AILoadingAnimation } from '@/components/upload/AILoadingAnimation';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Step4_AIPreview() {
  const { formData, updateFormData, nextStep, prevStep } = useUploadCraftStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (!hasGenerated && !formData.aiGeneratedTitle) {
      generateAIContent();
    }
  }, []);

  const generateAIContent = async () => {
    setIsGenerating(true);
    
    // Mock AI generation - simulating API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock content based on form data
    const mockTitle = `Handcrafted ${formData.customizable ? 'Custom ' : ''}Art Piece`;
    const mockStory = `This exquisite piece showcases traditional craftsmanship passed down through generations. ${formData.voiceDescription.slice(0, 200)}... Meticulously created with attention to detail, measuring ${formData.length}x${formData.width}cm.`;
    const mockTags = ['Handmade', 'Traditional', 'Authentic', 'Cultural', 'Artisan', 'Unique'];

    updateFormData({
      aiGeneratedTitle: mockTitle,
      aiGeneratedStory: mockStory,
      aiGeneratedTags: mockTags,
    });

    setIsGenerating(false);
    setHasGenerated(true);
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      aiGeneratedTags: formData.aiGeneratedTags.filter(tag => tag !== tagToRemove),
    });
  };

  const addTag = (newTag: string) => {
    if (newTag.trim() && !formData.aiGeneratedTags.includes(newTag.trim())) {
      updateFormData({
        aiGeneratedTags: [...formData.aiGeneratedTags, newTag.trim()],
      });
    }
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AILoadingAnimation />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-accent" />
          AI-Generated Content
        </h2>
        <p className="text-muted-foreground">
          Review and edit the AI-generated title, description, and tags for your craft.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ai-title">Product Title</Label>
          <Input
            id="ai-title"
            value={formData.aiGeneratedTitle}
            onChange={(e) => updateFormData({ aiGeneratedTitle: e.target.value })}
            placeholder="Enter product title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-story">Product Story</Label>
          <Textarea
            id="ai-story"
            value={formData.aiGeneratedStory}
            onChange={(e) => updateFormData({ aiGeneratedStory: e.target.value })}
            placeholder="Enter product description"
            rows={8}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            {formData.aiGeneratedStory.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg min-h-[60px]">
            {formData.aiGeneratedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add custom tag and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-accent" />
          <p className="text-sm text-foreground">
            AI has analyzed your images and description to generate this content. Feel free to edit as needed.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={prevStep}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={generateAIContent}
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Regenerate
          </Button>
          <Button
            size="lg"
            className="bg-gradient-hero"
            onClick={nextStep}
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
