import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  onClose: () => void;
  productId?: string;
}

export function SuccessModal({ onClose, productId }: SuccessModalProps) {
  const navigate = useNavigate();

  const handleUploadAnother = () => {
    onClose();
    navigate('/artisan/upload');
  };

  const handleViewProduct = () => {
    onClose();
    navigate('/dashboard/artisan');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-card rounded-2xl p-8 max-w-md w-full shadow-warm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Craft Submitted!</h2>
            <p className="text-muted-foreground">
              Your craft has been submitted for review. Our team will review it within 24-48 hours and notify you once it's live on CultureCart.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="bg-gradient-hero"
              onClick={handleViewProduct}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Product
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/dashboard/artisan')}
              >
                Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleUploadAnother}
              >
                Upload Another
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
