
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HolographicScoreRingProps {
  score: number;
  trend?: number;
  level: string;
  breakdown: {
    physical: number;
    mental: number;
    sleep: number;
    energy: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function HolographicScoreRing({ 
  score, 
  trend = 0, 
  level, 
  breakdown,
  size = 'lg' 
}: HolographicScoreRingProps) {
  const sizeConfig = {
    sm: { width: 200, height: 200, radius: 80, strokeWidth: 8, fontSize: '2xl' },
    md: { width: 250, height: 250, radius: 100, strokeWidth: 10, fontSize: '3xl' },
    lg: { width: 300, height: 300, radius: 120, strokeWidth: 12, fontSize: '4xl' }
  };
  
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const scoreOffset = circumference - (score / 100) * circumference;
  const center = config.width / 2;

  const getLevelColor = () => {
    switch (level) {
      case 'excellent': return { primary: '#10b981', secondary: '#059669', bg: 'bg-emerald-500/10' };
      case 'good': return { primary: '#3b82f6', secondary: '#2563eb', bg: 'bg-blue-500/10' };
      case 'fair': return { primary: '#f59e0b', secondary: '#d97706', bg: 'bg-amber-500/10' };
      case 'needs_attention': return { primary: '#ef4444', secondary: '#dc2626', bg: 'bg-red-500/10' };
      default: return { primary: '#6b7280', secondary: '#4b5563', bg: 'bg-gray-500/10' };
    }
  };

  const getLevelText = () => {
    switch (level) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'fair': return 'Regular';
      case 'needs_attention': return 'Atenção';
      default: return 'N/A';
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const colors = getLevelColor();

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Score Ring */}
      <div className="relative" style={{ width: config.width, height: config.height }}>
        {/* Subtle background glow */}
        <div 
          className="absolute inset-4 rounded-full blur-2xl opacity-30"
          style={{ 
            background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`
          }}
        />
        
        <svg 
          className="transform -rotate-90" 
          width={config.width} 
          height={config.height}
          viewBox={`0 0 ${config.width} ${config.height}`}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke="rgba(30, 41, 59, 0.4)"
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Score progress */}
          <motion.circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke="url(#scoreGradient)"
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={scoreOffset}
            filter="url(#glow)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: scoreOffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.primary}40)`
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="space-y-2"
            >
              <div 
                className={`text-${config.fontSize} font-bold text-white`}
                style={{
                  textShadow: `0 0 15px ${colors.primary}60, 0 2px 4px rgba(0,0,0,0.5)`
                }}
              >
                {score}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                Score VIVA
              </div>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.bg} border border-current/20`}>
                <span className="text-xs font-medium" style={{ color: colors.primary }}>
                  {getLevelText()}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Breakdown metrics */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {Object.entries(breakdown).map(([key, value], index) => {
          const labels = {
            physical: 'Físico',
            mental: 'Mental', 
            sleep: 'Sono',
            energy: 'Energia'
          };
          
          const metricColors = {
            physical: 'text-red-400',
            mental: 'text-purple-400',
            sleep: 'text-indigo-400',
            energy: 'text-yellow-400'
          };

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="text-center p-3 bg-navy-800/30 rounded-xl border border-navy-600/20 backdrop-blur-sm"
            >
              <div className={`text-lg font-semibold ${metricColors[key as keyof typeof metricColors]} mb-1`}>
                {value}
              </div>
              <div className="text-xs text-gray-400">
                {labels[key as keyof typeof labels]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trend indicator */}
      {trend !== 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800/40 rounded-full border border-navy-600/30"
        >
          {getTrendIcon()}
          <span className="text-sm text-gray-300">
            {Math.abs(trend)}% esta semana
          </span>
        </motion.div>
      )}
    </div>
  );
}
