
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target,
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';
import { usePredictiveWellness } from '@/hooks/usePredictiveWellness';

export function PredictiveWellnessPanel() {
  const { data: predictiveData, isLoading } = usePredictiveWellness();

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

  if (!predictiveData) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-navy-500 mx-auto mb-4" />
          <p className="text-navy-400">
            Continue registrando dados para ativar o sistema preditivo
          </p>
        </CardContent>
      </Card>
    );
  }

  const { forecast, risks, goalProbabilities, optimalWeekPlan } = predictiveData;

  const getRiskColor = (probability: number) => {
    if (probability > 0.7) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (probability > 0.4) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-green-400 bg-green-400/10 border-green-400/20';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability > 0.8) return 'text-green-400';
    if (probability > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* 7-Day Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
              Previsão de Bem-estar (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {forecast.slice(0, 7).map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 rounded-lg border border-navy-700/30 bg-navy-800/30"
                >
                  <div className="text-center space-y-2">
                    <div className="text-xs text-gray-400">
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {day.predictedScore}
                    </div>
                    <Progress value={day.predictedScore} className="h-1" />
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ fontSize: '10px' }}
                    >
                      {(day.confidence * 100).toFixed(0)}% confiança
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Predictions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Previsão de Riscos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {risks.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhum risco significativo detectado</p>
                </div>
              ) : (
                risks.map((risk, index) => (
                  <motion.div
                    key={risk.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getRiskColor(risk.probability)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white capitalize">
                        {risk.type.replace('_', ' ')}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {(risk.probability * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Timeframe: {risk.timeframe}
                    </p>
                    <div className="space-y-1">
                      {risk.preventiveActions.slice(0, 2).map((action, i) => (
                        <div key={i} className="text-xs text-gray-400 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Goal Achievement Probabilities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-green-400" />
                Probabilidade de Conquista
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goalProbabilities.map((goal, index) => (
                <motion.div
                  key={goal.goalType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-navy-700/30 bg-navy-800/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{goal.goalType}</h4>
                    <span className={`text-lg font-bold ${getProbabilityColor(goal.probability)}`}>
                      {(goal.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Consistência</span>
                      <span className="text-white">{(goal.factors.consistency * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={goal.factors.consistency * 100} className="h-1" />
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    {goal.recommendations.slice(0, 2).map((rec, i) => (
                      <div key={i} className="text-xs text-gray-400 flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Optimal Week Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-blue-400" />
              Plano de Semana Otimizada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {optimalWeekPlan.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-3 rounded-lg border border-navy-700/30 bg-navy-800/20"
                >
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">
                        {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </div>
                      <div className="text-sm font-medium text-white">{day.focus}</div>
                    </div>
                    
                    <div className="space-y-1">
                      {day.activities.map((activity, i) => (
                        <div key={i} className="text-xs text-gray-300 text-center">
                          {activity}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400">
                        Descanso: {day.restLevel}/10
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
