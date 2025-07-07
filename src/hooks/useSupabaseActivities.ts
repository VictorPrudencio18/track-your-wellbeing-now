
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

      // Calcular pontos específicos para diferentes atividades
      let calculatedPoints = 0;
      const basePoints = Math.floor(activity.duration / 60); // 1 ponto por minuto
      
      if (activity.type === 'pilates') {
        const performanceZones = activity.performance_zones as any;
        const intensityMultiplier = performanceZones?.intensity_level === 'high' ? 1.3 : 
                                  performanceZones?.intensity_level === 'low' ? 0.8 : 1.0;
        const completionBonus = performanceZones?.completion_rate >= 100 ? 1.2 : 
                              performanceZones?.completion_rate >= 80 ? 1.1 : 1.0;
        
        calculatedPoints = Math.round(basePoints * intensityMultiplier * completionBonus * 1.1); // Pilates tem bônus de 10%
      } else if (activity.type === 'hits') {
        // HITS treinos são mais intensos e ganham mais pontos
        const gpsData = activity.gps_data as any;
        const roundsCompleted = gpsData?.completed_rounds || 1;
        const totalRounds = gpsData?.total_rounds || 1;
        const completionRate = roundsCompleted / totalRounds;
        
        calculatedPoints = Math.round(basePoints * 1.5 * completionRate * 1.2); // HITS tem bônus de 50% + 20%
      }

      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          user_id: user.id,
          points_earned: calculatedPoints || undefined
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
