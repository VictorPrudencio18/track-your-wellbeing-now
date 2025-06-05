
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Timer, Waves, Pause, Play, Volume2, VolumeX, Zap } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface ModernMeditationActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const meditationTypes = [
  { name: 'Mindfulness', duration: 10, intensity: 1, color: 'from-green-400 to-emerald-500', icon: '🧘‍♀️' },
  { name: 'Respiração', duration: 15, intensity: 2, color: 'from-blue-400 to-cyan-500', icon: '🌬️' },
  { name: 'Body Scan', duration: 20, intensity: 2, color: 'from-purple-400 to-pink-500', icon: '✨' },
  { name: 'Concentração', duration: 25, intensity: 3, color: 'from-orange-400 to-red-500', icon: '🎯' }
];

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
}

const breathingPatterns: BreathingPattern[] = [
  { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, pause: 0 },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, pause: 4 },
  { name: 'Alternate Nostril', inhale: 4, hold: 0, exhale: 6, pause: 0 },
  { name: 'Lion’s Breath', inhale: 4, hold: 0, exhale: 8, pause: 0 }
];

const ambientSounds = [
  { name: 'Silêncio', sound: null, icon: '🔇' },
  { name: 'Chuva', sound: 'rain', icon: '🌧️' },
  { name: 'Oceano', sound: 'ocean', icon: '🌊' },
  { name: 'Floresta', sound: 'forest', icon: '🌲' },
  { name: 'Sino Tibetano', sound: 'bell', icon: '🔔' }
];

const meditationPhases = [
  { name: 'Preparação', duration: 3 },
  { name: 'Foco na Respiração', duration: 5 },
  { name: 'Consciência Plena', duration: 7 },
  { name: 'Expansão da Consciência', duration: 5 },
  { name: 'Retorno Gentil', duration: 3 }
];

export function ModernMeditationActivity({ onComplete, onCancel }: ModernMeditationActivityProps) {
  const createActivity = useCreateActivity();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [heartRate, setHeartRate] = useState(70);
  const [avgHeartRate, setAvgHeartRate] = useState(70);
  const [calories, setCalories] = useState(0);
  const [mindfulness, setMindfulness] = useState(50);
  const [relaxation, setRelaxation] = useState(50);
  const [focus, setFocus] = useState(50);
  const [stressReduction, setStressReduction] = useState(50);
  const [sessionQuality, setSessionQuality] = useState('Boa');
  const [volume, setVolume] = useState(0.5);
  const [selectedType, setSelectedType] = useState(meditationTypes[0]);
  const [selectedSound, setSelectedSound] = useState(ambientSounds[0]);
  const [breathingPattern, setBreathingPattern] = useState(breathingPatterns[0]);
  const [phases, setPhases] = useState(meditationPhases.map(phase => ({ ...phase, completed: false })));
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(phases[0].name);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let phaseTimer: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simulação de métricas
        setHeartRate(prev => Math.min(100, prev + (Math.random() - 0.5) * 2));
        setAvgHeartRate(prev => (prev + heartRate) / 2);
        setCalories(prev => prev + (selectedType.intensity * 0.1));
        setMindfulness(prev => Math.min(100, mindfulness + (Math.random() - 0.5) * 1));
        setRelaxation(prev => Math.min(100, relaxation + (Math.random() - 0.5) * 1));
        setFocus(prev => Math.min(100, focus + (Math.random() - 0.5) * 1));
        setStressReduction(prev => Math.max(0, stressReduction - (Math.random() * 0.5)));
      }, 1000);

      // Lógica de fases
      phaseTimer = setTimeout(() => {
        if (currentPhaseIndex < phases.length - 1) {
          const updatedPhases = [...phases];
          updatedPhases[currentPhaseIndex].completed = true;
          setPhases(updatedPhases);
          setCurrentPhaseIndex(currentPhaseIndex + 1);
          setCurrentPhase(updatedPhases[currentPhaseIndex + 1].name);
        } else {
          // Última fase concluída
          setSessionQuality('Excelente');
        }
      }, phases[currentPhaseIndex].duration * 60 * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, isPaused, heartRate, mindfulness, relaxation, focus, stressReduction, selectedType, phases, currentPhaseIndex]);

  useEffect(() => {
    if (selectedSound.sound && audioRef.current) {
      audioRef.current.src = `/sounds/${selectedSound.sound}.mp3`;
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      if (isActive && !isPaused) {
        audioRef.current.play().catch(error => {
          console.error("Erro ao tentar tocar o áudio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [selectedSound, volume, isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (audioRef.current && selectedSound.sound) {
      audioRef.current.play().catch(error => {
        console.error("Erro ao tentar tocar o áudio:", error);
      });
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (audioRef.current) {
      isPaused ? audioRef.current.play() : audioRef.current.pause();
    }
  };

  const handleStop = async () => {
    const sessionData = {
      type: 'yoga' as const, // Changed from 'meditation' to 'yoga' as meditation is not a valid type in DB
      name: `Meditação ${selectedType.name}`,
      duration,
      calories: Math.round(calories),
      avg_heart_rate: Math.round(avgHeartRate),
      max_heart_rate: Math.round(heartRate),
      notes: `Tipo: ${selectedType.name} | Som: ${selectedSound.name} | Respiração: ${breathingPattern.name} | Fase Final: ${currentPhase}`,
      gps_data: {
        meditation_type: selectedType.name,
        ambient_sound: selectedSound.name,
        breathing_pattern: breathingPattern.name,
        phases_completed: phases.filter(p => p.completed).length,
        mindfulness_score: Math.round(mindfulness),
        relaxation_score: Math.round(relaxation),
        focus_score: Math.round(focus),
        stress_reduction: Math.round(stressReduction),
        session_quality: sessionQuality,
        breathing_cycles: Math.round(duration / (breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale + breathingPattern.pause)),
        final_phase: currentPhase
      }
    };
    
    try {
      await createActivity.mutateAsync(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving meditation activity:', error);
      onComplete(sessionData); // Still complete the activity even if save fails
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
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
      trend: (heartRate > 70 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: `${Math.round(heartRate - 70)} bpm`
    },
    {
      id: 'mindfulness',
      icon: Brain,
      label: 'Mindfulness',
      value: Math.round(mindfulness),
      unit: '%',
      color: 'from-blue-500 to-cyan-600',
      trend: (mindfulness > 50 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: `${Math.round(mindfulness - 50)}%`
    },
    {
      id: 'relaxation',
      icon: Waves,
      label: 'Relaxamento',
      value: Math.round(relaxation),
      unit: '%',
      color: 'from-green-500 to-emerald-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: `${Math.round(relaxation - 50)}%`
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: Math.round(calories),
      unit: 'kcal',
      color: 'from-orange-500 to-yellow-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: `${(calories/duration*60).toFixed(0)}/min`
    }
  ];

  return (
    <ModernActivityBase
      title="Meditação"
      icon={<Brain className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: Math.round(mindfulness).toLocaleString(),
        unit: '%',
        label: 'Nível de Mindfulness'
      }}
    >
      <div className="space-y-6">
        {/* Seleção de Tipo de Meditação */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha o Tipo de Meditação</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {meditationTypes.map((type) => (
                <motion.button
                  key={type.name}
                  onClick={() => setSelectedType(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedType.name === type.name
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-blue-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${type.color} mb-2`} />
                  <div className="text-left">
                    <div className="font-semibold text-white">{type.name}</div>
                    <div className="text-xs text-slate-400">{type.duration} min</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Sons Ambiente */}
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">Sons Ambiente</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ambientSounds.map((sound) => (
                <motion.button
                  key={sound.name}
                  onClick={() => setSelectedSound(sound)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedSound.name === sound.name
                      ? 'border-green-400 bg-green-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-green-400/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{sound.icon}</div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{sound.name}</div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Padrões de Respiração */}
            <h3 className="text-lg font-semibold text-white mb-4 mt-8">Padrões de Respiração</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {breathingPatterns.map((pattern) => (
                <motion.button
                  key={pattern.name}
                  onClick={() => setBreathingPattern(pattern)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    breathingPattern.name === pattern.name
                      ? 'border-yellow-400 bg-yellow-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-yellow-400/50'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{pattern.name}</div>
                    <div className="text-xs text-slate-400">
                      {pattern.inhale}-{pattern.hold}-{pattern.exhale}-{pattern.pause}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {isActive && (
          <>
            {/* Métricas Principais */}
            <MetricsGrid metrics={metrics} columns={4} />

            {/* Controle de Volume */}
            {selectedSound.sound && (
              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Volume</h4>
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-blue-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <Volume2 className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <audio ref={audioRef} src={selectedSound.sound ? `/sounds/${selectedSound.sound}.mp3` : null} preload="auto" />
              </PremiumCard>
            )}

            {/* Progresso da Sessão */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Fases da Meditação</h4>
                </div>
                
                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`text-slate-400 ${phase.completed ? 'line-through' : ''}`}>{phase.name}</span>
                      <span className="text-white">{phase.completed ? '✅' : '⏳'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumCard>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Qualidade da Sessão</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mindfulness</span>
                    <span className="text-white">{mindfulness.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Relaxamento</span>
                    <span className="text-white">{relaxation.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Foco</span>
                    <span className="text-white">{focus.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Redução de Stress</span>
                    <span className="text-white">{stressReduction.toFixed(0)}%</span>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Detalhes</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipo</span>
                    <span className="text-white">{selectedType.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Som Ambiente</span>
                    <span className="text-white">{selectedSound.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Respiração</span>
                    <span className="text-white">{breathingPattern.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fase Atual</span>
                    <span className="text-white">{currentPhase}</span>
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
