
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  target?: number;
  className?: string;
  delay?: number;
}

export function HealthStatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  target,
  className,
  delay = 0
}: HealthStatsCardProps) {
  const progress = target && typeof value === 'number' ? (value / target) * 100 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      className={cn(
        "glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift group border border-navy-600/20 h-full",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-white/80 mb-1 truncate">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-navy-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        <motion.div
          className="p-2 sm:p-3 bg-accent-orange/10 rounded-lg sm:rounded-xl border border-accent-orange/20 group-hover:bg-accent-orange/20 transition-colors flex-shrink-0 ml-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-orange" />
        </motion.div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-all">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          
          {trend && (
            <motion.span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full flex-shrink-0",
                trend.isPositive 
                  ? "bg-accent-orange/20 text-accent-orange" 
                  : "bg-red-500/20 text-red-400"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </motion.span>
          )}
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-navy-400">Progresso</span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-navy-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-orange to-accent-orange-light rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.5 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
