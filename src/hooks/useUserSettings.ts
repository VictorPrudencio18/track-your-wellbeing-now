
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserPreferences {
  theme: 'light' | 'dark';
  layout: 'daily' | 'weekly' | 'monthly';
  units: {
    distance: 'km' | 'miles';
    weight: 'kg' | 'lbs';
    temperature: 'celsius' | 'fahrenheit';
  };
  notifications: {
    activity_reminders: boolean;
    health_checkins: boolean;
    social_updates: boolean;
  };
  activity_settings: {
    auto_pause: boolean;
    gps_accuracy: 'high' | 'medium' | 'low';
    heart_rate_zones: {
      zone1: { min: number; max: number };
      zone2: { min: number; max: number };
      zone3: { min: number; max: number };
      zone4: { min: number; max: number };
      zone5: { min: number; max: number };
    };
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  layout: 'daily',
  units: {
    distance: 'km',
    weight: 'kg',
    temperature: 'celsius'
  },
  notifications: {
    activity_reminders: true,
    health_checkins: true,
    social_updates: true
  },
  activity_settings: {
    auto_pause: true,
    gps_accuracy: 'high',
    heart_rate_zones: {
      zone1: { min: 50, max: 60 },
      zone2: { min: 60, max: 70 },
      zone3: { min: 70, max: 80 },
      zone4: { min: 80, max: 90 },
      zone5: { min: 90, max: 100 }
    }
  }
};

export function useUserSettings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      if (!user) return defaultPreferences;

      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user settings:', error);
        return defaultPreferences;
      }

      // Garantir que as preferências são um objeto válido
      const preferences = data?.preferences;
      if (!preferences || typeof preferences !== 'object') {
        return defaultPreferences;
      }

      return { ...defaultPreferences, ...preferences } as UserPreferences;
    },
    enabled: !!user,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar preferências atuais
      const { data: currentData } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const currentPreferences = currentData?.preferences || defaultPreferences;
      
      // Garantir que currentPreferences é um objeto
      const safeCurrentPreferences = typeof currentPreferences === 'object' && currentPreferences !== null 
        ? currentPreferences 
        : defaultPreferences;

      const updatedPreferences = { ...safeCurrentPreferences, ...preferences };

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          preferences: updatedPreferences,
          data_version: ((currentData?.data_version || 1) + 1)
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user settings:', error);
        throw error;
      }

      // Log da ação
      await supabase.rpc('log_user_action', {
        action_type_param: 'update',
        entity_type_param: 'user_settings',
        details_param: { updated_fields: Object.keys(preferences) }
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      
      toast({
        title: "Configurações salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Failed to update user settings:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar configurações: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
