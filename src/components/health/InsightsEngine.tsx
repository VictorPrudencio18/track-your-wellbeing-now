
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHealthAnalytics } from '@/hooks/useHealthAnalytics';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export function InsightsEngine() {
  const { data: analytics } = useHealthAnalytics();
  const [insights] = useState([
    {
      id: '1',
      type: 'positive',
      priority: 1,
      title: 'Padrão de Sono Melhorando',
      description: 'Seus dados mostram que você está dormindo 30 minutos mais cedo nas últimas duas semanas. Continue assim!',
      actionable: false,
      confidence: 92,
      tags: ['sono', 'rotina']
    },
    {
      id: '2',
      type: 'neutral',
      priority: 2,
      title: 'Correlação: Exercício × Humor',
      description: 'Detectamos uma correlação de 78% entre dias de exercício e melhores scores de humor. Que tal exercitar-se hoje?',
      actionable: true,
      confidence: 78,
      tags: ['exercício', 'humor', 'correlação']
    },
    {
      id: '3',
      type: 'negative',
      priority: 3,
      title: 'Stress nas Segundas-feiras',
      description: 'Suas segundas-feiras apresentam 40% mais stress que outros dias. Considere técnicas de preparação no domingo.',
      actionable: true,
      confidence: 85,
      tags: ['stress', 'padrão semanal']
    },
    {
      id: '4',
      type: 'positive',
      priority: 4,
      title: 'Hidratação Consistente',
      description: 'Parabéns! Você manteve uma hidratação adequada por 14 dias consecutivos.',
      actionable: false,
      confidence: 100,
      tags: ['hidratação', 'consistência']
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'negative':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/10';
      case 'negative':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-navy-800/50 to-navy-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent-orange" />
                Motor de Insights
              </CardTitle>
              <p className="text-navy-400 text-sm">
                Descobertas inteligentes baseadas nos seus dados de saúde
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-navy-600 text-navy-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Novos
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Insights Grid */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`glass-card border ${getInsightColor(insight.type)} hover:scale-[1.02] transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                        <p className="text-navy-300 text-sm leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}% confiança
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {insight.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-navy-700 text-navy-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {insight.actionable && (
                        <Button size="sm" variant="outline" className="text-xs border-navy-600 text-navy-300 hover:bg-navy-700">
                          Aplicar Sugestão
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Insights Positivos',
            value: insights.filter(i => i.type === 'positive').length,
            icon: CheckCircle,
            color: 'text-green-400'
          },
          {
            title: 'Oportunidades',
            value: insights.filter(i => i.actionable).length,
            icon: TrendingUp,
            color: 'text-blue-400'
          },
          {
            title: 'Confiança Média',
            value: `${Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%`,
            icon: Brain,
            color: 'text-purple-400'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/20 text-center">
              <CardContent className="p-4">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-navy-400">
                  {stat.title}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
