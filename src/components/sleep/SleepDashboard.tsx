
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Star,
  ZapOff,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSleepRecords, useSleepGoals } from '@/hooks/useSleep';

export function SleepDashboard() {
  const { data: sleepRecords, isLoading: recordsLoading } = useSleepRecords();
  const { data: sleepGoals } = useSleepGoals();

  // Calcular métricas
  const recentRecord = sleepRecords?.[0];
  const activeGoal = sleepGoals?.find(goal => goal.is_active);
  const last7Records = sleepRecords?.slice(0, 7) || [];
  
  const averageScore = last7Records.length > 0 
    ? last7Records.reduce((sum, record) => sum + (record.calculated_scores?.overall_score || 0), 0) / last7Records.length
    : 0;

  const averageDuration = last7Records.length > 0
    ? last7Records.reduce((sum, record) => sum + (record.sleep_duration || 0), 0) / last7Records.length
    : 0;

  const consistencyStreak = calculateConsistencyStreak(sleepRecords || []);
  
  function calculateConsistencyStreak(records: any[]): number {
    let streak = 0;
    for (const record of records) {
      if (record.calculated_scores?.overall_score >= 70) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Ruim';
  }

  function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  }

  if (recordsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-navy-700/50 rounded mb-4"></div>
              <div className="h-8 bg-navy-700/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Score Geral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Score Geral</span>
                </div>
                <Badge variant="outline" className={getScoreColor(averageScore)}>
                  {getScoreLabel(averageScore)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                  {averageScore.toFixed(0)}
                </div>
                <Progress 
                  value={averageScore} 
                  className="h-2 bg-navy-800/50"
                />
                <p className="text-xs text-gray-400">
                  Média dos últimos 7 dias
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Duração Média */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Duração Média</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">
                  {formatDuration(averageDuration)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400">
                    Meta: {activeGoal ? formatDuration(activeGoal.target_duration) : '8h'}
                  </div>
                  {activeGoal && (
                    <Progress 
                      value={(averageDuration / activeGoal.target_duration) * 100} 
                      className="flex-1 h-1 bg-navy-800/50"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sequência de Consistência */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Sequência</span>
                </div>
                {consistencyStreak >= 7 && (
                  <Zap className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">
                  {consistencyStreak}
                </div>
                <p className="text-xs text-gray-400">
                  Dias consecutivos de bom sono
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Última Noite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Moon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">Última Noite</span>
                </div>
              </div>
              <div className="space-y-2">
                {recentRecord ? (
                  <>
                    <div className={`text-3xl font-bold ${getScoreColor(recentRecord.calculated_scores?.overall_score || 0)}`}>
                      {(recentRecord.calculated_scores?.overall_score || 0).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {recentRecord.sleep_duration ? formatDuration(recentRecord.sleep_duration) : 'N/A'}
                      {recentRecord.subjective_quality && (
                        <span className="ml-2">• Qualidade: {recentRecord.subjective_quality}/10</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-gray-500">
                      --
                    </div>
                    <p className="text-xs text-gray-400">
                      Nenhum registro encontrado
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Análise Rápida */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-orange" />
              Análise Rápida da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tendência */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Tendência</h4>
                <div className="flex items-center gap-2">
                  {averageScore >= 70 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-sm text-gray-400">
                    {averageScore >= 70 
                      ? 'Sono consistente e de qualidade'
                      : averageScore >= 50
                      ? 'Há margem para melhorias'
                      : 'Requer atenção urgente'
                    }
                  </span>
                </div>
              </div>

              {/* Padrão */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Padrão</h4>
                <div className="text-sm text-gray-400">
                  {last7Records.length >= 5 
                    ? 'Dados suficientes para análise'
                    : 'Registre mais dados para análise completa'
                  }
                </div>
              </div>

              {/* Recomendação */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Próximo Passo</h4>
                <div className="text-sm text-gray-400">
                  {!activeGoal 
                    ? 'Configure suas metas de sono'
                    : averageScore < 60
                    ? 'Foque na consistência do horário'
                    : 'Continue mantendo a rotina'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
