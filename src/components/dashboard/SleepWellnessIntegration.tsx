
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Moon, 
  Heart, 
  Zap, 
  Brain,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useSleepRecords } from '@/hooks/useSleepRecords';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { Link } from 'react-router-dom';

export function SleepWellnessIntegration() {
  const { sleepRecords, sleepStats, isLoading } = useSleepRecords();
  const { todayCheckin, last7Days } = useDailyCheckins();

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-navy-700 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-32 bg-navy-700/30 rounded"></div>
              <div className="h-32 bg-navy-700/30 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se não há dados de sono, mostrar call-to-action
  if (!sleepRecords || sleepRecords.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Moon className="w-5 h-5 text-accent-orange" />
            Integração Sono-Bem-estar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Moon className="w-16 h-16 text-navy-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Descubra como seu sono afeta seu bem-estar
            </h3>
            <p className="text-navy-400 mb-6">
              Registre seus dados de sono para ver correlações com humor, energia e saúde mental
            </p>
            <Button asChild className="bg-accent-orange hover:bg-accent-orange/80">
              <Link to="/sleep">
                Começar Registro de Sono
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Cálculos de correlação
  const last7DaysWithSleep = last7Days.filter(day => 
    sleepRecords.some(sleep => sleep.sleep_date === day.checkin_date)
  );

  const sleepMoodCorrelation = calculateCorrelation(last7DaysWithSleep, sleepRecords, 'mood');
  const sleepEnergyCorrelation = calculateCorrelation(last7DaysWithSleep, sleepRecords, 'energy');

  const integrationMetrics = [
    {
      title: 'Qualidade do Sono',
      value: sleepStats.averageQuality.toFixed(1),
      target: '8.0',
      progress: (sleepStats.averageQuality / 10) * 100,
      icon: Moon,
      color: 'indigo',
      trend: getTrend(sleepRecords, 'subjective_quality')
    },
    {
      title: 'Humor Médio',
      value: last7Days.length ? 
        (last7Days.reduce((sum, day) => sum + (day.mood_rating || 0), 0) / last7Days.length).toFixed(1) : '0.0',
      target: '8.0',
      progress: last7Days.length ? 
        (last7Days.reduce((sum, day) => sum + (day.mood_rating || 0), 0) / last7Days.length / 10) * 100 : 0,
      icon: Heart,
      color: 'red',
      trend: getTrend(last7Days, 'mood_rating')
    },
    {
      title: 'Energia Média',
      value: last7Days.length ? 
        (last7Days.reduce((sum, day) => sum + (day.energy_level || 0), 0) / last7Days.length).toFixed(1) : '0.0',
      target: '8.0',
      progress: last7Days.length ? 
        (last7Days.reduce((sum, day) => sum + (day.energy_level || 0), 0) / last7Days.length / 10) * 100 : 0,
      icon: Zap,
      color: 'yellow',
      trend: getTrend(last7Days, 'energy_level')
    },
    {
      title: 'Duração Média',
      value: `${Math.floor(sleepStats.averageDuration / 60)}h${(sleepStats.averageDuration % 60).toFixed(0)}m`,
      target: '8h00m',
      progress: (sleepStats.averageDuration / 480) * 100,
      icon: Clock,
      color: 'blue',
      trend: getTrend(sleepRecords, 'sleep_duration')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrationMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-700/30 hover:border-accent-orange/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-${metric.color}-500/10 rounded-lg`}>
                    <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">+{metric.trend}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">{metric.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{metric.value}</span>
                    <span className="text-xs text-navy-400">meta: {metric.target}</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Correlações e Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlação Sono-Humor */}
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Brain className="w-5 h-5 text-purple-400" />
              Sono × Humor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Correlação detectada:</span>
                <span className={`font-semibold ${
                  sleepMoodCorrelation > 0.5 ? 'text-green-400' : 
                  sleepMoodCorrelation > 0.2 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {sleepMoodCorrelation > 0.5 ? 'Forte' : 
                   sleepMoodCorrelation > 0.2 ? 'Moderada' : 'Fraca'}
                </span>
              </div>
              
              <Progress value={Math.abs(sleepMoodCorrelation) * 100} className="h-2" />
              
              <p className="text-sm text-gray-300">
                {sleepMoodCorrelation > 0.5 
                  ? 'Noites bem dormidas melhoram significativamente seu humor'
                  : sleepMoodCorrelation > 0.2
                  ? 'Há uma relação moderada entre seu sono e humor'
                  : 'Correlação fraca detectada - outros fatores podem estar influenciando mais'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Correlação Sono-Energia */}
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Zap className="w-5 h-5 text-yellow-400" />
              Sono × Energia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Correlação detectada:</span>
                <span className={`font-semibold ${
                  sleepEnergyCorrelation > 0.5 ? 'text-green-400' : 
                  sleepEnergyCorrelation > 0.2 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {sleepEnergyCorrelation > 0.5 ? 'Forte' : 
                   sleepEnergyCorrelation > 0.2 ? 'Moderada' : 'Fraca'}
                </span>
              </div>
              
              <Progress value={Math.abs(sleepEnergyCorrelation) * 100} className="h-2" />
              
              <p className="text-sm text-gray-300">
                {sleepEnergyCorrelation > 0.5 
                  ? 'Seu nível de energia está diretamente ligado à qualidade do sono'
                  : sleepEnergyCorrelation > 0.2
                  ? 'Sono de qualidade contribui moderadamente para sua energia'
                  : 'Outros fatores além do sono podem estar afetando sua energia'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      {(sleepStats.averageQuality < 6 || sleepStats.averageDuration < 420) && (
        <Card className="glass-card border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-2">Oportunidade de Melhoria</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Seus dados mostram que melhorar o sono pode ter um impacto positivo significativo no seu bem-estar geral.
                </p>
                <Button asChild size="sm" className="bg-accent-orange hover:bg-accent-orange/80">
                  <Link to="/sleep">
                    Ver Página de Sono
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Função auxiliar para calcular correlação
function calculateCorrelation(
  checkins: any[],
  sleepRecords: any[],
  metric: 'mood' | 'energy'
): number {
  if (checkins.length < 3) return 0;

  const pairs = checkins.map(checkin => {
    const sleep = sleepRecords.find(s => s.sleep_date === checkin.checkin_date);
    return {
      sleep: sleep?.subjective_quality || 0,
      metric: metric === 'mood' ? checkin.mood_rating : checkin.energy_level
    };
  }).filter(pair => pair.sleep > 0 && pair.metric > 0);

  if (pairs.length < 3) return 0;

  const n = pairs.length;
  const sumX = pairs.reduce((sum, p) => sum + p.sleep, 0);
  const sumY = pairs.reduce((sum, p) => sum + p.metric, 0);
  const sumXY = pairs.reduce((sum, p) => sum + p.sleep * p.metric, 0);
  const sumX2 = pairs.reduce((sum, p) => sum + p.sleep * p.sleep, 0);
  const sumY2 = pairs.reduce((sum, p) => sum + p.metric * p.metric, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : Math.max(0, Math.min(1, numerator / denominator));
}

// Função auxiliar para calcular tendência
function getTrend(records: any[], field: string): number {
  if (records.length < 4) return 0;
  
  const recent = records.slice(0, Math.floor(records.length / 2));
  const older = records.slice(Math.floor(records.length / 2));
  
  const recentAvg = recent.reduce((sum, r) => sum + (r[field] || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, r) => sum + (r[field] || 0), 0) / older.length;
  
  return olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0;
}
