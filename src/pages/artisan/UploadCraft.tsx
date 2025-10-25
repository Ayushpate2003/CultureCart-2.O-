import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProgressStepper } from '@/components/upload/ProgressStepper';
import { useUploadCraftStore } from '@/stores/uploadCraftStore';
import { Step1_ImageUpload } from './Step1_ImageUpload';
import { Step2_VoiceDescription } from './Step2_VoiceDescription';
import { Step3_BasicDetails } from './Step3_BasicDetails';
import { Step4_AIPreview } from './Step4_AIPreview';
import { Step5_FinalReview } from './Step5_FinalReview';

export default function UploadCraft() {
  const { currentStep } = useUploadCraftStore();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_ImageUpload />;
      case 2:
        return <Step2_VoiceDescription />;
      case 3:
        return <Step3_BasicDetails />;
      case 4:
        return <Step4_AIPreview />;
      case 5:
        return <Step5_FinalReview />;
      default:
        return <Step1_ImageUpload />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-craft">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-2xl shadow-warm p-8"
          >
            <ProgressStepper currentStep={currentStep} />

            <div className="mt-8">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
