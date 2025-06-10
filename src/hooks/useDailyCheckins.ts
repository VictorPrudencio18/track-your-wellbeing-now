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
  category?: string;
  subcategory?: string;
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

  // Buscar últimos 7 dias
  const { data: last7Days } = useQuery({
    queryKey: ['daily-checkins-7days', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('checkin_date', { ascending: false });

      if (error) throw error;
      return data as DailyCheckin[];
    },
    enabled: !!user,
  });

  // Buscar últimos 30 dias
  const { data: last30Days } = useQuery({
    queryKey: ['daily-checkins-30days', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('checkin_date', { ascending: false });

      if (error) throw error;
      return data as DailyCheckin[];
    },
    enabled: !!user,
  });

  // Buscar prompts ativos (incluindo novos categorizados)
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

  // Buscar respostas categorizadas de hoje
  const { data: categorizedResponses } = useQuery({
    queryKey: ['categorized-responses', user?.id],
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

  // Criar ou atualizar check-in tradicional
  const upsertCheckin = useMutation({
    mutationFn: async (updates: Partial<DailyCheckin>) => {
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];
      
      // Primeiro, verificar se já existe um check-in para hoje
      const { data: existingCheckin } = await supabase
        .from('daily_health_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle();

      let result;
      
      if (existingCheckin) {
        // Atualizar check-in existente
        const { data, error } = await supabase
          .from('daily_health_checkins')
          .update(updates)
          .eq('id', existingCheckin.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Criar novo check-in
        const defaultCheckinData = {
          hydration_glasses: 0,
          sleep_quality: null,
          sleep_hours: null,
          exercise_completed: false,
          exercise_type: null,
          exercise_planned: false,
          stress_level: null,
          work_satisfaction: null,
          energy_level: null,
          mood_rating: null, // Will be overridden by updates if provided
          had_lunch: false,
          had_dinner: false,
          ate_healthy: false,
          wellness_score: 50, // Assuming a neutral default score, can be recalculated later
          notes: null,
        };

        const { data, error } = await supabase
          .from('daily_health_checkins')
          .insert({
            ...defaultCheckinData, // Spread defaults first
            user_id: user.id,      // Specific to this new record
            checkin_date: today,   // Specific to this new record
            ...updates,           // Spread updates last to override defaults with provided values
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return result;
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
    last7Days: last7Days || [],
    last30Days: last30Days || [],
    prompts: prompts || [],
    categorizedResponses: categorizedResponses || [],
    isLoading,
    upsertCheckin,
  };
}
