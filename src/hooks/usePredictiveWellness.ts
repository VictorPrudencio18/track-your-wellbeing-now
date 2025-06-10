
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useSleepRecords } from '@/hooks/useSleepRecords';

interface PredictiveInsight {
  type: 'warning' | 'opportunity' | 'trend';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  actionable: string;
  category: string;
}

export function usePredictiveWellness() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: activities } = useActivities();
  const { sleepRecords } = useSleepRecords();

  return useQuery({
    queryKey: ['predictive-wellness', user?.id],
    queryFn: () => generatePredictiveInsights(last30Days, activities, sleepRecords),
    enabled: !!user && last30Days && last30Days.length >= 7,
    staleTime: 2 * 60 * 60 * 1000, // 2 horas
  });
}

function generatePredictiveInsights(
  checkins: any[] = [],
  activities: any[] = [],
  sleepRecords: any[] = []
): PredictiveInsight[] {
  const insights: PredictiveInsight[] = [];

  // Análise de tendência de humor
  if (checkins.length >= 7) {
    const recentMood = checkins.slice(0, 7).map(c => c.mood_rating).filter(Boolean);
    const olderMood = checkins.slice(7, 14).map(c => c.mood_rating).filter(Boolean);
    
    if (recentMood.length >= 5 && olderMood.length >= 5) {
      const recentAvg = recentMood.reduce((sum, m) => sum + m, 0) / recentMood.length;
      const olderAvg = olderMood.reduce((sum, m) => sum + m, 0) / olderMood.length;
      
      if (recentAvg < olderAvg - 1) {
        insights.push({
          type: 'warning',
          title: 'Declínio no Humor Detectado',
          description: `Seu humor médio diminuiu ${(olderAvg - recentAvg).toFixed(1)} pontos na última semana`,
          probability: 85,
          timeframe: 'Próximos 3-5 dias',
          actionable: 'Considere atividades relaxantes e verifique seu padrão de sono',
          category: 'Mental'
        });
      }
    }
  }

  // Predição de burnout baseado em atividade e stress
  const recentStress = checkins.slice(0, 7).map(c => c.stress_level).filter(Boolean);
  const recentActivity = activities?.filter(a => 
    new Date(a.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ) || [];

  if (recentStress.length >= 5) {
    const avgStress = recentStress.reduce((sum, s) => sum + s, 0) / recentStress.length;
    const lowActivity = recentActivity.length < 3;
    
    if (avgStress >= 7 && lowActivity) {
      insights.push({
        type: 'warning',
        title: 'Risco de Burnout Detectado',
        description: 'Alto stress combinado com baixa atividade física pode levar ao esgotamento',
        probability: 78,
        timeframe: 'Próximas 2 semanas',
        actionable: 'Aumente atividade física leve e pratique técnicas de relaxamento',
        category: 'Físico'
      });
    }
  }

  // Oportunidade de melhoria no sono
  if (sleepRecords.length >= 5) {
    const avgQuality = sleepRecords.reduce((sum, s) => sum + (s.subjective_quality || 0), 0) / sleepRecords.length;
    const avgDuration = sleepRecords.reduce((sum, s) => sum + (s.sleep_duration || 0), 0) / sleepRecords.length;
    
    if (avgQuality < 6 || avgDuration < 420) { // Menos de 7h
      insights.push({
        type: 'opportunity',
        title: 'Potencial de Melhoria no Sono',
        description: 'Seu padrão de sono pode ser otimizado para melhor bem-estar',
        probability: 92,
        timeframe: '2-3 semanas',
        actionable: 'Estabeleça horário regular de sono e evite telas 1h antes de dormir',
        category: 'Sono'
      });
    }
  }

  // Tendência positiva de exercícios
  const weeklyActivity = activities?.filter(a => 
    new Date(a.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ) || [];
  
  if (weeklyActivity.length >= 4) {
    insights.push({
      type: 'trend',
      title: 'Excelente Consistência de Exercícios',
      description: 'Você está mantendo uma rotina consistente de atividades físicas',
      probability: 95,
      timeframe: 'Mantendo o ritmo',
      actionable: 'Continue assim! Considere variar os tipos de exercício',
      category: 'Físico'
    });
  }

  return insights.slice(0, 4); // Máximo 4 insights
}
