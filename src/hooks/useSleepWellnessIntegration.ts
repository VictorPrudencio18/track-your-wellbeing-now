
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useSleepRecords } from '@/hooks/useSleep';

interface SleepEnergyCorrelation {
  date: string;
  sleepQuality: number;
  sleepDuration: number;
  energyLevel: number;
  correlation: number;
}

interface SleepDebtData {
  currentDebt: number;
  weeklyDebt: number;
  recoveryDays: number;
  recommendations: string[];
}

interface SleepImpactAnalysis {
  moodImpact: {
    correlation: number;
    trend: 'positive' | 'negative' | 'neutral';
    insights: string[];
  };
  productivityImpact: {
    correlation: number;
    workSatisfactionChange: number;
    insights: string[];
  };
  physicalImpact: {
    energyCorrelation: number;
    exercisePerformance: number;
    insights: string[];
  };
}

interface OptimalSleepInsights {
  optimalBedtime: string;
  optimalWakeTime: string;
  idealDuration: number;
  consistencyScore: number;
  improvements: string[];
}

interface SleepWellnessData {
  correlations: SleepEnergyCorrelation[];
  sleepDebt: SleepDebtData;
  impactAnalysis: SleepImpactAnalysis;
  optimalInsights: OptimalSleepInsights;
}

export function useSleepWellnessIntegration() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: sleepRecords } = useSleepRecords();

  return useQuery({
    queryKey: ['sleep-wellness-integration', user?.id],
    queryFn: () => analyzeSleepWellnessIntegration(last30Days, sleepRecords),
    enabled: !!user && last30Days && last30Days.length >= 7,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}

function analyzeSleepWellnessIntegration(
  checkins: any[] = [],
  sleepRecords: any[] = []
): SleepWellnessData {
  const correlations = calculateSleepEnergyCorrelations(checkins, sleepRecords);
  const sleepDebt = calculateSleepDebt(sleepRecords);
  const impactAnalysis = analyzeSleepImpact(checkins, sleepRecords);
  const optimalInsights = generateOptimalSleepInsights(checkins, sleepRecords);

  return {
    correlations,
    sleepDebt,
    impactAnalysis,
    optimalInsights
  };
}

function calculateSleepEnergyCorrelations(
  checkins: any[],
  sleepRecords: any[]
): SleepEnergyCorrelation[] {
  const correlations: SleepEnergyCorrelation[] = [];

  checkins.forEach(checkin => {
    const sleepRecord = sleepRecords.find(sleep => 
      sleep.sleep_date === checkin.checkin_date
    );

    if (sleepRecord && checkin.energy_level) {
      const sleepQuality = sleepRecord.subjective_quality || checkin.sleep_quality || 5;
      const sleepDuration = sleepRecord.sleep_duration || (checkin.sleep_hours * 60) || 480;
      
      // Calcular correlação simples
      const correlation = calculateSimpleCorrelation(sleepQuality, checkin.energy_level);

      correlations.push({
        date: checkin.checkin_date,
        sleepQuality,
        sleepDuration,
        energyLevel: checkin.energy_level,
        correlation
      });
    }
  });

  return correlations.slice(0, 14); // Últimas 2 semanas
}

function calculateSleepDebt(sleepRecords: any[]): SleepDebtData {
  const targetSleep = 480; // 8 horas em minutos
  const recent7Days = sleepRecords.slice(0, 7);
  
  let totalDebt = 0;
  let weeklyDebt = 0;
  
  recent7Days.forEach(record => {
    if (record.sleep_duration) {
      const debt = Math.max(0, targetSleep - record.sleep_duration);
      totalDebt += debt;
      weeklyDebt += debt;
    }
  });

  const currentDebt = recent7Days[0]?.sleep_duration 
    ? Math.max(0, targetSleep - recent7Days[0].sleep_duration)
    : 0;

  const recoveryDays = Math.ceil(totalDebt / 60); // Horas para dias

  const recommendations = [];
  if (totalDebt > 300) { // Mais de 5 horas de déficit
    recommendations.push('Priorize dormir 30min mais cedo por alguns dias');
    recommendations.push('Evite cafeína após 14h');
  }
  if (weeklyDebt > 120) { // Mais de 2 horas na semana
    recommendations.push('Mantenha horários consistentes de sono');
  }

  return {
    currentDebt: Math.round(currentDebt / 60 * 10) / 10, // Converter para horas
    weeklyDebt: Math.round(weeklyDebt / 60 * 10) / 10,
    recoveryDays,
    recommendations
  };
}

function analyzeSleepImpact(checkins: any[], sleepRecords: any[]): SleepImpactAnalysis {
  const paired = checkins
    .map(checkin => {
      const sleepRecord = sleepRecords.find(sleep => 
        sleep.sleep_date === checkin.checkin_date
      );
      return {
        sleepQuality: sleepRecord?.subjective_quality || checkin.sleep_quality,
        mood: checkin.mood_rating,
        energy: checkin.energy_level,
        workSatisfaction: checkin.work_satisfaction,
        stress: checkin.stress_level
      };
    })
    .filter(pair => pair.sleepQuality && pair.mood);

  const moodCorrelation = calculateCorrelation(
    paired.map(p => p.sleepQuality),
    paired.map(p => p.mood)
  );

  const energyCorrelation = calculateCorrelation(
    paired.map(p => p.sleepQuality),
    paired.map(p => p.energy)
  );

  const workCorrelation = calculateCorrelation(
    paired.map(p => p.sleepQuality),
    paired.map(p => p.workSatisfaction).filter(Boolean)
  );

  return {
    moodImpact: {
      correlation: moodCorrelation,
      trend: moodCorrelation > 0.3 ? 'positive' : moodCorrelation < -0.3 ? 'negative' : 'neutral',
      insights: moodCorrelation > 0.3 
        ? ['Sono de qualidade melhora significativamente seu humor']
        : ['Trabalhe na qualidade do sono para melhorar o humor']
    },
    productivityImpact: {
      correlation: workCorrelation,
      workSatisfactionChange: workCorrelation * 10,
      insights: workCorrelation > 0.2 
        ? ['Bom sono aumenta sua satisfação no trabalho']
        : ['Sono ruim pode estar impactando sua produtividade']
    },
    physicalImpact: {
      energyCorrelation,
      exercisePerformance: energyCorrelation * 15,
      insights: energyCorrelation > 0.4 
        ? ['Sono adequado mantém seus níveis de energia altos']
        : ['Melhore o sono para ter mais energia para exercícios']
    }
  };
}

function generateOptimalSleepInsights(checkins: any[], sleepRecords: any[]): OptimalSleepInsights {
  const bestPerformanceDays = checkins
    .filter(c => c.energy_level >= 8 && c.mood_rating >= 8)
    .map(c => {
      const sleep = sleepRecords.find(s => s.sleep_date === c.checkin_date);
      return sleep;
    })
    .filter(Boolean);

  const avgBedtime = bestPerformanceDays.length > 0
    ? calculateAverageTime(bestPerformanceDays.map(s => s.bedtime).filter(Boolean))
    : '22:30';

  const avgWakeTime = bestPerformanceDays.length > 0
    ? calculateAverageTime(bestPerformanceDays.map(s => s.wake_time).filter(Boolean))
    : '06:30';

  const avgDuration = bestPerformanceDays.length > 0
    ? bestPerformanceDays.reduce((sum, s) => sum + (s.sleep_duration || 480), 0) / bestPerformanceDays.length
    : 480;

  const consistencyScore = calculateSleepConsistency(sleepRecords);

  const improvements = [];
  if (consistencyScore < 70) {
    improvements.push('Mantenha horários mais consistentes');
  }
  if (avgDuration < 420) {
    improvements.push('Aumente a duração do sono');
  }
  improvements.push('Continue monitorando padrões de sono');

  return {
    optimalBedtime: avgBedtime,
    optimalWakeTime: avgWakeTime,
    idealDuration: Math.round(avgDuration),
    consistencyScore,
    improvements
  };
}

function calculateSimpleCorrelation(x: number, y: number): number {
  return (x * y) / 100; // Correlação simplificada
}

function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0;

  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : Math.max(-1, Math.min(1, numerator / denominator));
}

function calculateAverageTime(times: string[]): string {
  if (times.length === 0) return '22:30';
  
  const minutes = times.map(time => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  });

  const avgMinutes = minutes.reduce((sum, m) => sum + m, 0) / minutes.length;
  const hours = Math.floor(avgMinutes / 60);
  const mins = Math.round(avgMinutes % 60);

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function calculateSleepConsistency(sleepRecords: any[]): number {
  const recent14Days = sleepRecords.slice(0, 14);
  if (recent14Days.length < 7) return 50;

  const bedtimes = recent14Days.map(s => s.bedtime).filter(Boolean);
  const waketimes = recent14Days.map(s => s.wake_time).filter(Boolean);

  if (bedtimes.length < 5) return 50;

  // Calcular variação nos horários
  const bedtimeVariation = calculateTimeVariation(bedtimes);
  const waketimeVariation = calculateTimeVariation(waketimes);

  const avgVariation = (bedtimeVariation + waketimeVariation) / 2;
  
  // Converter variação em score (menor variação = maior score)
  return Math.max(0, 100 - avgVariation * 2);
}

function calculateTimeVariation(times: string[]): number {
  const minutes = times.map(time => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  });

  const avg = minutes.reduce((sum, m) => sum + m, 0) / minutes.length;
  const variance = minutes.reduce((sum, m) => sum + Math.pow(m - avg, 2), 0) / minutes.length;
  
  return Math.sqrt(variance); // Desvio padrão em minutos
}
