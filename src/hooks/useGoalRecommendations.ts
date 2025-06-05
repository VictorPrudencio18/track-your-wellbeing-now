
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GoalRecommendation {
  id: string;
  user_id: string;
  recommended_goal_type: string;
  recommended_title: string;
  recommended_description?: string;
  recommended_target_value: number;
  recommended_unit: string;
  confidence_score: number;
  reasoning?: string;
  based_on_data: any;
  status: 'pending' | 'accepted' | 'rejected' | 'modified';
  created_at: string;
  applied_at?: string;
}

export function useGoalRecommendations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['goalRecommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('goal_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('confidence_score', { ascending: false });
      
      if (error) throw error;
      return data as GoalRecommendation[];
    },
    enabled: !!user?.id,
  });

  const generateRecommendations = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('generate_goal_recommendations', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goalRecommendations'] });
    },
  });

  const updateRecommendationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('goal_recommendations')
        .update({ 
          status,
          applied_at: status === 'accepted' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goalRecommendations'] });
    },
  });

  return {
    recommendations: recommendations || [],
    isLoading,
    error,
    generateRecommendations,
    updateRecommendationStatus,
  };
}
