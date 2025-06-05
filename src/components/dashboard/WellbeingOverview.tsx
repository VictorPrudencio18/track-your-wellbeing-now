
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Droplets, 
  Moon, 
  Activity,
  Smile,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useVivaScore } from '@/hooks/useVivaScore';

export function WellbeingOverview() {
  const { todayCheckin, isLoading } = useDailyCheckins();
  const { data: vivaData } = useVivaScore();

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-navy-700 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-navy-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHealthStatus = () => {
    if (!todayCheckin) return { status: 'pending', color: 'text-gray-400', icon: AlertCircle };
    
    const metrics = [
      todayCheckin.mood_rating >= 7,
      todayCheckin.energy_level >= 7,
      todayCheckin.stress_level <= 4,
      todayCheckin.hydration_glasses >= 6,
      todayCheckin.exercise_completed
    ];
    
    const positiveMetrics = metrics.filter(Boolean).length;
    
    if (positiveMetrics >= 4) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle };
    if (positiveMetrics >= 3) return { status: 'good', color: 'text-blue-400', icon: CheckCircle };
    if (positiveMetrics >= 2) return { status: 'fair', color: 'text-yellow-400', icon: AlertCircle };
    return { status: 'needs_attention', color: 'text-red-400', icon: AlertCircle };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  const quickMetrics = [
    {
      key: 'mood',
      label: 'Humor',
      value: todayCheckin?.mood_rating || 0,
      max: 10,
      icon: Smile,
      color: 'text-yellow-400'
    },
    {
      key: 'energy',
      label: 'Energia',
      value: todayCheckin?.energy_level || 0,
      max: 10,
      icon: Activity,
      color: 'text-orange-400'
    },
    {
      key: 'hydration',
      label: 'Hidratação',
      value: todayCheckin?.hydration_glasses || 0,
      max: 8,
      icon: Droplets,
      color: 'text-blue-400'
    },
    {
      key: 'sleep',
      label: 'Sono',
      value: todayCheckin?.sleep_quality || 0,
      max: 10,
      icon: Moon,
      color: 'text-indigo-400'
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'fair': return 'Regular';
      case 'needs_attention': return 'Atenção';
      default: return 'Pendente';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Bem-estar Hoje
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${healthStatus.color}`} />
              <Badge variant="outline" className={`${healthStatus.color} border-current`}>
                {getStatusText(healthStatus.status)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickMetrics.map((metric, index) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-sm text-gray-300">{metric.label}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-semibold">{metric.value}</span>
                    <span className="text-gray-500">/{metric.max}</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.max) * 100} 
                    className="h-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Today's Highlights */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-orange" />
              Destaques de Hoje
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Exercise Status */}
              <div className={`p-3 rounded-lg border ${
                todayCheckin?.exercise_completed 
                  ? 'bg-green-400/10 border-green-400/20' 
                  : 'bg-gray-800/50 border-gray-700/50'
              }`}>
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${
                    todayCheckin?.exercise_completed ? 'text-green-400' : 'text-gray-500'
                  }`} />
                  <span className="text-sm text-gray-300">
                    {todayCheckin?.exercise_completed ? 'Exercício concluído' : 'Exercício pendente'}
                  </span>
                </div>
              </div>

              {/* Stress Level */}
              <div className={`p-3 rounded-lg border ${
                (todayCheckin?.stress_level || 10) <= 4
                  ? 'bg-green-400/10 border-green-400/20'
                  : (todayCheckin?.stress_level || 10) <= 7
                  ? 'bg-yellow-400/10 border-yellow-400/20'
                  : 'bg-red-400/10 border-red-400/20'
              }`}>
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${
                    (todayCheckin?.stress_level || 10) <= 4 ? 'text-green-400' :
                    (todayCheckin?.stress_level || 10) <= 7 ? 'text-yellow-400' : 'text-red-400'
                  }`} />
                  <span className="text-sm text-gray-300">
                    Stress: {todayCheckin?.stress_level || 'N/A'}/10
                  </span>
                </div>
              </div>

              {/* VIVA Score */}
              {vivaData && (
                <div className="p-3 rounded-lg border bg-accent-orange/10 border-accent-orange/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-orange" />
                    <span className="text-sm text-gray-300">
                      Score VIVA: {vivaData.score}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {!todayCheckin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/20"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Check-in pendente</p>
                  <p className="text-xs text-gray-400">
                    Registre como você está se sentindo hoje
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
