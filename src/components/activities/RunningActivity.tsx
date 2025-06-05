
import { useState, useEffect } from "react";
import { Play, Pause, Square, MapPin, Timer, Zap, Heart, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button"; // Assuming AnimatedButton exists
import { PremiumCard } from "@/components/ui/premium-card"; // Assuming PremiumCard exists
import { useGeolocation } from '@/hooks/useGeolocation';
import ActivityMap from './ActivityMap';
import { Button } from "@/components/ui/button"; // Fallback if AnimatedButton is not available
import { Card } from "@/components/ui/card"; // Fallback if PremiumCard is not available

// Use actual components if they exist, otherwise use fallbacks
const EffectiveButton = AnimatedButton || Button;
const EffectiveCard = PremiumCard || Card;


interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  const {
    currentPosition,
    path,
    distance: gpsDistance,
    error: geolocationError,
    isTracking,
    startTracking,
    pauseTracking,
    stopTracking,
  } = useGeolocation();

  const [time, setTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [heartRate, setHeartRate] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          
          // Calculate Pace
          if (gpsDistance > 0) {
            const currentPace = (newTime / 60) / gpsDistance; // minutes per km
            const paceMinutes = Math.floor(currentPace);
            const paceSeconds = Math.floor((currentPace - paceMinutes) * 60);
            setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
          } else {
            setPace("0:00");
          }

          // Simulate Calories & Heart Rate (can be refined later)
          setCalories(Math.floor(newTime * 0.15));
          setHeartRate(120 + Math.floor(Math.random() * 10) + Math.floor(newTime / 120)); // Smoother HR

          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, gpsDistance]); // setTime, setPace, setCalories, setHeartRate are stable from parent scope

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    setTime(0);
    setCalories(0);
    setPace("0:00");
    setHeartRate(120); // Reset initial heart rate
    // Note: useGeolocation's startTracking should reset path and distance if it's designed to do so.
    // If not, manual reset of path/distance in useGeolocation or here might be needed.
    startTracking();
  };

  const handlePauseTracking = () => {
    pauseTracking();
  };

  const handleResumeTracking = () => {
    startTracking(); // Assumes useGeolocation handles resuming
  };

  const handleStopAndCompleteActivity = () => {
    pauseTracking(); // Ensure tracking is paused before finalizing
    stopTracking();  // Fully stop geolocation, clear watchId etc.
    onComplete({
      type: 'run',
      name: 'Corrida GPS',
      duration: time,
      distance: parseFloat(gpsDistance.toFixed(2)),
      calories,
      pace,
      heartRate: { avg: heartRate, max: heartRate + 15 }, // Max is still simulated
      path: path,
      date: new Date().toISOString(),
    });
  };

  const handleCancelActivity = () => {
    pauseTracking();
    stopTracking();
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6" // Adjusted spacing
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          className="text-6xl mb-3" // Adjusted margin
          animate={{ scale: isTracking ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 2, repeat: isTracking ? Infinity : 0 }}
        >
          🏃‍♂️
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-1">Corrida GPS</h2>
        {/* GPS Status/Error Display */}
        {geolocationError && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center justify-center gap-2">
            <AlertTriangle size={18} />
            <span>{geolocationError}</span>
          </div>
        )}
        {!geolocationError && isTracking && (
           <div className="flex items-center justify-center gap-2 text-green-400">
             <CheckCircle size={16} />
             <span className="text-sm">GPS ativo e rastreando</span>
           </div>
        )}
         {!geolocationError && !isTracking && time > 0 && (
           <div className="flex items-center justify-center gap-2 text-yellow-400">
             <Pause size={16} />
             <span className="text-sm">GPS pausado</span>
           </div>
        )}
      </div>

      {/* Activity Map */}
      <ActivityMap path={path} currentPosition={currentPosition} height="250px" className="mb-4 rounded-lg overflow-hidden shadow-lg" />

      {/* Timer Principal */}
      <EffectiveCard glass className="p-6 text-center"> {/* Adjusted padding */}
        <motion.div
          className="text-6xl font-mono font-bold text-accent-orange mb-2" // Adjusted size and margin
          animate={{ scale: isTracking ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: isTracking ? Infinity : 0 }}
        >
          {formatTime(time)}
        </motion.div>
        <p className="text-navy-400 text-sm">Tempo decorrido</p> {/* Adjusted size */}
      </EffectiveCard>

      {/* Métricas em Grid */}
      <div className="grid grid-cols-2 gap-3"> {/* Adjusted gap */}
        <EffectiveCard glass className="p-4 text-center hover-lift"> {/* Adjusted padding */}
          <div className="p-2 bg-green-500/10 rounded-full w-fit mx-auto mb-2 border border-green-500/20">
            <MapPin className="w-5 h-5 text-green-400" /> {/* Adjusted size */}
          </div>
          <div className="text-2xl font-bold text-green-400 mb-0.5"> {/* Adjusted size */}
            {gpsDistance.toFixed(2)}
          </div>
          <div className="text-xs text-navy-400">quilômetros</div> {/* Adjusted size */}
        </EffectiveCard>

        <EffectiveCard glass className="p-4 text-center hover-lift">
          <div className="p-2 bg-orange-500/10 rounded-full w-fit mx-auto mb-2 border border-orange-500/20">
            <Timer className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400 mb-0.5">{pace}</div>
          <div className="text-xs text-navy-400">min/km</div>
        </EffectiveCard>

        <EffectiveCard glass className="p-4 text-center hover-lift">
          <div className="p-2 bg-red-500/10 rounded-full w-fit mx-auto mb-2 border border-red-500/20">
            <Zap className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 mb-0.5">{calories}</div>
          <div className="text-xs text-navy-400">calorias</div>
        </EffectiveCard>

        <EffectiveCard glass className="p-4 text-center hover-lift">
          <div className="p-2 bg-purple-500/10 rounded-full w-fit mx-auto mb-2 border border-purple-500/20">
            <Heart className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-0.5">{heartRate}</div>
          <div className="text-xs text-navy-400">bpm</div>
        </EffectiveCard>
      </div>

      {/* Controles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }} // Adjusted delay
        className="flex flex-col sm:flex-row gap-3" // Adjusted gap and direction for mobile
      >
        {!isTracking && time === 0 && (
          <EffectiveButton
            onClick={handleStartTracking}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-md font-semibold" // Adjusted padding and text size
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" /> {/* Adjusted size and margin */}
            Iniciar Corrida
          </EffectiveButton>
        )}
        {!isTracking && time > 0 && (
           <EffectiveButton
            onClick={handleResumeTracking}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-md font-semibold"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Retomar
          </EffectiveButton>
        )}
        {isTracking && (
          <EffectiveButton
            onClick={handlePauseTracking}
            variant="outline"
            className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-3 text-md font-semibold"
            size="lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pausar
          </EffectiveButton>
        )}
        
        <EffectiveButton
          onClick={time > 0 ? handleStopAndCompleteActivity : handleCancelActivity}
          variant={time > 0 ? "default" : "destructive"}
          className={`flex-1 py-3 text-md font-semibold ${
            time > 0 
              ? "bg-accent-orange hover:bg-accent-orange/80 text-navy-900" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          size="lg"
          disabled={isTracking && time === 0} // Unlikely to be hit, but good practice
        >
          <Square className="w-5 h-5 mr-2" />
          {time > 0 ? "Finalizar" : "Cancelar"}
        </EffectiveButton>
      </motion.div>
    </motion.div>
  );
}
