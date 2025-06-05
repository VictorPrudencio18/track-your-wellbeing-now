
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Lightbulb,
  Eye,
  Archive
} from 'lucide-react';

export function InsightsCenter() {
  const { healthInsights, markInsightAsRead } = useAdvancedHealth();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Info;
      case 'low': return CheckCircle;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertTriangle;
      default: return Brain;
    }
  };

  const unreadInsights = healthInsights.filter(insight => !insight.is_read);
  const readInsights = healthInsights.filter(insight => insight.is_read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Central de Insights</h2>
          <p className="text-navy-400">Análises inteligentes baseadas em seus dados de saúde</p>
        </div>
        <Badge className="bg-accent-orange/20 text-accent-orange">
          {unreadInsights.length} novos insights
        </Badge>
      </div>

      {unreadInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent-orange" />
            Novos Insights
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {unreadInsights.map((insight, index) => {
              const SeverityIcon = getSeverityIcon(insight.severity);
              const CategoryIcon = getCategoryIcon(insight.category);
              const severityColor = getSeverityColor(insight.severity);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-lg">
                            <CategoryIcon className="w-5 h-5 text-accent-orange" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg group-hover:text-accent-orange transition-colors">
                              {insight.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${severityColor} border`}>
                                <SeverityIcon className="w-3 h-3 mr-1" />
                                {insight.severity}
                              </Badge>
                              <Badge className="bg-navy-700/50 text-navy-300">
                                {insight.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-navy-300 leading-relaxed">{insight.content}</p>
                      
                      {insight.actionable_steps && insight.actionable_steps.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-white font-medium text-sm">Ações Recomendadas:</h4>
                          <ul className="space-y-1">
                            {insight.actionable_steps.slice(0, 3).map((step: any, stepIndex: number) => (
                              <li key={stepIndex} className="text-navy-400 text-sm flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                {typeof step === 'string' ? step : step.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-navy-700/30">
                        <div className="text-navy-500 text-xs">
                          {new Date(insight.created_at).toLocaleDateString('pt-BR')}
                          {insight.confidence_score && (
                            <span className="ml-2">
                              Confiança: {Math.round(insight.confidence_score * 100)}%
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
                          onClick={() => markInsightAsRead.mutate(insight.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Marcar como Lido
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {readInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-navy-400" />
            Insights Lidos
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {readInsights.slice(0, 6).map((insight, index) => {
              const CategoryIcon = getCategoryIcon(insight.category);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="glass-card border-navy-600/20 bg-navy-800/20 backdrop-blur-xl opacity-75 hover:opacity-100 transition-opacity">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-navy-700/30 rounded-lg">
                          <CategoryIcon className="w-4 h-4 text-navy-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm mb-1">{insight.title}</h4>
                          <p className="text-navy-400 text-xs leading-relaxed line-clamp-2">
                            {insight.content}
                          </p>
                          <div className="text-navy-500 text-xs mt-2">
                            {new Date(insight.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {healthInsights.length === 0 && (
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Sem Insights Disponíveis</h3>
            <p className="text-navy-400 leading-relaxed">
              Continue registrando suas métricas de saúde para receber insights personalizados baseados em seus dados
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
