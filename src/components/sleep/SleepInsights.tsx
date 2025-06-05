
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  Calendar,
  Clock,
  Heart,
  Moon,
  Sun,
  Zap,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSleepInsights, useSleepRecommendations, useSleepCorrelations } from '@/hooks/useSleepAdvanced';

export function SleepInsights() {
  const { data: insights, isLoading: insightsLoading } = useSleepInsights();
  const { data: recommendations, isLoading: recommendationsLoading } = useSleepRecommendations();
  const { data: correlations, isLoading: correlationsLoading } = useSleepCorrelations();

  // Mock data for demo purposes
  const mockInsights = [
    {
      id: '1',
      insight_type: 'improvement',
      title: 'Melhoria na Consistência',
      description: 'Sua regularidade de horários melhorou 34% nas últimas duas semanas.',
      severity: 'positive',
      confidence: 92
    },
    {
      id: '2',
      insight_type: 'pattern',
      title: 'Padrão de Fim de Semana',
      description: 'Você tende a dormir 2h mais tarde nos fins de semana, afetando a segunda-feira.',
      severity: 'warning',
      confidence: 88
    },
    {
      id: '3',
      insight_type: 'correlation',
      title: 'Exercício e Sono Profundo',
      description: 'Exercícios pela manhã aumentam seu sono profundo em 23%.',
      severity: 'positive',
      confidence: 95
    }
  ];

  const mockRecommendations = [
    {
      id: '1',
      recommendation_type: 'bedtime',
      title: 'Ajuste de Horário',
      description: 'Tente ir para a cama 30 minutos mais cedo para melhorar a duração do sono.',
      priority: 5,
      expected_improvement: 15
    },
    {
      id: '2',
      recommendation_type: 'environment',
      title: 'Temperatura do Quarto',
      description: 'Mantenha a temperatura entre 18-20°C para otimizar a qualidade do sono.',
      priority: 4,
      expected_improvement: 12
    },
    {
      id: '3',
      recommendation_type: 'lifestyle',
      title: 'Cafeína',
      description: 'Evite cafeína após 14h para reduzir a latência do sono.',
      priority: 3,
      expected_improvement: 20
    }
  ];

  const mockCorrelations = [
    {
      id: '1',
      factor_name: 'Exercício Matinal',
      factor_type: 'activity',
      correlation_coefficient: 0.78,
      impact_level: 'high',
      confidence_score: 0.95
    },
    {
      id: '2',
      factor_name: 'Cafeína Tarde',
      factor_type: 'dietary',
      correlation_coefficient: -0.65,
      impact_level: 'medium',
      confidence_score: 0.88
    },
    {
      id: '3',
      factor_name: 'Estresse Trabalho',
      factor_type: 'mood',
      correlation_coefficient: -0.72,
      impact_level: 'high',
      confidence_score: 0.91
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Lightbulb className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'positive': return 'border-green-400/20 bg-green-500/10';
      case 'warning': return 'border-yellow-400/20 bg-yellow-500/10';
      case 'negative': return 'border-red-400/20 bg-red-500/10';
      default: return 'border-blue-400/20 bg-blue-500/10';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'bedtime': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'environment': return <Moon className="w-4 h-4 text-purple-400" />;
      case 'lifestyle': return <Heart className="w-4 h-4 text-red-400" />;
      case 'activity': return <Activity className="w-4 h-4 text-green-400" />;
      case 'nutrition': return <Zap className="w-4 h-4 text-orange-400" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCorrelationIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Activity className="w-4 h-4 text-green-400" />;
      case 'dietary': return <Zap className="w-4 h-4 text-orange-400" />;
      case 'mood': return <Heart className="w-4 h-4 text-red-400" />;
      case 'environmental': return <Moon className="w-4 h-4 text-purple-400" />;
      case 'lifestyle': return <Sun className="w-4 h-4 text-yellow-400" />;
      default: return <Brain className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (insightsLoading || recommendationsLoading || correlationsLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-navy-700/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">Insights Inteligentes</h2>
        </div>
        <p className="text-xl text-gray-300">
          Análises avançadas e recomendações personalizadas para otimizar seu sono
        </p>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className={`p-4 rounded-xl border ${getSeverityColor(insight.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-navy-800/50 rounded-lg">
                      {getSeverityIcon(insight.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{insight.title}</h4>
                        <Badge variant="outline" className="border-navy-400/50 text-navy-200 text-xs">
                          {insight.confidence}% confiança
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              Recomendações Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRecommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/30 h-full">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getRecommendationIcon(recommendation.recommendation_type)}
                          <h4 className="font-medium text-white text-sm">
                            {recommendation.title}
                          </h4>
                        </div>
                        
                        <p className="text-xs text-gray-300">
                          {recommendation.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Impacto esperado</span>
                            <span className="text-green-400">+{recommendation.expected_improvement}%</span>
                          </div>
                          <Progress 
                            value={recommendation.expected_improvement} 
                            className="h-1" 
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className="text-xs border-navy-400/50 text-navy-200"
                          >
                            Prioridade {recommendation.priority}/5
                          </Badge>
                          <Button size="sm" variant="outline" className="text-xs">
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Correlations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Correlações Descobertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCorrelations.map((correlation, index) => (
                <motion.div
                  key={correlation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-navy-800/30 rounded-xl border border-navy-600/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-navy-700/50 rounded-lg">
                        {getCorrelationIcon(correlation.factor_type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{correlation.factor_name}</h4>
                        <p className="text-xs text-gray-400 capitalize">
                          {correlation.factor_type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {Math.abs(correlation.correlation_coefficient * 100).toFixed(0)}%
                        </span>
                        {correlation.correlation_coefficient > 0 ? 
                          <TrendingUp className="w-4 h-4 text-green-400" /> : 
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        }
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${getImpactColor(correlation.impact_level)}`}>
                          {correlation.impact_level}
                        </span>
                        <Badge variant="outline" className="text-xs border-navy-400/50 text-navy-200">
                          {Math.round(correlation.confidence_score * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Resumo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">5/7</div>
                <div className="text-sm text-gray-400">Noites com meta atingida</div>
              </div>
              
              <div className="text-center p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">+12%</div>
                <div className="text-sm text-gray-400">Melhoria geral</div>
              </div>
              
              <div className="text-center p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">7.2h</div>
                <div className="text-sm text-gray-400">Duração média</div>
              </div>
              
              <div className="text-center p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">8.1/10</div>
                <div className="text-sm text-gray-400">Qualidade média</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
