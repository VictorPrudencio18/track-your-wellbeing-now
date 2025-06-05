
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMicroCheckins } from '@/hooks/useMicroCheckins';
import { ThermometerWidget } from '@/components/wellness/ThermometerWidget';
import { CounterWidget } from '@/components/wellness/CounterWidget';
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

  // Preparar dados dos termômetros rápidos
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
    },
    {
      key: 'stress_quick',
      title: 'Stress Atual',
      type: 'thermometer' as const,
      icon: AlertTriangle,
      color: 'red' as const,
      maxValue: 10,
      labels: ['Zen', 'Calmo', 'Tranquilo', 'Relaxado', 'Neutro', 'Tenso', 'Agitado', 'Estressado', 'Muito tenso', 'Exaustão'],
      currentValue: todayCheckins.find(c => c.metric_key === 'stress_check')?.value
    },
    {
      key: 'energy_quick',
      title: 'Energia Física',
      type: 'thermometer' as const,
      icon: Zap,
      color: 'green' as const,
      maxValue: 10,
      labels: ['Exausto', 'Muito cansado', 'Cansado', 'Baixa', 'Neutra', 'OK', 'Boa', 'Alta', 'Muito alta', 'Máxima'],
      currentValue: todayCheckins.find(c => c.metric_key === 'physical_energy_check')?.value
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
    },
    {
      key: 'movement_quick',
      title: 'Movimento',
      type: 'counter' as const,
      icon: Activity,
      color: 'green' as const,
      unit: 'vezes',
      maxValue: 8,
      currentValue: todayCheckins.find(c => c.metric_key === 'movement_check')?.value || 0
    }
  ];

  const handleQuickSubmit = async (key: string, value: number) => {
    const metricKeyMap: { [key: string]: string } = {
      'mood_quick': 'mood_check',
      'stress_quick': 'stress_check',
      'energy_quick': 'physical_energy_check',
      'water_quick': 'water_intake_check',
      'movement_quick': 'movement_check'
    };

    const metricKey = metricKeyMap[key];
    if (!metricKey) return;

    await submitCheckin.mutateAsync({
      metricKey,
      value,
      checkinType: key.includes('quick') && ['water', 'movement'].some(k => key.includes(k)) ? 'counter' : 'thermometer',
      maxValue: key === 'water_quick' ? 12 : key === 'movement_quick' ? 8 : 10,
      context: {
        source: 'dashboard_quick',
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Scores de Bem-estar */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-orange" />
            Scores de Bem-estar Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {wellnessScores.map((score) => {
              const Icon = scoreIcons[score.score_type as keyof typeof scoreIcons];
              const colorClass = scoreColors[score.score_type as keyof typeof scoreColors];
              const name = scoreNames[score.score_type as keyof typeof scoreNames];
              
              return (
                <motion.div
                  key={score.score_type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex flex-col items-center gap-2 p-3 bg-navy-700/30 rounded-xl">
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                    <div className={`text-2xl font-bold ${colorClass}`}>
                      {Math.round(score.score_value)}
                    </div>
                    <div className="text-xs text-navy-300">
                      {name}
                    </div>
                    {score.trend_7d !== 0 && (
                      <div className={`text-xs flex items-center gap-1 ${
                        score.trend_7d > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${score.trend_7d < 0 ? 'rotate-180' : ''}`} />
                        {score.trend_7d > 0 ? '+' : ''}{score.trend_7d.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Termômetros Rápidos */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Smile className="w-5 h-5 text-accent-orange" />
            Check-ins Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Termômetros */}
            {quickThermometers.map((thermo) => (
              <div key={thermo.key} className="flex justify-center">
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
              <div key={counter.key} className="flex justify-center">
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
    </div>
  );
}
