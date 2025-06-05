
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface DeviceIntegration {
  id: string;
  user_id: string;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  integration_status: string;
  last_sync_at?: string;
  sync_frequency: string;
  data_types: any[];
  settings: any;
  created_at: string;
  updated_at: string;
}

export function useDeviceIntegrations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar integrações de dispositivos
  const { data: deviceIntegrations, isLoading } = useQuery({
    queryKey: ['device-integrations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('device_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DeviceIntegration[];
    },
    enabled: !!user,
  });

  // Criar integração de dispositivo
  const createDeviceIntegration = useMutation({
    mutationFn: async (device: {
      device_type: string;
      device_brand?: string;
      device_model?: string;
      integration_status?: string;
      sync_frequency?: string;
      data_types?: any[];
      settings?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('device_integrations')
        .insert({
          user_id: user.id,
          device_type: device.device_type,
          device_brand: device.device_brand,
          device_model: device.device_model,
          integration_status: device.integration_status || 'connected',
          sync_frequency: device.sync_frequency || 'automatic',
          data_types: device.data_types || [],
          settings: device.settings || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device-integrations'] });
      toast({
        title: "Dispositivo conectado!",
        description: "Sua integração foi configurada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível conectar o dispositivo.",
        variant: "destructive",
      });
    }
  });

  return {
    deviceIntegrations: deviceIntegrations || [],
    isLoading,
    createDeviceIntegration,
  };
}
