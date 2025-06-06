
import { useQuery } from '@tanstack/react-query';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useSleepRecords } from '@/hooks/useSleep';

interface WellnessScores {
  mood: {
    score: number;
    trend: number;
    level: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
  sleep: {
    score: number;
    trend: number;
    level: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
    hasData: boolean;
  };
  activity: {
    score: number;
    trend: number;
    level: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
    weeklyCount: number;
  };
  energy: {
    score: number;
    trend: number;
    level: 'excellent' | 'good' | 'fair' | 'poor';
    description: string;
  };
}

export function useWellnessScores() {
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: activities } = useActivities();
  const { data: sleepRecords } = useSleepRecords();

  return useQuery({
    queryKey: ['wellness-scores', todayCheckin?.id, activities?.length, sleepRecords?.length],
    queryFn: (): WellnessScores => {
      // Score de Humor (baseado em check-ins dos últimos 7 dias)
      const moodScore = calculateMoodScore(todayCheckin, last7Days);
      
      // Score de Sono (baseado nos registros de sono)
      const sleepScore = calculateSleepScore(sleepRecords);
      
      // Score de Atividade (baseado nas atividades da semana)
      const activityScore = calculateActivityScore(activities);
      
      // Score de Energia (combinação de humor e sono)
      const energyScore = calculateEnergyScore(moodScore.score, sleepScore.score, todayCheckin, last7Days);

      return {
        mood: moodScore,
        sleep: sleepScore,
        activity: activityScore,
        energy: energyScore
      };
    },
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });
}

function calculateMoodScore(todayCheckin: any, last7Days: any[]) {
  const moodRatings = last7Days
    .filter(day => day.mood_rating !== null && day.mood_rating !== undefined)
    .map(day => day.mood_rating);
  
  if (todayCheckin?.mood_rating) {
    moodRatings.unshift(todayCheckin.mood_rating);
  }

  if (moodRatings.length === 0) {
    return {
      score: 0,
      trend: 0,
      level: 'poor' as const,
      description: 'Sem dados suficientes'
    };
  }

  // Calcular score baseado na média ponderada (mais peso para dias recentes)
  const weightedSum = moodRatings.reduce((sum, rating, index) => {
    const weight = Math.pow(0.9, index); // Peso decrescente para dias mais antigos
    return sum + (rating * 10 * weight);
  }, 0);
  
  const totalWeight = moodRatings.reduce((sum, _, index) => {
    return sum + Math.pow(0.9, index);
  }, 0);

  const score = Math.round(weightedSum / totalWeight);

  // Calcular tendência (últimos 3 vs 3 anteriores)
  const recent = moodRatings.slice(0, 3);
  const previous = moodRatings.slice(3, 6);
  const recentAvg = recent.reduce((sum, r) => sum + r, 0) / recent.length;
  const previousAvg = previous.length > 0 ? previous.reduce((sum, r) => sum + r, 0) / previous.length : recentAvg;
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

  return {
    score,
    trend: isNaN(trend) ? 0 : Math.round(trend),
    level: getScoreLevel(score),
    description: getMoodDescription(score, moodRatings.length)
  };
}

function calculateSleepScore(sleepRecords: any[] = []) {
  const recentRecords = sleepRecords.slice(0, 7); // Últimos 7 dias
  
  if (recentRecords.length === 0) {
    return {
      score: 0,
      trend: 0,
      level: 'poor' as const,
      description: 'Conhecer página de sono',
      hasData: false
    };
  }

  // Calcular score baseado em qualidade subjetiva e duração
  const scores = recentRecords.map(record => {
    let dayScore = 50; // Base score
    
    if (record.subjective_quality) {
      dayScore += record.subjective_quality * 10; // 10-100 baseado na qualidade
    }
    
    if (record.sleep_duration) {
      const optimalDuration = 480; // 8 horas em minutos
      const durationDiff = Math.abs(record.sleep_duration - optimalDuration);
      const durationPenalty = Math.min(durationDiff / 60 * 5, 30); // Máximo 30 pontos de penalidade
      dayScore -= durationPenalty;
    }
    
    return Math.max(0, Math.min(100, dayScore));
  });

  const score = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
  
  // Calcular tendência
  const recent = scores.slice(0, 3);
  const previous = scores.slice(3, 6);
  const recentAvg = recent.reduce((sum, s) => sum + s, 0) / recent.length;
  const previousAvg = previous.length > 0 ? previous.reduce((sum, s) => sum + s, 0) / previous.length : recentAvg;
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

  return {
    score,
    trend: isNaN(trend) ? 0 : Math.round(trend),
    level: getScoreLevel(score),
    description: getSleepDescription(score, recentRecords.length),
    hasData: true
  };
}

function calculateActivityScore(activities: any[] = []) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weeklyActivities = activities.filter(activity => 
    new Date(activity.completed_at) >= oneWeekAgo
  );

  if (weeklyActivities.length === 0) {
    return {
      score: 20,
      trend: 0,
      level: 'poor' as const,
      description: 'Sem atividades esta semana',
      weeklyCount: 0
    };
  }

  let score = 0;
  
  // Score baseado na frequência (40 pontos máx)
  const frequencyScore = Math.min(weeklyActivities.length * 6, 40);
  score += frequencyScore;
  
  // Score baseado na duração total (30 pontos máx)
  const totalDuration = weeklyActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  const durationScore = Math.min(totalDuration / 60 / 30, 1) * 30; // 30 minutos por dia = score máximo
  score += durationScore;
  
  // Score baseado na variedade de atividades (20 pontos máx)
  const uniqueTypes = new Set(weeklyActivities.map(a => a.type)).size;
  const varietyScore = Math.min(uniqueTypes * 5, 20);
  score += varietyScore;
  
  // Score baseado na intensidade (10 pontos máx)
  const avgCalories = weeklyActivities.reduce((sum, a) => sum + (a.calories || 0), 0) / weeklyActivities.length;
  const intensityScore = Math.min(avgCalories / 50, 1) * 10;
  score += intensityScore;

  // Calcular tendência comparando com semana anterior
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const previousWeekActivities = activities.filter(activity => {
    const activityDate = new Date(activity.completed_at);
    return activityDate >= twoWeeksAgo && activityDate < oneWeekAgo;
  });
  
  const trend = previousWeekActivities.length > 0 
    ? ((weeklyActivities.length - previousWeekActivities.length) / previousWeekActivities.length) * 100
    : 0;

  return {
    score: Math.round(score),
    trend: Math.round(trend),
    level: getScoreLevel(score),
    description: getActivityDescription(score, weeklyActivities.length),
    weeklyCount: weeklyActivities.length
  };
}

function calculateEnergyScore(moodScore: number, sleepScore: number, todayCheckin: any, last7Days: any[]) {
  // Energia é uma combinação de humor, sono e níveis de stress/energia reportados
  let energyScore = 0;
  
  // 40% baseado no humor
  energyScore += (moodScore * 0.4);
  
  // 40% baseado no sono
  energyScore += (sleepScore * 0.4);
  
  // 20% baseado nos níveis de energia e stress reportados
  const energyLevels = last7Days
    .filter(day => day.energy_level !== null && day.energy_level !== undefined)
    .map(day => day.energy_level);
    
  if (todayCheckin?.energy_level) {
    energyLevels.unshift(todayCheckin.energy_level);
  }
  
  const stressLevels = last7Days
    .filter(day => day.stress_level !== null && day.stress_level !== undefined)
    .map(day => day.stress_level);
    
  if (todayCheckin?.stress_level) {
    stressLevels.unshift(todayCheckin.stress_level);
  }
  
  if (energyLevels.length > 0) {
    const avgEnergy = energyLevels.reduce((sum, e) => sum + e, 0) / energyLevels.length;
    energyScore += (avgEnergy * 10 * 0.15); // 15% do score
  }
  
  if (stressLevels.length > 0) {
    const avgStress = stressLevels.reduce((sum, s) => sum + s, 0) / stressLevels.length;
    energyScore += ((10 - avgStress) * 10 * 0.05); // 5% do score (stress invertido)
  }

  const score = Math.round(Math.max(0, Math.min(100, energyScore)));
  
  // Calcular tendência baseada nos últimos níveis de energia
  const recentEnergy = energyLevels.slice(0, 3);
  const previousEnergy = energyLevels.slice(3, 6);
  const recentAvg = recentEnergy.length > 0 ? recentEnergy.reduce((sum, e) => sum + e, 0) / recentEnergy.length : 5;
  const previousAvg = previousEnergy.length > 0 ? previousEnergy.reduce((sum, e) => sum + e, 0) / previousEnergy.length : recentAvg;
  const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

  return {
    score,
    trend: isNaN(trend) ? 0 : Math.round(trend),
    level: getScoreLevel(score),
    description: getEnergyDescription(score, energyLevels.length, stressLevels.length)
  };
}

function getScoreLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'fair';
  return 'poor';
}

function getMoodDescription(score: number, dataPoints: number): string {
  if (dataPoints < 3) return `Poucos dados (${dataPoints} registros)`;
  if (score >= 80) return 'Humor excelente';
  if (score >= 65) return 'Bem-estar';
  if (score >= 45) return 'Humor regular';
  return 'Precisa atenção';
}

function getSleepDescription(score: number, dataPoints: number): string {
  if (dataPoints < 3) return `Poucos dados (${dataPoints} registros)`;
  if (score >= 80) return 'Sono excelente';
  if (score >= 65) return 'Descanso';
  if (score >= 45) return 'Sono regular';
  return 'Sono inadequado';
}

function getActivityDescription(score: number, weeklyCount: number): string {
  if (weeklyCount === 0) return 'Sem atividades';
  if (score >= 80) return 'Muito ativo';
  if (score >= 65) return 'Exercício';
  if (score >= 45) return 'Pouco ativo';
  return 'Sedentário';
}

function getEnergyDescription(score: number, energyDataPoints: number, stressDataPoints: number): string {
  if (energyDataPoints === 0 && stressDataPoints === 0) return 'Sem dados de energia';
  if (score >= 80) return 'Alta energia';
  if (score >= 65) return 'Vitalidade';
  if (score >= 45) return 'Energia regular';
  return 'Baixa energia';
}
