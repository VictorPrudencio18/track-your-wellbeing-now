
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface SleepRecord {
  id: string;
  user_id: string;
  sleep_date: string;
  bedtime: string | null;
  wake_time: string | null;
  sleep_duration: number | null;
  sleep_latency: number | null;
  wake_count: number;
  subjective_quality: number | null;
  calculated_scores: any;
  sleep_efficiency: number | null;
  sleep_debt: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useSleepRecords() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar registros de sono dos últimos 30 dias
  const { data: sleepRecords, isLoading } = useQuery({
    queryKey: ['sleep-records', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('sleep_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('sleep_date', { ascending: false });

      if (error) throw error;
      return data as SleepRecord[];
    },
    enabled: !!user,
  });

  // Buscar registro de sono de hoje
  const { data: todaySleep } = useQuery({
    queryKey: ['today-sleep', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('sleep_date', today)
        .maybeSingle();

      if (error) throw error;
      return data as SleepRecord | null;
    },
    enabled: !!user,
  });

  // Calcular estatísticas de sono
  const sleepStats = {
    averageQuality: sleepRecords?.length ? 
      sleepRecords.reduce((sum, record) => sum + (record.subjective_quality || 0), 0) / sleepRecords.length : 0,
    averageDuration: sleepRecords?.length ?
      sleepRecords.reduce((sum, record) => sum + (record.sleep_duration || 0), 0) / sleepRecords.length : 0,
    totalSleepDebt: sleepRecords?.reduce((sum, record) => sum + (record.sleep_debt || 0), 0) || 0,
    consistency: sleepRecords?.length || 0,
  };

  const createSleepRecord = useMutation({
    mutationFn: async (sleepData: Partial<SleepRecord>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sleep_records')
        .insert({
          ...sleepData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep-records'] });
      queryClient.invalidateQueries({ queryKey: ['today-sleep'] });
      toast({
        title: "Registro de sono salvo!",
        description: "Seus dados de sono foram registrados com sucesso.",
      });
    },
  });

  return {
    sleepRecords: sleepRecords || [],
    todaySleep,
    sleepStats,
    isLoading,
    createSleepRecord,
  };
}
