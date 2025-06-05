
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface MicroCheckin {
  id: string;
  user_id: string;
  checkin_type: 'thermometer' | 'counter';
  metric_key: string;
  value: number;
  max_value: number;
  recorded_at: string;
  session_id: string;
  context: any;
  created_at: string;
}

export interface WellnessScore {
  id: string;
  user_id: string;
  score_type: 'mental_health' | 'vitality' | 'hydration' | 'work_life_balance' | 'self_care';
  score_value: number;
  max_score: number;
  calculation_date: string;
  contributing_metrics: any;
  trend_7d: number;
  trend_30d: number;
  insights: any[];
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  metric_key: string;
  is_enabled: boolean;
  frequency_hours: number;
  preferred_times: string[];
  last_shown_at?: string;
  snooze_until?: string;
  total_responses: number;
  total_dismissals: number;
  created_at: string;
  updated_at: string;
}

export function useMicroCheckins() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar micro check-ins de hoje
  const { data: todayCheckins, isLoading } = useQuery({
    queryKey: ['micro-checkins-today', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('micro_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', `${today}T00:00:00Z`)
        .lt('recorded_at', `${today}T23:59:59Z`)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data as MicroCheckin[];
    },
    enabled: !!user,
  });

  // Buscar scores de bem-estar
  const { data: wellnessScores } = useQuery({
    queryKey: ['wellness-scores', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('wellness_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('calculation_date', new Date().toISOString().split('T')[0])
        .order('score_type');

      if (error) throw error;
      return data as WellnessScore[];
    },
    enabled: !!user,
  });

  // Buscar preferências de notificação
  const { data: notificationPrefs } = useQuery({
    queryKey: ['notification-preferences', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as NotificationPreference[];
    },
    enabled: !!user,
  });

  // Submeter micro check-in
  const submitCheckin = useMutation({
    mutationFn: async ({ metricKey, value, checkinType, maxValue = 10, context = {} }: {
      metricKey: string;
      value: number;
      checkinType: 'thermometer' | 'counter';
      maxValue?: number;
      context?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('micro_checkins')
        .insert({
          user_id: user.id,
          metric_key: metricKey,
          value,
          checkin_type: checkinType,
          max_value: maxValue,
          context,
          recorded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['micro-checkins-today'] });
      queryClient.invalidateQueries({ queryKey: ['wellness-scores'] });
      toast({
        title: "Registrado! ✅",
        description: "Obrigado por compartilhar como você está se sentindo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível salvar sua resposta. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  // Atualizar preferências de notificação
  const updateNotificationPrefs = useMutation({
    mutationFn: async ({ metricKey, updates }: {
      metricKey: string;
      updates: Partial<NotificationPreference>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          metric_key: metricKey,
          ...updates
        }, {
          onConflict: 'user_id,metric_key'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    }
  });

  return {
    todayCheckins: todayCheckins || [],
    wellnessScores: wellnessScores || [],
    notificationPrefs: notificationPrefs || [],
    isLoading,
    submitCheckin,
    updateNotificationPrefs,
  };
}
