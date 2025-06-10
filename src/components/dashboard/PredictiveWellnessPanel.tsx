
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Brain,
  Clock,
  CheckCircle
} from 'lucide-react';
import { usePredictiveWellness } from '@/hooks/usePredictiveWellness';

export function PredictiveWellnessPanel() {
  const { data: predictions, isLoading, error } = usePredictiveWellness();

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-navy-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !predictions || predictions.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-accent-orange" />
            Sistema Preditivo de Bem-estar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400">
              Continue registrando seus dados para receber previsões personalizadas
            </p>
            <p className="text-navy-500 text-sm mt-2">
              Precisamos de pelo menos 7 dias de dados para gerar insights preditivos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'opportunity': return <Target className="w-5 h-5 text-green-400" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      default: return <CheckCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-red-400/20 bg-red-400/5';
      case 'opportunity': return 'border-green-400/20 bg-green-400/5';
      case 'trend': return 'border-blue-400/20 bg-blue-400/5';
      default: return 'border-purple-400/20 bg-purple-400/5';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-400 bg-green-400/10';
    if (probability >= 60) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-orange-400 bg-orange-400/10';
  };

  return (
    <Card className="glass-card border-navy-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="w-5 h-5 text-accent-orange" />
          Sistema Preditivo de Bem-estar
        </CardTitle>
        <p className="text-navy-400 text-sm">
          Insights baseados em IA sobre tendências futuras do seu bem-estar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.map((prediction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getTypeColor(prediction.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(prediction.type)}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white">
                    {prediction.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getProbabilityColor(prediction.probability)}
                    >
                      {prediction.probability}% confiança
                    </Badge>
                    <Badge variant="outline" className="text-navy-400 border-navy-600/30">
                      {prediction.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300">
                  {prediction.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-navy-400">
                  <Clock className="w-3 h-3" />
                  <span>{prediction.timeframe}</span>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Target className="w-4 h-4 text-accent-orange" />
                  <p className="text-sm text-accent-orange font-medium">
                    {prediction.actionable}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
