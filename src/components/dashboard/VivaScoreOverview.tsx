
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Brain, 
  Moon, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Sparkles
} from 'lucide-react';
import { useVivaScore } from '@/hooks/useVivaScore';

export function VivaScoreOverview() {
  const { data: vivaData, isLoading } = useVivaScore();

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-navy-700 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-navy-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!vivaData) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-400 border-green-400/20 bg-green-400/10';
      case 'good': return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
      case 'fair': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'needs_attention': return 'text-red-400 border-red-400/20 bg-red-400/10';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'fair': return 'Regular';
      case 'needs_attention': return 'Atenção';
      default: return 'N/A';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const breakdownItems = [
    { key: 'physical', label: 'Físico', icon: Heart, value: vivaData.breakdown.physical, color: 'text-red-400' },
    { key: 'mental', label: 'Mental', icon: Brain, value: vivaData.breakdown.mental, color: 'text-purple-400' },
    { key: 'sleep', label: 'Sono', icon: Moon, value: vivaData.breakdown.sleep, color: 'text-indigo-400' },
    { key: 'energy', label: 'Energia', icon: Zap, value: vivaData.breakdown.energy, color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Score Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-accent-orange to-orange-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Score VIVA</h3>
                  <p className="text-sm text-navy-400 font-normal">Bem-estar Unificado</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getTrendIcon(vivaData.trend)}
                <span className="text-sm text-gray-400">
                  {vivaData.trendPercentage.toFixed(1)}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Circle */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-orange/20 to-orange-500/20 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-navy-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {vivaData.score}
                      </div>
                      <div className="text-sm text-navy-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge variant="outline" className={getLevelColor(vivaData.level)}>
                    {getLevelText(vivaData.level)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {breakdownItems.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                  <Progress 
                    value={item.value} 
                    className="h-2 bg-navy-800"
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recomendações */}
      {vivaData.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-accent-orange" />
                Recomendações Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vivaData.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-navy-800/30 rounded-lg border border-navy-700/20"
                  >
                    <div className="w-2 h-2 bg-accent-orange rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-300">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
