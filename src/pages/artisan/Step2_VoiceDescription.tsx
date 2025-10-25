import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceRecorder } from '@/components/upload/VoiceRecorder';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { ArrowRight, ArrowLeft, Mic, Type } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Step2_VoiceDescription() {
  const { formData, updateFormData, nextStep, prevStep } = useUploadCraftStore();
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');

  const handleRecordingComplete = (blob: Blob, url: string) => {
    updateFormData({ audioBlob: blob, audioUrl: url });
  };

  const handleDeleteRecording = () => {
    updateFormData({ audioBlob: null, audioUrl: null });
  };

  const canProceed = formData.voiceDescription.trim() || formData.audioUrl;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold mb-2">Tell Your Craft's Story</h2>
        <p className="text-muted-foreground">
          Share the story behind your craft - the inspiration, technique, and cultural significance.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={formData.language} onValueChange={(value) => updateFormData({ language: value })}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
              <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
              <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              <SelectItem value="mr">मराठी (Marathi)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'voice' | 'text')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voice" className="gap-2">
              <Mic className="w-4 h-4" />
              Voice Recording
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <Type className="w-4 h-4" />
              Type Description
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-6">
            <VoiceRecorder
              audioBlob={formData.audioBlob}
              audioUrl={formData.audioUrl}
              onRecordingComplete={handleRecordingComplete}
              onDelete={handleDeleteRecording}
            />
          </TabsContent>

          <TabsContent value="text" className="mt-6">
            <div className="space-y-2">
              <Label htmlFor="description">Written Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your craft, the technique used, materials, cultural significance, and what makes it special..."
                value={formData.voiceDescription}
                onChange={(e) => updateFormData({ voiceDescription: e.target.value })}
                rows={8}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                {formData.voiceDescription.length} characters
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={prevStep}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
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
