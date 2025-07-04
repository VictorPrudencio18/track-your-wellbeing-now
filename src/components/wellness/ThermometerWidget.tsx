
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ThermometerWidgetProps {
  title: string;
  value?: number;
  maxValue?: number;
  labels?: string[];
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
    thermometer: 'from-red-400 to-red-600',
    accent: 'text-red-400',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
  },
  orange: {
    bg: 'from-orange-500/15 to-yellow-500/15',
    border: 'border-orange-500/20',
    button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25',
    thermometer: 'from-orange-400 to-orange-600',
    accent: 'text-orange-400',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
  },
  blue: {
    bg: 'from-blue-500/15 to-cyan-500/15',
    border: 'border-blue-500/20',
    button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25',
    thermometer: 'from-blue-400 to-blue-600',
    accent: 'text-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  green: {
    bg: 'from-green-500/15 to-emerald-500/15',
    border: 'border-green-500/20',
    button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25',
    thermometer: 'from-green-400 to-green-600',
    accent: 'text-green-400',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'
  },
  purple: {
    bg: 'from-purple-500/15 to-indigo-500/15',
    border: 'border-purple-500/20',
    button: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25',
    thermometer: 'from-purple-400 to-purple-600',
    accent: 'text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
  }
};

export function ThermometerWidget({
  title,
  value,
  maxValue = 10,
  labels = [],
  icon: Icon,
  color = 'orange',
  onSubmit,
  onDismiss,
  size = 'md'
}: ThermometerWidgetProps) {
  const [selectedValue, setSelectedValue] = React.useState<number | null>(value || null);
  const colorMap = colorMaps[color];
  
  const sizeClasses = {
    sm: 'w-full max-w-xs',
    md: 'w-full max-w-sm',
    lg: 'w-full max-w-md'
  };

  const handleSubmit = () => {
    if (selectedValue !== null) {
      onSubmit(selectedValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3 }}
      className={sizeClasses[size]}
    >
      <Card className={`glass-card bg-gradient-to-br ${colorMap.bg} border ${colorMap.border} backdrop-blur-xl`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
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

          {/* Thermometer Visual */}
          <div className="flex items-end justify-center gap-1 mb-4 h-16">
            {Array.from({ length: maxValue }, (_, i) => {
              const level = i + 1;
              const isActive = selectedValue ? level <= selectedValue : false;
              const intensity = level / maxValue;
              const barHeight = 20 + (intensity * 40); // 20px to 60px height
              
              return (
                <motion.button
                  key={level}
                  onClick={() => setSelectedValue(level)}
                  className={`w-4 rounded-sm transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-t ${colorMap.thermometer} ${colorMap.glow}` 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  style={{ height: `${barHeight}px` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Nível ${level}`}
                />
              );
            })}
          </div>

          {/* Value Display */}
          <div className="text-center mb-4">
            <div className={`text-2xl font-bold ${colorMap.accent}`}>
              {selectedValue || '?'}
            </div>
            <div className="text-xs text-white/70 leading-relaxed mt-1">
              {selectedValue && labels[selectedValue - 1] ? labels[selectedValue - 1] : 'Toque para selecionar'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
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
                disabled={selectedValue === null}
                className={`w-full ${colorMap.button} text-white font-semibold disabled:opacity-50 text-xs h-8`}
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
