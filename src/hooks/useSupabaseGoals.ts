
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

type Goal = Tables<'goals'>;

export function useGoals() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for goals');
        return [];
      }

      console.log('Fetching user goals...');
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        throw error;
      }
      
      console.log('Goals fetched:', data);
      return data as Goal[];
    },
    enabled: !!user,
    retry: 3,
  });
}
