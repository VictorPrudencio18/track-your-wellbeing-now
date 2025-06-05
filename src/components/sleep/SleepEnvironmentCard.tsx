
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface SleepEnvironmentCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  color: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  gradient: string;
  onValueChange: (value: number[]) => void;
  delay?: number;
}

export function SleepEnvironmentCard({
  title,
  value,
  unit = '',
  icon: Icon,
  color,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  gradient,
  onValueChange,
  delay = 0
}: SleepEnvironmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="w-full"
    >
      <Card className="glass-card border-2 border-navy-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90 hover:border-navy-400/50 transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-lg">
            <div className={`p-2.5 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white font-medium">{title}</span>
                <span className={`text-2xl font-bold ${color}`}>
                  {value}{unit}
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Enhanced Slider Container */}
            <div className="px-6 py-8 bg-gradient-to-br from-navy-700/60 to-navy-800/40 rounded-2xl border-2 border-navy-500/40 shadow-2xl backdrop-blur-sm">
              {/* Instructions */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-300 font-medium flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 8L2 12L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Arraste o controle para ajustar
                </p>
              </div>
              
              <Slider
                value={[value]}
                onValueChange={onValueChange}
                max={max}
                min={min}
                step={step}
                className="w-full"
              />
              
              {/* Enhanced Labels */}
              <div className="flex justify-between text-sm text-gray-300 mt-6 px-2">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-400">{min}{unit}</span>
                  <span className="text-xs text-gray-500">{minLabel}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-gray-400">{max}{unit}</span>
                  <span className="text-xs text-gray-500">{maxLabel}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Indicator */}
            <div className="flex items-center justify-center">
              <div className="flex gap-2">
                {Array.from({ length: Math.min(8, max - min + 1) }).map((_, index) => {
                  const progress = (value - min) / (max - min);
                  const isActive = index < (progress * 8);
                  return (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: delay + (index * 0.1) }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${gradient} shadow-lg` 
                          : 'bg-navy-600/50'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
