
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CacheItem {
  id: string;
  user_id: string;
  cache_key: string;
  cache_data: any;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export function useOfflineCache(cacheKey: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['offline-cache', user?.id, cacheKey],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('offline_cache')
        .select('*')
        .eq('user_id', user.id)
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cache:', error);
        return null;
      }

      return data?.cache_data || null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useSetCache() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      cacheKey, 
      data, 
      expiresInMinutes = 60 
    }: { 
      cacheKey: string; 
      data: any; 
      expiresInMinutes?: number;
    }) => {
      if (!user) throw new Error('Usuário não autenticado');

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

      const { data: result, error } = await supabase
        .from('offline_cache')
        .upsert({
          user_id: user.id,
          cache_key: cacheKey,
          cache_data: data,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error setting cache:', error);
        throw error;
      }

      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['offline-cache', user?.id, variables.cacheKey] 
      });
    },
  });
}

export function useClearCache() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (cacheKey?: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      let query = supabase
        .from('offline_cache')
        .delete()
        .eq('user_id', user.id);

      if (cacheKey) {
        query = query.eq('cache_key', cacheKey);
      }

      const { error } = await query;

      if (error) {
        console.error('Error clearing cache:', error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offline-cache'] });
    },
  });
}
