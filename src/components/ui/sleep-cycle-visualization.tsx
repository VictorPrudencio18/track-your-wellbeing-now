
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Brain, Heart, Zap } from 'lucide-react';

interface SleepCycleVisualizationProps {
  sleepPhases: Array<{
    phase: string;
    duration: number;
    quality: number;
    color: string;
  }>;
  totalDuration: number;
  className?: string;
}

export function SleepCycleVisualization({ 
  sleepPhases, 
  totalDuration,
  className 
}: SleepCycleVisualizationProps) {
  const radius = 130;
  const centerRadius = 50;
  let currentAngle = 0;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background rings com efeito mais sutil */}
      <div className="absolute inset-0">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-navy-600/10"
            style={{
              transform: `scale(${1 + i * 0.15})`,
            }}
            animate={{
              rotate: 360,
              scale: [1 + i * 0.15, 1.1 + i * 0.15, 1 + i * 0.15],
            }}
            transition={{
              rotate: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      {/* Main visualization */}
      <div className="relative w-96 h-96">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
          {/* Background circle com stroke mais grosso */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            stroke="rgba(30, 41, 59, 0.6)"
            strokeWidth="12"
            fill="transparent"
          />
          
          {/* Sleep phases arcs */}
          {sleepPhases.map((phase, index) => {
            const phaseAngle = (phase.duration / totalDuration) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + phaseAngle;
            
            const x1 = 160 + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 160 + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 160 + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 160 + radius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = phaseAngle > 180 ? 1 : 0;
            
            currentAngle += phaseAngle;
            
            return (
              <motion.path
                key={index}
                d={`M 160 160 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={phase.color}
                stroke={phase.color}
                strokeWidth="3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                style={{
                  filter: `drop-shadow(0 0 15px ${phase.color}80)`,
                }}
              />
            );
          })}
          
          {/* Centro com background mais forte e bordas */}
          <circle
            cx="160"
            cy="160"
            r={centerRadius}
            fill="rgba(15, 23, 42, 0.95)"
            stroke="rgba(245, 158, 11, 0.8)"
            strokeWidth="3"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.4))'
            }}
          />
          
          {/* Inner glow effect */}
          <circle
            cx="160"
            cy="160"
            r={centerRadius - 5}
            fill="none"
            stroke="url(#centerGlow)"
            strokeWidth="2"
            opacity="0.6"
          />
          
          {/* Gradients */}
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.8)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
            </radialGradient>
          </defs>
        </svg>

        {/* Center content com melhor contraste */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="mb-3"
            >
              <Moon className="w-10 h-10 text-accent-orange mx-auto filter drop-shadow-lg" />
            </motion.div>
            <div 
              className="text-3xl font-bold text-white mb-1"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.8)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </div>
            <div 
              className="text-sm text-gray-300 font-medium"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              Duração Total
            </div>
          </div>
        </div>

        {/* Phase indicators com melhor posicionamento */}
        {sleepPhases.map((phase, index) => {
          const angle = (sleepPhases.slice(0, index).reduce((sum, p) => sum + p.duration, 0) + phase.duration / 2) / totalDuration * 360;
          const indicatorRadius = radius + 40;
          const x = 160 + indicatorRadius * Math.cos((angle - 90) * Math.PI / 180);
          const y = 160 + indicatorRadius * Math.sin((angle - 90) * Math.PI / 180);
          
          return (
            <motion.div
              key={index}
              className="absolute w-14 h-14 -translate-x-7 -translate-y-7"
              style={{ left: x, top: y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
            >
              <div 
                className="w-full h-full rounded-full border-3 flex items-center justify-center backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${phase.color}25`,
                  borderColor: phase.color,
                  boxShadow: `0 0 25px ${phase.color}60, inset 0 0 15px ${phase.color}20`
                }}
              >
                {phase.phase === 'REM' && <Brain className="w-6 h-6" style={{ color: phase.color, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
                {phase.phase === 'Deep' && <Zap className="w-6 h-6" style={{ color: phase.color, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
                {phase.phase === 'Light' && <Heart className="w-6 h-6" style={{ color: phase.color, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
                {phase.phase === 'Awake' && <Sun className="w-6 h-6" style={{ color: phase.color, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles mais sutis */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-accent-orange rounded-full opacity-40"
            style={{
              left: `${25 + Math.random() * 50}%`,
              top: `${25 + Math.random() * 50}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
