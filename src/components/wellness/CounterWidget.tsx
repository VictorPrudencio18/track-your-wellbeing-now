
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
    bg: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    button: 'bg-red-500 hover:bg-red-600',
    accent: 'text-red-400'
  },
  orange: {
    bg: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/30',
    button: 'bg-orange-500 hover:bg-orange-600',
    accent: 'text-orange-400'
  },
  blue: {
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    button: 'bg-blue-500 hover:bg-blue-600',
    accent: 'text-blue-400'
  },
  green: {
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    button: 'bg-green-500 hover:bg-green-600',
    accent: 'text-green-400'
  },
  purple: {
    bg: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
    button: 'bg-purple-500 hover:bg-purple-600',
    accent: 'text-purple-400'
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
    sm: 'w-64 h-32',
    md: 'w-80 h-40',
    lg: 'w-96 h-48'
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
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-white" />}
              <h3 className="text-white font-semibold text-sm">{title}</h3>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-white/70 hover:text-white h-6 w-6 p-0"
              >
                ×
              </Button>
            )}
          </div>

          {/* Counter */}
          <div className="flex-1 flex items-center justify-center mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecrement}
                disabled={selectedValue <= 0}
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
              >
                <Minus className="w-5 h-5" />
              </Button>

              <div className="text-center min-w-[80px]">
                <div className={`text-3xl font-bold ${colorMap.accent}`}>
                  {selectedValue}
                </div>
                <div className="text-xs text-white/70">
                  {unit}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleIncrement}
                disabled={selectedValue >= maxValue}
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className={`h-full bg-gradient-to-r ${colorMap.button.replace('bg-', 'from-').replace(' hover:bg-', ' to-')} rounded-full`}
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
          <div className="flex gap-2">
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
              >
                Depois
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              className={`flex-1 ${colorMap.button} text-white font-semibold`}
              size="sm"
            >
              Registrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
