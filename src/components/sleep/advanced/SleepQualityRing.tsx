
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface SleepQualityRingProps {
  quality: number;
  efficiency: number;
  debt: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SleepQualityRing({ quality, efficiency, debt, size = 'md' }: SleepQualityRingProps) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const radius = size === 'sm' ? 50 : size === 'md' ? 80 : 110;
  const strokeWidth = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  const circumference = 2 * Math.PI * radius;

  const qualityOffset = circumference - (quality / 100) * circumference;
  const efficiencyOffset = circumference - (efficiency / 100) * circumference;

  const getQualityColor = (score: number) => {
    if (score >= 80) return { primary: '#10b981', secondary: '#059669' };
    if (score >= 60) return { primary: '#3b82f6', secondary: '#2563eb' };
    if (score >= 40) return { primary: '#f59e0b', secondary: '#d97706' };
    return { primary: '#ef4444', secondary: '#dc2626' };
  };

  const getDebtStatus = (debt: number) => {
    if (debt <= 30) return { text: 'Excelente', color: 'text-emerald-400' };
    if (debt <= 60) return { text: 'Moderado', color: 'text-yellow-400' };
    return { text: 'Alto', color: 'text-red-400' };
  };

  const colors = getQualityColor(quality);
  const debtStatus = getDebtStatus(debt);

  return (
    <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-blue-500/20 rounded-full blur-xl" />
            
            <svg className="absolute inset-0 transform -rotate-90" width="100%" height="100%" viewBox="0 0 200 200">
              <defs>
                {/* Quality gradient */}
                <linearGradient id={`qualityGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="100%" stopColor={colors.secondary} />
                </linearGradient>
                
                {/* Efficiency gradient */}
                <linearGradient id={`efficiencyGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                
                {/* Glow filter */}
                <filter id={`glow-${size}`}>
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Shadow filter */}
                <filter id={`shadow-${size}`}>
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)"/>
                </filter>
              </defs>
              
              {/* Background track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="rgba(30, 41, 59, 0.3)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Efficiency ring (inner) */}
              <motion.circle
                cx="100"
                cy="100"
                r={radius - strokeWidth - 4}
                stroke={`url(#efficiencyGradient-${size})`}
                strokeWidth={strokeWidth - 4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={efficiencyOffset}
                filter={`url(#glow-${size})`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: efficiencyOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))`
                }}
              />
              
              {/* Quality ring (outer) */}
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                stroke={`url(#qualityGradient-${size})`}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={qualityOffset}
                filter={`url(#glow-${size})`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: qualityOffset }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                style={{
                  filter: `drop-shadow(0 0 16px ${colors.primary}60)`
                }}
              />
            </svg>

            {/* Center content with enhanced styling */}
            <div className="text-center z-10 relative">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-2"
              >
                <div 
                  className="text-4xl font-bold text-white"
                  style={{
                    textShadow: `0 0 20px ${colors.primary}80, 0 2px 8px rgba(0,0,0,0.8)`,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                >
                  {quality}%
                </div>
                <div 
                  className="text-base text-gray-200 font-medium"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  Qualidade
                </div>
              </motion.div>
            </div>
          </div>

          {/* Metrics with improved styling */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <motion.div 
              className="text-center p-4 bg-navy-800/40 rounded-xl border border-navy-600/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className="text-xl font-semibold text-blue-400 mb-1">{efficiency}%</div>
              <div className="text-xs text-gray-400">Eficiência</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-navy-800/40 rounded-xl border border-navy-600/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            >
              <div className={`text-xl font-semibold ${debtStatus.color} mb-1`}>
                {Math.round(debt / 60)}h {debt % 60}m
              </div>
              <div className="text-xs text-gray-400">Débito</div>
            </motion.div>
          </div>

          {/* Status with enhanced presentation */}
          <motion.div 
            className="text-center p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-400/20 w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <div className={`text-lg font-semibold ${debtStatus.color} mb-1`}>
              Status: {debtStatus.text}
            </div>
            <div className="text-xs text-gray-400">
              Baseado nos últimos 7 dias
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
