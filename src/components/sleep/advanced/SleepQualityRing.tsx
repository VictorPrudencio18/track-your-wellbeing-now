
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
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const circumference = 2 * Math.PI * radius;

  const qualityOffset = circumference - (quality / 100) * circumference;
  const efficiencyOffset = circumference - (efficiency / 100) * circumference;

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getDebtStatus = (debt: number) => {
    if (debt <= 30) return { text: 'Excelente', color: 'text-emerald-400' };
    if (debt <= 60) return { text: 'Moderado', color: 'text-yellow-400' };
    return { text: 'Alto', color: 'text-red-400' };
  };

  const debtStatus = getDebtStatus(debt);

  return (
    <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
            {/* Background circles */}
            <svg className="absolute inset-0 transform -rotate-90" width="100%" height="100%">
              <defs>
                <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="stop-emerald-400" />
                  <stop offset="100%" className="stop-green-500" />
                </linearGradient>
                <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="stop-blue-400" />
                  <stop offset="100%" className="stop-cyan-500" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Background ring */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                className="text-navy-700/30"
              />
              
              {/* Efficiency ring */}
              <motion.circle
                cx="50%"
                cy="50%"
                r={radius - strokeWidth - 2}
                stroke="url(#efficiencyGradient)"
                strokeWidth={strokeWidth - 2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={efficiencyOffset}
                filter="url(#glow)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: efficiencyOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Quality ring */}
              <motion.circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="url(#qualityGradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={qualityOffset}
                filter="url(#glow)"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: qualityOffset }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>

            {/* Center content */}
            <div className="text-center z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-1"
              >
                <div className="text-3xl font-bold text-white">{quality}%</div>
                <div className="text-sm text-gray-300">Qualidade</div>
              </motion.div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
              <div className="text-lg font-semibold text-blue-400">{efficiency}%</div>
              <div className="text-xs text-gray-400">Eficiência</div>
            </div>
            <div className="text-center p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
              <div className={`text-lg font-semibold ${debtStatus.color}`}>
                {Math.round(debt / 60)}h {debt % 60}m
              </div>
              <div className="text-xs text-gray-400">Débito</div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={`text-sm font-medium ${debtStatus.color}`}>
              Status: {debtStatus.text}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Baseado nos últimos 7 dias
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
