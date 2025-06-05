
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Heart,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useAuth } from '@/hooks/useAuth';

export function MentalHealthDashboard() {
  const { user } = useAuth();
  const { todayCheckin, last7Days, isLoading } = useDailyCheckins();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-navy-700 rounded w-1/3"></div>
                <div className="h-8 bg-navy-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular métricas de saúde mental
  const calculateMentalHealthMetrics = () => {
    const recent7Days = last7Days.slice(0, 7);
    
    // Stress médio
    const avgStress = recent7Days
      .filter(d => d.stress_level)
      .reduce((sum, d) => sum + d.stress_level, 0) / 
      Math.max(recent7Days.filter(d => d.stress_level).length, 1);

    // Humor médio
    const avgMood = recent7Days
      .filter(d => d.mood_rating)
      .reduce((sum, d) => sum + d.mood_rating, 0) / 
      Math.max(recent7Days.filter(d => d.mood_rating).length, 1);

    // Energia média
    const avgEnergy = recent7Days
      .filter(d => d.energy_level)
      .reduce((sum, d) => sum + d.energy_level, 0) / 
      Math.max(recent7Days.filter(d => d.energy_level).length, 1);

    // Satisfação no trabalho média
    const avgWorkSat = recent7Days
      .filter(d => d.work_satisfaction)
      .reduce((sum, d) => sum + d.work_satisfaction, 0) / 
      Math.max(recent7Days.filter(d => d.work_satisfaction).length, 1);

    // Burnout risk (baseado em stress alto + energia baixa + satisfação baixa)
    const burnoutRisk = ((avgStress / 10) * 0.4) + 
                       ((1 - avgEnergy / 10) * 0.3) + 
                       ((1 - avgWorkSat / 10) * 0.3);

    return {
      avgStress: avgStress || 5,
      avgMood: avgMood || 5,
      avgEnergy: avgEnergy || 5,
      avgWorkSat: avgWorkSat || 5,
      burnoutRisk: Math.min(burnoutRisk * 100, 100),
      mentalHealthScore: Math.max(0, 100 - (avgStress * 5) + (avgMood * 8) + (avgEnergy * 7))
    };
  };

  const metrics = calculateMentalHealthMetrics();

  const getMoodTrend = () => {
    if (last7Days.length < 2) return 'stable';
    const recent = last7Days.slice(0, 3).map(d => d.mood_rating).filter(Boolean);
    const previous = last7Days.slice(3, 6).map(d => d.mood_rating).filter(Boolean);
    
    if (recent.length === 0 || previous.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((sum, m) => sum + m, 0) / recent.length;
    const previousAvg = previous.reduce((sum, m) => sum + m, 0) / previous.length;
    
    if (recentAvg > previousAvg + 0.5) return 'up';
    if (recentAvg < previousAvg - 0.5) return 'down';
    return 'stable';
  };

  const moodTrend = getMoodTrend();

  const getBurnoutLevel = (risk: number) => {
    if (risk < 30) return { level: 'Baixo', color: 'text-green-400 bg-green-400/10' };
    if (risk < 60) return { level: 'Moderado', color: 'text-yellow-400 bg-yellow-400/10' };
    return { level: 'Alto', color: 'text-red-400 bg-red-400/10' };
  };

  const burnoutLevel = getBurnoutLevel(metrics.burnoutRisk);

  return (
    <div className="space-y-6">
      {/* Mental Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="w-5 h-5 text-purple-400" />
              Saúde Mental
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Humor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Humor</span>
                  <div className="flex items-center gap-1">
                    {moodTrend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                    {moodTrend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                    <span className="text-white font-semibold">{metrics.avgMood.toFixed(1)}</span>
                  </div>
                </div>
                <Progress value={metrics.avgMood * 10} className="h-2" />
              </div>

              {/* Stress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Stress</span>
                  <span className="text-white font-semibold">{metrics.avgStress.toFixed(1)}</span>
                </div>
                <Progress value={100 - (metrics.avgStress * 10)} className="h-2" />
              </div>

              {/* Energia */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Energia</span>
                  <span className="text-white font-semibold">{metrics.avgEnergy.toFixed(1)}</span>
                </div>
                <Progress value={metrics.avgEnergy * 10} className="h-2" />
              </div>

              {/* Trabalho */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Trabalho</span>
                  <span className="text-white font-semibold">{metrics.avgWorkSat.toFixed(1)}</span>
                </div>
                <Progress value={metrics.avgWorkSat * 10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Burnout Risk & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Burnout Risk */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Risco de Burnout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={burnoutLevel.color}>
                    {burnoutLevel.level}
                  </Badge>
                  <span className="text-2xl font-bold text-white">
                    {metrics.burnoutRisk.toFixed(0)}%
                  </span>
                </div>
                <Progress value={metrics.burnoutRisk} className="h-3" />
                <p className="text-sm text-gray-400">
                  {metrics.burnoutRisk < 30 
                    ? "Você está mantendo um bom equilíbrio mental"
                    : metrics.burnoutRisk < 60
                    ? "Atenção aos sinais de stress - considere pausas"
                    : "Alto risco - priorize autocuidado e descanso"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Mental Health Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-green-400" />
                Ações Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.avgStress > 7 && (
                  <div className="flex items-center gap-3 p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-gray-300">Pratique técnicas de relaxamento</span>
                  </div>
                )}
                {metrics.avgEnergy < 4 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Melhore a qualidade do sono</span>
                  </div>
                )}
                {metrics.avgMood < 5 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                    <Heart className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Conecte-se com pessoas queridas</span>
                  </div>
                )}
                {metrics.burnoutRisk < 30 && (
                  <div className="flex items-center gap-3 p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Continue mantendo o equilíbrio!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
