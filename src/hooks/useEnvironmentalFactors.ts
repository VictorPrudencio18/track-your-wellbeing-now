
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';

interface EnvironmentalFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  correlation: number;
  description: string;
  suggestion: string;
  dataPoints: number;
}

export function useEnvironmentalFactors() {
  const { user } = useAuth();
  const { last30Days } = useDailyCheckins();

  return useQuery({
    queryKey: ['environmental-factors', user?.id],
    queryFn: () => analyzeEnvironmentalFactors(last30Days),
    enabled: !!user && last30Days && last30Days.length >= 14,
    staleTime: 6 * 60 * 60 * 1000, // 6 horas
  });
}

function analyzeEnvironmentalFactors(checkins: any[] = []): EnvironmentalFactor[] {
  const factors: EnvironmentalFactor[] = [];

  // Análise de padrões temporais (dia da semana)
  const moodByWeekday = checkins.reduce((acc, checkin) => {
    const day = new Date(checkin.checkin_date).getDay();
    if (!acc[day]) acc[day] = [];
    if (checkin.mood_rating) acc[day].push(checkin.mood_rating);
    return acc;
  }, {} as Record<number, number[]>);

  const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  Object.entries(moodByWeekday).forEach(([day, moods]) => {
    if (moods.length >= 3) {
      const avgMood = moods.reduce((sum, m) => sum + m, 0) / moods.length;
      const dayName = weekdayNames[parseInt(day)];
      
      if (avgMood >= 7.5) {
        factors.push({
          factor: `${dayName}s`,
          impact: 'positive',
          correlation: 0.7,
          description: `Seu humor é consistentemente melhor nas ${dayName.toLowerCase()}s`,
          suggestion: `Planeje atividades importantes para ${dayName.toLowerCase()}s`,
          dataPoints: moods.length
        });
      } else if (avgMood <= 4.5) {
        factors.push({
          factor: `${dayName}s`,
          impact: 'negative',
          correlation: -0.6,
          description: `${dayName}s tendem a ser dias mais desafiadores para você`,
          suggestion: `Prepare estratégias extras de autocuidado para ${dayName.toLowerCase()}s`,
          dataPoints: moods.length
        });
      }
    }
  });

  // Análise de padrões sazonais (simulado baseado em data)
  const seasonalMood = checkins.reduce((acc, checkin) => {
    const month = new Date(checkin.checkin_date).getMonth();
    const season = Math.floor(month / 3); // 0=verão, 1=outono, 2=inverno, 3=primavera
    if (!acc[season]) acc[season] = [];
    if (checkin.mood_rating) acc[season].push(checkin.mood_rating);
    return acc;
  }, {} as Record<number, number[]>);

  const seasonNames = ['Verão', 'Outono', 'Inverno', 'Primavera'];
  
  Object.entries(seasonalMood).forEach(([season, moods]) => {
    if (moods.length >= 5) {
      const avgMood = moods.reduce((sum, m) => sum + m, 0) / moods.length;
      const seasonName = seasonNames[parseInt(season)];
      
      if (avgMood >= 7) {
        factors.push({
          factor: seasonName,
          impact: 'positive',
          correlation: 0.6,
          description: `Você se sente melhor durante o ${seasonName.toLowerCase()}`,
          suggestion: `Aproveite essa estação para atividades ao ar livre`,
          dataPoints: moods.length
        });
      }
    }
  });

  // Análise de padrões de sono e ambiente
  const sleepQualityData = checkins.filter(c => c.sleep_quality).map(c => ({
    quality: c.sleep_quality,
    mood: c.mood_rating || 5,
    energy: c.energy_level || 5
  }));

  if (sleepQualityData.length >= 10) {
    const highQualitySleep = sleepQualityData.filter(d => d.quality >= 4);
    const lowQualitySleep = sleepQualityData.filter(d => d.quality <= 2);
    
    if (highQualitySleep.length >= 5 && lowQualitySleep.length >= 3) {
      const highSleepMood = highQualitySleep.reduce((sum, d) => sum + d.mood, 0) / highQualitySleep.length;
      const lowSleepMood = lowQualitySleep.reduce((sum, d) => sum + d.mood, 0) / lowQualitySleep.length;
      
      if (highSleepMood - lowSleepMood >= 2) {
        factors.push({
          factor: 'Qualidade do Sono',
          impact: 'positive',
          correlation: 0.8,
          description: 'Há uma forte correlação entre qualidade do sono e seu bem-estar',
          suggestion: 'Continue priorizando uma boa higiene do sono',
          dataPoints: sleepQualityData.length
        });
      }
    }
  }

  // Análise de padrões sociais (fins de semana vs dias úteis)
  const weekendData = checkins.filter(c => {
    const day = new Date(c.checkin_date).getDay();
    return day === 0 || day === 6;
  });
  
  const weekdayData = checkins.filter(c => {
    const day = new Date(c.checkin_date).getDay();
    return day >= 1 && day <= 5;
  });

  if (weekendData.length >= 5 && weekdayData.length >= 10) {
    const weekendMood = weekendData.reduce((sum, c) => sum + (c.mood_rating || 5), 0) / weekendData.length;
    const weekdayMood = weekdayData.reduce((sum, c) => sum + (c.mood_rating || 5), 0) / weekdayData.length;
    
    if (weekendMood - weekdayMood >= 1.5) {
      factors.push({
        factor: 'Fins de Semana',
        impact: 'positive',
        correlation: 0.5,
        description: 'Você se sente significativamente melhor nos fins de semana',
        suggestion: 'Incorpore elementos de lazer dos fins de semana nos dias úteis',
        dataPoints: weekendData.length + weekdayData.length
      });
    }
  }

  return factors.slice(0, 4); // Máximo 4 fatores
}
