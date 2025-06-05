import React, { useState, useEffect } from 'react';
import { Music, Timer, Heart, Zap, Target, Star, Volume2 } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface ModernDanceActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const danceStyles = [
  { name: 'Hip Hop', intensity: 3, color: 'from-red-400 to-orange-500', icon: '🕺' },
  { name: 'Salsa', intensity: 4, color: 'from-yellow-400 to-lime-500', icon: '💃' },
  { name: 'Ballet', intensity: 2, color: 'from-blue-400 to-purple-500', icon: '🩰' },
  { name: 'Jazz', intensity: 3, color: 'from-pink-400 to-rose-500', icon: '🎭' },
  { name: 'Funk', intensity: 4, color: 'from-orange-400 to-red-500', icon: '🪩' }
];

const musicGenres = [
  { name: 'Pop', bpm: 120, icon: '🎵' },
  { name: 'Eletrônica', bpm: 128, icon: '🎶' },
  { name: 'Latina', bpm: 135, icon: '🎼' },
  { name: 'Hip Hop', bpm: 95, icon: '🎤' },
  { name: 'Clássica', bpm: 60, icon: '🎻' }
];

const danceMovements = [
  { name: 'Giro', difficulty: 2, icon: '💫' },
  { name: 'Salto', difficulty: 3, icon: '🤸' },
  { name: 'Onda', difficulty: 1, icon: '🌊' },
  { name: 'Slide', difficulty: 2, icon: '🏂' },
  { name: 'Footwork', difficulty: 3, icon: '👣' }
];

const choreographyRoutines = [
  { name: 'Routine A', duration: 60, difficulty: 3 },
  { name: 'Routine B', duration: 90, difficulty: 4 },
  { name: 'Routine C', duration: 120, difficulty: 5 }
];

export function ModernDanceActivity({ onComplete, onCancel }: ModernDanceActivityProps) {
  const createActivity = useCreateActivity();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(80);
  const [avgHeartRate, setAvgHeartRate] = useState(80);
  const [selectedStyle, setSelectedStyle] = useState(danceStyles[0]);
  const [selectedMusic, setSelectedMusic] = useState(musicGenres[0]);
  const [combosCompleted, setCombosCompleted] = useState(0);
  const [rhythm, setRhythm] = useState(50);
  const [expression, setExpression] = useState(50);
  const [energy, setEnergy] = useState(50);
  const [coordination, setCoordination] = useState(50);
  const [isChoreographyMode, setIsChoreographyMode] = useState(false);
  const [currentMovements, setCurrentMovements] = useState(danceMovements);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);

        // Simulação de métricas
        const intensity = selectedStyle.intensity;
        const musicFactor = selectedMusic.bpm / 120;

        // Calorias
        const caloriesPerMinute = intensity * 6 * musicFactor;
        setCalories(prev => prev + (caloriesPerMinute / 60));

        // Frequência cardíaca
        const targetHR = 70 + (intensity * 20) + (musicFactor * 10);
        setHeartRate(prev => {
          const newHR = prev + (Math.random() - 0.5) * 4;
          return Math.max(60, Math.min(180, newHR));
        });
        setAvgHeartRate(prev => (prev + heartRate) / 2);

        // Scores
        setRhythm(prev => Math.min(100, prev + (Math.random() - 0.5) * 2));
        setExpression(prev => Math.min(100, prev + (Math.random() - 0.5) * 2));
        setEnergy(prev => Math.min(100, prev + (Math.random() - 0.5) * 3));
        setCoordination(prev => Math.min(100, prev + (Math.random() - 0.5) * 2));

      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, selectedStyle, selectedMusic, heartRate]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    const sessionData = {
      type: 'dance' as const,
      name: `Dança ${selectedStyle.name}`,
      duration,
      calories: Math.round(calories),
      avg_heart_rate: Math.round(avgHeartRate),
      max_heart_rate: Math.round(heartRate),
      notes: `Estilo: ${selectedStyle.name} | Música: ${selectedMusic.name} | Combos: ${combosCompleted} | Coreografia: ${isChoreographyMode ? 'Sim' : 'Não'}`,
      gps_data: {
        dance_style: selectedStyle.name,
        music_genre: selectedMusic.name,
        combos_completed: combosCompleted,
        movements_total: currentMovements.length,
        choreography_mode: isChoreographyMode,
        rhythm_score: Math.round(rhythm),
        expression_score: Math.round(expression),
        energy_score: Math.round(energy),
        coordination_score: Math.round(coordination),
        session_intensity: selectedStyle.intensity,
        completion_rate: (combosCompleted / currentMovements.length) * 100,
        beats_per_minute: selectedMusic.bpm
      }
    };
    
    try {
      await createActivity.mutateAsync(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving dance activity:', error);
      onComplete(sessionData); // Still complete the activity even if save fails
    }
  };

  const metrics = [
    {
      id: 'heartrate',
      icon: Heart,
      label: 'Frequência Cardíaca',
      value: Math.round(heartRate),
      unit: 'bpm',
      color: 'from-red-500 to-pink-600',
      trend: (heartRate > 100 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: `${Math.round(avgHeartRate)} bpm`
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: Math.round(calories),
      unit: 'kcal',
      color: 'from-orange-500 to-yellow-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: `${(calories/(duration/60)).toFixed(0)}/hr`
    },
    {
      id: 'rhythm',
      icon: Music,
      label: 'Ritmo',
      value: Math.round(rhythm),
      unit: '%',
      color: 'from-blue-500 to-cyan-600',
      trend: (rhythm > 50 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: `${selectedMusic.bpm} BPM`
    },
    {
      id: 'energy',
      icon: Star,
      label: 'Energia',
      value: Math.round(energy),
      unit: '%',
      color: 'from-purple-500 to-indigo-600',
      trend: (energy > 50 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: `${selectedStyle.intensity}/5`
    }
  ];

  return (
    <ModernActivityBase
      title="Dança"
      icon={<Music className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: combosCompleted.toLocaleString(),
        unit: 'combos',
        label: 'Combos Completados'
      }}
    >
      <div className="space-y-6">
        {/* Seleção de Estilo de Dança */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha seu Estilo de Dança</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {danceStyles.map((style) => (
                <motion.button
                  key={style.name}
                  onClick={() => setSelectedStyle(style)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedStyle.name === style.name
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-blue-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-2`} />
                  <div className="text-left">
                    <div className="font-semibold text-white">{style.name}</div>
                    <div className="text-xs text-slate-400">{style.intensity}/5 Intensidade</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Seleção de Música */}
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">Escolha sua Música</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {musicGenres.map((music) => (
                <motion.button
                  key={music.name}
                  onClick={() => setSelectedMusic(music)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedMusic.name === music.name
                      ? 'border-green-400 bg-green-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-green-400/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{music.icon}</div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{music.name}</div>
                    <div className="text-xs text-slate-400">{music.bpm} BPM</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Modo Coreografia */}
            <div className="flex items-center justify-between mt-8">
              <h3 className="text-lg font-semibold text-white">Modo Coreografia</h3>
              <motion.button
                onClick={() => setIsChoreographyMode(!isChoreographyMode)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isChoreographyMode
                    ? 'bg-yellow-500 text-yellow-900'
                    : 'bg-slate-800 text-slate-400 hover:text-yellow-400'
                }`}
              >
                {isChoreographyMode ? 'Ativado' : 'Desativado'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {isActive && (
          <>
            {/* Métricas Principais */}
            <MetricsGrid metrics={metrics} columns={4} />

            {/* Contagem de Combos */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Combos Completados</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">{combosCompleted}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Movimentos</span>
                    <span className="text-white">{combosCompleted} / {currentMovements.length}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      className={`bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full flex items-center justify-end pr-2`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (combosCompleted / currentMovements.length) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      {combosCompleted > 0 && (
                        <span className="text-xs text-white font-bold">
                          {Math.round((combosCompleted / currentMovements.length) * 100)}%
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>

                {combosCompleted >= currentMovements.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4 bg-green-500/20 rounded-lg border border-green-400"
                  >
                    <div className="text-2xl">🎉</div>
                    <div className="text-green-400 font-semibold">Rotina Dominada!</div>
                    <div className="text-xs text-slate-400">Parabéns pela sua performance!</div>
                  </motion.div>
                )}
              </div>
            </PremiumCard>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Expressão e Ritmo</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expressão</span>
                    <span className="text-white">{expression.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ritmo</span>
                    <span className="text-white">{rhythm.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estilo</span>
                    <span className="text-white">{selectedStyle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Música</span>
                    <span className="text-white">{selectedMusic.name}</span>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Energia e Coordenação</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{energy.toFixed(0)}</div>
                    <div className="text-sm text-slate-400">Energia</div>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-400`}>
                      Coordenação: {coordination.toFixed(0)}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">BPM</span>
                    <span className="text-white">{selectedMusic.bpm}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Modo Coreografia</span>
                    <span className="text-white">{isChoreographyMode ? 'Sim' : 'Não'}</span>
                  </div>
                </div>
              </PremiumCard>
            </div>
          </>
        )}
      </div>
    </ModernActivityBase>
  );
}
