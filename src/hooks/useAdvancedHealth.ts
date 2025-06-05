
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface AdvancedHealthMetric {
  id: string;
  user_id: string;
  metric_category: string;
  metric_name: string;
  value: number;
  unit?: string;
  measurement_date: string;
  time_of_day?: string;
  context: any;
  trends: any;
  created_at: string;
  updated_at: string;
}

export interface HealthGoal {
  id: string;
  user_id: string;
  goal_category: string;
  goal_title: string;
  goal_description?: string;
  target_value?: number;
  current_value: number;
  unit?: string;
  target_date?: string;
  priority: number;
  is_active: boolean;
  progress_tracking: any;
  milestones: any[];
  rewards: any[];
  created_at: string;
  updated_at: string;
}

export interface HealthInsight {
  id: string;
  user_id: string;
  insight_type: string;
  category: string;
  title: string;
  content: string;
  severity: string;
  confidence_score?: number;
  data_sources: any[];
  actionable_steps: any[];
  is_read: boolean;
  is_archived: boolean;
  valid_until?: string;
  created_at: string;
}

export function useAdvancedHealth() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar métricas de saúde avançadas
  const { data: healthMetrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['advanced-health-metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('advanced_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AdvancedHealthMetric[];
    },
    enabled: !!user,
  });

  // Buscar metas de saúde
  const { data: healthGoals, isLoading: loadingGoals } = useQuery({
    queryKey: ['health-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as HealthGoal[];
    },
    enabled: !!user,
  });

  // Buscar insights de saúde
  const { data: healthInsights, isLoading: loadingInsights } = useQuery({
    queryKey: ['health-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('health_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as HealthInsight[];
    },
    enabled: !!user,
  });

  // Calcular score geral de saúde
  const { data: overallScore } = useQuery({
    queryKey: ['overall-health-score', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await supabase
        .rpc('calculate_overall_health_score', { p_user_id: user.id });

      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
  });

  // Adicionar métrica de saúde
  const addHealthMetric = useMutation({
    mutationFn: async (metric: Partial<AdvancedHealthMetric>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('advanced_health_metrics')
        .insert({
          user_id: user.id,
          ...metric,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advanced-health-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['overall-health-score'] });
      toast({
        title: "Métrica adicionada!",
        description: "Sua métrica de saúde foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a métrica.",
        variant: "destructive",
      });
    }
  });

  // Criar meta de saúde
  const createHealthGoal = useMutation({
    mutationFn: async (goal: Partial<HealthGoal>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_goals')
        .insert({
          user_id: user.id,
          ...goal,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-goals'] });
      toast({
        title: "Meta criada!",
        description: "Sua nova meta de saúde foi criada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta.",
        variant: "destructive",
      });
    }
  });

  // Atualizar progresso da meta
  const updateGoalProgress = useMutation({
    mutationFn: async ({ goalId, currentValue }: { goalId: string; currentValue: number }) => {
      const { data, error } = await supabase
        .from('health_goals')
        .update({ current_value: currentValue })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-goals'] });
      toast({
        title: "Progresso atualizado!",
        description: "O progresso da sua meta foi atualizado.",
      });
    },
  });

  // Marcar insight como lido
  const markInsightAsRead = useMutation({
    mutationFn: async (insightId: string) => {
      const { data, error } = await supabase
        .from('health_insights')
        .update({ is_read: true })
        .eq('id', insightId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-insights'] });
    },
  });

  return {
    healthMetrics: healthMetrics || [],
    healthGoals: healthGoals || [],
    healthInsights: healthInsights || [],
    overallScore: overallScore || 0,
    isLoading: loadingMetrics || loadingGoals || loadingInsights,
    addHealthMetric,
    createHealthGoal,
    updateGoalProgress,
    markInsightAsRead,
  };
}
