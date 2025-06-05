
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  unit?: string;
  recorded_at: string;
  source: string;
  sync_status: string;
  device_info: any;
  additional_data?: any;
}

export function useHealthMetrics(metricType?: string, days: number = 30) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['health-metrics', user?.id, metricType, days],
    queryFn: async () => {
      if (!user) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: false });

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
      }

      return data as HealthMetric[];
    },
    enabled: !!user,
  });
}

export function useCreateHealthMetric() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (metric: Omit<HealthMetric, 'id' | 'user_id' | 'sync_status'>) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('health_metrics')
        .insert({
          ...metric,
          user_id: user.id,
          sync_status: 'synced'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating health metric:', error);
        throw error;
      }

      // Log da ação
      await supabase.rpc('log_user_action', {
        action_type_param: 'create',
        entity_type_param: 'health_metric',
        entity_id_param: data.id,
        details_param: { metric_type: metric.metric_type, value: metric.value }
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      
      toast({
        title: "Métrica registrada!",
        description: `${data.metric_type} salvo com sucesso.`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create health metric:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar métrica: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

export function useBulkCreateHealthMetrics() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (metrics: Omit<HealthMetric, 'id' | 'user_id' | 'sync_status'>[]) => {
      if (!user) throw new Error('Usuário não autenticado');

      const metricsWithUser = metrics.map(metric => ({
        ...metric,
        user_id: user.id,
        sync_status: 'synced'
      }));

      const { data, error } = await supabase
        .from('health_metrics')
        .insert(metricsWithUser)
        .select();

      if (error) {
        console.error('Error creating health metrics:', error);
        throw error;
      }

      // Log da ação em lote
      await supabase.rpc('log_user_action', {
        action_type_param: 'bulk_create',
        entity_type_param: 'health_metrics',
        details_param: { count: metrics.length, types: metrics.map(m => m.metric_type) }
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      
      toast({
        title: "Métricas registradas!",
        description: `${data.length} métricas salvas com sucesso.`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create health metrics:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar métricas: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
