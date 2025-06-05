
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  user_id: string;
  type: string;
  duration: number;
  calories?: number;
  distance?: number;
  name?: string;
  notes?: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
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
      return data?.map(activity => ({
        id: activity.id,
        user_id: activity.user_id,
        type: activity.type,
        duration: activity.duration,
        calories: activity.calories,
        distance: activity.distance,
        name: activity.name,
        notes: activity.notes,
        completed_at: activity.completed_at,
        created_at: activity.created_at,
        updated_at: activity.updated_at
      })) as Activity[] || [];
    },
    enabled: !!user?.id,
  });

  return {
    activities: activities || [],
    isLoading,
    error,
  };
}

// Export useActivities as an alias
export const useActivities = useSupabaseActivities;

// Create activity mutation
export function useCreateActivity() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityData: {
      type: string;
      name?: string;
      duration: number;
      distance?: number;
      calories?: number;
      notes?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          user_id: user.id,
          type: activityData.type,
          name: activityData.name,
          duration: activityData.duration,
          distance: activityData.distance,
          calories: activityData.calories,
          notes: activityData.notes,
          completed_at: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Sucesso!",
        description: "Atividade registrada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar atividade.",
        variant: "destructive",
      });
    },
  });
}
