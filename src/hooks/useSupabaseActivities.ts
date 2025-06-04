
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Activity = Tables<'activities'>;
type ActivityInsert = TablesInsert<'activities'>;

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      console.log('Fetching activities...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      console.log('Activities fetched:', data?.length || 0);
      return data as Activity[];
    },
    retry: 3,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Omit<ActivityInsert, 'user_id' | 'id'>) => {
      console.log('Creating activity:', activity);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }
      
      console.log('Activity created:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Activity created successfully, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['user-scores'] });
      
      toast({
        title: "Sucesso!",
        description: "Atividade registrada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create activity:', error);
      toast({
        title: "Erro",
        description: `Erro ao registrar atividade: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
