
import { motion } from 'framer-motion';
import { Timer, MapPin, Zap, Heart, TrendingUp, Activity, Target } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { NeonProgress } from '@/components/ui/neon-progress';
import { GPSState } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';

interface MetricsDashboardProps {
  data: ActivityData;
  gpsState: GPSState;
  layout: 'compact' | 'detailed' | 'minimal' | 'pro';
  isActive: boolean;
  isPaused: boolean;
}

export function MetricsDashboard({ data, gpsState, layout, isActive, isPaused }: MetricsDashboardProps) {
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
    if (pace === 0) return { zone: 'Repouso', color: 'gray' };
    if (pace < 300) return { zone: 'Muito Rápido', color: 'red' };
    if (pace < 360) return { zone: 'Rápido', color: 'orange' };
    if (pace < 420) return { zone: 'Moderado', color: 'green' };
    if (pace < 480) return { zone: 'Fácil', color: 'blue' };
    return { zone: 'Caminhada', color: 'purple' };
  };

  const getHeartRateZone = (hr: number) => {
    if (hr < 100) return { zone: 'Repouso', color: 'gray', percentage: (hr / 100) * 100 };
    if (hr < 120) return { zone: 'Aquecimento', color: 'blue', percentage: 20 + ((hr - 100) / 20) * 20 };
    if (hr < 140) return { zone: 'Aeróbico', color: 'green', percentage: 40 + ((hr - 120) / 20) * 20 };
    if (hr < 160) return { zone: 'Limiar', color: 'orange', percentage: 60 + ((hr - 140) / 20) * 20 };
    if (hr < 180) return { zone: 'Anaeróbico', color: 'red', percentage: 80 + ((hr - 160) / 20) * 20 };
    return { zone: 'Máximo', color: 'purple', percentage: 100 };
  };

  const paceZone = getPaceZone(data.pace);
  const hrZone = getHeartRateZone(data.heartRate);

  if (layout === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Timer gigante */}
        <PremiumCard glass className="p-8 text-center">
          <motion.div
            className="text-8xl font-mono font-bold text-accent-orange mb-4"
            animate={{ scale: isActive && !isPaused ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
          >
            {formatTime(data.duration)}
          </motion.div>
        </PremiumCard>

        {/* Métricas essenciais */}
        <div className="grid grid-cols-3 gap-4">
          <PremiumCard glass className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {data.distance.toFixed(2)}
            </div>
            <div className="text-sm text-navy-400">km</div>
          </PremiumCard>

          <PremiumCard glass className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {formatPace(data.pace)}
            </div>
            <div className="text-sm text-navy-400">pace</div>
          </PremiumCard>

          <PremiumCard glass className="p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {data.heartRate}
            </div>
            <div className="text-sm text-navy-400">bpm</div>
          </PremiumCard>
        </div>
      </motion.div>
    );
  }

  if (layout === 'pro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-12 grid-rows-6 gap-4 h-[600px]"
      >
        {/* Timer principal */}
        <motion.div className="col-span-6 row-span-2">
          <PremiumCard glass className="h-full p-6 flex flex-col justify-center">
            <div className="text-center">
              <motion.div
                className="text-6xl font-mono font-bold text-accent-orange mb-2"
                animate={{ scale: isActive && !isPaused ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive && !isPaused ? Infinity : 0 }}
              >
                {formatTime(data.duration)}
              </motion.div>
              <p className="text-navy-400">Tempo decorrido</p>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Pace Zone */}
        <motion.div className="col-span-3 row-span-2">
          <PremiumCard glass className="h-full p-4 flex flex-col justify-center">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <ProgressRing
                  progress={Math.min((420 - data.pace) / 420 * 100, 100)}
                  size={96}
                  strokeWidth={8}
                  gradient="accent"
                  showText={false}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold text-white">{formatPace(data.pace)}</div>
                  <div className="text-xs text-navy-400">pace</div>
                </div>
              </div>
              <div className={`text-sm font-medium text-${paceZone.color}-400`}>
                {paceZone.zone}
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Heart Rate Zone */}
        <motion.div className="col-span-3 row-span-2">
          <PremiumCard glass className="h-full p-4 flex flex-col justify-center">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <ProgressRing
                  progress={hrZone.percentage}
                  size={96}
                  strokeWidth={8}
                  gradient="secondary"
                  showText={false}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold text-white">{data.heartRate}</div>
                  <div className="text-xs text-navy-400">bpm</div>
                </div>
              </div>
              <div className={`text-sm font-medium text-${hrZone.color}-400`}>
                {hrZone.zone}
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Distância com progresso */}
        <motion.div className="col-span-4 row-span-1">
          <PremiumCard glass className="h-full p-4 flex items-center">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-green-400">{data.distance.toFixed(2)}</span>
                <span className="text-sm text-navy-400">km</span>
              </div>
              <NeonProgress
                value={data.distance}
                max={10}
                color="green"
                animated={isActive}
                glow={true}
              />
            </div>
            <MapPin className="w-8 h-8 text-green-400 ml-4" />
          </PremiumCard>
        </motion.div>

        {/* Velocidade atual */}
        <motion.div className="col-span-4 row-span-1">
          <PremiumCard glass className="h-full p-4 flex items-center">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-purple-400">{(data.currentSpeed * 3.6).toFixed(1)}</span>
                <span className="text-sm text-navy-400">km/h</span>
              </div>
              <NeonProgress
                value={data.currentSpeed * 3.6}
                max={20}
                color="purple"
                animated={isActive}
              />
            </div>
            <Zap className="w-8 h-8 text-purple-400 ml-4" />
          </PremiumCard>
        </motion.div>

        {/* Calorias */}
        <motion.div className="col-span-4 row-span-1">
          <PremiumCard glass className="h-full p-4 flex items-center">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-orange-400">{data.calories}</span>
                <span className="text-sm text-navy-400">cal</span>
              </div>
              <NeonProgress
                value={data.calories}
                max={1000}
                color="orange"
                animated={isActive}
              />
            </div>
            <Activity className="w-8 h-8 text-orange-400 ml-4" />
          </PremiumCard>
        </motion.div>

        {/* Métricas detalhadas */}
        <motion.div className="col-span-6 row-span-2">
          <PremiumCard glass className="h-full p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
              Análise Avançada
            </h3>
            <div className="grid grid-cols-2 gap-4 h-32">
              <div>
                <div className="text-sm text-navy-400 mb-1">Pace Médio</div>
                <div className="text-2xl font-bold text-white mb-2">{formatPace(data.avgPace)}</div>
                <div className="text-sm text-navy-400 mb-1">Velocidade Máx</div>
                <div className="text-xl font-bold text-white">{(data.maxSpeed * 3.6).toFixed(1)} km/h</div>
              </div>
              <div>
                <div className="text-sm text-navy-400 mb-1">Elevação</div>
                <div className="text-2xl font-bold text-white mb-2">{data.elevationGain.toFixed(0)}m</div>
                <div className="text-sm text-navy-400 mb-1">Cadência</div>
                <div className="text-xl font-bold text-white">{data.cadence || 0}</div>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* GPS Status */}
        <motion.div className="col-span-6 row-span-1">
          <PremiumCard glass className="h-full p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Status GPS</h4>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  gpsState.isHighAccuracy ? 'bg-green-400 animate-pulse' : 'bg-orange-400 animate-pulse'
                }`}></div>
                <span className={`text-sm ${
                  gpsState.isHighAccuracy ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {gpsState.isHighAccuracy ? 'Alta Precisão' : 'Baixa Precisão'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-navy-400">Pontos</div>
              <div className="text-lg font-bold text-white">{gpsState.getPositionHistory().length}</div>
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>
    );
  }

  // Layout padrão (detailed)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Timer principal */}
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

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-4">
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
            <div className="text-sm text-navy-400 mb-3">quilômetros</div>
            <NeonProgress
              value={data.distance}
              max={10}
              color="green"
              animated={isActive}
              showPercentage={false}
            />
          </PremiumCard>
        </motion.div>

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
            <div className="text-sm text-navy-400 mb-3">pace atual</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full bg-${paceZone.color}-500/20 text-${paceZone.color}-400`}>
              {paceZone.zone}
            </div>
          </PremiumCard>
        </motion.div>

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
              {(data.currentSpeed * 3.6).toFixed(1)}
            </div>
            <div className="text-sm text-navy-400 mb-3">km/h</div>
            <NeonProgress
              value={data.currentSpeed * 3.6}
              max={20}
              color="purple"
              animated={isActive}
              showPercentage={false}
            />
          </PremiumCard>
        </motion.div>

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
            <div className="text-sm text-navy-400 mb-3">bpm</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full bg-${hrZone.color}-500/20 text-${hrZone.color}-400`}>
              {hrZone.zone}
            </div>
          </PremiumCard>
        </motion.div>
      </div>

      {/* Métricas detalhadas */}
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

      {/* Estatísticas médias */}
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
            <div className="text-xl font-bold text-white">{(data.maxSpeed * 3.6).toFixed(1)} km/h</div>
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
