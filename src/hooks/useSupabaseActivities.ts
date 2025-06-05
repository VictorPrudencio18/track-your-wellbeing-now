
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  duration?: number;
  calories_burned?: number;
  distance?: number;
  notes?: string;
  intensity?: string;
  mood_after?: number;
  created_at: string;
}

export function useSupabaseActivities() {
  const { user } = useAuth();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!user?.id,
  });

  return {
    activities: activities || [],
    isLoading,
    error,
  };
}
