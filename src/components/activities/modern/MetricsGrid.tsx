
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';

interface Metric {
  id: string;
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface MetricsGridProps {
  metrics: Metric[];
  columns?: number;
}

export function MetricsGrid({ metrics, columns = 3 }: MetricsGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PremiumCard className="p-4 bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    {metric.label}
                  </div>
                </div>
              </div>
              
              <div className="flex items-baseline gap-1 mb-2">
                <motion.span
                  key={metric.value}
                  initial={{ scale: 1.2, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  {metric.value}
                </motion.span>
                {metric.unit && (
                  <span className="text-sm text-slate-400">{metric.unit}</span>
                )}
              </div>
              
              {metric.trend && metric.trendValue && (
                <div className={`text-xs flex items-center gap-1 ${
                  metric.trend === 'up' ? 'text-green-400' :
                  metric.trend === 'down' ? 'text-red-400' :
                  'text-slate-400'
                }`}>
                  <span>{metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}</span>
                  <span>{metric.trendValue}</span>
                </div>
              )}
            </PremiumCard>
          </motion.div>
        );
      })}
    </div>
  );
}
