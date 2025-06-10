
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useActivities } from '@/hooks/useSupabaseActivities';

interface SmartAlert {
  id: string;
  type: 'reminder' | 'warning' | 'celebration' | 'insight';
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  expiresAt: Date;
  category: string;
}

export function useSmartAlerts() {
  const { user } = useAuth();
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: activities } = useActivities();

  return useQuery({
    queryKey: ['smart-alerts', user?.id],
    queryFn: () => generateSmartAlerts(todayCheckin, last7Days, activities || []),
    enabled: !!user,
    refetchInterval: 10 * 60 * 1000, // Atualizar a cada 10 minutos
  });
}

function generateSmartAlerts(
  todayCheckin: any,
  last7Days: any[] = [],
  activities: any[] = []
): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Alert de check-in diário
  if (!todayCheckin) {
    alerts.push({
      id: 'daily-checkin',
      type: 'reminder',
      priority: 'medium',
      title: 'Check-in Diário Pendente',
      message: 'Não se esqueça de registrar como você está se sentindo hoje',
      actionText: 'Fazer Check-in',
      actionUrl: '/health',
      expiresAt: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 horas
      category: 'Bem-estar'
    });
  }

  // Alert de hidratação
  if (todayCheckin && todayCheckin.hydration_glasses < 4 && now.getHours() >= 14) {
    alerts.push({
      id: 'hydration-reminder',
      type: 'reminder',
      priority: 'medium',
      title: 'Hidratação Baixa',
      message: `Você bebeu apenas ${todayCheckin.hydration_glasses} copos de água hoje`,
      actionText: 'Beber Água',
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 horas
      category: 'Saúde'
    });
  }

  // Alert de atividade física
  const todayActivities = activities.filter(a => 
    new Date(a.completed_at).toDateString() === now.toDateString()
  );

  if (todayActivities.length === 0 && now.getHours() >= 16) {
    alerts.push({
      id: 'activity-reminder',
      type: 'reminder',
      priority: 'low',
      title: 'Nenhuma Atividade Hoje',
      message: 'Que tal uma caminhada ou alongamento?',
      actionText: 'Ver Atividades',
      actionUrl: '/',
      expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3 horas
      category: 'Exercício'
    });
  }

  // Alert de humor baixo
  if (todayCheckin && todayCheckin.mood_rating <= 3) {
    alerts.push({
      id: 'mood-support',
      type: 'warning',
      priority: 'high',
      title: 'Humor Baixo Detectado',
      message: 'Percebemos que você não está se sentindo bem. Considere conversar com alguém ou praticar uma atividade relaxante',
      expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 horas
      category: 'Mental'
    });
  }

  // Celebração de streak
  const recentCheckins = last7Days.filter(c => c.mood_rating || c.energy_level || c.hydration_glasses > 0);
  if (recentCheckins.length >= 7) {
    alerts.push({
      id: 'streak-celebration',
      type: 'celebration',
      priority: 'low',
      title: 'Parabéns! 7 Dias Consecutivos',
      message: 'Você manteve seu registro de bem-estar por uma semana inteira!',
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 horas
      category: 'Conquista'
    });
  }

  // Insight baseado em padrões
  if (last7Days.length >= 5) {
    const avgStress = last7Days.reduce((sum, c) => sum + (c.stress_level || 0), 0) / last7Days.length;
    if (avgStress >= 7) {
      alerts.push({
        id: 'stress-insight',
        type: 'insight',
        priority: 'medium',
        title: 'Nível de Stress Elevado',
        message: 'Seu stress médio esta semana foi alto. Considere técnicas de relaxamento',
        actionText: 'Ver Dicas',
        expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 horas
        category: 'Mental'
      });
    }
  }

  return alerts.slice(0, 3); // Máximo 3 alertas por vez
}
