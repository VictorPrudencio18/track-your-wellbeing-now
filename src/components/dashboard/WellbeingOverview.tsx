
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Droplets, 
  Moon, 
  Activity,
  Smile,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useWellnessScores } from '@/hooks/useWellnessScores';
import { DailyMoodThermometer } from '@/components/wellness/DailyMoodThermometer';
import { useNavigate } from 'react-router-dom';

export function WellbeingOverview() {
  const { todayCheckin, isLoading } = useDailyCheckins();
  const { data: wellnessScores } = useWellnessScores();
  const navigate = useNavigate();

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
    if (!wellnessScores) return { status: 'pending', color: 'text-gray-400', icon: AlertCircle };
    
    const avgScore = (wellnessScores.mood.score + wellnessScores.activity.score + wellnessScores.energy.score) / 3;
    
    if (avgScore >= 80) return { status: 'excellent', color: 'text-green-400', icon: CheckCircle };
    if (avgScore >= 65) return { status: 'good', color: 'text-blue-400', icon: CheckCircle };
    if (avgScore >= 45) return { status: 'fair', color: 'text-yellow-400', icon: AlertCircle };
    return { status: 'needs_attention', color: 'text-red-400', icon: AlertCircle };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend < -5) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return null;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const quickMetrics = wellnessScores ? [
    {
      key: 'mood',
      label: 'Humor',
      value: wellnessScores.mood.score,
      max: 100,
      icon: Smile,
      color: getLevelColor(wellnessScores.mood.level),
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      description: wellnessScores.mood.description,
      trend: wellnessScores.mood.trend
    },
    {
      key: 'energy',
      label: 'Energia',
      value: wellnessScores.energy.score,
      max: 100,
      icon: Zap,
      color: getLevelColor(wellnessScores.energy.level),
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/20',
      description: wellnessScores.energy.description,
      trend: wellnessScores.energy.trend
    },
    {
      key: 'activity',
      label: 'Atividade',
      value: wellnessScores.activity.score,
      max: 100,
      icon: Activity,
      color: getLevelColor(wellnessScores.activity.level),
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      description: wellnessScores.activity.description,
      trend: wellnessScores.activity.trend
    },
    {
      key: 'sleep',
      label: 'Sono',
      value: wellnessScores.sleep.score,
      max: 100,
      icon: Moon,
      color: getLevelColor(wellnessScores.sleep.level),
      bgColor: 'bg-indigo-400/10',
      borderColor: 'border-indigo-400/20',
      description: wellnessScores.sleep.description,
      trend: wellnessScores.sleep.trend,
      hasData: wellnessScores.sleep.hasData
    }
  ] : [];

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
      className="space-y-6"
    >
      {/* Termômetro de Humor Diário - Mostrar apenas se não foi registrado */}
      {!todayCheckin?.mood_rating && <DailyMoodThermometer />}

      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Métricas de Bem-estar</h3>
        </div>
        <Badge 
          variant="outline" 
          className={`${healthStatus.color} border-current bg-current/10 px-3 py-1`}
        >
          <StatusIcon className="w-3 h-3 mr-1" />
          {getStatusText(healthStatus.status)}
        </Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickMetrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              relative p-4 rounded-2xl border backdrop-blur-sm
              ${metric.bgColor} ${metric.borderColor}
              hover:scale-105 transition-all duration-300
              cursor-pointer group
            `}
            onClick={() => {
              if (metric.key === 'sleep' && !metric.hasData) {
                navigate('/sleep');
              }
            }}
          >
            {/* Ícone e Label */}
            <div className="flex items-center gap-2 mb-3">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-sm text-gray-300 font-medium">{metric.label}</span>
              {metric.trend !== undefined && getTrendIcon(metric.trend)}
            </div>
            
            {/* Valor Principal */}
            <div className="mb-2">
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.key === 'activity' && wellnessScores?.activity.weeklyCount 
                    ? wellnessScores.activity.weeklyCount 
                    : Math.round(metric.value)
                  }
                </span>
                <span className="text-sm text-gray-500">
                  {metric.key === 'activity' && wellnessScores?.activity.weeklyCount ? '/7' : '/100'}
                </span>
              </div>
            </div>
            
            {/* Descrição */}
            <div className="text-xs text-gray-400 mb-2">
              {metric.description}
            </div>
            
            {/* Barra de Progresso */}
            <div className="space-y-1">
              <Progress 
                value={metric.value} 
                className="h-2 bg-navy-800/50"
              />
              <div className="text-xs text-gray-500 text-center">
                {Math.round(metric.value)}%
              </div>
            </div>

            {/* Ação especial para sono sem dados */}
            {metric.key === 'sleep' && !metric.hasData && (
              <div className="absolute inset-0 bg-blue-400/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center">
                  <ExternalLink className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs text-blue-400">Configurar</span>
                </div>
              </div>
            )}

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Destaques de Hoje */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-orange" />
          Status Atual
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Exercício */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`
              p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
              ${todayCheckin?.exercise_completed 
                ? 'bg-green-400/10 border-green-400/30 hover:bg-green-400/15' 
                : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Activity className={`w-5 h-5 ${
                todayCheckin?.exercise_completed ? 'text-green-400' : 'text-gray-500'
              }`} />
              <div>
                <div className="text-sm font-medium text-white">
                  {todayCheckin?.exercise_completed ? 'Exercício concluído' : 'Exercício pendente'}
                </div>
                <div className="text-xs text-gray-400">
                  {wellnessScores?.activity.weeklyCount 
                    ? `${wellnessScores.activity.weeklyCount} atividades esta semana`
                    : 'Que tal se movimentar?'
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mood */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`
              p-4 rounded-xl border backdrop-blur-sm transition-all duration-300
              ${todayCheckin?.mood_rating
                ? todayCheckin.mood_rating >= 7
                  ? 'bg-green-400/10 border-green-400/30 hover:bg-green-400/15'
                  : todayCheckin.mood_rating >= 5
                  ? 'bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/15'
                  : 'bg-red-400/10 border-red-400/30 hover:bg-red-400/15'
                : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-5 h-5 ${
                todayCheckin?.mood_rating
                  ? todayCheckin.mood_rating >= 7 ? 'text-green-400'
                  : todayCheckin.mood_rating >= 5 ? 'text-yellow-400'
                  : 'text-red-400'
                  : 'text-gray-500'
              }`} />
              <div>
                <div className="text-sm font-medium text-white">
                  Humor: {todayCheckin?.mood_rating || 'Não registrado'}/10
                </div>
                <div className="text-xs text-gray-400">
                  {todayCheckin?.mood_rating 
                    ? todayCheckin.mood_rating >= 7 ? 'Humor excelente!'
                    : todayCheckin.mood_rating >= 5 ? 'Humor regular'
                    : 'Precisa de atenção'
                    : 'Registre seu humor'
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {/* Wellness Score Geral */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-4 rounded-xl border bg-accent-orange/10 border-accent-orange/30 backdrop-blur-sm hover:bg-accent-orange/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
              <div>
                <div className="text-sm font-medium text-white">
                  Score Geral: {wellnessScores 
                    ? Math.round((wellnessScores.mood.score + wellnessScores.activity.score + wellnessScores.energy.score) / 3)
                    : todayCheckin?.wellness_score || 0
                  }/100
                </div>
                <div className="text-xs text-accent-orange/80">
                  {healthStatus.status === 'needs_attention' ? 'Atenção necessária' : 'Em progresso'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Check-in Pendente */}
      {!todayCheckin?.mood_rating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-blue-400/10 rounded-2xl border border-blue-400/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-400/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-1">Check-in pendente</h4>
              <p className="text-sm text-gray-400">
                Registre como você está se sentindo hoje para acompanhar seu progresso
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-400 font-medium">Pendente</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
