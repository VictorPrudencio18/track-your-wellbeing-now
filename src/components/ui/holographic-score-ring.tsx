
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Sparkles, Star } from 'lucide-react';

interface HolographicScoreRingProps {
  score: number;
  trend?: number;
  level?: string;
  breakdown?: {
    physical: number;
    mental: number;
    sleep: number;
    energy: number;
  };
  className?: string;
}

export function HolographicScoreRing({ 
  score, 
  trend = 0, 
  level = 'good',
  breakdown,
  className 
}: HolographicScoreRingProps) {
  const circumference = 2 * Math.PI * 100;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981'; // Verde
    if (score >= 70) return '#3B82F6'; // Azul
    if (score >= 55) return '#F59E0B'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  const getLevelEmoji = (level: string) => {
    switch (level) {
      case 'excellent': return '⭐';
      case 'good': return '😊';
      case 'fair': return '😐';
      case 'needs_attention': return '⚠️';
      default: return '😊';
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    radius: 120 + Math.random() * 40,
    angle: (i * 30) * (Math.PI / 180),
  }));

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Partículas de fundo */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-accent-orange to-yellow-400 opacity-60"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${particle.angle}rad) translateX(${particle.radius}px)`,
            }}
            animate={{
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotate: 360,
            }}
            transition={{
              duration: 4,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Anel principal holográfico */}
      <div className="relative">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{
            background: `radial-gradient(circle, ${getScoreColor(score)}40 0%, transparent 70%)`,
          }}
        />
        
        {/* Ring container */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
            {/* Background ring */}
            <circle
              cx="120"
              cy="120"
              r="100"
              stroke="rgba(100, 116, 139, 0.2)"
              strokeWidth="8"
              fill="transparent"
            />
            
            {/* Progress ring */}
            <motion.circle
              cx="120"
              cy="120"
              r="100"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 8px ${getScoreColor(score)}80)`,
              }}
            />
            
            {/* Inner glow ring */}
            <circle
              cx="120"
              cy="120"
              r="85"
              stroke={`${getScoreColor(score)}20`}
              strokeWidth="2"
              fill="transparent"
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Score */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-2"
              >
                <div className="text-4xl font-bold text-white mb-1">
                  {score}
                </div>
                <div className="text-sm text-gray-400">/100</div>
              </motion.div>

              {/* Level indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <span className="text-2xl">{getLevelEmoji(level)}</span>
                <span className="text-sm font-medium text-accent-orange capitalize">
                  {level.replace('_', ' ')}
                </span>
              </motion.div>

              {/* Trend */}
              {trend !== 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="flex items-center justify-center gap-1 mt-2"
                >
                  {getTrendIcon()}
                  <span className="text-xs text-gray-400">
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 12}%`,
                top: `${15 + (i % 2) * 70}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: 180,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="w-4 h-4 text-accent-orange" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Breakdown mini rings */}
      {breakdown && (
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(breakdown).map(([key, value], index) => {
            const angle = (index * 90) * (Math.PI / 180);
            const radius = 140;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={key}
                className="absolute w-12 h-12"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={getScoreColor(value)}
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(value / 100) * 126} 126`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
