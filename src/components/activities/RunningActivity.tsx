
import { useState, useEffect } from "react";
import { Play, Pause, Square, MapPin, Timer, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";

interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [heartRate, setHeartRate] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          // Simular progresso
          const newDistance = distance + (Math.random() * 0.002 + 0.003); // ~4-6 km/h
          const newCalories = Math.floor(newTime * 0.15); // ~9 cal/min
          const currentPace = newDistance > 0 ? (newTime / 60) / newDistance : 0;
          const paceMinutes = Math.floor(currentPace);
          const paceSeconds = Math.floor((currentPace - paceMinutes) * 60);
          const newHeartRate = 120 + Math.floor(Math.random() * 40) + Math.floor(newTime / 60) * 2;

          setDistance(newDistance);
          setCalories(newCalories);
          setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
          setHeartRate(Math.min(newHeartRate, 180));
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, distance]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onComplete({
      type: 'run',
      name: 'Corrida',
      duration: time,
      distance,
      calories,
      pace,
      heartRate: { avg: heartRate, max: heartRate + 15 },
      date: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
        >
          🏃‍♂️
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Corrida GPS</h2>
        <div className="flex items-center justify-center gap-2 text-accent-orange">
          <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></div>
          <span className="text-sm">GPS ativo</span>
        </div>
      </div>

      {/* Timer Principal */}
      <PremiumCard glass className="p-8 text-center">
        <motion.div
          className="text-7xl font-mono font-bold text-accent-orange mb-4"
          animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        >
          {formatTime(time)}
        </motion.div>
        <p className="text-navy-400">Tempo decorrido</p>
      </PremiumCard>

      {/* Métricas em Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-green-500/10 rounded-full w-fit mx-auto mb-4 border border-green-500/20">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {distance.toFixed(2)}
            </div>
            <div className="text-sm text-navy-400">quilômetros</div>
          </PremiumCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-orange-500/10 rounded-full w-fit mx-auto mb-4 border border-orange-500/20">
              <Timer className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-1">{pace}</div>
            <div className="text-sm text-navy-400">min/km</div>
          </PremiumCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-red-500/10 rounded-full w-fit mx-auto mb-4 border border-red-500/20">
              <Zap className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">{calories}</div>
            <div className="text-sm text-navy-400">calorias</div>
          </PremiumCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-purple-500/10 rounded-full w-fit mx-auto mb-4 border border-purple-500/20">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{heartRate}</div>
            <div className="text-sm text-navy-400">bpm</div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex gap-4"
      >
        {!isActive ? (
          <AnimatedButton 
            onClick={() => setIsActive(true)} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Iniciar Corrida
          </AnimatedButton>
        ) : (
          <AnimatedButton 
            onClick={() => setIsActive(false)} 
            variant="outline"
            className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Pause className="w-6 h-6 mr-3" />
            Pausar
          </AnimatedButton>
        )}
        
        <AnimatedButton 
          onClick={time > 0 ? handleComplete : onCancel} 
          variant={time > 0 ? "default" : "destructive"}
          className={`flex-1 py-4 text-lg font-semibold ${
            time > 0 
              ? "bg-accent-orange hover:bg-accent-orange/80 text-navy-900" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          size="lg"
        >
          <Square className="w-6 h-6 mr-3" />
          {time > 0 ? "Finalizar" : "Cancelar"}
        </AnimatedButton>
      </motion.div>

      {/* Status GPS */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <PremiumCard glass className="p-4">
            <div className="flex items-center justify-center gap-3 text-accent-orange">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-accent-orange rounded animate-pulse"></div>
                <div className="w-1 h-4 bg-accent-orange/60 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-4 bg-accent-orange/40 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm font-medium">Rastreando localização GPS...</span>
            </div>
          </PremiumCard>
        </motion.div>
      )}
    </motion.div>
  );
}
