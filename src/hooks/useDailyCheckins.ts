
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  hydration_glasses: number;
  sleep_quality: number | null;
  sleep_hours: number | null;
  exercise_completed: boolean;
  exercise_type: string | null;
  exercise_planned: boolean;
  stress_level: number | null;
  work_satisfaction: number | null;
  energy_level: number | null;
  mood_rating: number | null;
  had_lunch: boolean;
  had_dinner: boolean;
  ate_healthy: boolean;
  wellness_score: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckinPrompt {
  id: string;
  prompt_key: string;
  question: string;
  response_type: 'scale' | 'boolean' | 'number' | 'text' | 'select';
  options: any;
  time_ranges: string[];
  context_triggers: string[];
  priority: number;
  is_active: boolean;
}

export function useDailyCheckins() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar check-in de hoje
  const { data: todayCheckin, isLoading } = useQuery({
    queryKey: ['daily-checkin', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle();

      if (error) throw error;
      return data as DailyCheckin | null;
    },
    enabled: !!user,
  });

  // Buscar prompts ativos
  const { data: prompts } = useQuery({
    queryKey: ['checkin-prompts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkin_prompts')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as CheckinPrompt[];
    },
  });

  // Criar ou atualizar check-in
  const upsertCheckin = useMutation({
    mutationFn: async (updates: Partial<DailyCheckin>) => {
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_health_checkins')
        .upsert({
          user_id: user.id,
          checkin_date: today,
          ...updates,
        }, {
          onConflict: 'user_id,checkin_date'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-checkin'] });
      toast({
        title: "Check-in atualizado!",
        description: "Seus dados de saúde foram salvos com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o check-in. Tente novamente.",
        variant: "destructive",
      });
      console.error('Checkin error:', error);
    }
  });

  return {
    todayCheckin,
    prompts: prompts || [],
    isLoading,
    upsertCheckin,
  };
}
