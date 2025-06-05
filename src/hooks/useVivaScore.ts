
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useSleepRecords } from '@/hooks/useSleep';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';

interface VivaScoreBreakdown {
  physical: number;
  mental: number;
  sleep: number;
  energy: number;
  overall: number;
}

interface VivaScoreData {
  score: number;
  breakdown: VivaScoreBreakdown;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  level: 'excellent' | 'good' | 'fair' | 'needs_attention';
  recommendations: string[];
}

export function useVivaScore() {
  const { user } = useAuth();
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: activities } = useActivities();
  const { data: sleepRecords } = useSleepRecords();
  const { data: healthMetrics } = useHealthMetrics();

  return useQuery({
    queryKey: ['viva-score', user?.id],
    queryFn: () => calculateVivaScore(todayCheckin, last7Days, activities, sleepRecords, healthMetrics),
    enabled: !!user,
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}

function calculateVivaScore(
  todayCheckin: any,
  last7Days: any[],
  activities: any[],
  sleepRecords: any[],
  healthMetrics: any[]
): VivaScoreData {
  // Score Físico (peso: 25%)
  const physicalScore = calculatePhysicalScore(activities, healthMetrics);
  
  // Score Mental (peso: 30%)
  const mentalScore = calculateMentalScore(todayCheckin, last7Days);
  
  // Score do Sono (peso: 25%)
  const sleepScore = calculateSleepScore(sleepRecords);
  
  // Score de Energia (peso: 20%)
  const energyScore = calculateEnergyScore(todayCheckin, last7Days);

  // Score geral ponderado
  const overall = Math.round(
    (physicalScore * 0.25) +
    (mentalScore * 0.30) +
    (sleepScore * 0.25) +
    (energyScore * 0.20)
  );

  // Calcular tendência
  const { trend, trendPercentage } = calculateTrend(last7Days);

  // Determinar nível
  const level = getScoreLevel(overall);

  // Gerar recomendações
  const recommendations = generateRecommendations({
    physical: physicalScore,
    mental: mentalScore,
    sleep: sleepScore,
    energy: energyScore,
    overall
  });

  return {
    score: overall,
    breakdown: {
      physical: physicalScore,
      mental: mentalScore,
      sleep: sleepScore,
      energy: energyScore,
      overall
    },
    trend,
    trendPercentage,
    level,
    recommendations
  };
}

function calculatePhysicalScore(activities: any[] = [], healthMetrics: any[] = []): number {
  const last7Days = activities?.filter(a => 
    new Date(a.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ) || [];

  let score = 50; // Base score

  // Frequência de exercícios (40%)
  const exerciseFrequency = last7Days.length;
  score += Math.min(exerciseFrequency * 7, 28); // Max 28 pontos

  // Intensidade média (30%)
  const avgCalories = last7Days.reduce((sum, a) => sum + (a.calories || 0), 0) / Math.max(last7Days.length, 1);
  score += Math.min(avgCalories / 20, 22); // Max 22 pontos

  return Math.min(Math.round(score), 100);
}

function calculateMentalScore(todayCheckin: any, last7Days: any[] = []): number {
  let score = 50; // Base score

  if (todayCheckin) {
    // Humor atual (40%)
    if (todayCheckin.mood_rating) {
      score += (todayCheckin.mood_rating * 4); // Max 40 pontos
    }

    // Nível de stress invertido (35%)
    if (todayCheckin.stress_level) {
      score += ((11 - todayCheckin.stress_level) * 3.5); // Max 35 pontos
    }

    // Satisfação no trabalho (25%)
    if (todayCheckin.work_satisfaction) {
      score += (todayCheckin.work_satisfaction * 2.5); // Max 25 pontos
    }
  }

  // Tendência dos últimos 7 dias
  const recentMoodAvg = last7Days.reduce((sum, day) => sum + (day.mood_rating || 5), 0) / Math.max(last7Days.length, 1);
  if (recentMoodAvg > 7) score += 15;
  else if (recentMoodAvg < 4) score -= 15;

  return Math.min(Math.max(Math.round(score), 0), 100);
}

function calculateSleepScore(sleepRecords: any[] = []): number {
  const recent = sleepRecords?.slice(0, 7) || [];
  if (recent.length === 0) return 50;

  let score = 0;
  let count = 0;

  recent.forEach(record => {
    if (record.calculated_scores?.overall_score) {
      score += record.calculated_scores.overall_score;
      count++;
    }
  });

  return count > 0 ? Math.round(score / count) : 50;
}

function calculateEnergyScore(todayCheckin: any, last7Days: any[] = []): number {
  let score = 50;

  if (todayCheckin?.energy_level) {
    score = todayCheckin.energy_level * 10; // Max 100
  }

  // Consistência nos últimos 7 dias
  const energyLevels = last7Days.map(day => day.energy_level).filter(Boolean);
  if (energyLevels.length > 0) {
    const avgEnergy = energyLevels.reduce((sum, e) => sum + e, 0) / energyLevels.length;
    const consistency = 100 - (Math.abs(todayCheckin?.energy_level - avgEnergy) * 10);
    score = (score + consistency) / 2;
  }

  return Math.min(Math.round(score), 100);
}

function calculateTrend(last7Days: any[] = []): { trend: 'up' | 'down' | 'stable', trendPercentage: number } {
  if (last7Days.length < 3) return { trend: 'stable', trendPercentage: 0 };

  const recent3 = last7Days.slice(0, 3).map(d => d.wellness_score || 0);
  const previous3 = last7Days.slice(3, 6).map(d => d.wellness_score || 0);

  const recentAvg = recent3.reduce((sum, s) => sum + s, 0) / recent3.length;
  const previousAvg = previous3.reduce((sum, s) => sum + s, 0) / Math.max(previous3.length, 1);

  const change = ((recentAvg - previousAvg) / Math.max(previousAvg, 1)) * 100;

  if (Math.abs(change) < 5) return { trend: 'stable', trendPercentage: Math.abs(change) };
  return { 
    trend: change > 0 ? 'up' : 'down', 
    trendPercentage: Math.abs(change) 
  };
}

function getScoreLevel(score: number): 'excellent' | 'good' | 'fair' | 'needs_attention' {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'fair';
  return 'needs_attention';
}

function generateRecommendations(breakdown: VivaScoreBreakdown): string[] {
  const recommendations: string[] = [];

  if (breakdown.physical < 60) {
    recommendations.push('Aumente sua atividade física - tente 30 min de exercício hoje');
  }

  if (breakdown.mental < 60) {
    recommendations.push('Reserve tempo para relaxamento e atividades que você gosta');
  }

  if (breakdown.sleep < 60) {
    recommendations.push('Melhore sua higiene do sono - durma e acorde no mesmo horário');
  }

  if (breakdown.energy < 60) {
    recommendations.push('Hidrate-se bem e faça pausas regulares durante o dia');
  }

  if (breakdown.overall >= 85) {
    recommendations.push('Excelente! Continue mantendo esses hábitos saudáveis');
  }

  return recommendations.slice(0, 3); // Máximo 3 recomendações
}
