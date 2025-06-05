
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface CounterWidgetProps {
  title: string;
  value?: number;
  unit: string;
  maxValue?: number;
  icon?: React.ComponentType<any>;
  color?: 'red' | 'orange' | 'blue' | 'green' | 'purple';
  onSubmit: (value: number) => void;
  onDismiss?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const colorMaps = {
  red: {
    bg: 'from-red-500/15 to-pink-500/15',
    border: 'border-red-500/20',
    button: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25',
    accent: 'text-red-400',
    progress: 'from-red-400 to-red-600',
    counterBtn: 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30',
    glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]'
  },
  orange: {
    bg: 'from-orange-500/15 to-yellow-500/15',
    border: 'border-orange-500/20',
    button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25',
    accent: 'text-orange-400',
    progress: 'from-orange-400 to-orange-600',
    counterBtn: 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30',
    glow: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]'
  },
  blue: {
    bg: 'from-blue-500/15 to-cyan-500/15',
    border: 'border-blue-500/20',
    button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25',
    accent: 'text-blue-400',
    progress: 'from-blue-400 to-blue-600',
    counterBtn: 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
  },
  green: {
    bg: 'from-green-500/15 to-emerald-500/15',
    border: 'border-green-500/20',
    button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25',
    accent: 'text-green-400',
    progress: 'from-green-400 to-green-600',
    counterBtn: 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30',
    glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]'
  },
  purple: {
    bg: 'from-purple-500/15 to-indigo-500/15',
    border: 'border-purple-500/20',
    button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25',
    accent: 'text-purple-400',
    progress: 'from-purple-400 to-purple-600',
    counterBtn: 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30',
    glow: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]'
  }
};

export function CounterWidget({
  title,
  value = 0,
  unit,
  maxValue = 20,
  icon: Icon,
  color = 'blue',
  onSubmit,
  onDismiss,
  size = 'md'
}: CounterWidgetProps) {
  const [selectedValue, setSelectedValue] = React.useState<number>(value);
  const colorMap = colorMaps[color];
  
  const sizeClasses = {
    sm: 'w-full max-w-[280px] h-[260px]',
    md: 'w-full max-w-[320px] h-[280px]',
    lg: 'w-full max-w-[360px] h-[300px]'
  };

  const handleIncrement = () => {
    if (selectedValue < maxValue) {
      setSelectedValue(selectedValue + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedValue > 0) {
      setSelectedValue(selectedValue - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className={sizeClasses[size]}
    >
      <Card className={`h-full glass-card bg-gradient-to-br ${colorMap.bg} border ${colorMap.border} backdrop-blur-xl`}>
        <CardContent className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {Icon && <Icon className={`w-4 h-4 ${colorMap.accent} flex-shrink-0`} />}
              <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-white/70 hover:text-white h-6 w-6 p-0 flex-shrink-0 ml-2"
              >
                ×
              </Button>
            )}
          </div>

          {/* Counter */}
          <div className="flex-1 flex items-center justify-center mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={handleDecrement}
                  disabled={selectedValue <= 0}
                  className={`h-10 w-10 rounded-full ${colorMap.counterBtn} text-white disabled:opacity-50 flex items-center justify-center touch-target`}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </motion.div>

              <div className="text-center min-w-[60px]">
                <motion.div 
                  className={`text-3xl font-bold ${colorMap.accent} ${colorMap.glow}`}
                  key={selectedValue}
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedValue}
                </motion.div>
                <div className="text-xs text-white/70 truncate mt-1">
                  {unit}
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={handleIncrement}
                  disabled={selectedValue >= maxValue}
                  className={`h-10 w-10 rounded-full ${colorMap.counterBtn} text-white disabled:opacity-50 flex items-center justify-center touch-target`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${colorMap.progress} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((selectedValue / maxValue) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-xs text-white/50 mt-1 text-center">
              {selectedValue}/{maxValue} {unit}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="flex-1 text-white/70 hover:text-white hover:bg-white/10 text-xs h-8"
              >
                Depois
              </Button>
            )}
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                className={`w-full ${colorMap.button} text-white font-semibold text-xs h-8`}
                size="sm"
              >
                Registrar
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
