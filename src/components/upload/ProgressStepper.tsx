import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: 'Images' },
  { number: 2, title: 'Description' },
  { number: 3, title: 'Details' },
  { number: 4, title: 'AI Preview' },
  { number: 5, title: 'Review' },
];

interface ProgressStepperProps {
  currentStep: number;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1,
                  backgroundColor:
                    currentStep > step.number
                      ? 'hsl(var(--primary))'
                      : currentStep === step.number
                      ? 'hsl(var(--accent))'
                      : 'hsl(var(--muted))',
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold relative z-10"
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.number}</span>
                )}
              </motion.div>
              <span
                className={`text-sm mt-2 font-medium transition-colors ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-muted mx-2 relative -mt-6">
                <motion.div
                  initial={false}
                  animate={{
                    width: currentStep > step.number ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
