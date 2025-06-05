
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  Target,
  Lightbulb,
  Calendar,
  Zap,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useBehavioralPatterns } from '@/hooks/useBehavioralPatterns';

export function BehavioralPatternsPanel() {
  const { data: patternsData, isLoading } = useBehavioralPatterns();

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

  if (!patternsData) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 text-navy-500 mx-auto mb-4" />
          <p className="text-navy-400">
            Colete mais dados para análise comportamental
          </p>
        </CardContent>
      </Card>
    );
  }

  const { weeklyHeatmap, habitStrengths, triggers, recommendations, insights } = patternsData;

  const getHeatmapColor = (intensity: number) => {
    if (intensity > 80) return 'bg-green-400/80';
    if (intensity > 60) return 'bg-green-400/60';
    if (intensity > 40) return 'bg-yellow-400/60';
    if (intensity > 20) return 'bg-orange-400/60';
    return 'bg-red-400/60';
  };

  const getStrengthColor = (strength: number) => {
    if (strength > 80) return 'text-green-400';
    if (strength > 60) return 'text-blue-400';
    if (strength > 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Weekly Behavior Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-accent-orange" />
              Mapa de Calor Comportamental
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weeklyHeatmap.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xs text-gray-400 mb-2">{day.day.slice(0, 3)}</div>
                  <div 
                    className={`w-12 h-12 rounded-lg ${getHeatmapColor(day.intensity)} flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="text-xs font-bold text-white">
                      {day.intensity.toFixed(0)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-300">
                      Ex: {day.patterns.exercise.toFixed(0)}%
                    </div>
                    <div className="text-gray-300">
                      Humor: {(day.patterns.mood / 10).toFixed(1)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-navy-700/30">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-400/60 rounded"></div>
                <span className="text-gray-400">Baixa</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-yellow-400/60 rounded"></div>
                <span className="text-gray-400">Média</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-green-400/80 rounded"></div>
                <span className="text-gray-400">Alta</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-yellow-400" />
                Força dos Hábitos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {habitStrengths.map((habit, index) => (
                <motion.div
                  key={habit.habit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-navy-700/30 bg-navy-800/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{habit.habit}</h4>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(habit.trend)}
                      <span className={`font-bold ${getStrengthColor(habit.strength)}`}>
                        {habit.strength.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <Progress value={habit.strength} className="h-2 mb-3" />
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Consistência: {(habit.consistency * 100).toFixed(0)}%</span>
                    <span>Sequência: {habit.streak} dias</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Behavioral Triggers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-blue-400" />
                Gatilhos Comportamentais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {triggers.length === 0 ? (
                <div className="text-center py-6">
                  <Brain className="w-12 h-12 text-navy-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Colete mais dados para identificar padrões
                  </p>
                </div>
              ) : (
                triggers.map((trigger, index) => (
                  <motion.div
                    key={trigger.trigger}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-navy-700/30 bg-navy-800/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{trigger.trigger}</h4>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {(trigger.confidence * 100).toFixed(0)}% confiança
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{trigger.effect}</p>
                    
                    <div className="space-y-1">
                      {trigger.examples.map((example, i) => (
                        <div key={i} className="text-xs text-gray-400">
                          • {example}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Smart Recommendations & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="w-5 h-5 text-green-400" />
                Recomendações Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.habit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-green-400/20 bg-green-400/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{rec.habit}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        rec.difficulty === 'easy' ? 'text-green-400 border-green-400/50' :
                        rec.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400/50' :
                        'text-red-400 border-red-400/50'
                      }`}
                    >
                      {rec.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{rec.reason}</p>
                  <p className="text-sm text-green-400 mb-2">💡 {rec.expectedBenefit}</p>
                  
                  <div className="text-xs text-gray-400 bg-navy-800/30 p-2 rounded">
                    <strong>Como fazer:</strong> {rec.implementation}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Behavioral Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-purple-400" />
                Insights Comportamentais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-purple-400/20 bg-purple-400/5"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-300">{insight}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
