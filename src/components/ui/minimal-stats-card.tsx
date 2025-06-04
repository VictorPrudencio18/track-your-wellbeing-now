
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function MinimalStatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  className,
  delay = 0
}: MinimalStatsCardProps) {
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
        "glass-card rounded-2xl p-6 hover-lift group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-navy-400 mb-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-navy-500">
              {subtitle}
            </p>
          )}
        </div>
        
        <motion.div
          className="p-3 bg-accent-orange/10 rounded-xl border border-accent-orange/20 group-hover:bg-accent-orange/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-5 h-5 text-accent-orange" />
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          
          {trend && (
            <motion.span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
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
      </div>
    </motion.div>
  );
}
