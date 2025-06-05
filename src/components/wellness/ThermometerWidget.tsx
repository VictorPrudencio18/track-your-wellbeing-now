
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
    bg: 'from-red-500/20 to-pink-500/20',
    border: 'border-red-500/30',
    button: 'bg-red-500 hover:bg-red-600',
    thermometer: 'from-red-400 to-red-600'
  },
  orange: {
    bg: 'from-orange-500/20 to-yellow-500/20',
    border: 'border-orange-500/30',
    button: 'bg-orange-500 hover:bg-orange-600',
    thermometer: 'from-orange-400 to-orange-600'
  },
  blue: {
    bg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    button: 'bg-blue-500 hover:bg-blue-600',
    thermometer: 'from-blue-400 to-blue-600'
  },
  green: {
    bg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    button: 'bg-green-500 hover:bg-green-600',
    thermometer: 'from-green-400 to-green-600'
  },
  purple: {
    bg: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
    button: 'bg-purple-500 hover:bg-purple-600',
    thermometer: 'from-purple-400 to-purple-600'
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
    sm: 'w-64 h-32',
    md: 'w-80 h-40',
    lg: 'w-96 h-48'
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

          {/* Thermometer Visual */}
          <div className="flex-1 flex items-center justify-center mb-3">
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: maxValue }, (_, i) => {
                const level = i + 1;
                const isActive = selectedValue ? level <= selectedValue : false;
                const intensity = level / maxValue;
                
                return (
                  <motion.button
                    key={level}
                    onClick={() => setSelectedValue(level)}
                    className={`w-3 rounded-sm transition-all duration-200 ${
                      isActive 
                        ? `bg-gradient-to-t ${colorMap.thermometer} shadow-lg` 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    style={{ height: `${20 + (intensity * 32)}px` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Value Display */}
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-white">
              {selectedValue || '?'}
            </div>
            <div className="text-xs text-white/70">
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
                className="flex-1 text-white/70 hover:text-white hover:bg-white/10"
              >
                Depois
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={selectedValue === null}
              className={`flex-1 ${colorMap.button} text-white font-semibold disabled:opacity-50`}
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
