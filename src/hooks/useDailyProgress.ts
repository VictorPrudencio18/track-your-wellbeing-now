
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type DailyProgress = Tables<'daily_goal_progress'>;
type DailyProgressInsert = TablesInsert<'daily_goal_progress'>;

export function useDailyProgress(weeklyGoalId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['dailyProgress', user?.id, weeklyGoalId],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('daily_goal_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('progress_date', { ascending: false });
      
      if (weeklyGoalId) {
        query = query.eq('weekly_goal_id', weeklyGoalId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as DailyProgress[];
    },
    enabled: !!user?.id,
  });

  const updateProgress = useMutation({
    mutationFn: async (progressData: Omit<DailyProgressInsert, 'user_id' | 'id'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('daily_goal_progress')
        .upsert({ ...progressData, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
      queryClient.invalidateQueries({ queryKey: ['weeklyGoals'] });
    },
  });

  return {
    progress: progress || [],
    isLoading,
    error,
    updateProgress,
  };
}

export type { DailyProgress };
