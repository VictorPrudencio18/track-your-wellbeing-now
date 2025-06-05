
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';

interface WeatherImpact {
  condition: string;
  moodCorrelation: number;
  energyCorrelation: number;
  activityImpact: number;
  recommendations: string[];
}

interface SocialActivityCorrelation {
  socialDays: number;
  avgMoodOnSocialDays: number;
  avgMoodOnSoloDays: number;
  socialImpact: number;
  insights: string[];
}

interface WorkLifeBalance {
  workSatisfactionTrend: number;
  stressLevels: {
    work: number;
    personal: number;
    overall: number;
  };
  balanceScore: number;
  recommendations: string[];
}

interface EnvironmentalWellnessScore {
  overall: number;
  factors: {
    weather: number;
    social: number;
    work: number;
    activity: number;
  };
  insights: string[];
}

interface EnvironmentalFactorsData {
  weatherImpact: WeatherImpact;
  socialCorrelation: SocialActivityCorrelation;
  workLifeBalance: WorkLifeBalance;
  environmentalScore: EnvironmentalWellnessScore;
}

export function useEnvironmentalFactors() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: activities } = useActivities();

  return useQuery({
    queryKey: ['environmental-factors', user?.id],
    queryFn: () => analyzeEnvironmentalFactors(last30Days, activities),
    enabled: !!user && last30Days && last30Days.length >= 7,
    staleTime: 2 * 60 * 60 * 1000, // 2 horas
  });
}

function analyzeEnvironmentalFactors(
  checkins: any[] = [],
  activities: any[] = []
): EnvironmentalFactorsData {
  const weatherImpact = analyzeWeatherImpact(checkins);
  const socialCorrelation = analyzeSocialActivityCorrelation(checkins, activities);
  const workLifeBalance = analyzeWorkLifeBalance(checkins);
  const environmentalScore = calculateEnvironmentalWellnessScore(checkins, activities);

  return {
    weatherImpact,
    socialCorrelation,
    workLifeBalance,
    environmentalScore
  };
}

function analyzeWeatherImpact(checkins: any[]): WeatherImpact {
  // Simulação de análise climática (na vida real, integraria com API de clima)
  const mockWeatherData = generateMockWeatherCorrelation(checkins);
  
  return {
    condition: 'sunny',
    moodCorrelation: mockWeatherData.moodCorrelation,
    energyCorrelation: mockWeatherData.energyCorrelation,
    activityImpact: mockWeatherData.activityImpact,
    recommendations: [
      'Aproveite dias ensolarados para atividades ao ar livre',
      'Em dias chuvosos, foque em exercícios internos',
      'Use luz artificial em dias nublados para manter energia'
    ]
  };
}

function generateMockWeatherCorrelation(checkins: any[]) {
  const recentMood = checkins.slice(0, 7).map(c => c.mood_rating).filter(Boolean);
  const recentEnergy = checkins.slice(0, 7).map(c => c.energy_level).filter(Boolean);
  
  const avgMood = recentMood.reduce((sum, m) => sum + m, 0) / Math.max(recentMood.length, 1);
  const avgEnergy = recentEnergy.reduce((sum, e) => sum + e, 0) / Math.max(recentEnergy.length, 1);

  // Simular correlações baseadas na performance atual
  return {
    moodCorrelation: (avgMood - 5) * 0.1,
    energyCorrelation: (avgEnergy - 5) * 0.12,
    activityImpact: avgMood > 7 ? 15 : avgMood < 4 ? -10 : 5
  };
}

function analyzeSocialActivityCorrelation(checkins: any[], activities: any[]): SocialActivityCorrelation {
  // Identificar dias com atividades sociais (baseado em tipos de exercício ou notas)
  const socialActivities = activities.filter(a => 
    a.type === 'dance' || 
    a.notes?.toLowerCase().includes('amigos') ||
    a.notes?.toLowerCase().includes('grupo') ||
    a.notes?.toLowerCase().includes('social')
  );

  const socialDates = new Set(socialActivities.map(a => 
    new Date(a.completed_at).toISOString().split('T')[0]
  ));

  const socialDays = checkins.filter(c => socialDates.has(c.checkin_date));
  const soloDays = checkins.filter(c => !socialDates.has(c.checkin_date));

  const avgMoodSocial = socialDays.length > 0
    ? socialDays.reduce((sum, d) => sum + (d.mood_rating || 5), 0) / socialDays.length
    : 5;

  const avgMoodSolo = soloDays.length > 0
    ? soloDays.reduce((sum, d) => sum + (d.mood_rating || 5), 0) / soloDays.length
    : 5;

  const socialImpact = avgMoodSocial - avgMoodSolo;

  const insights = [];
  if (socialImpact > 1) {
    insights.push('Atividades sociais melhoram significativamente seu humor');
    insights.push('Tente incluir mais atividades em grupo na sua rotina');
  } else if (socialImpact < -0.5) {
    insights.push('Você pode se sentir melhor em atividades individuais');
    insights.push('Encontre o equilíbrio ideal entre social e tempo pessoal');
  } else {
    insights.push('Você se adapta bem tanto a atividades sociais quanto individuais');
  }

  return {
    socialDays: socialDays.length,
    avgMoodOnSocialDays: avgMoodSocial,
    avgMoodOnSoloDays: avgMoodSolo,
    socialImpact,
    insights
  };
}

function analyzeWorkLifeBalance(checkins: any[]): WorkLifeBalance {
  const workDays = checkins.filter(c => {
    const date = new Date(c.checkin_date);
    return date.getDay() >= 1 && date.getDay() <= 5; // Segunda a sexta
  });

  const weekends = checkins.filter(c => {
    const date = new Date(c.checkin_date);
    return date.getDay() === 0 || date.getDay() === 6; // Sábado e domingo
  });

  const workSatisfactionData = workDays
    .map(d => d.work_satisfaction)
    .filter(Boolean);

  const workStress = workDays
    .map(d => d.stress_level)
    .filter(Boolean);

  const personalStress = weekends
    .map(d => d.stress_level)
    .filter(Boolean);

  const avgWorkSatisfaction = workSatisfactionData.length > 0
    ? workSatisfactionData.reduce((sum, s) => sum + s, 0) / workSatisfactionData.length
    : 5;

  const avgWorkStress = workStress.length > 0
    ? workStress.reduce((sum, s) => sum + s, 0) / workStress.length
    : 5;

  const avgPersonalStress = personalStress.length > 0
    ? personalStress.reduce((sum, s) => sum + s, 0) / personalStress.length
    : 5;

  const overallStress = (avgWorkStress + avgPersonalStress) / 2;

  // Calcular tendência de satisfação no trabalho
  const recent = workSatisfactionData.slice(0, 5);
  const previous = workSatisfactionData.slice(5, 10);
  const trend = recent.length > 0 && previous.length > 0
    ? (recent.reduce((sum, s) => sum + s, 0) / recent.length) - 
      (previous.reduce((sum, s) => sum + s, 0) / previous.length)
    : 0;

  const balanceScore = Math.round(
    (avgWorkSatisfaction * 0.4) +
    ((10 - avgWorkStress) * 0.3) +
    ((10 - Math.abs(avgWorkStress - avgPersonalStress)) * 0.3)
  ) * 10;

  const recommendations = [];
  if (avgWorkStress > 7) {
    recommendations.push('Considere técnicas de gerenciamento de stress no trabalho');
  }
  if (avgWorkSatisfaction < 6) {
    recommendations.push('Explore maneiras de aumentar satisfação profissional');
  }
  if (Math.abs(avgWorkStress - avgPersonalStress) > 2) {
    recommendations.push('Trabalhe no equilíbrio entre vida pessoal e profissional');
  }
  if (recommendations.length === 0) {
    recommendations.push('Continue mantendo um bom equilíbrio trabalho-vida');
  }

  return {
    workSatisfactionTrend: trend,
    stressLevels: {
      work: avgWorkStress,
      personal: avgPersonalStress,
      overall: overallStress
    },
    balanceScore,
    recommendations
  };
}

function calculateEnvironmentalWellnessScore(checkins: any[], activities: any[]): EnvironmentalWellnessScore {
  const recent14Days = checkins.slice(0, 14);
  
  // Score de clima (simulado baseado no humor médio)
  const avgMood = recent14Days.reduce((sum, c) => sum + (c.mood_rating || 5), 0) / recent14Days.length;
  const weatherScore = Math.min(100, avgMood * 12);

  // Score social (baseado na variação de humor em atividades)
  const moodVariation = calculateMoodVariation(recent14Days);
  const socialScore = Math.max(0, 100 - moodVariation * 5);

  // Score de trabalho (baseado na satisfação média)
  const workSatisfaction = recent14Days
    .map(c => c.work_satisfaction)
    .filter(Boolean);
  const workScore = workSatisfaction.length > 0
    ? (workSatisfaction.reduce((sum, s) => sum + s, 0) / workSatisfaction.length) * 10
    : 70;

  // Score de atividade (baseado na frequência)
  const activityDays = activities.filter(a => 
    new Date(a.completed_at) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  ).length;
  const activityScore = Math.min(100, (activityDays / 14) * 100);

  const overall = Math.round(
    (weatherScore * 0.25) +
    (socialScore * 0.25) +
    (workScore * 0.25) +
    (activityScore * 0.25)
  );

  const insights = [];
  if (overall >= 80) {
    insights.push('Excelente harmonia com fatores ambientais');
  } else if (overall >= 60) {
    insights.push('Bom equilíbrio ambiental com espaço para melhorias');
  } else {
    insights.push('Foque em melhorar fatores ambientais que afetam seu bem-estar');
  }

  return {
    overall,
    factors: {
      weather: Math.round(weatherScore),
      social: Math.round(socialScore),
      work: Math.round(workScore),
      activity: Math.round(activityScore)
    },
    insights
  };
}

function calculateMoodVariation(checkins: any[]): number {
  const moods = checkins.map(c => c.mood_rating).filter(Boolean);
  if (moods.length < 2) return 0;

  const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
  const variance = moods.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) / moods.length;
  
  return Math.sqrt(variance);
}
