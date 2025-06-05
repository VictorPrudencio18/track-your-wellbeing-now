
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type GoalType = 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'wellness' | 'distance' | 'duration' | 'frequency' | 'calories';

export interface WeeklyGoal {
  id: string;
  user_id: string;
  goal_type: GoalType;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  week_start_date: string;
  week_end_date: string;
  priority?: number;
  difficulty_level?: number;
  auto_generated?: boolean;
  tags?: string[];
  reward_points?: number;
  streak_count?: number;
  completion_percentage?: number;
  is_completed?: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export function useWeeklyGoals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['weeklyGoals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(goal => ({
        ...goal,
        is_completed: goal.is_completed || goal.completion_percentage >= 100
      })) as WeeklyGoal[];
    },
    enabled: !!user?.id,
  });

  const createGoal = useMutation({
    mutationFn: async (goalData: Omit<WeeklyGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'> & {
      goal_type: GoalType;
      title: string;
      target_value: number;
      unit: string;
      week_start_date: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .insert([{ 
          ...goalData, 
          user_id: user.id,
          current_value: goalData.current_value || 0
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyGoals'] });
    },
  });

  const updateGoal = useMutation({
    mutationFn: async (goalData: Partial<WeeklyGoal> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .update(goalData)
        .eq('id', goalData.id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyGoals'] });
    },
  });

  return {
    goals: goals || [],
    isLoading,
    error,
    createGoal,
    updateGoal,
  };
}
