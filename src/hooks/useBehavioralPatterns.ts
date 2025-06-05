
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useExtendedDailyActivity } from '@/hooks/useExtendedDailyActivity';

interface HabitStrength {
  habit: string;
  strength: number; // 0-100
  consistency: number;
  streak: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface BehaviorTrigger {
  trigger: string;
  effect: string;
  confidence: number;
  examples: string[];
}

interface WeeklyPattern {
  day: string;
  patterns: {
    exercise: number;
    mood: number;
    energy: number;
    stress: number;
  };
  intensity: number;
}

interface HabitRecommendation {
  habit: string;
  reason: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedBenefit: string;
  implementation: string;
}

interface BehavioralPatternsData {
  weeklyHeatmap: WeeklyPattern[];
  habitStrengths: HabitStrength[];
  triggers: BehaviorTrigger[];
  recommendations: HabitRecommendation[];
  insights: string[];
}

export function useBehavioralPatterns() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: extendedActivity } = useExtendedDailyActivity(3); // 3 meses

  return useQuery({
    queryKey: ['behavioral-patterns', user?.id],
    queryFn: () => analyzeBehavioralPatterns(last30Days, extendedActivity),
    enabled: !!user && last30Days && last30Days.length >= 14,
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}

function analyzeBehavioralPatterns(
  checkins: any[],
  extendedActivity: any[] = []
): BehavioralPatternsData {
  const weeklyHeatmap = generateWeeklyHeatmap(checkins);
  const habitStrengths = analyzeHabitStrengths(checkins, extendedActivity);
  const triggers = identifyTriggers(checkins);
  const recommendations = generateHabitRecommendations(habitStrengths, triggers);
  const insights = generateBehavioralInsights(weeklyHeatmap, habitStrengths, triggers);

  return {
    weeklyHeatmap,
    habitStrengths,
    triggers,
    recommendations,
    insights
  };
}

function generateWeeklyHeatmap(checkins: any[]): WeeklyPattern[] {
  const dayMap = new Map<number, any[]>();
  
  // Agrupar check-ins por dia da semana
  checkins.forEach(checkin => {
    const date = new Date(checkin.checkin_date);
    const dayOfWeek = date.getDay();
    
    if (!dayMap.has(dayOfWeek)) {
      dayMap.set(dayOfWeek, []);
    }
    dayMap.get(dayOfWeek)!.push(checkin);
  });

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  return dayNames.map((day, index) => {
    const dayData = dayMap.get(index) || [];
    
    if (dayData.length === 0) {
      return {
        day,
        patterns: { exercise: 0, mood: 0, energy: 0, stress: 0 },
        intensity: 0
      };
    }

    const avgExercise = dayData.filter(d => d.exercise_completed).length / dayData.length;
    const avgMood = dayData.reduce((sum, d) => sum + (d.mood_rating || 0), 0) / dayData.length;
    const avgEnergy = dayData.reduce((sum, d) => sum + (d.energy_level || 0), 0) / dayData.length;
    const avgStress = dayData.reduce((sum, d) => sum + (d.stress_level || 0), 0) / dayData.length;

    const intensity = (avgExercise + (avgMood / 10) + (avgEnergy / 10) + ((10 - avgStress) / 10)) / 4;

    return {
      day,
      patterns: {
        exercise: avgExercise * 100,
        mood: avgMood * 10,
        energy: avgEnergy * 10,
        stress: (10 - avgStress) * 10 // Invertido para que maior = melhor
      },
      intensity: intensity * 100
    };
  });
}

function analyzeHabitStrengths(checkins: any[], extendedActivity: any[]): HabitStrength[] {
  const habits: HabitStrength[] = [];

  // Hábito de exercício
  const exerciseData = analyzeExerciseHabit(checkins);
  habits.push(exerciseData);

  // Hábito de hidratação
  const hydrationData = analyzeHydrationHabit(checkins);
  habits.push(hydrationData);

  // Hábito de sono
  const sleepData = analyzeSleepHabit(checkins);
  habits.push(sleepData);

  return habits;
}

function analyzeExerciseHabit(checkins: any[]): HabitStrength {
  const totalDays = checkins.length;
  const exerciseDays = checkins.filter(d => d.exercise_completed).length;
  const consistency = exerciseDays / totalDays;
  
  // Calcular streak atual
  let currentStreak = 0;
  for (const checkin of checkins) {
    if (checkin.exercise_completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calcular tendência (últimos 7 vs anteriores 7)
  const recent7 = checkins.slice(0, 7);
  const previous7 = checkins.slice(7, 14);
  const recentRate = recent7.filter(d => d.exercise_completed).length / 7;
  const previousRate = previous7.filter(d => d.exercise_completed).length / Math.max(previous7.length, 1);
  
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (recentRate > previousRate + 0.1) trend = 'increasing';
  else if (recentRate < previousRate - 0.1) trend = 'decreasing';

  return {
    habit: 'Exercício Regular',
    strength: consistency * 100,
    consistency,
    streak: currentStreak,
    trend
  };
}

function analyzeHydrationHabit(checkins: any[]): HabitStrength {
  const validCheckins = checkins.filter(d => d.hydration_glasses !== null);
  const avgHydration = validCheckins.reduce((sum, d) => sum + d.hydration_glasses, 0) / Math.max(validCheckins.length, 1);
  const consistency = validCheckins.filter(d => d.hydration_glasses >= 6).length / validCheckins.length;
  
  let currentStreak = 0;
  for (const checkin of checkins) {
    if (checkin.hydration_glasses >= 6) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    habit: 'Hidratação Adequada',
    strength: Math.min(100, (avgHydration / 8) * 100),
    consistency,
    streak: currentStreak,
    trend: 'stable'
  };
}

function analyzeSleepHabit(checkins: any[]): HabitStrength {
  const validCheckins = checkins.filter(d => d.sleep_quality !== null);
  const avgSleepQuality = validCheckins.reduce((sum, d) => sum + d.sleep_quality, 0) / Math.max(validCheckins.length, 1);
  const consistency = validCheckins.filter(d => d.sleep_quality >= 7).length / validCheckins.length;
  
  let currentStreak = 0;
  for (const checkin of checkins) {
    if (checkin.sleep_quality >= 7) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    habit: 'Sono de Qualidade',
    strength: avgSleepQuality * 10,
    consistency,
    streak: currentStreak,
    trend: 'stable'
  };
}

function identifyTriggers(checkins: any[]): BehaviorTrigger[] {
  const triggers: BehaviorTrigger[] = [];

  // Analisar correlação exercício -> humor
  const exerciseMoodCorr = analyzeExerciseMoodCorrelation(checkins);
  if (exerciseMoodCorr.confidence > 0.6) {
    triggers.push(exerciseMoodCorr);
  }

  // Analisar correlação sono -> energia
  const sleepEnergyCorr = analyzeSleepEnergyCorrelation(checkins);
  if (sleepEnergyCorr.confidence > 0.6) {
    triggers.push(sleepEnergyCorr);
  }

  // Analisar padrão de stress
  const stressPattern = analyzeStressPattern(checkins);
  if (stressPattern.confidence > 0.5) {
    triggers.push(stressPattern);
  }

  return triggers;
}

function analyzeExerciseMoodCorrelation(checkins: any[]): BehaviorTrigger {
  const exerciseDays = checkins.filter(d => d.exercise_completed && d.mood_rating);
  const noExerciseDays = checkins.filter(d => !d.exercise_completed && d.mood_rating);

  const avgMoodWithExercise = exerciseDays.reduce((sum, d) => sum + d.mood_rating, 0) / Math.max(exerciseDays.length, 1);
  const avgMoodWithoutExercise = noExerciseDays.reduce((sum, d) => sum + d.mood_rating, 0) / Math.max(noExerciseDays.length, 1);

  const difference = avgMoodWithExercise - avgMoodWithoutExercise;
  const confidence = Math.min(1, Math.abs(difference) / 3); // Normalizar diferença

  return {
    trigger: 'Exercício Físico',
    effect: difference > 1 ? 'Melhora significativa do humor' : 'Ligeira melhora do humor',
    confidence,
    examples: [
      `Humor médio com exercício: ${avgMoodWithExercise.toFixed(1)}`,
      `Humor médio sem exercício: ${avgMoodWithoutExercise.toFixed(1)}`
    ]
  };
}

function analyzeSleepEnergyCorrelation(checkins: any[]): BehaviorTrigger {
  const validCheckins = checkins.filter(d => d.sleep_quality && d.energy_level);
  
  const highSleepDays = validCheckins.filter(d => d.sleep_quality >= 7);
  const lowSleepDays = validCheckins.filter(d => d.sleep_quality < 7);

  const avgEnergyHighSleep = highSleepDays.reduce((sum, d) => sum + d.energy_level, 0) / Math.max(highSleepDays.length, 1);
  const avgEnergyLowSleep = lowSleepDays.reduce((sum, d) => sum + d.energy_level, 0) / Math.max(lowSleepDays.length, 1);

  const difference = avgEnergyHighSleep - avgEnergyLowSleep;
  const confidence = Math.min(1, Math.abs(difference) / 4);

  return {
    trigger: 'Sono de Qualidade',
    effect: difference > 1.5 ? 'Aumento significativo da energia' : 'Ligeiro aumento da energia',
    confidence,
    examples: [
      `Energia com bom sono: ${avgEnergyHighSleep.toFixed(1)}`,
      `Energia com sono ruim: ${avgEnergyLowSleep.toFixed(1)}`
    ]
  };
}

function analyzeStressPattern(checkins: any[]): BehaviorTrigger {
  const weekdayStress = checkins
    .filter(d => {
      const date = new Date(d.checkin_date);
      const day = date.getDay();
      return day >= 1 && day <= 5 && d.stress_level;
    })
    .reduce((sum, d) => sum + d.stress_level, 0) / 
    Math.max(checkins.filter(d => {
      const date = new Date(d.checkin_date);
      const day = date.getDay();
      return day >= 1 && day <= 5 && d.stress_level;
    }).length, 1);

  const weekendStress = checkins
    .filter(d => {
      const date = new Date(d.checkin_date);
      const day = date.getDay();
      return (day === 0 || day === 6) && d.stress_level;
    })
    .reduce((sum, d) => sum + d.stress_level, 0) / 
    Math.max(checkins.filter(d => {
      const date = new Date(d.checkin_date);
      const day = date.getDay();
      return (day === 0 || day === 6) && d.stress_level;
    }).length, 1);

  const difference = weekdayStress - weekendStress;
  const confidence = Math.min(1, Math.abs(difference) / 3);

  return {
    trigger: 'Dias da Semana',
    effect: difference > 1 ? 'Aumento significativo do stress' : 'Ligeiro aumento do stress',
    confidence,
    examples: [
      `Stress em dias úteis: ${weekdayStress.toFixed(1)}`,
      `Stress nos fins de semana: ${weekendStress.toFixed(1)}`
    ]
  };
}

function generateHabitRecommendations(habits: HabitStrength[], triggers: BehaviorTrigger[]): HabitRecommendation[] {
  const recommendations: HabitRecommendation[] = [];

  // Recomendações baseadas na força dos hábitos
  habits.forEach(habit => {
    if (habit.strength < 50) {
      switch (habit.habit) {
        case 'Exercício Regular':
          recommendations.push({
            habit: 'Caminhada Diária',
            reason: 'Seu hábito de exercício precisa ser fortalecido',
            difficulty: 'easy',
            expectedBenefit: 'Melhora do humor e energia',
            implementation: 'Comece com 15 minutos de caminhada após o almoço'
          });
          break;
        case 'Hidratação Adequada':
          recommendations.push({
            habit: 'Lembretes de Água',
            reason: 'Sua hidratação está abaixo do ideal',
            difficulty: 'easy',
            expectedBenefit: 'Mais energia e melhor concentração',
            implementation: 'Configure alarmes a cada 2 horas para beber água'
          });
          break;
        case 'Sono de Qualidade':
          recommendations.push({
            habit: 'Rotina de Sono',
            reason: 'A qualidade do seu sono pode melhorar',
            difficulty: 'medium',
            expectedBenefit: 'Mais energia e melhor humor',
            implementation: 'Estabeleça horário fixo para dormir e acordar'
          });
          break;
      }
    }
  });

  // Recomendações baseadas em triggers
  triggers.forEach(trigger => {
    if (trigger.confidence > 0.7) {
      if (trigger.trigger === 'Exercício Físico' && trigger.effect.includes('Melhora')) {
        recommendations.push({
          habit: 'Exercício Matinal',
          reason: 'Exercício melhora significativamente seu humor',
          difficulty: 'medium',
          expectedBenefit: 'Humor positivo durante todo o dia',
          implementation: 'Reserve 30 minutos pela manhã para atividade física'
        });
      }
    }
  });

  return recommendations.slice(0, 4); // Máximo 4 recomendações
}

function generateBehavioralInsights(
  heatmap: WeeklyPattern[],
  habits: HabitStrength[],
  triggers: BehaviorTrigger[]
): string[] {
  const insights: string[] = [];

  // Insight sobre dia da semana com melhor performance
  const bestDay = heatmap.reduce((best, current) => 
    current.intensity > best.intensity ? current : best
  );
  insights.push(`Sua melhor performance é às ${bestDay.day}s (${bestDay.intensity.toFixed(0)}% de intensidade)`);

  // Insight sobre hábito mais forte
  const strongestHabit = habits.reduce((strongest, current) => 
    current.strength > strongest.strength ? current : strongest
  );
  insights.push(`Seu hábito mais forte é: ${strongestHabit.habit} (${strongestHabit.strength.toFixed(0)}% de força)`);

  // Insight sobre trigger mais confiável
  if (triggers.length > 0) {
    const bestTrigger = triggers.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    insights.push(`${bestTrigger.trigger} tem o maior impacto: ${bestTrigger.effect}`);
  }

  // Insight sobre consistência geral
  const avgConsistency = habits.reduce((sum, h) => sum + h.consistency, 0) / habits.length;
  if (avgConsistency > 0.7) {
    insights.push('Você tem excelente consistência nos seus hábitos!');
  } else if (avgConsistency > 0.5) {
    insights.push('Sua consistência está boa, mas há espaço para melhorar');
  } else {
    insights.push('Foque em melhorar a consistência dos seus hábitos principais');
  }

  return insights;
}
