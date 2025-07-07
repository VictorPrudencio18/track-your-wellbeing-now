import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Square, Timer, MapPin, Zap, Mountain, Bike, Eye, EyeOff
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { Progress } from "@/components/ui/progress";

interface UnifiedCyclingInterfaceProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function UnifiedCyclingInterface({ onComplete, onCancel }: UnifiedCyclingInterfaceProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [calories, setCalories] = useState(0);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simular dados realistas de ciclismo
        const newSpeed = Math.max(0, 15 + Math.random() * 25 + Math.sin(Date.now() / 10000) * 10);
        setCurrentSpeed(newSpeed);
        setDistance(prev => prev + (newSpeed / 3600));
        setAvgSpeed(distance > 0 ? distance / (duration / 3600) : 0);
        setElevation(prev => prev + Math.random() * 0.5);
        setCalories(Math.floor(duration * 0.3));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, distance]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    onComplete({
      type: 'cycling',
      name: 'Ciclismo GPS',
      duration,
      distance,
      avgSpeed,
      elevation,
      date: new Date()
    });
  };

  // Métricas principais (apenas velocidade, distância e elevação)
  const mainMetrics = [
    {
      icon: Zap,
      label: 'Velocidade',
      value: `${currentSpeed.toFixed(1)} km/h`,
      color: 'blue',
      animate: currentSpeed > 0
    },
    {
      icon: MapPin,
      label: 'Distância',
      value: `${distance.toFixed(2)} km`,
      color: 'green',
      animate: distance > 0
    },
    {
      icon: Mountain,
      label: 'Elevação',
      value: `${Math.round(elevation)}m`,
      color: 'yellow',
      animate: elevation > 0
    }
  ];

  const getCardClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/20 border-green-500/30 text-green-400',
      yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      red: 'bg-red-500/20 border-red-500/30 text-red-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 glass-card-subtle mb-6 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="text-4xl"
            animate={{ scale: isActive && !isPaused ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive && !isPaused ? Infinity : 0 }}
          >
            🚴‍♂️
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Ciclismo GPS</h1>
            <div className="text-sm text-navy-400">
              Sistema de rastreamento avançado
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedButton
            onClick={() => setShowMap(!showMap)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-accent-orange/20"
          >
            {showMap ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Status da atividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-6"
      >
        <h2 className="text-2xl font-bold text-white">Dashboard do Ciclismo</h2>
        <div className={`text-lg font-medium ${
          isActive ? (isPaused ? 'text-yellow-400' : 'text-green-400') : 'text-navy-400'
        }`}>
          {isActive ? (isPaused ? 'PAUSADO' : 'PEDALANDO') : 'PARADO'}
        </div>
      </motion.div>

      {/* Layout principal */}
      <div className={`grid gap-6 ${showMap ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        
        {/* Métricas principais */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {mainMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PremiumCard glass className="p-4 h-full">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`p-3 rounded-lg border ${getCardClasses(metric.color)}`}
                      animate={metric.animate ? { 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 0 0 rgba(255,255,255,0)',
                          '0 0 20px rgba(255,255,255,0.2)',
                          '0 0 0 rgba(255,255,255,0)'
                        ]
                      } : {}}
                      transition={{ 
                        duration: 2, 
                        repeat: metric.animate ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <metric.icon className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-navy-400">{metric.label}</div>
                      <motion.div 
                        className="text-xl font-bold text-white truncate"
                        key={metric.value}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3 }}
                      >
                        {metric.value}
                      </motion.div>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
            ))}
          </div>

          {/* Estatísticas da Sessão */}
          <PremiumCard glass className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Estatísticas da Sessão</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-navy-400">Velocidade Média</div>
                <div className="text-xl font-bold text-white">{avgSpeed.toFixed(1)} km/h</div>
              </div>
              <div>
                <div className="text-sm text-navy-400">Tempo Ativo</div>
                <div className="text-xl font-bold text-white">{formatTime(duration)}</div>
              </div>
            </div>
          </PremiumCard>

          {/* Progresso de Metas */}
          <PremiumCard glass className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Progresso de Metas</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy-400">Distância (Meta: 20km)</span>
                  <span className="text-white">{((distance / 20) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(distance / 20) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-navy-400">Tempo (Meta: 60min)</span>
                  <span className="text-white">{((duration / 3600) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(duration / 3600) * 100} className="h-2" />
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Mapa */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Mapa da Rota</h3>
                <div className="text-sm text-green-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-400"></div>
                  GPS Ativo - Rastreando percurso
                </div>
              </div>
              
              <div className="relative h-96 rounded-2xl overflow-hidden glass-card">
                <div className="absolute inset-0 bg-navy-800 flex items-center justify-center">
                  <div className="text-center">
                    <Bike className="w-16 h-16 text-accent-orange mx-auto mb-4" />
                    <p className="text-white font-medium">Mapa do Percurso</p>
                    <p className="text-navy-400 text-sm mt-1">GPS integrado para rastreamento</p>
                  </div>
                </div>
                
                {/* Overlay de métricas */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="glass-card px-3 py-2 rounded-lg">
                    <div className="text-xs text-navy-400">Distância</div>
                    <div className="text-lg font-bold text-white">{distance.toFixed(2)} km</div>
                  </div>
                  
                  <div className="glass-card px-3 py-2 rounded-lg">
                    <div className="text-xs text-navy-400">Velocidade</div>
                    <div className="text-lg font-bold text-white">{currentSpeed.toFixed(1)} km/h</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles de atividade */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 flex gap-4"
      >
        {!isActive ? (
          <AnimatedButton 
            onClick={handleStart}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Iniciar Pedalada
          </AnimatedButton>
        ) : (
          <>
            <AnimatedButton 
              onClick={handlePause}
              variant="outline"
              className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              {isPaused ? <Play className="w-6 h-6 mr-3" /> : <Pause className="w-6 h-6 mr-3" />}
              {isPaused ? 'Retomar' : 'Pausar'}
            </AnimatedButton>
            
            <AnimatedButton 
              onClick={handleStop}
              variant={duration > 0 ? "default" : "destructive"}
              className={`flex-1 py-4 text-lg font-semibold ${
                duration > 0 
                  ? "bg-gradient-to-r from-accent-orange to-accent-orange-light text-navy-900" 
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white"
              }`}
              size="lg"
            >
              <Square className="w-6 h-6 mr-3" />
              {duration > 0 ? 'Finalizar' : 'Cancelar'}
            </AnimatedButton>
          </>
        )}
      </motion.div>

      {/* Indicador de status ativo */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 flex items-center gap-2 glass-card px-3 py-2 rounded-full"
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">
            {isPaused ? 'PAUSADO' : 'GRAVANDO'}
          </span>
          <Bike className="w-4 h-4 text-green-400" />
        </motion.div>
      )}
    </motion.div>
  );
}