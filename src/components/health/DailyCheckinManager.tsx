
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { CheckinCard } from './CheckinCard';
import { CheckinPrompt } from '@/hooks/useDailyCheckins';

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export function DailyCheckinManager() {
  const { todayCheckin, prompts, upsertCheckin } = useDailyCheckins();
  const [currentPrompt, setCurrentPrompt] = useState<CheckinPrompt | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [answeredPrompts, setAnsweredPrompts] = useState<Set<string>>(new Set());
  const [lastPromptTime, setLastPromptTime] = useState<number>(0);

  const timeOfDay = getTimeOfDay();

  // Filtrar prompts relevantes para o momento atual
  const getRelevantPrompts = (): CheckinPrompt[] => {
    const now = Date.now();
    const timeSinceLastPrompt = now - lastPromptTime;
    
    // Evitar prompts muito frequentes (mínimo 2 horas)
    if (timeSinceLastPrompt < 2 * 60 * 60 * 1000) return [];

    return prompts
      .filter(prompt => 
        prompt.time_ranges.includes(timeOfDay) &&
        !answeredPrompts.has(prompt.prompt_key)
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 1); // Máximo 1 prompt por vez
  };

  // Lógica para mostrar próximo prompt
  useEffect(() => {
    if (currentPrompt || isVisible) return;

    const relevantPrompts = getRelevantPrompts();
    if (relevantPrompts.length === 0) return;

    // Delay antes de mostrar (para não ser intrusivo)
    const timer = setTimeout(() => {
      setCurrentPrompt(relevantPrompts[0]);
      setIsVisible(true);
      setLastPromptTime(Date.now());
    }, 5000); // 5 segundos após o carregamento

    return () => clearTimeout(timer);
  }, [prompts, answeredPrompts, currentPrompt, isVisible, timeOfDay]);

  const handleAnswer = async (promptKey: string, value: any) => {
    if (!currentPrompt) return;

    // Mapear resposta para o campo correto no banco
    const fieldMap: Record<string, string> = {
      'morning_sleep': 'sleep_quality',
      'morning_water': 'hydration_glasses',
      'morning_exercise_plan': 'exercise_planned',
      'afternoon_work': 'work_satisfaction',
      'afternoon_energy': 'energy_level',
      'afternoon_stress': 'stress_level',
      'evening_water_total': 'hydration_glasses',
      'evening_exercise': 'exercise_completed',
      'evening_day_rating': 'mood_rating',
    };

    const field = fieldMap[promptKey];
    if (!field) return;

    // Converter valor conforme necessário
    let finalValue = value;
    if (promptKey === 'morning_water' && value === true) {
      finalValue = Math.max((todayCheckin?.hydration_glasses || 0) + 1, 1);
    }

    try {
      await upsertCheckin.mutateAsync({
        [field]: finalValue
      });

      setAnsweredPrompts(prev => new Set([...prev, promptKey]));
      setIsVisible(false);
      
      // Limpar prompt atual após um delay
      setTimeout(() => {
        setCurrentPrompt(null);
      }, 300);
    } catch (error) {
      console.error('Error saving checkin:', error);
    }
  };

  const handleDismiss = () => {
    if (currentPrompt) {
      setAnsweredPrompts(prev => new Set([...prev, currentPrompt.prompt_key]));
    }
    setIsVisible(false);
    setTimeout(() => {
      setCurrentPrompt(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && currentPrompt && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <CheckinCard
            prompt={currentPrompt}
            onAnswer={handleAnswer}
            onDismiss={handleDismiss}
            isLoading={upsertCheckin.isPending}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
