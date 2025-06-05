
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface NutritionPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  calorie_target?: number;
  macros_target: any;
  meal_schedule: any[];
  restrictions: any[];
  created_by_nutritionist?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface MealLog {
  id: string;
  user_id: string;
  nutrition_plan_id?: string;
  meal_type: string;
  meal_name?: string;
  foods: any[];
  total_calories?: number;
  macros: any;
  meal_time: string;
  satisfaction_rating?: number;
  notes?: string;
  photos: any[];
  created_at: string;
}

export function useNutrition() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar planos nutricionais
  const { data: nutritionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['nutrition-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NutritionPlan[];
    },
    enabled: !!user,
  });

  // Buscar logs de refeições
  const { data: mealLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['meal-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', weekAgo.toISOString())
        .order('meal_time', { ascending: false });

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Buscar refeições de hoje
  const { data: todayMeals } = useQuery({
    queryKey: ['today-meals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', today)
        .lt('meal_time', today + 'T23:59:59')
        .order('meal_time', { ascending: true });

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Mutations
  const createNutritionPlan = useMutation({
    mutationFn: async (planData: Partial<NutritionPlan>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert({
          user_id: user.id,
          ...planData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans'] });
      toast({
        title: "Plano nutricional criado!",
        description: "Seu plano nutricional foi salvo com sucesso.",
      });
    },
  });

  const logMeal = useMutation({
    mutationFn: async (mealData: Partial<MealLog>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          user_id: user.id,
          ...mealData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-logs'] });
      queryClient.invalidateQueries({ queryKey: ['today-meals'] });
      toast({
        title: "Refeição registrada!",
        description: "Sua refeição foi salva com sucesso.",
      });
    },
  });

  return {
    nutritionPlans,
    mealLogs,
    todayMeals,
    isLoading: plansLoading || logsLoading,
    createNutritionPlan,
    logMeal,
  };
}
