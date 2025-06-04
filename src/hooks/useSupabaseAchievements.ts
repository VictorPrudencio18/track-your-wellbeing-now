
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

type Achievement = Tables<'achievements'>;
type UserAchievement = Tables<'user_achievements'>;

interface AchievementWithStatus extends Achievement {
  is_unlocked: boolean;
  unlocked_at?: string;
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      console.log('Fetching achievements...');
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        throw error;
      }
      
      console.log('Achievements fetched:', data);
      return data as Achievement[];
    },
    retry: 3,
  });
}

export function useUserAchievements() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for user achievements');
        return [];
      }

      console.log('Fetching user achievements...');
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user achievements:', error);
        throw error;
      }
      
      console.log('User achievements fetched:', data);
      return data;
    },
    enabled: !!user,
    retry: 3,
  });
}

export function useAchievementsWithStatus() {
  const { user } = useAuth();
  const { data: achievements } = useAchievements();
  const { data: userAchievements } = useUserAchievements();
  
  return useQuery({
    queryKey: ['achievements-with-status', user?.id, achievements, userAchievements],
    queryFn: async () => {
      if (!achievements) return [];
      
      const userAchievementIds = new Set(
        userAchievements?.map(ua => ua.achievement_id) || []
      );
      
      const achievementsWithStatus: AchievementWithStatus[] = achievements.map(achievement => {
        const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        return {
          ...achievement,
          is_unlocked: userAchievementIds.has(achievement.id),
          unlocked_at: userAchievement?.unlocked_at || undefined
        };
      });
      
      return achievementsWithStatus;
    },
    enabled: !!achievements,
  });
}
