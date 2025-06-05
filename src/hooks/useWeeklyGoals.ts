
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface WeeklyGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  week_start_date: string;
  week_end_date: string;
  priority: number;
  difficulty_level: number;
  is_completed: boolean;
  completion_percentage: number;
  auto_generated: boolean;
  parent_goal_id?: string;
  milestone_rewards: any[];
  tracking_data: any;
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
        .order('week_start_date', { ascending: false });
      
      if (error) throw error;
      return data as WeeklyGoal[];
    },
    enabled: !!user?.id,
  });

  const createGoal = useMutation({
    mutationFn: async (goalData: Partial<WeeklyGoal>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .insert([{ ...goalData, user_id: user.id }])
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
    mutationFn: async ({ id, ...updates }: Partial<WeeklyGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from('weekly_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyGoals'] });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
    deleteGoal,
  };
}
