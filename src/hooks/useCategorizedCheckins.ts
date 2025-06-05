
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface CheckinPrompt {
  id: string;
  prompt_key: string;
  category: string;
  subcategory: string | null;
  question: string;
  response_type: 'scale' | 'boolean' | 'number' | 'text' | 'select' | 'time';
  options: any;
  time_ranges: string[];
  priority: number;
  scoring_weight: number;
  frequency: string;
  is_active: boolean;
}

export interface CheckinResponse {
  id: string;
  user_id: string;
  prompt_key: string;
  category: string;
  subcategory: string | null;
  response_value: any;
  category_score: number;
  responded_at: string;
  checkin_date: string;
}

export interface CategoryStats {
  category: string;
  score: number;
  totalResponses: number;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
}

const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

export function useCategorizedCheckins() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const timeOfDay = getTimeOfDay();

  // Buscar prompts por categoria e horário
  const { data: prompts = [], isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['categorized-prompts', timeOfDay],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkin_prompts')
        .select('*')
        .eq('is_active', true)
        .contains('time_ranges', [timeOfDay])
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as CheckinPrompt[];
    },
  });

  // Buscar respostas de hoje
  const { data: todayResponses = [], isLoading: isLoadingResponses } = useQuery({
    queryKey: ['today-checkin-responses', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_checkin_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today);

      if (error) throw error;
      return data as CheckinResponse[];
    },
    enabled: !!user,
  });

  // Agrupar prompts por categoria
  const promptsByCategory = prompts.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<string, CheckinPrompt[]>);

  // Verificar quais prompts já foram respondidos
  const answeredPromptKeys = new Set(todayResponses.map(r => r.prompt_key));
  
  // Filtrar prompts não respondidos por categoria
  const unansweredByCategory = Object.entries(promptsByCategory).reduce((acc, [category, categoryPrompts]) => {
    const unanswered = categoryPrompts.filter(p => !answeredPromptKeys.has(p.prompt_key));
    if (unanswered.length > 0) {
      acc[category] = unanswered;
    }
    return acc;
  }, {} as Record<string, CheckinPrompt[]>);

  // Calcular estatísticas por categoria
  const categoryStats: CategoryStats[] = Object.keys(promptsByCategory).map(category => {
    const categoryPrompts = promptsByCategory[category];
    const categoryResponses = todayResponses.filter(r => r.category === category);
    const avgScore = categoryResponses.length > 0 
      ? categoryResponses.reduce((sum, r) => sum + r.category_score, 0) / categoryResponses.length 
      : 0;
    
    return {
      category,
      score: avgScore,
      totalResponses: categoryResponses.length,
      completionRate: (categoryResponses.length / categoryPrompts.length) * 100,
      trend: 'stable' // TODO: Implementar cálculo de tendência
    };
  });

  // Mutation para responder check-in
  const respondToCheckin = useMutation({
    mutationFn: async ({ promptKey, value, category }: { 
      promptKey: string; 
      value: any; 
      category: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_checkin_responses')
        .upsert({
          user_id: user.id,
          prompt_key: promptKey,
          category: category,
          response_value: value,
          checkin_date: today,
        }, {
          onConflict: 'user_id,prompt_key,checkin_date'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-checkin-responses'] });
      toast({
        title: "Resposta salva!",
        description: "Seu check-in foi registrado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error saving checkin response:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  return {
    prompts,
    promptsByCategory,
    unansweredByCategory,
    todayResponses,
    categoryStats,
    timeOfDay,
    isLoading: isLoadingPrompts || isLoadingResponses,
    respondToCheckin,
  };
}
