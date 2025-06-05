
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

  // Buscar plano nutricional ativo
  const { data: activePlan, isLoading: loadingPlan } = useQuery({
    queryKey: ['active-nutrition-plan', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as NutritionPlan | null;
    },
    enabled: !!user,
  });

  // Buscar logs de refeições do dia
  const { data: todayMeals, isLoading: loadingMeals } = useQuery({
    queryKey: ['today-meals', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', `${today}T00:00:00`)
        .lt('meal_time', `${today}T23:59:59`)
        .order('meal_time', { ascending: true });

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Buscar histórico de refeições (últimos 7 dias)
  const { data: mealHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['meal-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('meal_time', sevenDaysAgo.toISOString())
        .order('meal_time', { ascending: false });

      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!user,
  });

  // Criar plano nutricional
  const createNutritionPlan = useMutation({
    mutationFn: async (plan: Partial<NutritionPlan>) => {
      if (!user) throw new Error('User not authenticated');

      // Desativar planos anteriores
      await supabase
        .from('nutrition_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      const { data, error } = await supabase
        .from('nutrition_plans')
        .insert({
          user_id: user.id,
          ...plan,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-nutrition-plan'] });
      toast({
        title: "Plano criado!",
        description: "Seu novo plano nutricional foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o plano nutricional.",
        variant: "destructive",
      });
    }
  });

  // Registrar refeição
  const logMeal = useMutation({
    mutationFn: async (meal: Partial<MealLog>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          user_id: user.id,
          nutrition_plan_id: activePlan?.id,
          ...meal,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal-history'] });
      toast({
        title: "Refeição registrada!",
        description: "Sua refeição foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a refeição.",
        variant: "destructive",
      });
    }
  });

  // Calcular totais do dia
  const dailyTotals = todayMeals?.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.total_calories || 0),
      protein: acc.protein + (meal.macros?.protein || 0),
      carbs: acc.carbs + (meal.macros?.carbs || 0),
      fat: acc.fat + (meal.macros?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return {
    activePlan,
    todayMeals: todayMeals || [],
    mealHistory: mealHistory || [],
    dailyTotals,
    isLoading: loadingPlan || loadingMeals || loadingHistory,
    createNutritionPlan,
    logMeal,
  };
}
