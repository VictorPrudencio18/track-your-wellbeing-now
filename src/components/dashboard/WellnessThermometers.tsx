
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMicroCheckins } from '@/hooks/useMicroCheckins';
import { ThermometerWidget } from '@/components/wellness/ThermometerWidget';
import { CounterWidget } from '@/components/wellness/CounterWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Heart, 
  Zap, 
  Brain, 
  Droplets, 
  Activity,
  Smile,
  AlertTriangle,
  Sun,
  TrendingUp
} from 'lucide-react';

const scoreColors = {
  mental_health: 'text-purple-400',
  vitality: 'text-green-400',
  hydration: 'text-blue-400',
  work_life_balance: 'text-orange-400',
  self_care: 'text-pink-400'
};

const scoreIcons = {
  mental_health: Brain,
  vitality: Zap,
  hydration: Droplets,
  work_life_balance: Sun,
  self_care: Heart
};

const scoreNames = {
  mental_health: 'Saúde Mental',
  vitality: 'Vitalidade',
  hydration: 'Hidratação',
  work_life_balance: 'Equilíbrio',
  self_care: 'Autocuidado'
};

export function WellnessThermometers() {
  const { todayCheckins, wellnessScores, submitCheckin } = useMicroCheckins();
  const isMobile = useIsMobile();

  // Preparar dados dos check-ins rápidos simplificados
  const quickThermometers = [
    {
      key: 'mood_quick',
      title: 'Humor Agora',
      type: 'thermometer' as const,
      icon: Smile,
      color: 'orange' as const,
      maxValue: 10,
      labels: ['Péssimo', 'Ruim', 'Baixo', 'Neutro', 'OK', 'Bom', 'Bem', 'Muito bem', 'Ótimo', 'Excelente'],
      currentValue: todayCheckins.find(c => c.metric_key === 'mood_check')?.value
    }
  ];

  const quickCounters = [
    {
      key: 'water_quick',
      title: 'Água Hoje',
      type: 'counter' as const,
      icon: Droplets,
      color: 'blue' as const,
      unit: 'copos',
      maxValue: 12,
      currentValue: todayCheckins.find(c => c.metric_key === 'water_intake_check')?.value || 0
    }
  ];

  const handleQuickSubmit = async (key: string, value: number) => {
    const metricKeyMap: { [key: string]: string } = {
      'mood_quick': 'mood_check',
      'water_quick': 'water_intake_check'
    };

    const metricKey = metricKeyMap[key];
    if (!metricKey) return;

    await submitCheckin.mutateAsync({
      metricKey,
      value,
      checkinType: key === 'water_quick' ? 'counter' : 'thermometer',
      maxValue: key === 'water_quick' ? 12 : 10,
      context: {
        source: 'dashboard_quick',
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Smile className="w-5 h-5 text-accent-orange" />
          Check-ins Rápidos
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className={`grid gap-4 ${
          isMobile 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : 'grid-cols-1 sm:grid-cols-2'
        }`}>
          {/* Termômetros */}
          {quickThermometers.map((thermo) => (
            <div key={thermo.key} className="w-full">
              <ThermometerWidget
                title={thermo.title}
                value={thermo.currentValue}
                maxValue={thermo.maxValue}
                labels={thermo.labels}
                icon={thermo.icon}
                color={thermo.color}
                onSubmit={(value) => handleQuickSubmit(thermo.key, value)}
                size="sm"
              />
            </div>
          ))}

          {/* Contadores */}
          {quickCounters.map((counter) => (
            <div key={counter.key} className="w-full">
              <CounterWidget
                title={counter.title}
                value={counter.currentValue}
                unit={counter.unit}
                maxValue={counter.maxValue}
                icon={counter.icon}
                color={counter.color}
                onSubmit={(value) => handleQuickSubmit(counter.key, value)}
                size="sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
