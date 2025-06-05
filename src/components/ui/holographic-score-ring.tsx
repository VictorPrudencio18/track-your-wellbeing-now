
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Star } from 'lucide-react';

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
  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10B981'; // Verde
    if (score >= 70) return '#3B82F6'; // Azul
    if (score >= 55) return '#F59E0B'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  const getLevelConfig = (level: string, score: number) => {
    if (score < 55) {
      return {
        text: 'Needs attention',
        icon: AlertTriangle,
        color: '#EF4444',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30'
      };
    }
    switch (level) {
      case 'excellent':
        return {
          text: 'Excelente',
          icon: Star,
          color: '#10B981',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30'
        };
      case 'good':
        return {
          text: 'Bom',
          icon: Star,
          color: '#3B82F6',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30'
        };
      case 'fair':
        return {
          text: 'Regular',
          icon: Star,
          color: '#F59E0B',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30'
        };
      default:
        return {
          text: 'Needs attention',
          icon: AlertTriangle,
          color: '#EF4444',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30'
        };
    }
  };

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const levelConfig = getLevelConfig(level, score);
  const scoreColor = getScoreColor(score);

  // Partículas orbitais
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.2,
    radius: 130 + Math.random() * 20,
    angle: (i * 45) * (Math.PI / 180),
  }));

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Partículas orbitais */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: scoreColor,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${particle.angle}rad) translateX(${particle.radius}px)`,
              opacity: 0.6,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotate: 360,
            }}
            transition={{
              duration: 6,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Anel principal */}
      <div className="relative">
        {/* Glow effect externo */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${scoreColor}60 0%, transparent 70%)`,
            width: '280px',
            height: '280px',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%'
          }}
        />
        
        {/* Container do anel */}
        <div className="relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Anel de fundo */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="6"
              fill="transparent"
            />
            
            {/* Anel de fundo mais escuro interno */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="rgba(15, 23, 42, 0.9)"
              strokeWidth="3"
              fill="transparent"
            />
            
            {/* Anel de progresso */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              stroke={scoreColor}
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 12px ${scoreColor}80)`,
              }}
            />
            
            {/* Anel interno decorativo */}
            <circle
              cx="100"
              cy="100"
              r="75"
              stroke={`${scoreColor}30`}
              strokeWidth="1"
              fill="transparent"
            />
          </svg>

          {/* Conteúdo central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Score principal */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="mb-3"
              >
                <div className="text-5xl font-bold text-white mb-1">
                  {score}
                </div>
                <div className="text-sm text-gray-400 font-medium">/100</div>
              </motion.div>

              {/* Level badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${levelConfig.bgColor} ${levelConfig.borderColor}`}
              >
                <levelConfig.icon className="w-3 h-3" style={{ color: levelConfig.color }} />
                <span className="text-xs font-medium text-white">
                  {levelConfig.text}
                </span>
              </motion.div>

              {/* Trend indicator */}
              {trend !== 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="flex items-center justify-center gap-1 mt-2"
                >
                  {getTrendIcon()}
                  <span className="text-xs text-gray-400 font-medium">
                    {Math.abs(trend).toFixed(1)}%
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Estrelas decorativas para scores baixos */}
        {score < 55 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${25 + i * 20}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  rotate: [0, 180, 360],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <AlertTriangle className="w-3 h-3 text-red-400" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mini anéis de breakdown - Reposicionados */}
      {breakdown && (
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(breakdown).map(([key, value], index) => {
            const positions = [
              { x: -160, y: -40 }, // Top left
              { x: 160, y: -40 },  // Top right
              { x: -160, y: 40 },  // Bottom left
              { x: 160, y: 40 }    // Bottom right
            ];
            
            const position = positions[index];
            if (!position) return null;
            
            return (
              <motion.div
                key={key}
                className="absolute w-10 h-10"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.8 + index * 0.1 }}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke={getScoreColor(value)}
                    strokeWidth="2"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${(value / 100) * 100} 100`}
                    style={{
                      filter: `drop-shadow(0 0 4px ${getScoreColor(value)}60)`,
                    }}
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
