
import { motion } from "framer-motion";
import { Play, Pause, Square, MapPin, Timer, Zap, Heart, Navigation, TrendingUp, Activity } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface AdvancedRunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function AdvancedRunningActivity({ onComplete, onCancel }: AdvancedRunningActivityProps) {
  const {
    isActive,
    isPaused,
    data,
    gpsState,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    isGPSReady
  } = useActivityTracker('running');

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (pace: number) => {
    if (pace === 0 || !isFinite(pace)) return "0:00";
    const minutes = Math.floor(pace / 60);
    const seconds = Math.floor(pace % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (speed: number) => {
    return (speed * 3.6).toFixed(1); // Convert m/s to km/h
  };

  const handleComplete = async () => {
    await stopActivity();
    onComplete({
      type: 'running',
      name: 'Corrida GPS Avançada',
      duration: data.duration,
      distance: data.distance,
      calories: data.calories,
      pace: data.avgPace,
      heartRate: { avg: data.heartRate, max: data.maxHeartRate },
      elevationGain: data.elevationGain,
      avgSpeed: data.avgSpeed,
      maxSpeed: data.maxSpeed,
      cadence: data.cadence,
      date: new Date()
    });
  };

  const handleStart = async () => {
    if (isPaused) {
      resumeActivity();
    } else {
      await startActivity();
    }
  };

  const handlePause = () => {
    pauseActivity();
  };

  const handleStop = () => {
    if (data.duration > 0) {
      handleComplete();
    } else {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header com Status GPS */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-4"
          animate={{ scale: isActive && !isPaused ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: isActive && !isPaused ? Infinity : 0 }}
        >
          🏃‍♂️
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Corrida GPS Avançada</h2>
        
        <div className="flex items-center justify-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            !gpsState.position ? 'bg-red-500/20 text-red-400' :
            !gpsState.isHighAccuracy ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              !gpsState.position ? 'bg-red-400' :
              !gpsState.isHighAccuracy ? 'bg-yellow-400' : 'bg-green-400'
            }`}></div>
            <span className="text-sm font-medium">
              {!gpsState.position ? 'Aguardando sinal GPS...' :
               !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'GPS Preciso'}
            </span>
          </div>
          
          {gpsState.accuracy > 0 && (
            <div className="text-xs text-navy-400">
              Precisão: {gpsState.accuracy.toFixed(0)}m
            </div>
          )}
        </div>
      </div>

      {/* Timer Principal */}
      <PremiumCard glass className="p-8 text-center">
        <motion.div
          className="text-7xl font-mono font-bold text-accent-orange mb-4"
          animate={{ scale: isActive && !isPaused ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
        >
          {formatTime(data.duration)}
        </motion.div>
        <p className="text-navy-400">Tempo decorrido</p>
      </PremiumCard>

      {/* Métricas Principais em Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Distância */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-green-500/10 rounded-full w-fit mx-auto mb-4 border border-green-500/20">
              <MapPin className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              {data.distance.toFixed(2)}
            </div>
            <div className="text-sm text-navy-400">quilômetros</div>
          </PremiumCard>
        </motion.div>

        {/* Pace Atual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-blue-500/10 rounded-full w-fit mx-auto mb-4 border border-blue-500/20">
              <Timer className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {formatPace(data.pace)}
            </div>
            <div className="text-sm text-navy-400">pace atual</div>
          </PremiumCard>
        </motion.div>

        {/* Velocidade */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-purple-500/10 rounded-full w-fit mx-auto mb-4 border border-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">
              {formatSpeed(data.currentSpeed)}
            </div>
            <div className="text-sm text-navy-400">km/h</div>
          </PremiumCard>
        </motion.div>

        {/* Frequência Cardíaca */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PremiumCard glass className="p-6 text-center hover-lift">
            <div className="p-3 bg-red-500/10 rounded-full w-fit mx-auto mb-4 border border-red-500/20">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">
              {data.heartRate}
            </div>
            <div className="text-sm text-navy-400">bpm</div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-3 gap-3">
        <PremiumCard glass className="p-4 text-center">
          <div className="text-accent-orange font-bold text-lg">{data.calories}</div>
          <div className="text-xs text-navy-400">calorias</div>
        </PremiumCard>
        
        <PremiumCard glass className="p-4 text-center">
          <div className="text-green-400 font-bold text-lg">{data.elevationGain.toFixed(0)}m</div>
          <div className="text-xs text-navy-400">elevação</div>
        </PremiumCard>
        
        <PremiumCard glass className="p-4 text-center">
          <div className="text-blue-400 font-bold text-lg">{data.cadence || 0}</div>
          <div className="text-xs text-navy-400">passadas/min</div>
        </PremiumCard>
      </div>

      {/* Estatísticas Médias */}
      <PremiumCard glass className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-orange" />
          Estatísticas Médias
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-navy-400">Pace Médio</div>
            <div className="text-xl font-bold text-white">{formatPace(data.avgPace)}</div>
          </div>
          <div>
            <div className="text-sm text-navy-400">Velocidade Máxima</div>
            <div className="text-xl font-bold text-white">{formatSpeed(data.maxSpeed)} km/h</div>
          </div>
        </div>
      </PremiumCard>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex gap-4"
      >
        {!isActive ? (
          <AnimatedButton 
            onClick={handleStart}
            disabled={!isGPSReady}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            {!gpsState.position ? 'Aguardando sinal GPS...' :
             !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'Iniciar Corrida'}
          </AnimatedButton>
        ) : (
          <AnimatedButton 
            onClick={isPaused ? handleStart : handlePause}
            variant="outline"
            className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            {isPaused ? <Play className="w-6 h-6 mr-3" /> : <Pause className="w-6 h-6 mr-3" />}
            {isPaused ? 'Retomar' : 'Pausar'}
          </AnimatedButton>
        )}
        
        <AnimatedButton 
          onClick={handleStop}
          variant={data.duration > 0 ? "default" : "destructive"}
          className={`flex-1 py-4 text-lg font-semibold ${
            data.duration > 0 
              ? "bg-accent-orange hover:bg-accent-orange/80 text-navy-900" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          size="lg"
        >
          <Square className="w-6 h-6 mr-3" />
          {data.duration > 0 ? 'Finalizar' : 'Cancelar'}
        </AnimatedButton>
      </motion.div>

      {/* Status GPS Detalhado */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <PremiumCard glass className="p-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-accent-orange">
                <Navigation className="w-4 h-4" />
                <span>GPS Ativo</span>
              </div>
              <div className="text-navy-400">
                Pontos: {gpsState.getPositionHistory().length}
              </div>
              {isPaused && (
                <div className="text-yellow-400 font-medium">
                  ⏸️ PAUSADO
                </div>
              )}
            </div>
          </PremiumCard>
        </motion.div>
      )}
    </motion.div>
  );
}
