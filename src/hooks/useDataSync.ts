
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineCache, useSetCache } from './useOfflineCache';
import { toast } from '@/hooks/use-toast';

interface SyncStatus {
  last_sync: string | null;
  pending_uploads: number;
  sync_errors: any[];
  is_syncing: boolean;
}

export function useSyncStatus() {
  const { user } = useAuth();
  const { data: cachedStatus } = useOfflineCache('sync_status');

  return useQuery({
    queryKey: ['sync-status', user?.id],
    queryFn: async (): Promise<SyncStatus> => {
      if (!user) return {
        last_sync: null,
        pending_uploads: 0,
        sync_errors: [],
        is_syncing: false
      };

      // Verificar dados pendentes no cache offline
      const { data: pendingData } = await supabase
        .from('offline_cache')
        .select('cache_key')
        .eq('user_id', user.id)
        .like('cache_key', 'pending_%');

      // Verificar último backup
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_backup_at')
        .eq('id', user.id)
        .single();

      return {
        last_sync: profile?.last_backup_at || null,
        pending_uploads: pendingData?.length || 0,
        sync_errors: [],
        is_syncing: false
      };
    },
    enabled: !!user,
    initialData: cachedStatus as SyncStatus | undefined,
  });
}

export function useBackupData() {
  const { user } = useAuth();
  const setCache = useSetCache();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');

      // Backup de todas as atividades
      const { data: activities } = await supabase
        .from('activities')
        .select(`
          *,
          activity_gps_points(*),
          activity_metrics(*),
          activity_segments(*)
        `)
        .eq('user_id', user.id);

      // Backup de métricas de saúde
      const { data: healthMetrics } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id);

      // Backup de check-ins
      const { data: checkins } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id);

      // Backup do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const backupData = {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        activities: activities || [],
        health_metrics: healthMetrics || [],
        health_checkins: checkins || [],
        profile: profile,
        version: profile?.data_version || 1
      };

      // Salvar backup no cache
      await setCache.mutateAsync({
        cacheKey: `backup_${new Date().toISOString().split('T')[0]}`,
        data: backupData,
        expiresInMinutes: 60 * 24 * 7 // 7 dias
      });

      // Atualizar timestamp do backup
      await supabase
        .from('profiles')
        .update({ last_backup_at: new Date().toISOString() })
        .eq('id', user.id);

      // Log da ação
      await supabase.rpc('log_user_action', {
        action_type_param: 'backup',
        entity_type_param: 'user_data',
        details_param: { 
          activities_count: activities?.length || 0,
          health_metrics_count: healthMetrics?.length || 0,
          checkins_count: checkins?.length || 0
        }
      });

      return backupData;
    },
    onSuccess: () => {
      toast({
        title: "Backup realizado!",
        description: "Seus dados foram salvos com segurança.",
      });
    },
    onError: (error: any) => {
      console.error('Backup failed:', error);
      toast({
        title: "Erro no backup",
        description: `Falha ao realizar backup: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}

export function useRestoreData() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (backupDate: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar backup
      const { data: cacheItem } = await supabase
        .from('offline_cache')
        .select('cache_data')
        .eq('user_id', user.id)
        .eq('cache_key', `backup_${backupDate}`)
        .single();

      if (!cacheItem) {
        throw new Error('Backup não encontrado');
      }

      const backupData = cacheItem.cache_data;

      // Log da ação
      await supabase.rpc('log_user_action', {
        action_type_param: 'restore',
        entity_type_param: 'user_data',
        details_param: { backup_date: backupDate }
      });

      return backupData;
    },
    onSuccess: () => {
      toast({
        title: "Dados restaurados!",
        description: "Seus dados foram restaurados com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Restore failed:', error);
      toast({
        title: "Erro na restauração",
        description: `Falha ao restaurar dados: ${error.message}`,
        variant: "destructive",
      });
    },
  });
}
