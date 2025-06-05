
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCategorizedCheckins } from '@/hooks/useCategorizedCheckins';
import { toast } from '@/hooks/use-toast';

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

const getContextualPrompts = (timeOfDay: string, userHistory: any[]) => {
  // Lógica para determinar prompts contextuais baseados no horário e histórico
  const basePrompts: Record<string, string[]> = {
    morning: ['morning_energy', 'morning_sleep', 'morning_mood', 'morning_hydration'],
    afternoon: ['afternoon_energy', 'afternoon_stress', 'afternoon_productivity', 'afternoon_nutrition'],
    evening: ['evening_reflection', 'evening_exercise', 'evening_gratitude', 'evening_tomorrow'],
    night: ['night_wind_down', 'night_stress', 'night_tomorrow_prep']
  };

  // Personalizar baseado no histórico do usuário
  let contextualPrompts = basePrompts[timeOfDay] || basePrompts.morning;
  
  // Se usuário tem histórico de stress alto, adicionar prompts de bem-estar
  const hasHighStress = userHistory.some(h => h.stress_level && h.stress_level > 7);
  if (hasHighStress && timeOfDay === 'afternoon') {
    contextualPrompts = ['stress_check', 'breathing_exercise', ...contextualPrompts];
  }

  // Se usuário raramente se exercita, adicionar prompts de atividade
  const exerciseRate = userHistory.filter(h => h.exercise_completed).length / userHistory.length;
  if (exerciseRate < 0.3 && timeOfDay === 'evening') {
    contextualPrompts = ['exercise_motivation', ...contextualPrompts];
  }

  return contextualPrompts;
};

export function useSmartCheckins() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { respondToCheckin } = useCategorizedCheckins();
  
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const timeOfDay = getTimeOfDay();

  // Buscar histórico do usuário para contextualização
  const { data: userHistory = [] } = useQuery({
    queryKey: ['user-health-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('checkin_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Buscar prompts inteligentes para hoje
  const { data: smartPrompts = [], isLoading } = useQuery({
    queryKey: ['smart-checkin-prompts', user?.id, timeOfDay],
    queryFn: async () => {
      if (!user) return [];

      // Determinar prompts contextuais
      const contextualPromptKeys = getContextualPrompts(timeOfDay, userHistory);
      
      const { data, error } = await supabase
        .from('checkin_prompts')
        .select('*')
        .in('prompt_key', contextualPromptKeys)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && userHistory.length >= 0,
  });

  // Buscar respostas de hoje
  const { data: todayResponses = [] } = useQuery({
    queryKey: ['today-smart-responses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_checkin_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Filtrar prompts não respondidos
  const answeredPromptKeys = new Set(todayResponses.map(r => r.prompt_key));
  const currentPrompts = smartPrompts.filter(p => !answeredPromptKeys.has(p.prompt_key));

  // Mutation para submeter resposta
  const submitResponseMutation = useMutation({
    mutationFn: async ({ promptKey, value }: { promptKey: string; value: any }) => {
      await respondToCheckin.mutateAsync({
        promptKey,
        value,
        category: smartPrompts.find(p => p.prompt_key === promptKey)?.category || 'geral'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-smart-responses'] });
      toast({
        title: "Resposta registrada! ✅",
        description: "Obrigado por compartilhar como você está se sentindo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const nextPrompt = () => {
    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const previousPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const submitResponse = async (promptKey: string, value: any) => {
    await submitResponseMutation.mutateAsync({ promptKey, value });
  };

  // Reset prompt index when prompts change
  useEffect(() => {
    setCurrentPromptIndex(0);
  }, [smartPrompts.length]);

  return {
    currentPrompts,
    currentPromptIndex,
    completedToday: todayResponses.length,
    totalToday: smartPrompts.length,
    timeOfDay,
    isLoading,
    nextPrompt,
    previousPrompt,
    submitResponse,
    canGoNext: currentPromptIndex < currentPrompts.length - 1,
    canGoPrevious: currentPromptIndex > 0,
    isCompleted: currentPrompts.length === 0,
    userHistory
  };
}
