
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type WeeklyGoal = Tables<'weekly_goals'>;
type WeeklyGoalInsert = TablesInsert<'weekly_goals'>;

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
    mutationFn: async (goalData: Omit<WeeklyGoalInsert, 'user_id' | 'id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('weekly_goals')
        .insert({ ...goalData, user_id: user.id })
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
    mutationFn: async ({ id, ...updates }: Partial<WeeklyGoalInsert> & { id: string }) => {
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

export type { WeeklyGoal };
