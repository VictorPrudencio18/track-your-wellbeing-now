
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface OnboardingData {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  isCompleted: boolean;
  responses: Record<string, any>;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OnboardingData>({
    currentStep: 1,
    totalSteps: 8,
    completedSteps: [],
    isCompleted: false,
    responses: {}
  });

  useEffect(() => {
    if (user) {
      loadOnboardingProgress();
    }
  }, [user]);

  const loadOnboardingProgress = async () => {
    if (!user) return;

    try {
      const { data: progress, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (progress) {
        const completedSteps = Array.isArray(progress.completed_steps) 
          ? progress.completed_steps as number[]
          : [];
        
        const responses = typeof progress.data_snapshot === 'object' && progress.data_snapshot !== null
          ? progress.data_snapshot as Record<string, any>
          : {};

        setData({
          currentStep: progress.current_step || 1,
          totalSteps: progress.total_steps || 8,
          completedSteps,
          isCompleted: progress.is_completed || false,
          responses
        });
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (step: number, responses: Record<string, any>) => {
    if (!user) return;

    try {
      console.log('Saving progress for step:', step, 'with data:', responses);
      
      const newCompletedSteps = [...data.completedSteps];
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step);
      }

      const updatedResponses = { ...data.responses, ...responses };

      const updatedData = {
        ...data,
        currentStep: step + 1,
        completedSteps: newCompletedSteps,
        responses: updatedResponses
      };

      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          user_id: user.id,
          current_step: updatedData.currentStep,
          total_steps: updatedData.totalSteps,
          completed_steps: updatedData.completedSteps,
          is_completed: updatedData.currentStep > updatedData.totalSteps,
          data_snapshot: updatedResponses,
          last_active_at: new Date().toISOString()
        });

      if (error) throw error;

      console.log('Progress saved successfully');
      setData(updatedData);
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  const saveResponse = async (questionKey: string, value: any, categoryName: string) => {
    if (!user) return;

    try {
      console.log('Saving individual response:', questionKey, value, categoryName);
      
      const { error } = await supabase
        .from('user_profile_assessment')
        .upsert({
          user_id: user.id,
          question_key: questionKey,
          category_name: categoryName,
          response_value: value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('Individual response saved successfully');
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      console.log('Completing onboarding for user:', user.id);
      
      // Marcar onboarding como completo
      const { error: progressError } = await supabase
        .from('onboarding_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      console.log('Onboarding completed successfully');
      setData(prev => ({ ...prev, isCompleted: true }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return {
    loading,
    data,
    saveProgress,
    saveResponse,
    completeOnboarding
  };
}
