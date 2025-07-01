import { motion } from 'framer-motion';
import { Timer, MapPin, Zap, Heart, Activity, Target } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { RunningData } from '@/hooks/useRunningTracker';
import { GPSState } from '@/hooks/useGPS';

interface RunningDashboardProps {
  data: RunningData;
  gpsState: GPSState;
  isActive: boolean;
  isPaused: boolean;
}

export function RunningDashboard({ data, gpsState, isActive, isPaused }: RunningDashboardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number) => {
    if (pace === 0) return '--:--';
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const cards = [
    {
      icon: Timer,
      label: 'Tempo',
      value: formatTime(data.duration),
      color: 'blue',
      animate: isActive && !isPaused
    },
    {
      icon: MapPin,
      label: 'Distância',
      value: `${data.distance.toFixed(2)} km`,
      color: 'green',
      animate: data.distance > 0
    },
    {
      icon: Zap,
      label: 'Velocidade',
      value: `${(data.currentSpeed * 3.6).toFixed(1)} km/h`,
      color: 'yellow',
      animate: data.currentSpeed > 0
    },
    {
      icon: Target,
      label: 'Pace',
      value: `${formatPace(data.pace)}/km`,
      color: 'purple',
      animate: data.pace > 0
    },
    {
      icon: Heart,
      label: 'Batimentos',
      value: `${data.heartRate} bpm`,
      color: 'red',
      animate: isActive
    },
    {
      icon: Activity,
      label: 'Calorias',
      value: `${data.calories} kcal`,
      color: 'orange',
      animate: data.calories > 0
    }
  ];

  const getCardClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/20 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      red: 'bg-red-500/20 border-red-500/30 text-red-400',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Status da corrida */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Dashboard da Corrida</h2>
        <div className={`text-lg font-medium ${
          isActive ? (isPaused ? 'text-yellow-400' : 'text-green-400') : 'text-navy-400'
        }`}>
          {isActive ? (isPaused ? 'PAUSADO' : 'CORRENDO') : 'PARADO'}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PremiumCard glass className="p-4 h-full">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`p-3 rounded-lg border ${getCardClasses(card.color)}`}
                  animate={card.animate ? { 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 rgba(255,255,255,0)',
                      '0 0 20px rgba(255,255,255,0.2)',
                      '0 0 0 rgba(255,255,255,0)'
                    ]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    repeat: card.animate ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <card.icon className="w-6 h-6" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-navy-400">{card.label}</div>
                  <motion.div 
                    className="text-xl font-bold text-white truncate"
                    key={card.value}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.value}
                  </motion.div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        ))}
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 gap-4">
        <PremiumCard glass className="p-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Estatísticas Avançadas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-navy-400">Velocidade Máxima</div>
                <div className="text-lg font-bold text-white">
                  {(data.maxSpeed * 3.6).toFixed(1)} km/h
                </div>
              </div>
              
              <div>
                <div className="text-sm text-navy-400">Pace Médio</div>
                <div className="text-lg font-bold text-white">
                  {formatPace(data.avgPace)}/km
                </div>
              </div>
              
              <div>
                <div className="text-sm text-navy-400">Elevação</div>
                <div className="text-lg font-bold text-white">
                  {data.elevationGain.toFixed(0)}m
                </div>
              </div>
              
              <div>
                <div className="text-sm text-navy-400">Cadência</div>
                <div className="text-lg font-bold text-white">
                  {data.cadence} spm
                </div>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Status GPS */}
        <PremiumCard glass className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                gpsState.isReady && gpsState.isHighAccuracy ? 'bg-green-500 animate-pulse' : 
                gpsState.position ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <div className="text-sm font-medium text-white">Status GPS</div>
                <div className="text-xs text-navy-400">
                  {gpsState.position ? 
                    `Precisão: ${gpsState.accuracy.toFixed(0)}m • ${data.gpsPoints.length} pontos` : 
                    'Aguardando sinal GPS...'}
                </div>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              gpsState.isReady && gpsState.isHighAccuracy ? 'text-green-400' : 
              gpsState.position ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {gpsState.isReady && gpsState.isHighAccuracy ? 'Excelente' :
               gpsState.position ? 'Boa' : 'Sem Sinal'}
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
}