
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface SleepLifestyleCardProps {
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

export function SleepLifestyleCard({
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
}: SleepLifestyleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="w-full"
    >
      <Card className="glass-card border-2 border-orange-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90 hover:border-orange-400/50 transition-all duration-300">
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
            {/* Slider Container */}
            <div className="px-6 py-8 bg-navy-700/50 rounded-2xl border border-navy-500/30 shadow-inner">
              <Slider
                value={[value]}
                onValueChange={onValueChange}
                max={max}
                min={min}
                step={step}
                className="w-full slider-enhanced"
              />
              
              {/* Labels */}
              <div className="flex justify-between text-sm text-gray-400 mt-4 px-2">
                <span className="font-medium">{minLabel}</span>
                <span className="font-medium">{maxLabel}</span>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center">
              <div className="flex gap-2">
                {Array.from({ length: Math.min(10, max - min + 1) }).map((_, index) => {
                  const progress = (value - min) / (max - min);
                  const isActive = index < (progress * 10);
                  return (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${gradient}` 
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
