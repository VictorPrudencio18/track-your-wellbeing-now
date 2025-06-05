
import { motion } from 'framer-motion';
import { Timer, MapPin, Heart, Zap, TrendingUp, Activity } from 'lucide-react';
import { ProgressRing } from '@/components/ui/progress-ring';
import { NeonProgress } from '@/components/ui/neon-progress';
import { GPSState } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';

interface StatsOverlayProps {
  data: ActivityData;
  gpsState: GPSState;
  isActive: boolean;
  isPaused: boolean;
  isFullscreen: boolean;
}

export function StatsOverlay({ data, gpsState, isActive, isPaused, isFullscreen }: StatsOverlayProps) {
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

  const getPaceZone = (pace: number) => {
    if (pace === 0) return { zone: 'Repouso', color: '#6b7280', intensity: 0 };
    if (pace < 300) return { zone: 'Muito Rápido', color: '#ef4444', intensity: 100 };
    if (pace < 360) return { zone: 'Rápido', color: '#f97316', intensity: 80 };
    if (pace < 420) return { zone: 'Moderado', color: '#eab308', intensity: 60 };
    if (pace < 480) return { zone: 'Fácil', color: '#22c55e', intensity: 40 };
    return { zone: 'Caminhada', color: '#3b82f6', intensity: 20 };
  };

  const getHeartRateZone = (hr: number) => {
    if (hr < 100) return { zone: 'Repouso', color: '#6b7280', intensity: 0 };
    if (hr < 120) return { zone: 'Aquecimento', color: '#3b82f6', intensity: 20 };
    if (hr < 140) return { zone: 'Aeróbico', color: '#22c55e', intensity: 40 };
    if (hr < 160) return { zone: 'Limiar', color: '#eab308', intensity: 60 };
    if (hr < 180) return { zone: 'Anaeróbico', color: '#f97316', intensity: 80 };
    return { zone: 'Máximo', color: '#ef4444', intensity: 100 };
  };

  const paceZone = getPaceZone(data.pace);
  const hrZone = getHeartRateZone(data.heartRate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${isFullscreen ? 'h-screen' : 'h-96'} relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900`}
    >
      {/* Background animado */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-orange/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Layout principal */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8">
        {/* Timer gigante central */}
        <div className="text-center mb-8">
          <motion.div
            className={`${isFullscreen ? 'text-9xl' : 'text-7xl'} font-mono font-black text-white mb-4 drop-shadow-2xl`}
            animate={{ 
              scale: isActive && !isPaused ? [1, 1.02, 1] : 1,
              textShadow: isActive && !isPaused ? [
                '0 0 20px rgba(245, 158, 11, 0.5)',
                '0 0 40px rgba(245, 158, 11, 0.8)',
                '0 0 20px rgba(245, 158, 11, 0.5)'
              ] : '0 0 20px rgba(245, 158, 11, 0.3)'
            }}
            transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
            style={{
              background: 'linear-gradient(45deg, #f59e0b, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {formatTime(data.duration)}
          </motion.div>
          {isPaused && (
            <motion.div
              className="text-2xl font-bold text-yellow-400 mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⏸️ PAUSADO
            </motion.div>
          )}
        </div>

        {/* Grid de métricas principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Distância */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <ProgressRing
                progress={(data.distance / 10) * 100}
                size={96}
                strokeWidth={8}
                gradient="success"
                showText={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MapPin className="w-6 h-6 text-green-400 mb-1" />
                <div className="text-lg font-bold text-white">{data.distance.toFixed(1)}</div>
              </div>
            </div>
            <div className="text-sm text-navy-400">Distância (km)</div>
          </motion.div>

          {/* Pace com zona */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <ProgressRing
                progress={paceZone.intensity}
                size={96}
                strokeWidth={8}
                gradient="primary"
                showText={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Timer className="w-6 h-6 text-blue-400 mb-1" />
                <div className="text-lg font-bold text-white">{formatPace(data.pace)}</div>
              </div>
            </div>
            <div className="text-sm text-navy-400">Pace</div>
            <div 
              className="text-xs font-medium px-2 py-1 rounded-full mt-1"
              style={{ 
                backgroundColor: `${paceZone.color}20`,
                color: paceZone.color 
              }}
            >
              {paceZone.zone}
            </div>
          </motion.div>

          {/* Velocidade */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <ProgressRing
                progress={(data.currentSpeed * 3.6 / 20) * 100}
                size={96}
                strokeWidth={8}
                gradient="accent"
                showText={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400 mb-1" />
                <div className="text-lg font-bold text-white">{(data.currentSpeed * 3.6).toFixed(1)}</div>
              </div>
            </div>
            <div className="text-sm text-navy-400">Velocidade (km/h)</div>
          </motion.div>

          {/* Frequência cardíaca com zona */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <ProgressRing
                progress={hrZone.intensity}
                size={96}
                strokeWidth={8}
                gradient="secondary"
                showText={false}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Heart className="w-6 h-6 text-red-400 mb-1" />
                <div className="text-lg font-bold text-white">{data.heartRate}</div>
              </div>
            </div>
            <div className="text-sm text-navy-400">FC (bpm)</div>
            <div 
              className="text-xs font-medium px-2 py-1 rounded-full mt-1"
              style={{ 
                backgroundColor: `${hrZone.color}20`,
                color: hrZone.color 
              }}
            >
              {hrZone.zone}
            </div>
          </motion.div>
        </div>

        {/* Barra de progresso para meta de distância */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">Progresso da Meta</h3>
            <div className="text-3xl font-bold text-accent-orange">
              {((data.distance / 5) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-navy-400">Meta: 5km</div>
          </div>
          <NeonProgress
            value={data.distance}
            max={5}
            color="orange"
            animated={isActive}
            glow={true}
            className="h-4"
          />
        </motion.div>

        {/* Métricas secundárias */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center"
        >
          <div className="glass-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-accent-orange">{data.calories}</div>
            <div className="text-xs text-navy-400">Calorias</div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{data.elevationGain.toFixed(0)}m</div>
            <div className="text-xs text-navy-400">Elevação</div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{data.cadence || 0}</div>
            <div className="text-xs text-navy-400">Cadência</div>
          </div>
          
          <div className="glass-card p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{gpsState.getPositionHistory().length}</div>
            <div className="text-xs text-navy-400">Pontos GPS</div>
          </div>
        </motion.div>

        {/* Status GPS */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              gpsState.isHighAccuracy ? 'bg-green-400' : 'bg-orange-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              gpsState.isHighAccuracy ? 'text-green-400' : 'text-orange-400'
            }`}>
              GPS {gpsState.isHighAccuracy ? 'Preciso' : 'Baixa Precisão'}
            </span>
            <span className="text-xs text-navy-400">
              ({gpsState.accuracy.toFixed(0)}m)
            </span>
            <Activity className="w-4 h-4 text-accent-orange" />
          </div>
        </motion.div>
      </div>

      {/* Overlay de partículas em movimento */}
      {isActive && !isPaused && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent-orange/30 rounded-full"
              initial={{ 
                x: -10,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{ 
                x: window.innerWidth + 10,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
