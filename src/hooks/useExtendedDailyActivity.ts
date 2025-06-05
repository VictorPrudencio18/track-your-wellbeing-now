
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DayActivity } from '@/hooks/useDailyActivity';

export function useExtendedDailyActivity(months: number = 12) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['extended-daily-activity', user?.id, months],
    queryFn: async () => {
      if (!user) return [];

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      // Buscar atividades
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      // Buscar check-ins de saúde
      const { data: checkins } = await supabase
        .from('daily_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('checkin_date', startDate.toISOString().split('T')[0])
        .order('checkin_date', { ascending: true });

      // Buscar métricas de saúde
      const { data: metrics } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true });

      // Consolidar dados por dia
      const dayMap = new Map<string, DayActivity>();

      // Inicializar todos os dias do período
      const totalDays = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        dayMap.set(dateStr, {
          date: dateStr,
          activities: [],
          healthCheckin: null,
          healthMetrics: [],
          wellnessScore: 0,
          totalActivities: 0,
          totalMinutes: 0,
          totalCalories: 0,
          summary: {
            mood: '',
            energy: '',
            productivity: '',
            highlight: ''
          }
        });
      }

      // Processar atividades
      activities?.forEach(activity => {
        const date = activity.completed_at.split('T')[0];
        const day = dayMap.get(date);
        if (day) {
          day.activities.push(activity);
          day.totalActivities++;
          day.totalMinutes += Math.floor(activity.duration / 60);
          day.totalCalories += activity.calories || 0;
        }
      });

      // Processar check-ins
      checkins?.forEach(checkin => {
        const day = dayMap.get(checkin.checkin_date);
        if (day) {
          day.healthCheckin = checkin;
          day.wellnessScore = checkin.wellness_score || 0;
          
          // Gerar resumo baseado nos dados
          if (checkin.mood_rating) {
            day.summary.mood = checkin.mood_rating >= 4 ? '😊' : checkin.mood_rating >= 3 ? '😐' : '😔';
          }
          
          if (checkin.energy_level) {
            day.summary.energy = checkin.energy_level >= 7 ? '⚡' : checkin.energy_level >= 4 ? '🔋' : '🪫';
          }
          
          if (checkin.work_satisfaction) {
            day.summary.productivity = checkin.work_satisfaction >= 4 ? '🎯' : checkin.work_satisfaction >= 3 ? '📈' : '📉';
          }
        }
      });

      // Processar métricas
      metrics?.forEach(metric => {
        const date = metric.recorded_at.split('T')[0];
        const day = dayMap.get(date);
        if (day) {
          day.healthMetrics.push(metric);
        }
      });

      // Gerar highlights
      Array.from(dayMap.values()).forEach(day => {
        if (day.totalActivities > 0) {
          const mainActivity = day.activities[0];
          day.summary.highlight = `${mainActivity.type} (${day.totalMinutes}min)`;
        } else if (day.wellnessScore > 80) {
          day.summary.highlight = 'Dia excelente!';
        } else if (day.wellnessScore > 60) {
          day.summary.highlight = 'Dia bom';
        } else if (day.wellnessScore > 0) {
          day.summary.highlight = 'Dia desafiador';
        } else {
          day.summary.highlight = 'Sem dados';
        }
      });

      return Array.from(dayMap.values()).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
