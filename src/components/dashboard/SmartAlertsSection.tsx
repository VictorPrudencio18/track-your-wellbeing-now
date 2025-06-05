
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock,
  Lightbulb,
  Target,
  TrendingDown,
  X
} from 'lucide-react';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useCorrelationAnalysis } from '@/hooks/useCorrelationAnalysis';

export function SmartAlertsSection() {
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: correlationData } = useCorrelationAnalysis();

  const generateSmartAlerts = () => {
    const alerts: Array<{
      id: string;
      type: 'warning' | 'info' | 'success' | 'urgent';
      title: string;
      message: string;
      action?: string;
      priority: number;
    }> = [];

    // Alert de check-in não realizado
    if (!todayCheckin) {
      alerts.push({
        id: 'checkin-pending',
        type: 'info',
        title: 'Check-in Pendente',
        message: 'Não esqueça de registrar como você está se sentindo hoje',
        action: 'Fazer Check-in',
        priority: 3
      });
    }

    // Alert de stress alto por vários dias
    const highStressDays = last7Days.filter(d => d.stress_level && d.stress_level >= 8).length;
    if (highStressDays >= 3) {
      alerts.push({
        id: 'high-stress',
        type: 'warning',
        title: 'Nível de Stress Elevado',
        message: `Você relatou stress alto em ${highStressDays} dos últimos 7 dias`,
        action: 'Ver Técnicas de Relaxamento',
        priority: 5
      });
    }

    // Alert de baixa energia consistente
    const lowEnergyDays = last7Days.filter(d => d.energy_level && d.energy_level <= 3).length;
    if (lowEnergyDays >= 3) {
      alerts.push({
        id: 'low-energy',
        type: 'warning',
        title: 'Energia Baixa Persistente',
        message: 'Sua energia está consistentemente baixa. Considere melhorar o sono',
        action: 'Dicas de Energia',
        priority: 4
      });
    }

    // Alert de hidratação baixa
    if (todayCheckin && todayCheckin.hydration_glasses < 4) {
      alerts.push({
        id: 'hydration',
        type: 'info',
        title: 'Hidratação Baixa',
        message: 'Você bebeu poucos copos de água hoje',
        action: 'Lembrete de Água',
        priority: 2
      });
    }

    // Alert de exercício não realizado por vários dias
    const noExerciseDays = last7Days.filter(d => !d.exercise_completed).length;
    if (noExerciseDays >= 4) {
      alerts.push({
        id: 'no-exercise',
        type: 'warning',
        title: 'Pouca Atividade Física',
        message: `${noExerciseDays} dias sem exercício na última semana`,
        action: 'Planejar Atividade',
        priority: 4
      });
    }

    // Alert positivo de progresso
    const goodDays = last7Days.filter(d => 
      d.mood_rating >= 7 && d.energy_level >= 7 && (d.stress_level <= 4 || !d.stress_level)
    ).length;
    if (goodDays >= 5) {
      alerts.push({
        id: 'good-progress',
        type: 'success',
        title: 'Excelente Progresso!',
        message: `Você teve ${goodDays} dias muito bons esta semana`,
        priority: 1
      });
    }

    // Alerts baseados em correlações
    if (correlationData?.insights) {
      correlationData.insights.forEach((insight, index) => {
        if (insight.type === 'negative' && insight.confidence > 70) {
          alerts.push({
            id: `correlation-${index}`,
            type: 'urgent',
            title: 'Padrão Identificado',
            message: insight.description,
            action: 'Ver Detalhes',
            priority: 5
          });
        }
      });
    }

    return alerts.sort((a, b) => b.priority - a.priority).slice(0, 5);
  };

  const alerts = generateSmartAlerts();

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'urgent':
        return { 
          icon: AlertTriangle, 
          color: 'border-red-400/50 bg-red-400/10 text-red-400',
          badgeColor: 'bg-red-400/20 text-red-400'
        };
      case 'warning':
        return { 
          icon: AlertTriangle, 
          color: 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400',
          badgeColor: 'bg-yellow-400/20 text-yellow-400'
        };
      case 'success':
        return { 
          icon: CheckCircle, 
          color: 'border-green-400/50 bg-green-400/10 text-green-400',
          badgeColor: 'bg-green-400/20 text-green-400'
        };
      default:
        return { 
          icon: Lightbulb, 
          color: 'border-blue-400/50 bg-blue-400/10 text-blue-400',
          badgeColor: 'bg-blue-400/20 text-blue-400'
        };
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-green-400" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-400">
              Tudo está bem! Nenhum alerta no momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-navy-700/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent-orange" />
            Alertas Inteligentes
          </div>
          <Badge variant="outline" className="text-accent-orange border-accent-orange/50">
            {alerts.length} alertas
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${config.color}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <Badge variant="outline" className={`text-xs ${config.badgeColor}`}>
                      Prioridade {alert.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  
                  {alert.action && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs hover:bg-white/10"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {alert.action}
                    </Button>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-500 hover:text-white hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4 border-t border-navy-700/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Ações rápidas:</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Adiar Todos
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Marcar Lidos
              </Button>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
