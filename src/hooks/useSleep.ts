
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SleepRecord {
  id: string;
  user_id: string;
  sleep_date: string;
  bedtime: string | null;
  wake_time: string | null;
  sleep_latency: number | null;
  sleep_duration: number | null;
  wake_count: number;
  subjective_quality: number | null;
  environmental_factors: any;
  lifestyle_factors: any;
  calculated_scores: any;
  insomnia_indicators: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface SleepGoal {
  id: string;
  user_id: string;
  target_duration: number;
  target_bedtime: string;
  target_wake_time: string;
  consistency_goal: number;
  quality_goal: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SleepInsight {
  id: string;
  user_id: string;
  insight_date: string;
  insight_type: string;
  title: string;
  description: string;
  severity: string;
  data_points: any;
  is_read: boolean;
  expires_at: string | null;
  created_at: string;
}

export function useSleepRecords() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-records', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .order('sleep_date', { ascending: false });

      if (error) throw error;
      return data as SleepRecord[];
    },
    enabled: !!user,
  });
}

export function useSleepGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['sleep-goals', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SleepGoal[];
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

      const { data, error } = await supabase
        .from('sleep_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('insight_date', { ascending: false });

      if (error) throw error;
      return data as SleepInsight[];
    },
    enabled: !!user,
  });
}

export function useCreateSleepRecord() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Partial<SleepRecord>) => {
      if (!user) throw new Error('User not authenticated');

      // Garantir que campos obrigatórios estão presentes
      const recordData = {
        ...data,
        user_id: user.id,
        sleep_date: data.sleep_date || new Date().toISOString().split('T')[0],
        wake_count: data.wake_count || 0,
      };

      const { data: result, error } = await supabase
        .from('sleep_records')
        .insert(recordData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-records'] });
      toast.success('Registro de sono salvo com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao salvar registro: ' + error.message);
    },
  });
}

export function useUpdateSleepRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SleepRecord> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('sleep_records')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-records'] });
      toast.success('Registro atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar registro: ' + error.message);
    },
  });
}

export function useCreateSleepGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: Partial<SleepGoal>) => {
      if (!user) throw new Error('User not authenticated');

      // Garantir que campos obrigatórios estão presentes
      const goalData = {
        user_id: user.id,
        target_duration: data.target_duration || 480, // 8 horas padrão
        target_bedtime: data.target_bedtime || '22:00',
        target_wake_time: data.target_wake_time || '06:00',
        consistency_goal: data.consistency_goal || 7,
        quality_goal: data.quality_goal || 7,
        is_active: data.is_active !== undefined ? data.is_active : true,
      };

      const { data: result, error } = await supabase
        .from('sleep_goals')
        .insert(goalData)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-goals'] });
      toast.success('Meta de sono criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar meta: ' + error.message);
    },
  });
}
