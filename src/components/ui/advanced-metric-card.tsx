
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedMetricCardProps {
  title: string;
  value: string | number;
  target?: string | number;
  progress?: number;
  trend?: number;
  icon: LucideIcon;
  category?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
}

export function AdvancedMetricCard({
  title,
  value,
  target,
  progress = 0,
  trend,
  icon: Icon,
  category,
  color = 'blue',
  size = 'md',
  interactive = true,
  className
}: AdvancedMetricCardProps) {
  const colorConfig = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-400/20',
      accent: 'text-blue-400',
      accentBg: 'bg-blue-400/10',
      glow: 'shadow-blue-400/20',
    },
    green: {
      bg: 'from-green-500/20 to-green-600/20',
      border: 'border-green-400/20',
      accent: 'text-green-400',
      accentBg: 'bg-green-400/10',
      glow: 'shadow-green-400/20',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-400/20',
      accent: 'text-orange-400',
      accentBg: 'bg-orange-400/10',
      glow: 'shadow-orange-400/20',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-400/20',
      accent: 'text-purple-400',
      accentBg: 'bg-purple-400/10',
      glow: 'shadow-purple-400/20',
    },
    red: {
      bg: 'from-red-500/20 to-red-600/20',
      border: 'border-red-400/20',
      accent: 'text-red-400',
      accentBg: 'bg-red-400/10',
      glow: 'shadow-red-400/20',
    },
    indigo: {
      bg: 'from-indigo-500/20 to-indigo-600/20',
      border: 'border-indigo-400/20',
      accent: 'text-indigo-400',
      accentBg: 'bg-indigo-400/10',
      glow: 'shadow-indigo-400/20',
    },
  }[color];

  const sizeConfig = {
    sm: {
      card: 'p-4',
      icon: 'w-4 h-4',
      title: 'text-sm',
      value: 'text-lg',
    },
    md: {
      card: 'p-6',
      icon: 'w-5 h-5',
      title: 'text-sm',
      value: 'text-2xl',
    },
    lg: {
      card: 'p-8',
      icon: 'w-6 h-6',
      title: 'text-base',
      value: 'text-3xl',
    },
  }[size];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-400';
    return trend > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={interactive ? { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      className={cn("group", className)}
    >
      <Card className={`glass-card border ${colorConfig.border} relative overflow-hidden transition-all duration-500 ${interactive ? `hover:${colorConfig.glow} hover:shadow-xl` : ''}`}>
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Floating orb */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent-orange/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardContent className={`${sizeConfig.card} relative z-10`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${colorConfig.accentBg} border ${colorConfig.border} relative`}>
                <Icon className={`${sizeConfig.icon} ${colorConfig.accent}`} />
                
                {/* Icon pulse effect */}
                <motion.div
                  className={`absolute inset-0 rounded-xl ${colorConfig.accentBg} opacity-0 group-hover:opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
              
              <div>
                <h4 className={`font-medium text-white ${sizeConfig.title}`}>
                  {title}
                </h4>
                {category && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-600 mt-1">
                    {category}
                  </Badge>
                )}
              </div>
            </div>

            {/* Trend indicator */}
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-xs font-medium ${getTrendColor()}`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`font-bold text-white ${sizeConfig.value} mb-1`}
            >
              {value}
            </motion.div>
            
            {target && (
              <div className="text-sm text-gray-400">
                Meta: {target}
              </div>
            )}
          </div>

          {/* Progress */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Progresso</span>
                <span className="text-xs font-medium text-white">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-2 bg-navy-800/50"
                />
                
                {/* Glow effect on progress bar */}
                <motion.div
                  className={`absolute top-0 left-0 h-2 ${colorConfig.accentBg} rounded-full opacity-50`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </div>
          )}

          {/* Achievement indicator */}
          {progress >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-1 mt-3 text-xs text-green-400 font-medium"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Meta atingida! 🎉
            </motion.div>
          )}
        </CardContent>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      </Card>
    </motion.div>
  );
}
