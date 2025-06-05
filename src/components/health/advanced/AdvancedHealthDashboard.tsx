
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Brain, 
  Utensils, 
  Moon, 
  TrendingUp,
  Target,
  Calendar,
  AlertCircle,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AdvancedHealthDashboard() {
  const { user } = useAuth();
  const { 
    workoutPlans, 
    healthMetrics, 
    healthGoals, 
    healthInsights, 
    overallHealthScore,
    isLoading 
  } = useAdvancedHealth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card border-accent-orange/20">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-accent-orange mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
              <p className="text-navy-300">Faça login para acessar o sistema de saúde avançado.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const activeGoals = healthGoals?.filter(goal => goal.is_active) || [];
  const unreadInsights = healthInsights?.filter(insight => !insight.is_read) || [];
  const recentMetrics = healthMetrics?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header com Score Geral */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Sistema de Saúde Avançado</h1>
          <p className="text-navy-300 text-lg">Monitoramento completo da sua saúde e bem-estar</p>
        </motion.div>

        {/* Score Geral de Saúde */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card-ultra border-navy-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-green-500/10" />
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-radial ${getScoreGradient(overallHealthScore || 0)}/20 rounded-full blur-3xl`} />
            
            <CardContent className="relative z-10 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-gradient-to-r ${getScoreGradient(overallHealthScore || 0)} rounded-2xl shadow-lg`}>
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Score Geral de Saúde</h2>
                    <p className="text-navy-300 text-lg">Baseado nos últimos 7 dias</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-6xl font-bold ${getScoreColor(overallHealthScore || 0)}`}>
                    {Math.round(overallHealthScore || 0)}
                  </div>
                  <div className="text-navy-400">/ 100</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Progress 
                  value={overallHealthScore || 0} 
                  className="h-3 bg-navy-800/50" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cards de Status Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="glass-card border-navy-600/30 hover:border-blue-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-navy-300 font-medium">Planos de Treino</span>
              </div>
              <div className="text-2xl font-bold text-white">{workoutPlans?.length || 0}</div>
              <div className="text-sm text-navy-400">Ativos</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-600/30 hover:border-green-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-navy-300 font-medium">Metas Ativas</span>
              </div>
              <div className="text-2xl font-bold text-white">{activeGoals.length}</div>
              <div className="text-sm text-navy-400">Em progresso</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-600/30 hover:border-purple-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-navy-300 font-medium">Métricas</span>
              </div>
              <div className="text-2xl font-bold text-white">{healthMetrics?.length || 0}</div>
              <div className="text-sm text-navy-400">Últimos 30 dias</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-600/30 hover:border-orange-500/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Brain className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-navy-300 font-medium">Insights</span>
              </div>
              <div className="text-2xl font-bold text-white">{unreadInsights.length}</div>
              <div className="text-sm text-navy-400">Não lidos</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metas em Destaque */}
        {activeGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card-ultra border-navy-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-6 h-6 text-green-400" />
                  Metas Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeGoals.slice(0, 3).map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white">{goal.goal_title}</h3>
                        <p className="text-sm text-navy-400">{goal.goal_description}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-400/10 border-green-400/30 text-green-400">
                        Prioridade {goal.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Progresso</span>
                        <span className="text-white">
                          {goal.current_value}/{goal.target_value} {goal.unit}
                        </span>
                      </div>
                      <Progress 
                        value={goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0} 
                        className="h-2 bg-navy-800/50" 
                      />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Insights Recentes */}
        {unreadInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-card-ultra border-navy-600/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="w-6 h-6 text-orange-400" />
                  Insights de Saúde
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {unreadInsights.slice(0, 3).map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${insight.severity === 'critical' ? 'bg-red-400/10 border-red-400/30 text-red-400' : ''}
                              ${insight.severity === 'warning' ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400' : ''}
                              ${insight.severity === 'info' ? 'bg-blue-400/10 border-blue-400/30 text-blue-400' : ''}
                              ${insight.severity === 'positive' ? 'bg-green-400/10 border-green-400/30 text-green-400' : ''}
                            `}
                          >
                            {insight.insight_type}
                          </Badge>
                          <span className="text-xs text-navy-400">{insight.category}</span>
                        </div>
                        <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                        <p className="text-sm text-navy-300">{insight.content}</p>
                      </div>
                      {insight.confidence_score && (
                        <div className="text-right ml-4">
                          <div className="text-sm text-navy-400">Confiança</div>
                          <div className="text-white font-semibold">
                            {Math.round(insight.confidence_score * 100)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navegação Rápida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="glass-card border-navy-600/30 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-blue-500/20 rounded-2xl mx-auto w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Treinos</h3>
              <p className="text-navy-300">Planos e sessões de treino</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-600/30 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-green-500/20 rounded-2xl mx-auto w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <Utensils className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nutrição</h3>
              <p className="text-navy-300">Planos e registro de refeições</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-navy-600/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-purple-500/20 rounded-2xl mx-auto w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Métricas</h3>
              <p className="text-navy-300">Monitoramento avançado</p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
