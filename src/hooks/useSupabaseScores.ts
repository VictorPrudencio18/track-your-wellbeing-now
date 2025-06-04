
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type UserScore = Tables<'user_scores'>;

export function useUserScores() {
  return useQuery({
    queryKey: ['user-scores'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data as UserScore;
    },
  });
}
