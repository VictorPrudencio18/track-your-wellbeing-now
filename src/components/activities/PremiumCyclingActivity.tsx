
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Square, Settings } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { CyclingMap } from "./premium-components/CyclingMap";
import { CyclingMetrics } from "./premium-components/CyclingMetrics";
import { CyclingControls } from "./premium-components/CyclingControls";
import { CyclingSettings } from "./premium-components/CyclingSettings";
import { useToast } from "@/hooks/use-toast";

interface PremiumCyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function PremiumCyclingActivity({ onComplete, onCancel }: PremiumCyclingActivityProps) {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [autoLap, setAutoLap] = useState(1); // km
  const [screenMode, setScreenMode] = useState<'metrics' | 'map' | 'split'>('split');
  
  const tracker = useActivityTracker('cycling');

  useEffect(() => {
    if (!tracker.gpsState.isTracking) {
      toast({
        title: "Aguardando GPS...",
        description: "Obtendo localização para início do treino",
      });
    }
  }, [tracker.gpsState.isTracking]);

  const handleStart = async () => {
    if (!tracker.isGPSReady) {
      toast({
        title: "GPS não está pronto",
        description: "Aguarde a precisão do GPS melhorar antes de iniciar",
        variant: "destructive"
      });
      return;
    }

    await tracker.startActivity();
    toast({
      title: "Ciclismo GPS Iniciado! 🚴‍♂️",
      description: "Rastreamento em tempo real ativado",
    });
  };

  const handlePause = () => {
    if (tracker.isActive && !tracker.isPaused) {
      tracker.pauseActivity();
      toast({
        title: "Atividade pausada",
        description: "Toque em retomar quando estiver pronto",
      });
    } else {
      tracker.resumeActivity();
      toast({
        title: "Atividade retomada",
        description: "Continuando rastreamento GPS",
      });
    }
  };

  const handleStop = async () => {
    await tracker.stopActivity();
    
    const activityData = {
      type: 'cycling',
      name: 'Ciclismo GPS',
      duration: tracker.data.duration,
      distance: tracker.data.distance,
      calories: tracker.data.calories,
      avgHeartRate: tracker.data.heartRate,
      maxHeartRate: tracker.data.maxHeartRate,
      elevationGain: tracker.data.elevationGain,
      avgSpeed: tracker.data.avgSpeed,
      maxSpeed: tracker.data.maxSpeed,
      avgPace: tracker.data.avgPace,
      gpsPoints: tracker.gpsState.getPositionHistory().length,
      date: new Date()
    };

    onComplete(activityData);
    
    toast({
      title: "Ciclismo finalizado! 🎉",
      description: `${(tracker.data.distance).toFixed(2)}km em ${Math.floor(tracker.data.duration / 60)}min`,
    });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AnimatedButton 
            variant="outline"
            onClick={onCancel}
            className="glass-card border-navy-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </AnimatedButton>
          
          <div>
            <h1 className="text-3xl font-bold text-white">🚴‍♂️ Ciclismo GPS</h1>
            <p className="text-navy-400">
              {tracker.gpsState.isTracking 
                ? `GPS ativo - Precisão: ${tracker.gpsState.accuracy.toFixed(0)}m` 
                : 'Aguardando GPS...'}
            </p>
          </div>
        </div>

        <AnimatedButton
          variant="outline"
          onClick={() => setShowSettings(true)}
          className="glass-card border-navy-600"
        >
          <Settings className="w-4 h-4" />
        </AnimatedButton>
      </div>

      {/* Timer Principal */}
      <PremiumCard glass className="p-8 text-center">
        <motion.div
          key={tracker.data.duration}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl font-mono font-bold text-accent-orange mb-4"
        >
          {formatTime(tracker.data.duration)}
        </motion.div>
        
        <div className="text-xl text-navy-400">
          {tracker.isActive 
            ? (tracker.isPaused ? 'Pausado' : 'Pedalando...') 
            : 'Pronto para iniciar'}
        </div>
      </PremiumCard>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métricas */}
        <div className="space-y-6">
          <CyclingMetrics 
            data={tracker.data}
            gpsState={tracker.gpsState}
            isActive={tracker.isActive}
          />
        </div>

        {/* Mapa */}
        <div className="space-y-6">
          <CyclingMap
            gpsState={tracker.gpsState}
            data={tracker.data}
            isActive={tracker.isActive}
            route={tracker.gpsState.getPositionHistory()}
          />
        </div>
      </div>

      {/* Controles */}
      <CyclingControls
        isActive={tracker.isActive}
        isPaused={tracker.isPaused}
        isGPSReady={tracker.isGPSReady}
        duration={tracker.data.duration}
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onCancel={onCancel}
      />

      {/* Modal de Configurações */}
      <CyclingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        autoLap={autoLap}
        onAutoLapChange={setAutoLap}
        screenMode={screenMode}
        onScreenModeChange={setScreenMode}
      />
    </motion.div>
  );
}
