
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Sun, 
  Cloud, 
  Users, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb
} from 'lucide-react';
import { useEnvironmentalFactors } from '@/hooks/useEnvironmentalFactors';

export function EnvironmentalFactorsPanel() {
  const { data: factors, isLoading, error } = useEnvironmentalFactors();

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

  if (error || !factors || factors.length === 0) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5 text-accent-orange" />
            Fatores Ambientais e Sociais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sun className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400">
              Continue registrando dados para identificar fatores ambientais que afetam seu bem-estar
            </p>
            <p className="text-navy-500 text-sm mt-2">
              Precisamos de pelo menos 14 dias de dados para análise ambiental
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-400/20 bg-green-400/5';
      case 'negative': return 'border-red-400/20 bg-red-400/5';
      default: return 'border-gray-400/20 bg-gray-400/5';
    }
  };

  const getFactorIcon = (factor: string) => {
    if (factor.includes('Domingo') || factor.includes('Sábado')) return <Calendar className="w-4 h-4" />;
    if (factor.includes('Verão') || factor.includes('Inverno')) return <Sun className="w-4 h-4" />;
    if (factor.includes('Outono') || factor.includes('Primavera')) return <Cloud className="w-4 h-4" />;
    if (factor.includes('Fins de Semana')) return <Users className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'text-green-400 bg-green-400/10';
    if (abs >= 0.4) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-orange-400 bg-orange-400/10';
  };

  return (
    <Card className="glass-card border-navy-700/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5 text-accent-orange" />
          Fatores Ambientais e Sociais
        </CardTitle>
        <p className="text-navy-400 text-sm">
          Identificação de fatores externos que influenciam seu bem-estar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {factors.map((factor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getImpactColor(factor.impact)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getImpactIcon(factor.impact)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFactorIcon(factor.factor)}
                    <h4 className="font-medium text-white">
                      {factor.factor}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getCorrelationColor(factor.correlation)}
                    >
                      {Math.abs(factor.correlation * 100).toFixed(0)}% correlação
                    </Badge>
                    <Badge variant="outline" className="text-navy-400 border-navy-600/30">
                      {factor.dataPoints} registros
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300">
                  {factor.description}
                </p>
                
                <div className="flex items-center gap-2 pt-2">
                  <Lightbulb className="w-4 h-4 text-accent-orange" />
                  <p className="text-sm text-accent-orange font-medium">
                    {factor.suggestion}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Resumo dos fatores identificados */}
        <div className="mt-6 p-4 bg-navy-800/30 rounded-lg border border-navy-700/20">
          <h4 className="font-medium text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-orange" />
            Resumo dos Fatores
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-400 font-medium">
                {factors.filter(f => f.impact === 'positive').length}
              </span>
              <span className="text-navy-400 ml-1">fatores positivos</span>
            </div>
            <div>
              <span className="text-red-400 font-medium">
                {factors.filter(f => f.impact === 'negative').length}
              </span>
              <span className="text-navy-400 ml-1">fatores de atenção</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">
                {factors.filter(f => f.impact === 'neutral').length}
              </span>
              <span className="text-navy-400 ml-1">fatores neutros</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
