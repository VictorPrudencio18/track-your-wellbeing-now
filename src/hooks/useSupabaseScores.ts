
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type UserScore = Tables<'user_scores'>;

export function useUserScores() {
  return useQuery({
    queryKey: ['user-scores'],
    queryFn: async () => {
      console.log('Fetching user scores...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found for scores');
        return null;
      }

      const { data, error } = await supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user scores:', error);
        throw error;
      }
      
      console.log('User scores fetched:', data);
      return data as UserScore | null;
    },
    retry: 3,
  });
}
