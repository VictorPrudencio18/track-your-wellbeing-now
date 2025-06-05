
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Lightbulb,
  Target,
  Activity
} from 'lucide-react';
import { useCorrelationAnalysis } from '@/hooks/useCorrelationAnalysis';

export function SmartInsights() {
  const { data: correlationData, isLoading } = useCorrelationAnalysis();

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-navy-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!correlationData || correlationData.insights.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-accent-orange" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400">
              Continue registrando seus dados para receber insights personalizados
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'negative': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <TrendingUp className="w-5 h-5 text-blue-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-400/20 bg-green-400/5';
      case 'negative': return 'border-red-400/20 bg-red-400/5';
      default: return 'border-blue-400/20 bg-blue-400/5';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-400 bg-green-400/10';
    if (confidence >= 50) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-orange-400 bg-orange-400/10';
  };

  return (
    <Card className="glass-card border-navy-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="w-5 h-5 text-accent-orange" />
          Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {correlationData.insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">
                    {insight.factor1} ↔ {insight.factor2}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={getConfidenceColor(insight.confidence)}
                  >
                    {insight.confidence.toFixed(0)}% confiança
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-300">
                  {insight.description}
                </p>
                
                <div className="flex items-center gap-2 pt-2">
                  <Target className="w-4 h-4 text-accent-orange" />
                  <p className="text-sm text-accent-orange font-medium">
                    {insight.actionable}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Gatilhos Identificados */}
        {(correlationData.triggers.positive.length > 0 || correlationData.triggers.negative.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 border-t border-navy-700/30"
          >
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-orange" />
              Gatilhos Identificados
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {correlationData.triggers.positive.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-green-400">Fatores Positivos</h5>
                  <div className="space-y-1">
                    {correlationData.triggers.positive.map((trigger, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {correlationData.triggers.negative.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-red-400">Fatores de Risco</h5>
                  <div className="space-y-1">
                    {correlationData.triggers.negative.map((trigger, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
