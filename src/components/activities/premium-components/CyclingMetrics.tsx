
import { motion } from 'framer-motion';
import { Gauge, MapPin, Mountain, Zap, Heart, RotateCcw, TrendingUp, Clock } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState } from '@/hooks/useGPS';
import { EnhancedActivityData } from '@/hooks/useEnhancedActivityTracker';

interface CyclingMetricsProps {
  data: EnhancedActivityData;
  gpsState: GPSState;
  isActive: boolean;
  detailed?: boolean;
}

export function CyclingMetrics({ data, gpsState, isActive, detailed = false }: CyclingMetricsProps) {
  const formatPace = (pace: number) => {
    if (pace === 0) return '--:--';
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speed: number) => {
    return (speed * 3.6).toFixed(1); // converter m/s para km/h
  };

  const metrics = [
    {
      icon: Gauge,
      label: 'Velocidade',
      value: formatSpeed(data.currentSpeed),
      unit: 'km/h',
      gradient: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400'
    },
    {
      icon: MapPin,
      label: 'Distância',
      value: data.distance.toFixed(2),
      unit: 'km',
      gradient: 'from-green-500 to-green-600',
      textColor: 'text-green-400'
    },
    {
      icon: Mountain,
      label: 'Elevação',
      value: Math.round(data.elevationGain),
      unit: 'm',
      gradient: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">
        {detailed ? 'Métricas Detalhadas' : 'Métricas em Tempo Real'}
      </h3>
      
      <div className={`grid ${detailed ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <PremiumCard glass className="p-4 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.gradient}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-navy-400 uppercase tracking-wide">
                      {metric.label}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={metric.value}
                    initial={{ scale: 1.2, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-bold ${metric.textColor}`}
                  >
                    {metric.value}
                  </motion.span>
                  <span className="text-sm text-navy-400">{metric.unit}</span>
                </div>
                
                {/* Indicador de atividade */}
                {isActive && (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400">Ativo</span>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
