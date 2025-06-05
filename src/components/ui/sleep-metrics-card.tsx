
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
    border: 'border-blue-400/20',
    glow: 'shadow-blue-500/20'
  },
  purple: {
    gradient: 'from-purple-500 to-indigo-600',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-400/20',
    glow: 'shadow-purple-500/20'
  },
  green: {
    gradient: 'from-green-500 to-emerald-600',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-400/20',
    glow: 'shadow-green-500/20'
  },
  orange: {
    gradient: 'from-orange-500 to-amber-600',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-400/20',
    glow: 'shadow-orange-500/20'
  },
  red: {
    gradient: 'from-red-500 to-pink-600',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-400/20',
    glow: 'shadow-red-500/20'
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
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.3), 0 0 30px ${colors.glow}`
      }}
      className="group"
    >
      <Card className={`glass-card-holographic border-navy-600/30 relative overflow-hidden ${colors.glow} shadow-xl`}>
        {/* Background effects */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent-orange/10 to-transparent rounded-full blur-2xl" />
        
        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-3 bg-gradient-to-br ${colors.gradient} rounded-xl shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-medium text-white">{title}</h3>
                {subtitle && (
                  <p className="text-xs text-gray-400">{subtitle}</p>
                )}
              </div>
            </div>
            
            {status && (
              <Badge 
                variant="outline" 
                className={`${statusConfig[status].color === 'green' ? 'border-green-400/50 text-green-400' :
                             statusConfig[status].color === 'blue' ? 'border-blue-400/50 text-blue-400' :
                             statusConfig[status].color === 'orange' ? 'border-orange-400/50 text-orange-400' :
                             'border-red-400/50 text-red-400'} bg-navy-800/50`}
              >
                {statusConfig[status].label}
              </Badge>
            )}
          </div>

          {/* Main Value */}
          <div className="mb-4">
            <motion.div
              className={`text-3xl font-bold ${colors.text} mb-1`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {value}
            </motion.div>
            
            {trend && trendValue && (
              <div className="flex items-center gap-2">
                <div className={`text-xs font-medium ${
                  trend === 'up' ? 'text-green-400' :
                  trend === 'down' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'} {trendValue}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: delay + 0.3 }}
              >
                <Progress 
                  value={progress} 
                  className="h-3 bg-navy-800/50"
                />
              </motion.div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>{progress?.toFixed(0)}%</span>
                <span>100</span>
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <motion.div
              className={`p-3 ${colors.bg} rounded-lg border ${colors.border} mt-4`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4, delay: delay + 0.5 }}
            >
              <h4 className="text-xs font-medium text-white mb-2">💡 Insights</h4>
              <ul className="space-y-1">
                {insights.map((insight, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <div className="w-1 h-1 bg-accent-orange rounded-full mt-1.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
