
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'purple' | 'pink' | 'cyan' | 'green';
  animated?: boolean;
  glow?: boolean;
  showPercentage?: boolean;
}

export function NeonProgress({ 
  value, 
  max = 100, 
  className,
  color = 'blue',
  animated = true,
  glow = true,
  showPercentage = false
}: NeonProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    blue: {
      bg: 'rgba(59, 130, 246, 0.1)',
      fill: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
      glow: '0 0 20px rgba(59, 130, 246, 0.6)'
    },
    purple: {
      bg: 'rgba(147, 51, 234, 0.1)',
      fill: 'linear-gradient(90deg, #9333ea, #7c3aed)',
      glow: '0 0 20px rgba(147, 51, 234, 0.6)'
    },
    pink: {
      bg: 'rgba(236, 72, 153, 0.1)',
      fill: 'linear-gradient(90deg, #ec4899, #db2777)',
      glow: '0 0 20px rgba(236, 72, 153, 0.6)'
    },
    cyan: {
      bg: 'rgba(34, 211, 238, 0.1)',
      fill: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
      glow: '0 0 20px rgba(34, 211, 238, 0.6)'
    },
    green: {
      bg: 'rgba(34, 197, 94, 0.1)',
      fill: 'linear-gradient(90deg, #22c55e, #16a34a)',
      glow: '0 0 20px rgba(34, 197, 94, 0.6)'
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        className="w-full h-3 rounded-full border border-white/20 overflow-hidden backdrop-blur-sm"
        style={{ backgroundColor: colors[color].bg }}
      >
        <motion.div
          className="h-full rounded-full relative"
          style={{ 
            background: colors[color].fill,
            boxShadow: glow ? colors[color].glow : 'none'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2
          }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                width: '30%'
              }}
            />
          )}
        </motion.div>
      </div>
      
      {showPercentage && (
        <motion.div
          className="absolute -top-8 right-0 text-sm font-medium text-white/90"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
      
      {glow && (
        <div 
          className="absolute inset-0 rounded-full blur-sm opacity-50 -z-10"
          style={{ 
            background: colors[color].fill,
            width: `${percentage}%`
          }}
        />
      )}
    </div>
  );
}
