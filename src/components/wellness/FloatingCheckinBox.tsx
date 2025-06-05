
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThermometerWidget } from './ThermometerWidget';
import { CounterWidget } from './CounterWidget';
import { useMicroCheckins } from '@/hooks/useMicroCheckins';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Heart, 
  Zap, 
  Brain, 
  Droplets, 
  Activity,
  Smile,
  AlertTriangle,
  Sun
} from 'lucide-react';

interface MetricConfig {
  key: string;
  title: string;
  type: 'thermometer' | 'counter';
  icon: React.ComponentType<any>;
  color: 'red' | 'orange' | 'blue' | 'green' | 'purple';
  unit?: string;
  maxValue: number;
  labels?: string[];
  category: string;
  frequencyHours: number;
  preferredTimes: string[];
}

const metricConfigs: MetricConfig[] = [
  // Termômetros Emocionais
  {
    key: 'mood_check',
    title: 'Como está seu humor?',
    type: 'thermometer',
    icon: Smile,
    color: 'orange',
    maxValue: 10,
    labels: ['Péssimo', 'Ruim', 'Baixo', 'Neutro', 'OK', 'Bom', 'Bem', 'Muito bem', 'Ótimo', 'Excelente'],
    category: 'mental_health',
    frequencyHours: 4,
    preferredTimes: ['09:00', '13:00', '17:00', '21:00']
  },
  {
    key: 'stress_check',
    title: 'Nível de stress agora?',
    type: 'thermometer',
    icon: AlertTriangle,
    color: 'red',
    maxValue: 10,
    labels: ['Zen', 'Calmo', 'Tranquilo', 'Relaxado', 'Neutro', 'Tenso', 'Agitado', 'Estressado', 'Muito tenso', 'Exaustão'],
    category: 'mental_health',
    frequencyHours: 4,
    preferredTimes: ['10:00', '14:00', '18:00']
  },
  {
    key: 'physical_energy_check',
    title: 'Energia física atual?',
    type: 'thermometer',
    icon: Zap,
    color: 'green',
    maxValue: 10,
    labels: ['Exausto', 'Muito cansado', 'Cansado', 'Baixa', 'Neutra', 'OK', 'Boa', 'Alta', 'Muito alta', 'Máxima'],
    category: 'physical',
    frequencyHours: 6,
    preferredTimes: ['08:00', '14:00', '20:00']
  },
  {
    key: 'mental_energy_check',
    title: 'Energia mental agora?',
    type: 'thermometer',
    icon: Brain,
    color: 'purple',
    maxValue: 10,
    labels: ['Nevoeiro', 'Confuso', 'Lento', 'Baixa', 'Neutra', 'OK', 'Clara', 'Focado', 'Muito focado', 'Máxima'],
    category: 'mental_health',
    frequencyHours: 6,
    preferredTimes: ['09:00', '15:00', '19:00']
  },
  
  // Contadores de Atividades
  {
    key: 'water_intake_check',
    title: 'Copos de água hoje?',
    type: 'counter',
    icon: Droplets,
    color: 'blue',
    unit: 'copos',
    maxValue: 15,
    category: 'physical',
    frequencyHours: 3,
    preferredTimes: ['09:00', '12:00', '15:00', '18:00', '21:00']
  },
  {
    key: 'movement_check',
    title: 'Movimentos/exercícios hoje?',
    type: 'counter',
    icon: Activity,
    color: 'green',
    unit: 'vezes',
    maxValue: 10,
    category: 'physical',
    frequencyHours: 6,
    preferredTimes: ['12:00', '18:00']
  },
  {
    key: 'rest_breaks_check',
    title: 'Pausas/descansos hoje?',
    type: 'counter',
    icon: Sun,
    color: 'orange',
    unit: 'pausas',
    maxValue: 15,
    category: 'mental_health',
    frequencyHours: 4,
    preferredTimes: ['11:00', '15:00', '19:00']
  },
  {
    key: 'leisure_moments_check',
    title: 'Momentos de lazer hoje?',
    type: 'counter',
    icon: Heart,
    color: 'red',
    unit: 'momentos',
    maxValue: 10,
    category: 'mental_health',
    frequencyHours: 8,
    preferredTimes: ['16:00', '20:00']
  }
];

export function FloatingCheckinBox() {
  const { user } = useAuth();
  const { todayCheckins, submitCheckin, updateNotificationPrefs } = useMicroCheckins();
  const [currentMetric, setCurrentMetric] = useState<MetricConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Função para determinar qual métrica mostrar
  const shouldShowMetric = (config: MetricConfig): boolean => {
    if (!user) return false;

    const now = new Date();
    
    // Verificar se já respondeu essa métrica hoje
    const alreadyAnswered = todayCheckins.some(checkin => checkin.metric_key === config.key);
    if (alreadyAnswered) return false;

    // Verificar se está no horário preferido (±1 hora)
    const isInPreferredTime = config.preferredTimes.some(time => {
      const [hour, minute] = time.split(':').map(Number);
      const preferredTime = hour * 60 + minute;
      const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
      return Math.abs(currentTimeMinutes - preferredTime) <= 60; // ±1 hora
    });

    return isInPreferredTime;
  };

  // Verificar periodicamente se deve mostrar alguma métrica
  useEffect(() => {
    const checkForMetrics = () => {
      if (isVisible || !user) return;

      const metricToShow = metricConfigs.find(shouldShowMetric);
      if (metricToShow) {
        setCurrentMetric(metricToShow);
        setIsVisible(true);
      }
    };

    // Verificar imediatamente
    checkForMetrics();

    // Verificar a cada 5 minutos
    const interval = setInterval(checkForMetrics, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isVisible, todayCheckins]);

  const handleSubmit = async (value: number) => {
    if (!currentMetric) return;

    try {
      await submitCheckin.mutateAsync({
        metricKey: currentMetric.key,
        value,
        checkinType: currentMetric.type,
        maxValue: currentMetric.maxValue,
        context: {
          timestamp: new Date().toISOString(),
          category: currentMetric.category
        }
      });

      // Atualizar last_shown_at
      await updateNotificationPrefs.mutateAsync({
        metricKey: currentMetric.key,
        updates: {
          last_shown_at: new Date().toISOString(),
          total_responses: 1, // Este será incrementado no backend
        }
      });

      handleDismiss();
    } catch (error) {
      console.error('Error submitting checkin:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setCurrentMetric(null);

    // Agendar próxima verificação em 30 minutos
    setTimeout(() => {
      // Permitir que o sistema verifique novamente
    }, 30 * 60 * 1000);
  };

  const handleSnooze = async () => {
    if (!currentMetric) return;

    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + 30);

    await updateNotificationPrefs.mutateAsync({
      metricKey: currentMetric.key,
      updates: {
        snooze_until: snoozeUntil.toISOString(),
        total_dismissals: 1, // Este será incrementado no backend
      }
    });

    handleDismiss();
  };

  if (!isVisible || !currentMetric) return null;

  const positionClass = isMobile 
    ? 'fixed bottom-4 left-4 right-4 z-50' 
    : 'fixed bottom-6 left-6 z-50 max-w-sm';

  return (
    <div className={positionClass}>
      <AnimatePresence>
        {currentMetric.type === 'thermometer' ? (
          <ThermometerWidget
            title={currentMetric.title}
            maxValue={currentMetric.maxValue}
            labels={currentMetric.labels}
            icon={currentMetric.icon}
            color={currentMetric.color}
            onSubmit={handleSubmit}
            onDismiss={handleSnooze}
            size={isMobile ? "sm" : "md"}
          />
        ) : (
          <CounterWidget
            title={currentMetric.title}
            unit={currentMetric.unit || ''}
            maxValue={currentMetric.maxValue}
            icon={currentMetric.icon}
            color={currentMetric.color}
            onSubmit={handleSubmit}
            onDismiss={handleSnooze}
            size={isMobile ? "sm" : "md"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
