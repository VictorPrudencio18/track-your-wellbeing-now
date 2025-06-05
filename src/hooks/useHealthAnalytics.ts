
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useDailyActivity } from '@/hooks/useDailyActivity';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';

interface HealthAnalyticsOptions {
  timeRange?: string;
}

export function useHealthAnalytics(options: HealthAnalyticsOptions = {}) {
  const { user } = useAuth();
  const { timeRange = '30d' } = options;
  
  // Convert timeRange to days
  const days = timeRange === '7d' ? 7 : 
               timeRange === '30d' ? 30 : 
               timeRange === '90d' ? 90 : 365;

  const { data: dailyActivity } = useDailyActivity(days);
  const { data: healthMetrics } = useHealthMetrics(undefined, days);
  const { todayCheckin } = useDailyCheckins();

  return useQuery({
    queryKey: ['health-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user) return null;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Buscar dados consolidados
      const [checkinsData, metricsData, correlationsData] = await Promise.all([
        // Check-ins de saúde
        supabase
          .from('daily_health_checkins')
          .select('*')
          .eq('user_id', user.id)
          .gte('checkin_date', startDate.toISOString().split('T')[0])
          .order('checkin_date', { ascending: true }),

        // Métricas de saúde
        supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .gte('recorded_at', startDate.toISOString())
          .order('recorded_at', { ascending: true }),

        // Respostas categorizadas
        supabase
          .from('daily_checkin_responses')
          .select('*')
          .eq('user_id', user.id)
          .gte('checkin_date', startDate.toISOString().split('T')[0])
          .order('checkin_date', { ascending: true })
      ]);

      const checkins = checkinsData.data || [];
      const metrics = metricsData.data || [];
      const responses = correlationsData.data || [];

      // Calcular score geral de bem-estar
      const overallScore = calculateOverallScore(checkins, metrics, responses);

      // Calcular tendências
      const trends = calculateTrends(checkins, metrics);

      // Calcular correlações
      const correlations = calculateCorrelations(checkins, metrics);

      // Identificar padrões
      const patterns = identifyPatterns(checkins, dailyActivity || []);

      // Gerar insights
      const insights = generateInsights(checkins, metrics, trends);

      return {
        overallScore,
        trends,
        correlations,
        patterns,
        insights,
        rawData: {
          checkins,
          metrics,
          responses,
          activities: dailyActivity
        },
        summary: {
          totalDays: days,
          checkinDays: checkins.length,
          completionRate: (checkins.length / days) * 100,
          avgWellnessScore: checkins.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / checkins.length || 0
        }
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

function calculateOverallScore(checkins: any[], metrics: any[], responses: any[]): number {
  if (checkins.length === 0) return 0;

  const avgWellness = checkins.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / checkins.length;
  const recentCheckins = checkins.slice(-7); // Últimos 7 dias
  const consistency = (recentCheckins.length / 7) * 100;
  
  // Score baseado em wellness médio (70%) + consistência (30%)
  return Math.round((avgWellness * 0.7) + (consistency * 0.3));
}

function calculateTrends(checkins: any[], metrics: any[]) {
  const trends: Record<string, any> = {};

  // Tendências de wellness score
  if (checkins.length >= 7) {
    const recent = checkins.slice(-7);
    const previous = checkins.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / previous.length || recentAvg;
    
    trends.wellness = {
      current: recentAvg,
      change: ((recentAvg - previousAvg) / previousAvg) * 100,
      direction: recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable'
    };
  }

  // Tendências de métricas específicas
  ['sleep_quality', 'energy_level', 'stress_level', 'mood_rating'].forEach(metric => {
    const values = checkins.map(c => c[metric]).filter(v => v != null);
    if (values.length >= 7) {
      const recent = values.slice(-7);
      const previous = values.slice(-14, -7);
      
      const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
      const previousAvg = previous.reduce((sum, v) => sum + v, 0) / previous.length || recentAvg;
      
      trends[metric] = {
        current: recentAvg,
        change: ((recentAvg - previousAvg) / previousAvg) * 100,
        direction: recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable'
      };
    }
  });

  return trends;
}

function calculateCorrelations(checkins: any[], metrics: any[]) {
  const correlations: Record<string, number> = {};

  if (checkins.length < 7) return correlations;

  // Correlação entre sono e energia
  const sleepValues = checkins.map(c => c.sleep_quality).filter(v => v != null);
  const energyValues = checkins.map(c => c.energy_level).filter(v => v != null);
  
  if (sleepValues.length >= 7 && energyValues.length >= 7) {
    correlations.sleepEnergy = calculatePearsonCorrelation(sleepValues, energyValues);
  }

  // Correlação entre stress e humor
  const stressValues = checkins.map(c => c.stress_level).filter(v => v != null);
  const moodValues = checkins.map(c => c.mood_rating).filter(v => v != null);
  
  if (stressValues.length >= 7 && moodValues.length >= 7) {
    correlations.stressMood = calculatePearsonCorrelation(
      stressValues.map(v => 10 - v), // Inverter stress (menos stress = melhor)
      moodValues
    );
  }

  // Correlação entre exercício e energia
  const exerciseValues = checkins.map(c => c.exercise_completed ? 1 : 0);
  if (exerciseValues.length >= 7 && energyValues.length >= 7) {
    correlations.exerciseEnergy = calculatePearsonCorrelation(exerciseValues, energyValues);
  }

  return correlations;
}

function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const sumX = x.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumY = y.slice(0, n).reduce((sum, val) => sum + val, 0);
  const sumXY = x.slice(0, n).reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.slice(0, n).reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.slice(0, n).reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

function identifyPatterns(checkins: any[], activities: any[]) {
  const patterns: Record<string, any> = {};

  // Padrão de dias da semana
  const dayOfWeekData = Array(7).fill(0).map(() => ({ wellness: [], count: 0 }));
  
  checkins.forEach(checkin => {
    const date = new Date(checkin.checkin_date);
    const dayOfWeek = date.getDay();
    dayOfWeekData[dayOfWeek].wellness.push(checkin.wellness_score || 0);
    dayOfWeekData[dayOfWeek].count++;
  });

  patterns.weeklyPattern = dayOfWeekData.map((day, index) => ({
    day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index],
    avgWellness: day.wellness.length > 0 ? 
      day.wellness.reduce((sum, w) => sum + w, 0) / day.wellness.length : 0,
    count: day.count
  }));

  // Padrão de exercício vs bem-estar
  const exerciseDays = checkins.filter(c => c.exercise_completed);
  const noExerciseDays = checkins.filter(c => !c.exercise_completed);

  patterns.exerciseImpact = {
    withExercise: exerciseDays.length > 0 ? 
      exerciseDays.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / exerciseDays.length : 0,
    withoutExercise: noExerciseDays.length > 0 ? 
      noExerciseDays.reduce((sum, c) => sum + (c.wellness_score || 0), 0) / noExerciseDays.length : 0
  };

  return patterns;
}

function generateInsights(checkins: any[], metrics: any[], trends: any) {
  const insights: Array<{
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    actionable: boolean;
    priority: number;
  }> = [];

  // Insight sobre tendências
  if (trends.wellness?.direction === 'up') {
    insights.push({
      type: 'positive',
      title: 'Bem-estar em Alta! 📈',
      description: `Seu score de bem-estar melhorou ${Math.abs(trends.wellness.change).toFixed(1)}% na última semana.`,
      actionable: false,
      priority: 1
    });
  } else if (trends.wellness?.direction === 'down') {
    insights.push({
      type: 'negative',
      title: 'Atenção ao Bem-estar ⚠️',
      description: `Seu score diminuiu ${Math.abs(trends.wellness.change).toFixed(1)}% na última semana. Vamos identificar o que pode ajudar.`,
      actionable: true,
      priority: 1
    });
  }

  // Insight sobre sono
  if (trends.sleep_quality?.current < 3 && checkins.length >= 7) {
    insights.push({
      type: 'negative',
      title: 'Qualidade do Sono 😴',
      description: 'Sua qualidade de sono está abaixo do ideal. Considere estabelecer uma rotina de sono mais consistente.',
      actionable: true,
      priority: 2
    });
  }

  // Insight sobre exercício
  const exerciseRate = checkins.filter(c => c.exercise_completed).length / checkins.length;
  if (exerciseRate < 0.5) {
    insights.push({
      type: 'neutral',
      title: 'Atividade Física 🏃‍♂️',
      description: `Você está se exercitando ${(exerciseRate * 100).toFixed(0)}% dos dias. Que tal definir uma meta de exercício?`,
      actionable: true,
      priority: 3
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}
