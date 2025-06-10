import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useSleepRecords } from '@/hooks/useSleepRecords';

interface CorrelationInsight {
  type: 'positive' | 'negative' | 'neutral';
  factor1: string;
  factor2: string;
  correlation: number;
  description: string;
  actionable: string;
  confidence: number;
}

interface CorrelationData {
  insights: CorrelationInsight[];
  patterns: {
    sleepEnergy: number;
    exerciseMood: number;
    stressSleep: number;
    weatherMood: number;
  };
  triggers: {
    positive: string[];
    negative: string[];
  };
}

export function useCorrelationAnalysis() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: activities } = useActivities();
  const { sleepRecords } = useSleepRecords();

  return useQuery({
    queryKey: ['correlation-analysis', user?.id],
    queryFn: () => analyzeCorrelations(last30Days, activities || [], sleepRecords || []),
    enabled: !!user && last30Days && last30Days.length >= 7,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}

function analyzeCorrelations(
  checkins: any[] = [],
  activities: any[] = [],
  sleepRecords: any[] = []
): CorrelationData {
  const insights: CorrelationInsight[] = [];
  
  // Correlação Sono vs Energia
  const sleepEnergyCorr = calculateSleepEnergyCorrelation(checkins, sleepRecords);
  if (Math.abs(sleepEnergyCorr) > 0.3) {
    insights.push({
      type: sleepEnergyCorr > 0 ? 'positive' : 'negative',
      factor1: 'Qualidade do Sono',
      factor2: 'Nível de Energia',
      correlation: sleepEnergyCorr,
      description: sleepEnergyCorr > 0 
        ? 'Noites bem dormidas aumentam significativamente sua energia'
        : 'Sono ruim está impactando negativamente sua energia',
      actionable: sleepEnergyCorr > 0 
        ? 'Continue priorizando 7-8h de sono de qualidade'
        : 'Foque em melhorar sua higiene do sono',
      confidence: Math.abs(sleepEnergyCorr) * 100
    });
  }

  // Correlação Exercício vs Humor
  const exerciseMoodCorr = calculateExerciseMoodCorrelation(checkins, activities);
  if (Math.abs(exerciseMoodCorr) > 0.25) {
    insights.push({
      type: exerciseMoodCorr > 0 ? 'positive' : 'negative',
      factor1: 'Exercício Físico',
      factor2: 'Humor',
      correlation: exerciseMoodCorr,
      description: exerciseMoodCorr > 0 
        ? 'Exercícios regulares melhoram consistentemente seu humor'
        : 'Falta de exercício pode estar afetando seu humor',
      actionable: 'Mantenha uma rotina de exercícios de 30min, 3-4x por semana',
      confidence: Math.abs(exerciseMoodCorr) * 100
    });
  }

  // Correlação Stress vs Sono
  const stressSleepCorr = calculateStressSleepCorrelation(checkins, sleepRecords);
  if (Math.abs(stressSleepCorr) > 0.3) {
    insights.push({
      type: 'negative',
      factor1: 'Nível de Stress',
      factor2: 'Qualidade do Sono',
      correlation: stressSleepCorr,
      description: 'Alto stress está prejudicando significativamente seu sono',
      actionable: 'Pratique técnicas de relaxamento antes de dormir',
      confidence: Math.abs(stressSleepCorr) * 100
    });
  }

  // Identificar gatilhos
  const triggers = identifyTriggers(checkins, activities);

  return {
    insights: insights.slice(0, 5), // Top 5 insights
    patterns: {
      sleepEnergy: sleepEnergyCorr,
      exerciseMood: exerciseMoodCorr,
      stressSleep: stressSleepCorr,
      weatherMood: 0 // Placeholder para dados climáticos futuros
    },
    triggers
  };
}

function calculateSleepEnergyCorrelation(checkins: any[], sleepRecords: any[]): number {
  const paired = checkins
    .map(checkin => {
      const sleepRecord = sleepRecords.find(sleep => 
        sleep.sleep_date === checkin.checkin_date
      );
      return {
        energy: checkin.energy_level,
        sleepQuality: sleepRecord?.subjective_quality || checkin.sleep_quality,
        sleepScore: sleepRecord?.calculated_scores?.overall_score
      };
    })
    .filter(pair => pair.energy && (pair.sleepQuality || pair.sleepScore));

  if (paired.length < 5) return 0;

  const energyValues = paired.map(p => p.energy);
  const sleepValues = paired.map(p => p.sleepScore || p.sleepQuality * 20);

  return calculatePearsonCorrelation(energyValues, sleepValues);
}

function calculateExerciseMoodCorrelation(checkins: any[], activities: any[]): number {
  const paired = checkins
    .map(checkin => {
      const hasExercise = checkin.exercise_completed || 
        activities.some(act => 
          new Date(act.completed_at).toDateString() === new Date(checkin.checkin_date).toDateString()
        );
      return {
        mood: checkin.mood_rating,
        exercise: hasExercise ? 1 : 0
      };
    })
    .filter(pair => pair.mood);

  if (paired.length < 5) return 0;

  const moodValues = paired.map(p => p.mood);
  const exerciseValues = paired.map(p => p.exercise);

  return calculatePearsonCorrelation(exerciseValues, moodValues);
}

function calculateStressSleepCorrelation(checkins: any[], sleepRecords: any[]): number {
  const paired = checkins
    .map(checkin => {
      const sleepRecord = sleepRecords.find(sleep => 
        sleep.sleep_date === checkin.checkin_date
      );
      return {
        stress: checkin.stress_level,
        sleepQuality: sleepRecord?.subjective_quality || checkin.sleep_quality
      };
    })
    .filter(pair => pair.stress && pair.sleepQuality);

  if (paired.length < 5) return 0;

  const stressValues = paired.map(p => p.stress);
  const sleepValues = paired.map(p => p.sleepQuality);

  return calculatePearsonCorrelation(stressValues, sleepValues) * -1; // Inverter pois stress alto = sono ruim
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

  return denominator === 0 ? 0 : Math.max(-1, Math.min(1, numerator / denominator));
}

function identifyTriggers(checkins: any[], activities: any[]): { positive: string[], negative: string[] } {
  const positive: string[] = [];
  const negative: string[] = [];

  // Analisar dias com humor muito alto (>8)
  const goodDays = checkins.filter(c => c.mood_rating >= 8);
  const badDays = checkins.filter(c => c.mood_rating <= 3);

  // Gatilhos positivos
  if (goodDays.filter(d => d.exercise_completed).length / goodDays.length > 0.7) {
    positive.push('Exercício físico');
  }
  if (goodDays.filter(d => d.sleep_quality >= 4).length / goodDays.length > 0.7) {
    positive.push('Sono de qualidade');
  }
  if (goodDays.filter(d => d.hydration_glasses >= 6).length / goodDays.length > 0.7) {
    positive.push('Boa hidratação');
  }

  // Gatilhos negativos
  if (badDays.filter(d => d.stress_level >= 8).length / badDays.length > 0.6) {
    negative.push('Alto nível de stress');
  }
  if (badDays.filter(d => d.sleep_quality <= 2).length / badDays.length > 0.6) {
    negative.push('Sono de má qualidade');
  }
  if (badDays.filter(d => !d.exercise_completed).length / badDays.length > 0.8) {
    negative.push('Falta de exercício');
  }

  return { positive, negative };
}
