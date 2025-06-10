
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';

interface BehavioralPattern {
  pattern: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  suggestion: string;
  confidence: number;
}

export function useBehavioralPatterns() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();
  const { data: activities } = useActivities();

  return useQuery({
    queryKey: ['behavioral-patterns', user?.id],
    queryFn: () => analyzeBehavioralPatterns(last30Days, activities),
    enabled: !!user && last30Days && last30Days.length >= 14,
    staleTime: 4 * 60 * 60 * 1000, // 4 horas
  });
}

function analyzeBehavioralPatterns(
  checkins: any[] = [],
  activities: any[] = []
): BehavioralPattern[] {
  const patterns: BehavioralPattern[] = [];

  // Análise de padrão de exercício matinal vs noturno
  const morningWorkouts = activities?.filter(a => {
    const hour = new Date(a.completed_at).getHours();
    return hour >= 6 && hour <= 10;
  }) || [];
  
  const eveningWorkouts = activities?.filter(a => {
    const hour = new Date(a.completed_at).getHours();
    return hour >= 18 && hour <= 22;
  }) || [];

  if (morningWorkouts.length > eveningWorkouts.length && morningWorkouts.length >= 5) {
    patterns.push({
      pattern: 'Exercício Matinal',
      frequency: morningWorkouts.length,
      impact: 'positive',
      description: 'Você prefere exercitar-se pela manhã, o que está associado a melhor humor',
      suggestion: 'Continue mantendo essa rotina matinal para maximizar os benefícios',
      confidence: 85
    });
  }

  // Padrão de hidratação nos fins de semana
  const weekendCheckins = checkins.filter(c => {
    const day = new Date(c.checkin_date).getDay();
    return day === 0 || day === 6; // Domingo ou sábado
  });
  
  const weekdayCheckins = checkins.filter(c => {
    const day = new Date(c.checkin_date).getDay();
    return day >= 1 && day <= 5;
  });

  if (weekendCheckins.length >= 4 && weekdayCheckins.length >= 10) {
    const weekendHydration = weekendCheckins.reduce((sum, c) => sum + (c.hydration_glasses || 0), 0) / weekendCheckins.length;
    const weekdayHydration = weekdayCheckins.reduce((sum, c) => sum + (c.hydration_glasses || 0), 0) / weekdayCheckins.length;
    
    if (weekendHydration < weekdayHydration - 2) {
      patterns.push({
        pattern: 'Hidratação Irregular nos Fins de Semana',
        frequency: weekendCheckins.length,
        impact: 'negative',
        description: 'Sua hidratação diminui significativamente nos fins de semana',
        suggestion: 'Configure lembretes para beber água também nos fins de semana',
        confidence: 78
      });
    }
  }

  // Padrão de humor pós-exercício
  const exerciseDays = checkins.filter(c => 
    c.exercise_completed || activities?.some(a => 
      new Date(a.completed_at).toDateString() === new Date(c.checkin_date).toDateString()
    )
  );
  
  if (exerciseDays.length >= 8) {
    const avgMoodOnExerciseDays = exerciseDays.reduce((sum, c) => sum + (c.mood_rating || 5), 0) / exerciseDays.length;
    const nonExerciseDays = checkins.filter(c => !exerciseDays.includes(c));
    const avgMoodOnNonExerciseDays = nonExerciseDays.length > 0 ? 
      nonExerciseDays.reduce((sum, c) => sum + (c.mood_rating || 5), 0) / nonExerciseDays.length : 5;
    
    if (avgMoodOnExerciseDays > avgMoodOnNonExerciseDays + 1) {
      patterns.push({
        pattern: 'Humor Elevado Pós-Exercício',
        frequency: exerciseDays.length,
        impact: 'positive',
        description: `Seu humor é ${(avgMoodOnExerciseDays - avgMoodOnNonExerciseDays).toFixed(1)} pontos maior em dias de exercício`,
        suggestion: 'Use exercícios como estratégia para melhorar o humor em dias difíceis',
        confidence: 92
      });
    }
  }

  // Padrão de stress semanal
  const stressPerDay = checkins.reduce((acc, c) => {
    const day = new Date(c.checkin_date).getDay();
    if (!acc[day]) acc[day] = [];
    if (c.stress_level) acc[day].push(c.stress_level);
    return acc;
  }, {} as Record<number, number[]>);

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  let maxStressDay = -1;
  let maxStressLevel = 0;

  Object.entries(stressPerDay).forEach(([day, levels]) => {
    if (levels.length >= 3) {
      const avgStress = levels.reduce((sum, l) => sum + l, 0) / levels.length;
      if (avgStress > maxStressLevel) {
        maxStressLevel = avgStress;
        maxStressDay = parseInt(day);
      }
    }
  });

  if (maxStressDay !== -1 && maxStressLevel >= 7) {
    patterns.push({
      pattern: `Pico de Stress nas ${dayNames[maxStressDay]}s`,
      frequency: stressPerDay[maxStressDay].length,
      impact: 'negative',
      description: `${dayNames[maxStressDay]} é consistentemente seu dia mais estressante`,
      suggestion: `Planeje atividades relaxantes para ${dayNames[maxStressDay]}s`,
      confidence: 88
    });
  }

  return patterns.slice(0, 5); // Máximo 5 padrões
}
