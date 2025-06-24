import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Square, Settings, Layout, Map as MapIcon, 
  BarChart3, Target, Zap, Activity, Eye, EyeOff
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { RunningMap } from "./premium-components/RunningMap";
import { MetricsDashboard } from "./premium-components/MetricsDashboard";
import { LiveCharts } from "./premium-components/LiveCharts";
import { StatsOverlay } from "./premium-components/StatsOverlay";
import { LayoutSelector } from "./premium-components/LayoutSelector";

type ViewMode = 'dashboard' | 'map' | 'charts' | 'fullscreen';
type LayoutType = 'compact' | 'detailed' | 'minimal' | 'pro';

interface PremiumGPSRunnerProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function PremiumGPSRunner({ onComplete, onCancel }: PremiumGPSRunnerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [layout, setLayout] = useState<LayoutType>('detailed');
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const handleComplete = async () => {
    await stopActivity();
    
    // Safely extract heart rate values with proper type checking
    let avgHeartRate: number | undefined = undefined;
    let maxHeartRate: number | undefined = undefined;

    // Handle heart rate based on its type
    if (typeof data.heartRate === 'number') {
      avgHeartRate = data.heartRate;
    } else if (data.heartRate && typeof data.heartRate === 'object') {
      const hrObject = data.heartRate as any;
      avgHeartRate = hrObject.avg;
      maxHeartRate = hrObject.max;
    }

    // Use maxHeartRate from data if available, otherwise from heartRate object
    if (!maxHeartRate && typeof data.maxHeartRate === 'number') {
      maxHeartRate = data.maxHeartRate;
    }

    onComplete({
      type: 'running',
      duration: data.duration,
      distance: data.distance,
      calories: data.calories,
      pace: data.avgPace,
      avg_heart_rate: avgHeartRate,
      max_heart_rate: maxHeartRate,
      elevation_gain: data.elevationGain,
    });
  };

  const handleStart = async () => {
    if (isPaused) {
      resumeActivity();
    } else {
      await startActivity();
    }
  };

  const handleStop = () => {
    if (data.duration > 0) {
      handleComplete();
    } else {
      onCancel();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Detectar mudanças de orientação e ajustar layout
  useEffect(() => {
    const handleOrientationChange = () => {
      // Ajustar layout baseado na orientação
      const isLandscape = window.innerWidth > window.innerHeight;
      if (isLandscape && isActive) {
        setViewMode('fullscreen');
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isActive]);

  const viewModeButtons = [
    { mode: 'dashboard' as ViewMode, icon: Layout, label: 'Dashboard' },
    { mode: 'map' as ViewMode, icon: MapIcon, label: 'Mapa' },
    { mode: 'charts' as ViewMode, icon: BarChart3, label: 'Gráficos' },
    { mode: 'fullscreen' as ViewMode, icon: Target, label: 'Foco' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-navy-900' : ''}`}
    >
      {/* Header com controles */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 glass-card-subtle mb-4"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="text-4xl"
            animate={{ scale: isActive && !isPaused ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive && !isPaused ? Infinity : 0 }}
          >
            🏃‍♂️
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">GPS Runner Premium</h1>
            <div className={`flex items-center gap-2 text-sm ${
              !gpsState.position ? 'text-red-400' :
              !gpsState.isHighAccuracy ? 'text-yellow-400' : 'text-green-400'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                !gpsState.position ? 'bg-red-400' :
                !gpsState.isHighAccuracy ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
              {!gpsState.position ? 'Aguardando sinal GPS...' :
               !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'GPS Preciso'}
              {gpsState.accuracy > 0 && (
                <span className="text-xs text-navy-400">
                  ({gpsState.accuracy.toFixed(0)}m)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedButton
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-accent-orange/20"
          >
            {isFullscreen ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </AnimatedButton>
          <AnimatedButton
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-accent-orange/20"
          >
            <Settings className="w-5 h-5" />
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Seletor de modo de visualização */}
      {!isFullscreen && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center gap-2 mb-4"
        >
          {viewModeButtons.map(({ mode, icon: Icon, label }) => (
            <AnimatedButton
              key={mode}
              onClick={() => setViewMode(mode)}
              variant={viewMode === mode ? "default" : "ghost"}
              className={`${
                viewMode === mode 
                  ? "bg-accent-orange text-navy-900" 
                  : "text-white hover:bg-accent-orange/20"
              } px-4 py-2`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </AnimatedButton>
          ))}
        </motion.div>
      )}

      {/* Configurações */}
      <AnimatePresence>
        {showSettings && !isFullscreen && (
          <LayoutSelector
            currentLayout={layout}
            onLayoutChange={setLayout}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {viewMode === 'dashboard' && (
            <MetricsDashboard
              data={data}
              gpsState={gpsState}
              layout={layout}
              isActive={isActive}
              isPaused={isPaused}
            />
          )}

          {viewMode === 'map' && (
            <RunningMap
              gpsState={gpsState}
              data={data}
              isActive={isActive}
              route={gpsState.getPositionHistory()}
            />
          )}

          {viewMode === 'charts' && (
            <LiveCharts
              data={data}
              gpsState={gpsState}
              isActive={isActive}
            />
          )}

          {viewMode === 'fullscreen' && (
            <StatsOverlay
              data={data}
              gpsState={gpsState}
              isActive={isActive}
              isPaused={isPaused}
              isFullscreen={isFullscreen}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controles de atividade */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${isFullscreen ? 'fixed bottom-6 left-1/2 transform -translate-x-1/2' : ''} 
                   flex gap-4 mt-6 ${isFullscreen ? 'glass-card p-4 rounded-2xl' : ''}`}
      >
        {!isActive ? (
          <AnimatedButton 
            onClick={handleStart}
            disabled={!isGPSReady}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 text-lg font-semibold min-w-[200px]"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            {!gpsState.position ? 'Aguardando sinal GPS...' :
             !gpsState.isHighAccuracy ? 'Otimizando precisão...' : 'Iniciar Corrida'}
          </AnimatedButton>
        ) : (
          <>
            <AnimatedButton 
              onClick={isPaused ? handleStart : pauseActivity}
              variant="outline"
              className="flex-1 glass-card border-navy-600 hover:border-accent-orange/50 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              {isPaused ? <Play className="w-6 h-6 mr-3" /> : <Pause className="w-6 h-6 mr-3" />}
              {isPaused ? 'Retomar' : 'Pausar'}
            </AnimatedButton>
            
            <AnimatedButton 
              onClick={handleStop}
              variant={data.duration > 0 ? "default" : "destructive"}
              className={`flex-1 py-4 text-lg font-semibold ${
                data.duration > 0 
                  ? "bg-gradient-to-r from-accent-orange to-accent-orange-light text-navy-900" 
                  : "bg-gradient-to-r from-red-600 to-red-700 text-white"
              }`}
              size="lg"
            >
              <Square className="w-6 h-6 mr-3" />
              {data.duration > 0 ? 'Finalizar' : 'Cancelar'}
            </AnimatedButton>
          </>
        )}
      </motion.div>

      {/* Indicador de status ativo */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${isFullscreen ? 'fixed top-4 right-4' : 'absolute top-4 right-4'} 
                     flex items-center gap-2 glass-card px-3 py-2 rounded-full`}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-400">
            {isPaused ? 'PAUSADO' : 'GRAVANDO'}
          </span>
          <Activity className="w-4 h-4 text-green-400" />
        </motion.div>
      )}
    </motion.div>
  );
}
