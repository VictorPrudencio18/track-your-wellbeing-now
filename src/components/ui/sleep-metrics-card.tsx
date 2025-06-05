
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SleepMetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'excellent' | 'good' | 'fair' | 'poor';
  delay?: number;
  insights?: string[];
}

const colorMap = {
  blue: {
    gradient: 'from-blue-500 to-cyan-600',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
    glow: 'shadow-blue-500/25',
    progressBg: 'bg-blue-500/20',
    progressFill: 'bg-gradient-to-r from-blue-400 to-cyan-500'
  },
  purple: {
    gradient: 'from-purple-500 to-indigo-600',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-400/30',
    glow: 'shadow-purple-500/25',
    progressBg: 'bg-purple-500/20',
    progressFill: 'bg-gradient-to-r from-purple-400 to-indigo-500'
  },
  green: {
    gradient: 'from-green-500 to-emerald-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-400/30',
    glow: 'shadow-green-500/25',
    progressBg: 'bg-green-500/20',
    progressFill: 'bg-gradient-to-r from-green-400 to-emerald-500'
  },
  orange: {
    gradient: 'from-orange-500 to-amber-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-400/30',
    glow: 'shadow-orange-500/25',
    progressBg: 'bg-orange-500/20',
    progressFill: 'bg-gradient-to-r from-orange-400 to-amber-500'
  },
  red: {
    gradient: 'from-red-500 to-pink-600',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-400/30',
    glow: 'shadow-red-500/25',
    progressBg: 'bg-red-500/20',
    progressFill: 'bg-gradient-to-r from-red-400 to-pink-500'
  }
};

const statusConfig = {
  excellent: { color: 'green', label: 'Excelente' },
  good: { color: 'blue', label: 'Bom' },
  fair: { color: 'orange', label: 'Regular' },
  poor: { color: 'red', label: 'Ruim' }
};

export function SleepMetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  progress,
  trend,
  trendValue,
  status,
  delay = 0,
  insights = []
}: SleepMetricsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.4)`
      }}
      className="group w-full"
    >
      <Card className={`
        relative overflow-hidden backdrop-blur-xl 
        bg-gradient-to-br from-navy-800/90 to-navy-900/95 
        border-2 ${colors.border} 
        ${colors.glow} shadow-2xl
        hover:border-opacity-60 transition-all duration-300
      `}>
        {/* Background gradient effects */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-40`} />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-white/5 to-transparent rounded-full blur-xl" />
        
        <CardContent className="p-6 relative z-10">
          {/* Header with icon and title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-2xl shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-gray-400">{subtitle}</p>
                )}
              </div>
            </div>
            
            {status && (
              <Badge 
                variant="outline" 
                className={`
                  ${statusConfig[status].color === 'green' ? 'border-green-400/50 text-green-400 bg-green-500/10' :
                    statusConfig[status].color === 'blue' ? 'border-blue-400/50 text-blue-400 bg-blue-500/10' :
                    statusConfig[status].color === 'orange' ? 'border-orange-400/50 text-orange-400 bg-orange-500/10' :
                    'border-red-400/50 text-red-400 bg-red-500/10'} 
                  font-medium text-xs px-2 py-1
                `}
              >
                {statusConfig[status].label}
              </Badge>
            )}
          </div>

          {/* Main Value Display */}
          <div className="mb-4">
            <motion.div
              className={`text-4xl font-bold ${colors.text} mb-2 tracking-tight`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {value}
            </motion.div>
            
            {trend && trendValue && (
              <div className="flex items-center gap-2">
                <div className={`text-xs font-medium flex items-center gap-1 ${
                  trend === 'up' ? 'text-green-400' :
                  trend === 'down' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  <span className="text-lg">
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
                  </span>
                  {trendValue}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Progresso</span>
                <span className="text-xs font-medium text-white">{progress?.toFixed(0)}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: delay + 0.3 }}
                className="relative"
              >
                <div className={`h-2 ${colors.progressBg} rounded-full overflow-hidden`}>
                  <motion.div 
                    className={`h-full ${colors.progressFill} rounded-full relative`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div
              className={`p-3 ${colors.bg} rounded-xl border ${colors.border} mt-4`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4, delay: delay + 0.7 }}
            >
              <h4 className="text-xs font-medium text-white mb-2 flex items-center gap-1">
                <span>💡</span>
                Insights
              </h4>
              <ul className="space-y-1">
                {insights.map((insight, index) => (
                  <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent-orange rounded-full mt-1.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
