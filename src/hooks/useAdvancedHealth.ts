
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  difficulty_level: number;
  duration_weeks: number;
  created_by_trainer?: string;
  is_active: boolean;
  workout_data: any[];
  progress_tracking: any;
  created_at: string;
  updated_at: string;
}

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

  // Buscar planos de treino
  const { data: workoutPlans, isLoading: workoutPlansLoading } = useQuery({
    queryKey: ['workout-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!user,
  });

  // Buscar métricas de saúde avançadas
  const { data: healthMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['health-metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('advanced_health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('measurement_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      return data as AdvancedHealthMetric[];
    },
    enabled: !!user,
  });

  // Buscar metas de saúde
  const { data: healthGoals, isLoading: goalsLoading } = useQuery({
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
  const { data: healthInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['health-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('health_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HealthInsight[];
    },
    enabled: !!user,
  });

  // Calcular score geral de saúde
  const { data: overallHealthScore } = useQuery({
    queryKey: ['overall-health-score', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error } = await supabase.rpc('calculate_overall_health_score', {
        p_user_id: user.id
      });

      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
  });

  // Mutations
  const createWorkoutPlan = useMutation({
    mutationFn: async (planData: Partial<WorkoutPlan>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          ...planData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
      toast({
        title: "Plano de treino criado!",
        description: "Seu novo plano de treino foi salvo com sucesso.",
      });
    },
  });

  const addHealthMetric = useMutation({
    mutationFn: async (metricData: Partial<AdvancedHealthMetric>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('advanced_health_metrics')
        .insert({
          user_id: user.id,
          ...metricData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      toast({
        title: "Métrica registrada!",
        description: "Sua métrica de saúde foi salva com sucesso.",
      });
    },
  });

  const createHealthGoal = useMutation({
    mutationFn: async (goalData: Partial<HealthGoal>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('health_goals')
        .insert({
          user_id: user.id,
          ...goalData,
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
        description: "Sua meta de saúde foi definida com sucesso.",
      });
    },
  });

  return {
    workoutPlans,
    healthMetrics,
    healthGoals,
    healthInsights,
    overallHealthScore,
    isLoading: workoutPlansLoading || metricsLoading || goalsLoading || insightsLoading,
    createWorkoutPlan,
    addHealthMetric,
    createHealthGoal,
  };
}
