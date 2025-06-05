
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    confidence: number;
    actionable?: string;
    category: string;
  };
  index?: number;
  className?: string;
}

export function PremiumInsightCard({ insight, index = 0, className }: InsightCardProps) {
  const getInsightConfig = (type: string) => {
    switch (type) {
      case 'positive':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-400/10',
          borderColor: 'border-green-400/20',
          gradient: 'from-green-400/20 to-emerald-600/20',
        };
      case 'negative':
        return {
          icon: AlertTriangle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10',
          borderColor: 'border-red-400/20',
          gradient: 'from-red-400/20 to-pink-600/20',
        };
      default:
        return {
          icon: TrendingUp,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/10',
          borderColor: 'border-blue-400/20',
          gradient: 'from-blue-400/20 to-indigo-600/20',
        };
    }
  };

  const config = getInsightConfig(insight.type);
  const IconComponent = config.icon;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (confidence >= 60) return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    if (confidence >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={cn("group", className)}
    >
      <Card className={`glass-card border ${config.borderColor} relative overflow-hidden hover:shadow-2xl transition-all duration-500`}>
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent-orange rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${config.bgColor} border ${config.borderColor} relative`}>
                <IconComponent className={`w-5 h-5 ${config.color}`} />
                
                {/* Icon glow effect */}
                <div className={`absolute inset-0 rounded-xl ${config.bgColor} blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
              
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">
                  {insight.title}
                </h4>
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  {insight.category}
                </Badge>
              </div>
            </div>

            {/* Confidence badge */}
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}
            >
              {insight.confidence}% confiança
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {insight.description}
          </p>

          {/* Actionable insight */}
          {insight.actionable && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-3 p-3 bg-accent-orange/5 border border-accent-orange/20 rounded-lg"
            >
              <Target className="w-4 h-4 text-accent-orange mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-accent-orange mb-1">
                  Ação Recomendada
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {insight.actionable}
                </p>
              </div>
            </motion.div>
          )}

          {/* Bottom accent line */}
          <motion.div
            className={`h-0.5 bg-gradient-to-r ${config.gradient} rounded-full mt-4 mx-auto`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </CardContent>

        {/* Sparkle effect on hover */}
        <motion.div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Sparkles className="w-4 h-4 text-accent-orange" />
        </motion.div>
      </Card>
    </motion.div>
  );
}
