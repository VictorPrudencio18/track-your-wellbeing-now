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
      if (!user) {
        console.log('No user found for daily checkin query');
        return null;
      }

      const today = new Date().toISOString().split('T')[0];
      console.log('Fetching daily checkin for date:', today, 'user:', user.id);
      
      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily checkin:', error);
        throw error;
      }
      
      console.log('Today checkin data:', data);
      return data as DailyCheckin | null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Buscar últimos 7 dias
  const { data: last7Days } = useQuery({
    queryKey: ['daily-checkins-7days', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const startDate = sevenDaysAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', startDate)
        .order('checkin_date', { ascending: false });

      if (error) {
        console.error('Error fetching 7 days checkins:', error);
        throw error;
      }
      return data as DailyCheckin[];
    },
    enabled: !!user,
  });

  // Buscar últimos 30 dias
  const { data: last30Days } = useQuery({
    queryKey: ['daily-checkins-30days', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', startDate)
        .order('checkin_date', { ascending: false });

      if (error) {
        console.error('Error fetching 30 days checkins:', error);
        throw error;
      }
      return data as DailyCheckin[];
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

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }
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

      if (error) {
        console.error('Error fetching categorized responses:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });

  // Criar ou atualizar check-in
  const upsertCheckin = useMutation({
    mutationFn: async (updates: Partial<DailyCheckin>) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const today = new Date().toISOString().split('T')[0];
      
      console.log('Upserting checkin with data:', updates);
      
      // Validação específica para mood_rating
      if (updates.mood_rating !== undefined && updates.mood_rating !== null) {
        const moodRating = updates.mood_rating;
        if (!Number.isInteger(moodRating) || moodRating < 1 || moodRating > 10) {
          throw new Error('Valor de humor deve ser um número inteiro entre 1 e 10');
        }
      }
      
      // Primeiro, verificar se já existe um check-in para hoje
      const { data: existingCheckin, error: fetchError } = await supabase
        .from('daily_health_checkins')
        .select('id')
        .eq('user_id', user.id)
        .eq('checkin_date', today)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing checkin:', fetchError);
        throw new Error('Erro ao verificar check-in existente');
      }

      let result;
      
      if (existingCheckin) {
        console.log('Updating existing checkin:', existingCheckin.id);
        // Atualizar check-in existente
        const { data, error } = await supabase
          .from('daily_health_checkins')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCheckin.id)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating checkin:', error);
          throw new Error(`Erro ao atualizar check-in: ${error.message}`);
        }
        result = data;
      } else {
        console.log('Creating new checkin for today');
        // Criar novo check-in com valores padrão
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
          mood_rating: null,
          had_lunch: false,
          had_dinner: false,
          ate_healthy: false,
          wellness_score: 50,
          notes: null,
        };

        const { data, error } = await supabase
          .from('daily_health_checkins')
          .insert({
            ...defaultCheckinData,
            ...updates,
            user_id: user.id,
            checkin_date: today,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error creating checkin:', error);
          throw new Error(`Erro ao criar check-in: ${error.message}`);
        }
        result = data;
      }

      console.log('Checkin operation successful:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Invalidating checkin queries after successful save');
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['daily-checkin'] });
      queryClient.invalidateQueries({ queryKey: ['daily-checkins-7days'] });
      queryClient.invalidateQueries({ queryKey: ['daily-checkins-30days'] });
      
      // Atualizar o cache otimisticamente
      queryClient.setQueryData(['daily-checkin', user?.id], data);
    },
    onError: (error) => {
      console.error('Checkin mutation error:', error);
      
      // Não mostrar toast aqui, deixar para o componente tratar
      // toast({
      //   title: "Erro",
      //   description: "Não foi possível salvar o check-in. Tente novamente.",
      //   variant: "destructive",
      // });
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
