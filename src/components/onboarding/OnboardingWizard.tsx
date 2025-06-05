
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/hooks/useOnboarding';
import { StepIndicator } from './StepIndicator';
import { WelcomeStep } from './steps/WelcomeStep';
import { BasicProfileStep } from './steps/BasicProfileStep';
import { HealthStep } from './steps/HealthStep';
import { LifestyleStep } from './steps/LifestyleStep';
import { GoalsStep } from './steps/GoalsStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { SocialStep } from './steps/SocialStep';
import { SummaryStep } from './steps/SummaryStep';

const steps = [
  { id: 1, title: 'Boas-vindas', component: WelcomeStep },
  { id: 2, title: 'Perfil Básico', component: BasicProfileStep },
  { id: 3, title: 'Saúde', component: HealthStep },
  { id: 4, title: 'Estilo de Vida', component: LifestyleStep },
  { id: 5, title: 'Objetivos', component: GoalsStep },
  { id: 6, title: 'Preferências', component: PreferencesStep },
  { id: 7, title: 'Social', component: SocialStep },
  { id: 8, title: 'Resumo', component: SummaryStep }
];

export function OnboardingWizard() {
  const { data, saveProgress, saveResponse, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(data.currentStep);

  const handleNext = async (stepData: Record<string, any>) => {
    await saveProgress(currentStep, stepData);
    
    if (currentStep < data.totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
      window.location.reload(); // Refresh to update auth state
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={data.totalSteps}
          steps={steps}
        />
        
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  canGoBack={currentStep > 1}
                  {...(currentStep > 1 && { saveResponse, responses: data.responses })}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
