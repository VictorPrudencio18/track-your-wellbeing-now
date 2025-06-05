
import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-orange to-accent-orange/80"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="absolute -top-1 right-0 text-xs text-navy-400">
          {currentStep} de {totalSteps}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? 'bg-accent-orange text-white' 
                    : isCurrent 
                      ? 'bg-accent-orange/20 border-2 border-accent-orange text-accent-orange'
                      : 'bg-navy-700 text-navy-400'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </motion.div>
              <span className={`
                mt-2 text-xs text-center max-w-16
                ${isCurrent ? 'text-accent-orange font-medium' : 'text-navy-400'}
              `}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
