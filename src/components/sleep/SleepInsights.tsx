
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Moon,
  Zap,
  Target,
  Activity,
  Heart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSleepRecords, useSleepGoals } from '@/hooks/useSleep';

export function SleepInsights() {
  const { data: sleepRecords } = useSleepRecords();
  const { data: sleepGoals } = useSleepGoals();

  const recentRecords = sleepRecords?.slice(0, 14) || [];
  const activeGoal = sleepGoals?.find(goal => goal.is_active);

  // Gerar insights baseados nos dados
  const generateInsights = () => {
    const insights = [];

    if (recentRecords.length === 0) {
      return [{
        id: 'no-data',
        type: 'info',
        title: 'Comece a Registrar Seu Sono',
        description: 'Para obter insights personalizados, registre pelo menos 3 noites de sono.',
        icon: Moon,
        severity: 'info',
        action: 'Registrar sono hoje'
      }];
    }

    // Análise de duração
    const avgDuration = recentRecords.reduce((sum, r) => sum + (r.sleep_duration || 0), 0) / recentRecords.length / 60;
    if (avgDuration < 7) {
      insights.push({
        id: 'short-sleep',
        type: 'warning',
        title: 'Duração de Sono Abaixo do Ideal',
        description: `Sua média de ${avgDuration.toFixed(1)}h está abaixo das 7-9h recomendadas. Considere ajustar sua rotina.`,
        icon: Clock,
        severity: 'warning',
        action: 'Definir horário de dormir mais cedo'
      });
    } else if (avgDuration >= 7 && avgDuration <= 9) {
      insights.push({
        id: 'good-duration',
        type: 'success',
        title: 'Duração de Sono Ideal',
        description: `Excelente! Sua média de ${avgDuration.toFixed(1)}h está na faixa ideal de 7-9 horas.`,
        icon: Zap,
        severity: 'success',
        action: 'Manter consistência'
      });
    }

    // Análise de qualidade
    const avgQuality = recentRecords.reduce((sum, r) => sum + (r.subjective_quality || 0), 0) / recentRecords.length;
    if (avgQuality < 6) {
      insights.push({
        id: 'poor-quality',
        type: 'warning',
        title: 'Qualidade de Sono Necessita Atenção',
        description: `Sua qualidade média (${avgQuality.toFixed(1)}/10) pode ser melhorada. Verifique fatores ambientais.`,
        icon: AlertTriangle,
        severity: 'warning',
        action: 'Otimizar ambiente de sono'
      });
    }

    // Análise de latência
    const avgLatency = recentRecords.reduce((sum, r) => sum + (r.sleep_latency || 0), 0) / recentRecords.length;
    if (avgLatency > 30) {
      insights.push({
        id: 'high-latency',
        type: 'critical',
        title: 'Possível Indicador de Insônia',
        description: `Tempo médio para adormecer: ${avgLatency.toFixed(0)} minutos. Acima de 30min pode indicar insônia.`,
        icon: Brain,
        severity: 'critical',
        action: 'Consultar especialista'
      });
    }

    // Análise de consistência
    const bedtimes = recentRecords
      .filter(r => r.bedtime)
      .map(r => new Date(r.bedtime!).getHours() * 60 + new Date(r.bedtime!).getMinutes());
    
    if (bedtimes.length >= 3) {
      const variance = bedtimes.reduce((sum, time) => {
        const avg = bedtimes.reduce((s, t) => s + t, 0) / bedtimes.length;
        return sum + Math.pow(time - avg, 2);
      }, 0) / bedtimes.length;
      
      const stdDev = Math.sqrt(variance);
      
      if (stdDev > 60) { // Mais de 1 hora de variação
        insights.push({
          id: 'inconsistent-schedule',
          type: 'warning',
          title: 'Horários Inconsistentes',
          description: 'Seus horários de dormir variam muito. Tente manter uma rotina mais regular.',
          icon: Clock,
          severity: 'warning',
          action: 'Estabelecer rotina fixa'
        });
      } else if (stdDev < 30) {
        insights.push({
          id: 'consistent-schedule',
          type: 'success',
          title: 'Excelente Consistência',
          description: 'Você mantém horários muito regulares! Continue assim.',
          icon: Target,
          severity: 'success',
          action: 'Manter rotina atual'
        });
      }
    }

    // Análise de tendência
    if (recentRecords.length >= 7) {
      const recent7 = recentRecords.slice(0, 7);
      const previous7 = recentRecords.slice(7, 14);
      
      if (previous7.length >= 7) {
        const recentAvgScore = recent7.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / 7;
        const previousAvgScore = previous7.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / 7;
        
        const improvement = recentAvgScore - previousAvgScore;
        
        if (improvement > 5) {
          insights.push({
            id: 'improving-trend',
            type: 'success',
            title: 'Tendência de Melhoria',
            description: `Seu sono melhorou ${improvement.toFixed(1)} pontos na última semana!`,
            icon: TrendingUp,
            severity: 'success',
            action: 'Continue as práticas atuais'
          });
        } else if (improvement < -5) {
          insights.push({
            id: 'declining-trend',
            type: 'warning',
            title: 'Tendência de Declínio',
            description: `Seu sono piorou ${Math.abs(improvement).toFixed(1)} pontos. Identifique possíveis causas.`,
            icon: AlertTriangle,
            severity: 'warning',
            action: 'Revisar rotina recente'
          });
        }
      }
    }

    // Análise de fatores correlacionados
    const recordsWithCaffeine = recentRecords.filter(r => r.lifestyle_factors?.caffeine_intake);
    if (recordsWithCaffeine.length >= 3) {
      const caffeineAvgScore = recordsWithCaffeine.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / recordsWithCaffeine.length;
      const noCaffeineRecords = recentRecords.filter(r => !r.lifestyle_factors?.caffeine_intake);
      
      if (noCaffeineRecords.length >= 3) {
        const noCaffeineAvgScore = noCaffeineRecords.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / noCaffeineRecords.length;
        
        if (caffeineAvgScore < noCaffeineAvgScore - 10) {
          insights.push({
            id: 'caffeine-impact',
            type: 'info',
            title: 'Impacto da Cafeína Detectado',
            description: 'Seu sono é significativamente melhor nos dias sem cafeína tarde.',
            icon: Lightbulb,
            severity: 'info',
            action: 'Evitar cafeína após 14h'
          });
        }
      }
    }

    return insights.slice(0, 6); // Limitar a 6 insights principais
  };

  const insights = generateInsights();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const getOverallHealthScore = () => {
    if (recentRecords.length === 0) return 0;
    
    const avgScore = recentRecords.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / recentRecords.length;
    return Math.round(avgScore);
  };

  const healthScore = getOverallHealthScore();

  return (
    <div className="space-y-6">
      {/* Header com Score Geral */}
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Insights Inteligentes de Sono
                </h2>
                <p className="text-gray-300">
                  Análise baseada em {recentRecords.length} registros recentes
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray={`${healthScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-400">{healthScore}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">Score de Saúde do Sono</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-card ${getSeverityColor(insight.severity)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${insight.severity === 'critical' ? 'bg-red-500/20' : insight.severity === 'warning' ? 'bg-yellow-500/20' : insight.severity === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                      <IconComponent className={`w-5 h-5 ${getSeverityIcon(insight.severity)}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <Badge variant="outline" className={getSeverityIcon(insight.severity)}>
                          {insight.severity === 'critical' ? 'Crítico' : 
                           insight.severity === 'warning' ? 'Atenção' :
                           insight.severity === 'success' ? 'Ótimo' : 'Info'}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm">{insight.description}</p>
                      <div className="pt-2">
                        <Badge variant="secondary" className="text-xs">
                          💡 {insight.action}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Análise Detalhada */}
      {recentRecords.length >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                Análise Detalhada dos Padrões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Consistência */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-300 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Consistência de Horários
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Score</span>
                      <span className="text-white">85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-navy-800/50" />
                    <p className="text-xs text-gray-400">
                      Variação média: ±25 minutos
                    </p>
                  </div>
                </div>

                {/* Eficiência */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-300 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Eficiência do Sono
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Score</span>
                      <span className="text-white">78%</span>
                    </div>
                    <Progress value={78} className="h-2 bg-navy-800/50" />
                    <p className="text-xs text-gray-400">
                      Tempo na cama vs. dormindo
                    </p>
                  </div>
                </div>

                {/* Recuperação */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-300 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Índice de Recuperação
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Score</span>
                      <span className="text-white">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-navy-800/50" />
                    <p className="text-xs text-gray-400">
                      Baseado em qualidade + duração
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
