
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Moon, 
  Zap, 
  TrendingUp, 
  Clock,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { useSleepWellnessIntegration } from '@/hooks/useSleepWellnessIntegration';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SleepWellnessIntegration() {
  const { data: integrationData, isLoading } = useSleepWellnessIntegration();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-navy-700 rounded w-1/2"></div>
                <div className="h-20 bg-navy-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!integrationData) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6 text-center">
          <Moon className="w-12 h-12 text-navy-500 mx-auto mb-4" />
          <p className="text-navy-400">
            Continue registrando dados de sono e energia para análise integrada
          </p>
        </CardContent>
      </Card>
    );
  }

  const { correlations, sleepDebt, impactAnalysis, optimalInsights } = integrationData;

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return 'text-green-400';
    if (correlation > 0.2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDebtColor = (debt: number) => {
    if (debt < 1) return 'text-green-400';
    if (debt < 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Sleep-Energy Correlation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Correlação Sono vs Energia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={correlations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                      border: '1px solid rgba(245, 158, 11, 0.2)', 
                      borderRadius: '12px',
                      color: '#f8fafc'
                    }}
                    labelFormatter={(value) => `Data: ${new Date(value).toLocaleDateString('pt-BR')}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sleepQuality" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Qualidade do Sono"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energyLevel" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Nível de Energia"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                <div className="text-sm text-gray-400">Correlação Média</div>
                <div className={`text-lg font-bold ${getCorrelationColor(impactAnalysis.physicalImpact.energyCorrelation)}`}>
                  {(impactAnalysis.physicalImpact.energyCorrelation * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                <div className="text-sm text-gray-400">Impacto no Humor</div>
                <div className={`text-lg font-bold ${getCorrelationColor(impactAnalysis.moodImpact.correlation)}`}>
                  {impactAnalysis.moodImpact.trend === 'positive' ? '+' : ''}
                  {(impactAnalysis.moodImpact.correlation * 10).toFixed(1)}
                </div>
              </div>
              <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                <div className="text-sm text-gray-400">Produtividade</div>
                <div className={`text-lg font-bold ${getCorrelationColor(impactAnalysis.productivityImpact.correlation)}`}>
                  {impactAnalysis.productivityImpact.workSatisfactionChange > 0 ? '+' : ''}
                  {impactAnalysis.productivityImpact.workSatisfactionChange.toFixed(1)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Debt Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-orange-400" />
                Calculadora de Déficit de Sono
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Déficit Atual</div>
                <div className={`text-4xl font-bold ${getDebtColor(sleepDebt.currentDebt)}`}>
                  {sleepDebt.currentDebt.toFixed(1)}h
                </div>
                {sleepDebt.currentDebt > 0 && (
                  <Badge variant="outline" className="mt-2 text-orange-400 border-orange-400/50">
                    {sleepDebt.recoveryDays} dias para recuperar
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Déficit Semanal</span>
                  <span className={`font-medium ${getDebtColor(sleepDebt.weeklyDebt)}`}>
                    {sleepDebt.weeklyDebt.toFixed(1)}h
                  </span>
                </div>
                
                <Progress 
                  value={Math.max(0, 100 - (sleepDebt.weeklyDebt / 10) * 100)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium text-white text-sm">💡 Recomendações:</h4>
                {sleepDebt.recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimal Sleep Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-purple-400" />
                Insights de Sono Otimizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                  <Moon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Horário Ideal</div>
                  <div className="font-medium text-white">
                    {optimalInsights.optimalBedtime}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Despertar Ideal</div>
                  <div className="font-medium text-white">
                    {optimalInsights.optimalWakeTime}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Duração Ideal</span>
                  <span className="font-medium text-white">
                    {Math.round(optimalInsights.idealDuration / 60)}h {optimalInsights.idealDuration % 60}min
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Score de Consistência</span>
                  <span className={`font-medium ${
                    optimalInsights.consistencyScore > 80 ? 'text-green-400' :
                    optimalInsights.consistencyScore > 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {optimalInsights.consistencyScore.toFixed(0)}%
                  </span>
                </div>
                
                <Progress value={optimalInsights.consistencyScore} className="h-2" />
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium text-white text-sm">🎯 Melhorias:</h4>
                {optimalInsights.improvements.map((improvement, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {improvement}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Impact Analysis Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5 text-red-400" />
              Análise de Impacto do Sono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mood Impact */}
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-lg border border-blue-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h4 className="font-medium text-white">Impacto no Humor</h4>
                </div>
                <div className={`text-2xl font-bold mb-2 ${getCorrelationColor(impactAnalysis.moodImpact.correlation)}`}>
                  {impactAnalysis.moodImpact.trend === 'positive' ? '↗️' : impactAnalysis.moodImpact.trend === 'negative' ? '↘️' : '➡️'}
                  {' '}{impactAnalysis.moodImpact.trend === 'positive' ? 'Positivo' : impactAnalysis.moodImpact.trend === 'negative' ? 'Negativo' : 'Neutro'}
                </div>
                <div className="space-y-1">
                  {impactAnalysis.moodImpact.insights.map((insight, i) => (
                    <p key={i} className="text-xs text-gray-400">{insight}</p>
                  ))}
                </div>
              </div>

              {/* Physical Impact */}
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-lg border border-green-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-green-400" />
                  <h4 className="font-medium text-white">Impacto Físico</h4>
                </div>
                <div className={`text-2xl font-bold mb-2 ${getCorrelationColor(impactAnalysis.physicalImpact.energyCorrelation)}`}>
                  {(impactAnalysis.physicalImpact.energyCorrelation * 100).toFixed(0)}%
                </div>
                <div className="space-y-1">
                  {impactAnalysis.physicalImpact.insights.map((insight, i) => (
                    <p key={i} className="text-xs text-gray-400">{insight}</p>
                  ))}
                </div>
              </div>

              {/* Productivity Impact */}
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-600/10 rounded-lg border border-purple-400/20">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h4 className="font-medium text-white">Produtividade</h4>
                </div>
                <div className={`text-2xl font-bold mb-2 ${getCorrelationColor(impactAnalysis.productivityImpact.correlation)}`}>
                  {impactAnalysis.productivityImpact.workSatisfactionChange > 0 ? '+' : ''}
                  {impactAnalysis.productivityImpact.workSatisfactionChange.toFixed(1)}%
                </div>
                <div className="space-y-1">
                  {impactAnalysis.productivityImpact.insights.map((insight, i) => (
                    <p key={i} className="text-xs text-gray-400">{insight}</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
