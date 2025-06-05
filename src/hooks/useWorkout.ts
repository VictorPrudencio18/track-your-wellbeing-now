
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

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_plan_id?: string;
  session_name: string;
  exercises: any[];
  duration?: number;
  calories_burned?: number;
  intensity_level?: number;
  notes?: string;
  completed_at: string;
  session_data: any;
  created_at: string;
}

export function useWorkout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar planos de treino
  const { data: workoutPlans, isLoading: loadingPlans } = useQuery({
    queryKey: ['workout-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!user,
  });

  // Buscar sessões de treino
  const { data: workoutSessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['workout-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as WorkoutSession[];
    },
    enabled: !!user,
  });

  // Criar plano de treino
  const createWorkoutPlan = useMutation({
    mutationFn: async (plan: {
      name: string;
      description?: string;
      difficulty_level?: number;
      duration_weeks?: number;
      workout_data?: any[];
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          name: plan.name,
          description: plan.description,
          difficulty_level: plan.difficulty_level || 1,
          duration_weeks: plan.duration_weeks || 4,
          workout_data: plan.workout_data || [],
          is_active: true,
          progress_tracking: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
      toast({
        title: "Plano criado!",
        description: "Seu plano de treino foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano.",
        variant: "destructive",
      });
    }
  });

  // Registrar sessão de treino
  const logWorkoutSession = useMutation({
    mutationFn: async (session: {
      workout_plan_id?: string;
      session_name: string;
      exercises?: any[];
      duration?: number;
      calories_burned?: number;
      intensity_level?: number;
      notes?: string;
      session_data?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_plan_id: session.workout_plan_id,
          session_name: session.session_name,
          exercises: session.exercises || [],
          duration: session.duration,
          calories_burned: session.calories_burned,
          intensity_level: session.intensity_level,
          notes: session.notes,
          session_data: session.session_data || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] });
      toast({
        title: "Sessão registrada!",
        description: "Sua sessão de treino foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a sessão.",
        variant: "destructive",
      });
    }
  });

  return {
    workoutPlans: workoutPlans || [],
    workoutSessions: workoutSessions || [],
    isLoading: loadingPlans || loadingSessions,
    createWorkoutPlan,
    logWorkoutSession,
  };
}
