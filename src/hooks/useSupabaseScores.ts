
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserScores {
  id: string;
  user_id: string;
  total_points: number;
  weekly_points: number;
  monthly_points: number;
  current_streak: number;
  longest_streak: number;
  current_level: number;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

export function useUserScores() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userScores', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as UserScores;
    },
    enabled: !!user?.id,
  });
}
