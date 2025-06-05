
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
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  let currentAngle = 0;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background rings */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-navy-600/20"
            style={{
              transform: `scale(${1 + i * 0.1})`,
            }}
            animate={{
              rotate: 360,
              scale: [1 + i * 0.1, 1.05 + i * 0.1, 1 + i * 0.1],
            }}
            transition={{
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      {/* Main visualization */}
      <div className="relative w-80 h-80">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Sleep phases arcs */}
          {sleepPhases.map((phase, index) => {
            const phaseAngle = (phase.duration / totalDuration) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + phaseAngle;
            
            const x1 = 140 + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 140 + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 140 + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 140 + radius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArcFlag = phaseAngle > 180 ? 1 : 0;
            
            currentAngle += phaseAngle;
            
            return (
              <motion.path
                key={index}
                d={`M 140 140 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={phase.color}
                stroke={phase.color}
                strokeWidth="2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                style={{
                  filter: `drop-shadow(0 0 10px ${phase.color}60)`,
                }}
              />
            );
          })}
          
          {/* Center circle */}
          <circle
            cx="140"
            cy="140"
            r="40"
            fill="rgba(30, 41, 59, 0.9)"
            stroke="rgba(245, 158, 11, 0.5)"
            strokeWidth="2"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Moon className="w-8 h-8 text-accent-orange mx-auto mb-2" />
            </motion.div>
            <div className="text-2xl font-bold text-white">
              {Math.round(totalDuration / 60)}h {totalDuration % 60}m
            </div>
            <div className="text-xs text-gray-400">Duração Total</div>
          </div>
        </div>

        {/* Phase indicators */}
        {sleepPhases.map((phase, index) => {
          const angle = (sleepPhases.slice(0, index).reduce((sum, p) => sum + p.duration, 0) + phase.duration / 2) / totalDuration * 360;
          const indicatorRadius = radius + 30;
          const x = 140 + indicatorRadius * Math.cos((angle - 90) * Math.PI / 180);
          const y = 140 + indicatorRadius * Math.sin((angle - 90) * Math.PI / 180);
          
          return (
            <motion.div
              key={index}
              className="absolute w-12 h-12 -translate-x-6 -translate-y-6"
              style={{ left: x, top: y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
            >
              <div 
                className="w-full h-full rounded-full border-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: `${phase.color}20`,
                  borderColor: phase.color,
                  boxShadow: `0 0 20px ${phase.color}40`
                }}
              >
                {phase.phase === 'REM' && <Brain className="w-5 h-5" style={{ color: phase.color }} />}
                {phase.phase === 'Deep' && <Zap className="w-5 h-5" style={{ color: phase.color }} />}
                {phase.phase === 'Light' && <Heart className="w-5 h-5" style={{ color: phase.color }} />}
                {phase.phase === 'Awake' && <Sun className="w-5 h-5" style={{ color: phase.color }} />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-orange rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
