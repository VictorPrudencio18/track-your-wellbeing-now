
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/animations/count-up';
import { NeonProgress } from './neon-progress';

interface AdvancedStatsCardProps {
  title: string;
  value: number;
  target?: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'neon' | 'glass' | 'holographic';
  color?: 'blue' | 'purple' | 'pink' | 'cyan' | 'green' | 'orange';
  showProgress?: boolean;
  suffix?: string;
  subtitle?: string;
  animated?: boolean;
}

export function AdvancedStatsCard({
  title,
  value,
  target,
  icon: Icon,
  trend,
  variant = 'default',
  color = 'blue',
  showProgress = false,
  suffix = '',
  subtitle,
  animated = true
}: AdvancedStatsCardProps) {
  const colorSchemes = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-blue-100',
      text: 'text-blue-600',
      glow: 'hover:shadow-blue-500/25',
      neon: 'border-blue-400 text-blue-400'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-purple-100',
      text: 'text-purple-600',
      glow: 'hover:shadow-purple-500/25',
      neon: 'border-purple-400 text-purple-400'
    },
    pink: {
      gradient: 'from-pink-500 to-pink-600',
      bg: 'from-pink-50 to-pink-100',
      text: 'text-pink-600',
      glow: 'hover:shadow-pink-500/25',
      neon: 'border-pink-400 text-pink-400'
    },
    cyan: {
      gradient: 'from-cyan-500 to-cyan-600',
      bg: 'from-cyan-50 to-cyan-100',
      text: 'text-cyan-600',
      glow: 'hover:shadow-cyan-500/25',
      neon: 'border-cyan-400 text-cyan-400'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'from-green-50 to-green-100',
      text: 'text-green-600',
      glow: 'hover:shadow-green-500/25',
      neon: 'border-green-400 text-green-400'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-orange-100',
      text: 'text-orange-600',
      glow: 'hover:shadow-orange-500/25',
      neon: 'border-orange-400 text-orange-400'
    }
  };

  const scheme = colorSchemes[color];

  const variants = {
    default: `bg-gradient-to-br ${scheme.bg} border border-white/20`,
    neon: `bg-black/50 backdrop-blur-xl border-2 ${scheme.neon} shadow-[0_0_30px_rgba(34,211,238,0.3)]`,
    glass: `glass-card-premium`,
    holographic: `card-holographic`
  };

  const percentage = target ? (value / target) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "relative rounded-2xl p-6 overflow-hidden group cursor-pointer transition-all duration-500",
        variants[variant],
        scheme.glow
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="grid-pattern absolute inset-0" />
      </div>

      {/* Animated Background Glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${scheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
        whileHover={{ opacity: 0.1 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/70 mb-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-white/50">{subtitle}</p>
            )}
          </div>
          
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-r ${scheme.gradient} shadow-lg`}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.2 }
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <motion.h3 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {animated ? (
                <CountUp end={value} suffix={suffix} duration={2} />
              ) : (
                `${value.toLocaleString()}${suffix}`
              )}
            </motion.h3>
            
            {trend && (
              <motion.span
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-red-500/20 text-red-400"
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </motion.span>
            )}
          </div>

          {showProgress && target && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                <span>Progresso</span>
                <span>{Math.round(percentage)}%</span>
              </div>
              <NeonProgress 
                value={value}
                max={target}
                color={color}
                animated={animated}
                glow={true}
              />
            </motion.div>
          )}
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 -skew-x-12"
          whileHover={{
            opacity: 1,
            x: ['0%', '100%'],
            transition: { duration: 0.6 }
          }}
        />
      </div>
    </motion.div>
  );
}
