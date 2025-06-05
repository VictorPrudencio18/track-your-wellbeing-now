import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SmartAlarm {
  id: string;
  user_id: string;
  alarm_time: string;
  smart_window_minutes: number;
  is_active: boolean;
  days_of_week: number[];
  alarm_sound: string;
  vibration_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface SleepJournal {
  id: string;
  user_id: string;
  sleep_date: string;
  pre_sleep_activities: string[];
  mood_before_sleep: number;
  mood_after_sleep: number;
  dreams_quality: number;
  dreams_description: string;
  factors_affecting_sleep: string[];
  supplements_taken: string[];
  bedtime_routine_followed: boolean;
  screen_time_before_bed: number;
  caffeine_intake_time: string;
  alcohol_consumption: boolean;
  exercise_timing: string;
  stress_events: string[];
  gratitude_notes: string;
  tomorrow_priorities: string[];
  sleep_environment_rating: number;
  created_at: string;
  updated_at: string;
}

interface SleepCorrelation {
  id: string;
  user_id: string;
  factor_name: string;
  factor_type: 'lifestyle' | 'environmental' | 'dietary' | 'activity' | 'mood';
  correlation_coefficient: number;
  impact_level: 'low' | 'medium' | 'high';
  confidence_score: number;
  sample_size: number;
  last_calculated: string;
  insights: any;
  created_at: string;
}

interface SleepRecommendation {
  id: string;
  user_id: string;
  recommendation_type: 'bedtime' | 'environment' | 'lifestyle' | 'activity' | 'nutrition';
  title: string;
  description: string;
  priority: number;
  confidence_score: number;
  expected_improvement: number;
  based_on_data: any;
  status: 'pending' | 'viewed' | 'applied' | 'dismissed';
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface SleepSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end: string;
  session_type: 'night_sleep' | 'nap' | 'rest';
  target_duration: number;
  actual_duration: number;
  sleep_phases: any[];
  heart_rate_data: any[];
  movement_data: any[];
  audio_analysis: any;
  session_status: 'active' | 'completed' | 'interrupted';
  created_at: string;
  updated_at: string;
}

export function useSmartAlarms() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['smart-alarms', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('smart_alarms')
        .select('*')
        .eq('user_id', user.id)
        .order('alarm_time', { ascending: true });

      if (error) throw error;
      return data as SmartAlarm[];
    },
    enabled: !!user,
  });
}

export function useSleepJournal() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-journal', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_journal')
        .select('*')
        .eq('user_id', user.id)
        .order('sleep_date', { ascending: false });

      if (error) throw error;
      return data as SleepJournal[];
    },
    enabled: !!user,
  });
}

export function useSleepCorrelations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-correlations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_correlations')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data as SleepCorrelation[];
    },
    enabled: !!user,
  });
}

export function useSleepRecommendations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-recommendations', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as SleepRecommendation[];
    },
    enabled: !!user,
  });
}

export function useSleepSessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-sessions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('session_start', { ascending: false });

      if (error) throw error;
      return data as SleepSession[];
    },
    enabled: !!user,
  });
}

export function useSleepInsights() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-insights', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // For now, return mock data since we don't have a specific insights table
      // In a real implementation, this would fetch from a sleep_insights table
      return [
        {
          id: '1',
          insight_type: 'improvement',
          title: 'Melhoria na Consistência',
          description: 'Sua regularidade de horários melhorou 34% nas últimas duas semanas.',
          severity: 'positive',
          confidence: 92
        },
        {
          id: '2',
          insight_type: 'pattern',
          title: 'Padrão de Fim de Semana',
          description: 'Você tende a dormir 2h mais tarde nos fins de semana, afetando a segunda-feira.',
          severity: 'warning',
          confidence: 88
        },
        {
          id: '3',
          insight_type: 'correlation',
          title: 'Exercício e Sono Profundo',
          description: 'Exercícios pela manhã aumentam seu sono profundo em 23%.',
          severity: 'positive',
          confidence: 95
        }
      ];
    },
    enabled: !!user,
  });
}

export function useCreateSmartAlarm() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Partial<SmartAlarm>) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('smart_alarms')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smart-alarms'] });
      toast.success('Alarme inteligente criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar alarme: ' + error.message);
    },
  });
}

export function useCreateSleepJournal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Partial<SleepJournal>) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('sleep_journal')
        .upsert({ ...data, user_id: user.id }, {
          onConflict: 'user_id,sleep_date'
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-journal'] });
      toast.success('Diário de sono salvo com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar diário: ' + error.message);
    },
  });
}

export function useStartSleepSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sessionType: 'night_sleep' | 'nap' | 'rest' = 'night_sleep') => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('sleep_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          session_status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-sessions'] });
      toast.success('Sessão de sono iniciada!');
    },
    onError: (error: any) => {
      toast.error('Erro ao iniciar sessão: ' + error.message);
    },
  });
}

export function useEndSleepSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, duration }: { sessionId: string; duration: number }) => {
      const { data: result, error } = await supabase
        .from('sleep_sessions')
        .update({
          session_end: new Date().toISOString(),
          actual_duration: duration,
          session_status: 'completed'
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-sessions'] });
      toast.success('Sessão de sono finalizada!');
    },
    onError: (error: any) => {
      toast.error('Erro ao finalizar sessão: ' + error.message);
    },
  });
}
