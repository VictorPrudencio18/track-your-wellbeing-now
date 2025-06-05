
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useSleepRecords } from '@/hooks/useSleep';

interface WellnessForecast {
  date: string;
  predictedScore: number;
  confidence: number;
  factors: {
    sleep: number;
    exercise: number;
    stress: number;
    energy: number;
  };
  risks: string[];
  recommendations: string[];
}

interface RiskPrediction {
  type: 'burnout' | 'low_energy' | 'poor_sleep' | 'high_stress';
  probability: number;
  timeframe: string;
  preventiveActions: string[];
}

interface GoalAchievementProbability {
  goalType: string;
  probability: number;
  factors: {
    consistency: number;
    trend: number;
    motivation: number;
  };
  recommendations: string[];
}

interface PredictiveWellnessData {
  forecast: WellnessForecast[];
  risks: RiskPrediction[];
  goalProbabilities: GoalAchievementProbability[];
  optimalWeekPlan: {
    date: string;
    activities: string[];
    focus: string;
    restLevel: number;
  }[];
}

export function usePredictiveWellness() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: activities } = useActivities();
  const { data: sleepRecords } = useSleepRecords();

  return useQuery({
    queryKey: ['predictive-wellness', user?.id],
    queryFn: () => generatePredictiveAnalysis(last30Days, activities, sleepRecords),
    enabled: !!user && last30Days && last30Days.length >= 7,
    staleTime: 2 * 60 * 60 * 1000, // 2 horas
  });
}

function generatePredictiveAnalysis(
  checkins: any[],
  activities: any[] = [],
  sleepRecords: any[] = []
): PredictiveWellnessData {
  const forecast = generate7DayForecast(checkins, activities, sleepRecords);
  const risks = predictRisks(checkins);
  const goalProbabilities = calculateGoalProbabilities(checkins, activities);
  const optimalWeekPlan = generateOptimalWeekPlan(checkins, activities);

  return {
    forecast,
    risks,
    goalProbabilities,
    optimalWeekPlan
  };
}

function generate7DayForecast(
  checkins: any[],
  activities: any[],
  sleepRecords: any[]
): WellnessForecast[] {
  const recentData = checkins.slice(0, 14); // Últimas 2 semanas
  const forecast: WellnessForecast[] = [];

  // Calcular tendências
  const trends = calculateTrends(recentData);
  
  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);
    
    // Modelo preditivo simplificado baseado em médias móveis e tendências
    const dayOfWeek = futureDate.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.95 : 1.05;
    
    const predictedFactors = {
      sleep: Math.max(1, Math.min(10, trends.sleep * weekendFactor + (Math.random() - 0.5) * 0.5)),
      exercise: trends.exercise * weekendFactor,
      stress: Math.max(1, Math.min(10, trends.stress + (dayOfWeek >= 1 && dayOfWeek <= 5 ? 0.5 : -0.5))),
      energy: Math.max(1, Math.min(10, trends.energy * weekendFactor))
    };

    const predictedScore = Math.round(
      (predictedFactors.sleep * 0.3) +
      (predictedFactors.exercise * 0.2) +
      ((11 - predictedFactors.stress) * 0.3) +
      (predictedFactors.energy * 0.2)
    ) * 10;

    const confidence = Math.max(0.5, 1 - (i * 0.1)); // Confiança diminui com tempo

    const risks: string[] = [];
    const recommendations: string[] = [];

    if (predictedFactors.stress > 7) {
      risks.push('Alto nível de stress previsto');
      recommendations.push('Agende atividades relaxantes');
    }
    if (predictedFactors.energy < 4) {
      risks.push('Baixa energia prevista');
      recommendations.push('Priorize sono de qualidade');
    }
    if (predictedFactors.sleep < 6) {
      risks.push('Qualidade de sono comprometida');
      recommendations.push('Mantenha rotina de sono');
    }

    forecast.push({
      date: futureDate.toISOString().split('T')[0],
      predictedScore,
      confidence,
      factors: predictedFactors,
      risks,
      recommendations
    });
  }

  return forecast;
}

function calculateTrends(recentData: any[]) {
  const avgSleep = recentData.reduce((sum, d) => sum + (d.sleep_quality || 5), 0) / recentData.length;
  const avgExercise = recentData.filter(d => d.exercise_completed).length / recentData.length * 10;
  const avgStress = recentData.reduce((sum, d) => sum + (d.stress_level || 5), 0) / recentData.length;
  const avgEnergy = recentData.reduce((sum, d) => sum + (d.energy_level || 5), 0) / recentData.length;

  return {
    sleep: avgSleep,
    exercise: avgExercise,
    stress: avgStress,
    energy: avgEnergy
  };
}

function predictRisks(checkins: any[]): RiskPrediction[] {
  const risks: RiskPrediction[] = [];
  const recent7Days = checkins.slice(0, 7);

  // Risco de Burnout
  const highStressDays = recent7Days.filter(d => d.stress_level >= 8).length;
  const lowEnergyDays = recent7Days.filter(d => d.energy_level <= 3).length;
  
  if (highStressDays >= 4 || lowEnergyDays >= 4) {
    risks.push({
      type: 'burnout',
      probability: Math.min(0.9, (highStressDays + lowEnergyDays) / 7),
      timeframe: '1-2 semanas',
      preventiveActions: [
        'Reduzir carga de trabalho',
        'Aumentar atividades relaxantes',
        'Melhorar qualidade do sono'
      ]
    });
  }

  // Risco de energia baixa
  if (lowEnergyDays >= 3) {
    risks.push({
      type: 'low_energy',
      probability: lowEnergyDays / 7,
      timeframe: 'próximos dias',
      preventiveActions: [
        'Melhorar hidratação',
        'Exercícios leves regulares',
        'Revisar qualidade do sono'
      ]
    });
  }

  return risks;
}

function calculateGoalProbabilities(checkins: any[], activities: any[]): GoalAchievementProbability[] {
  const probabilities: GoalAchievementProbability[] = [];

  // Probabilidade de exercício regular
  const exerciseConsistency = checkins.filter(d => d.exercise_completed).length / checkins.length;
  const exerciseTrend = calculateExerciseTrend(checkins);

  probabilities.push({
    goalType: 'Exercício Regular',
    probability: Math.min(0.95, exerciseConsistency * 0.7 + exerciseTrend * 0.3),
    factors: {
      consistency: exerciseConsistency,
      trend: exerciseTrend,
      motivation: checkins.reduce((sum, d) => sum + (d.mood_rating || 5), 0) / checkins.length / 10
    },
    recommendations: [
      exerciseConsistency < 0.5 ? 'Comece com 15min de caminhada diária' : 'Continue mantendo a consistência',
      'Defina horários fixos para exercícios',
      'Encontre atividades que você goste'
    ]
  });

  return probabilities;
}

function calculateExerciseTrend(checkins: any[]): number {
  const recent = checkins.slice(0, 7);
  const previous = checkins.slice(7, 14);
  
  const recentRate = recent.filter(d => d.exercise_completed).length / recent.length;
  const previousRate = previous.filter(d => d.exercise_completed).length / Math.max(previous.length, 1);
  
  return Math.max(-1, Math.min(1, recentRate - previousRate));
}

function generateOptimalWeekPlan(checkins: any[], activities: any[]) {
  const plan = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    
    let focus = '';
    let activities_list: string[] = [];
    let restLevel = 5;
    
    switch (dayOfWeek) {
      case 1: // Segunda
        focus = 'Planejamento e energia';
        activities_list = ['Exercício moderado', 'Definir metas da semana'];
        restLevel = 3;
        break;
      case 2: // Terça
        focus = 'Produtividade';
        activities_list = ['Foco em tarefas importantes', 'Exercício leve'];
        restLevel = 2;
        break;
      case 3: // Quarta
        focus = 'Equilíbrio';
        activities_list = ['Exercício regular', 'Tempo para hobbies'];
        restLevel = 4;
        break;
      case 4: // Quinta
        focus = 'Intensidade';
        activities_list = ['Exercício intenso', 'Conclusão de projetos'];
        restLevel = 2;
        break;
      case 5: // Sexta
        focus = 'Finalização';
        activities_list = ['Exercício leve', 'Socialização'];
        restLevel = 5;
        break;
      case 6: // Sábado
        focus = 'Recreação';
        activities_list = ['Atividades ao ar livre', 'Tempo em família'];
        restLevel = 7;
        break;
      case 0: // Domingo
        focus = 'Recuperação';
        activities_list = ['Descanso ativo', 'Preparação para semana'];
        restLevel = 8;
        break;
    }
    
    plan.push({
      date: date.toISOString().split('T')[0],
      activities: activities_list,
      focus,
      restLevel
    });
  }
  
  return plan;
}
