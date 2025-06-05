
import React, { useState, useEffect } from 'react';
import { Brain, Timer, Waves, Heart, Volume2, VolumeX, Sun, Moon, Flower2 } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernMeditationActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const meditationTypes = [
  { name: 'Mindfulness', duration: 10, description: 'Atenção plena no momento presente', color: 'from-blue-500 to-cyan-600', icon: '🧠' },
  { name: 'Respiração', duration: 15, description: 'Foco na respiração consciente', color: 'from-green-500 to-emerald-600', icon: '🌬️' },
  { name: 'Body Scan', duration: 20, description: 'Escaneamento corporal relaxante', color: 'from-purple-500 to-indigo-600', icon: '✨' },
  { name: 'Gratidão', duration: 12, description: 'Cultivando sentimentos de gratidão', color: 'from-yellow-500 to-orange-600', icon: '🙏' },
  { name: 'Compaixão', duration: 18, description: 'Desenvolvimento da autocompaixão', color: 'from-pink-500 to-rose-600', icon: '💖' },
  { name: 'Concentração', duration: 25, description: 'Foco em objeto único', color: 'from-indigo-500 to-purple-600', icon: '🎯' }
];

const ambientSounds = [
  { name: 'Silêncio', file: null, icon: VolumeX, description: 'Meditação em silêncio' },
  { name: 'Chuva', file: 'rain.mp3', icon: Volume2, description: 'Som suave de chuva' },
  { name: 'Oceano', file: 'ocean.mp3', icon: Waves, description: 'Ondas do mar' },
  { name: 'Floresta', file: 'forest.mp3', icon: Flower2, description: 'Sons da natureza' },
  { name: 'Sino Tibetano', file: 'bell.mp3', icon: Sun, description: 'Sinos relaxantes' }
];

const breathingPatterns = [
  { name: '4-4-4-4', inhale: 4, hold1: 4, exhale: 4, hold2: 4, description: 'Respiração quadrada' },
  { name: '4-7-8', inhale: 4, hold1: 7, exhale: 8, hold2: 0, description: 'Respiração relaxante' },
  { name: '6-2-6-2', inhale: 6, hold1: 2, exhale: 6, hold2: 2, description: 'Respiração profunda' },
  { name: '5-5-5-5', inhale: 5, hold1: 5, exhale: 5, hold2: 5, description: 'Respiração equilibrada' }
];

const guidedPhases = [
  { name: 'Preparação', duration: 60, instruction: 'Encontre uma posição confortável e feche os olhos' },
  { name: 'Respiração Inicial', duration: 120, instruction: 'Respire naturalmente e observe sua respiração' },
  { name: 'Prática Principal', duration: 480, instruction: 'Mantenha o foco na sua técnica escolhida' },
  { name: 'Integração', duration: 120, instruction: 'Observe como você se sente agora' },
  { name: 'Finalização', duration: 60, instruction: 'Abra os olhos lentamente e volte ao presente' }
];

export function ModernMeditationActivity({ onComplete, onCancel }: ModernMeditationActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedType, setSelectedType] = useState(meditationTypes[0]);
  const [selectedSound, setSelectedSound] = useState(ambientSounds[0]);
  const [selectedBreathing, setSelectedBreathing] = useState(breathingPatterns[0]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [mindfulness, setMindfulness] = useState(50);
  const [relaxation, setRelaxation] = useState(50);
  const [focus, setFocus] = useState(50);
  const [heartRate, setHeartRate] = useState(72);
  const [stressLevel, setStressLevel] = useState(50);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setPhaseTime(prev => prev + 1);
        
        // Progredir através das fases
        if (currentPhase < guidedPhases.length - 1 && phaseTime >= guidedPhases[currentPhase].duration) {
          const currentPhaseName = guidedPhases[currentPhase].name;
          if (!completedPhases.includes(currentPhaseName)) {
            setCompletedPhases(prev => [...prev, currentPhaseName]);
          }
          setCurrentPhase(prev => prev + 1);
          setPhaseTime(0);
        }
        
        // Simulação de métricas melhorando com o tempo
        setMindfulness(prev => Math.min(100, prev + 0.1));
        setRelaxation(prev => Math.min(100, prev + 0.08));
        setFocus(prev => Math.min(100, prev + 0.06));
        setHeartRate(prev => Math.max(55, prev - 0.02));
        setStressLevel(prev => Math.max(0, prev - 0.05));
        
        // Contador de ciclos de respiração
        if (duration % (selectedBreathing.inhale + selectedBreathing.hold1 + selectedBreathing.exhale + selectedBreathing.hold2) === 0) {
          setBreathCycle(prev => prev + 1);
        }
        
        // Fase da respiração
        const cycleTime = duration % (selectedBreathing.inhale + selectedBreathing.hold1 + selectedBreathing.exhale + selectedBreathing.hold2);
        if (cycleTime < selectedBreathing.inhale) {
          setBreathPhase('inhale');
        } else if (cycleTime < selectedBreathing.inhale + selectedBreathing.hold1) {
          setBreathPhase('hold1');
        } else if (cycleTime < selectedBreathing.inhale + selectedBreathing.hold1 + selectedBreathing.exhale) {
          setBreathPhase('exhale');
        } else {
          setBreathPhase('hold2');
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, currentPhase, phaseTime, selectedBreathing, completedPhases]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    const sessionData = {
      type: 'meditation',
      name: `Meditação ${selectedType.name}`,
      duration,
      meditation_type: selectedType.name,
      breath_cycles: breathCycle,
      phases_completed: completedPhases.length,
      total_phases: guidedPhases.length,
      mindfulness_score: Math.round(mindfulness),
      relaxation_score: Math.round(relaxation),
      focus_score: Math.round(focus),
      final_heart_rate: Math.round(heartRate),
      stress_reduction: Math.round(50 - stressLevel),
      ambient_sound: selectedSound.name,
      breathing_pattern: selectedBreathing.name,
      date: new Date()
    };
    
    onComplete(sessionData);
  };

  const metrics = [
    {
      id: 'mindfulness',
      icon: Brain,
      label: 'Mindfulness',
      value: Math.round(mindfulness),
      unit: '%',
      color: 'from-blue-500 to-cyan-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: '+5%'
    },
    {
      id: 'relaxation',
      icon: Flower2,
      label: 'Relaxamento',
      value: Math.round(relaxation),
      unit: '%',
      color: 'from-green-500 to-emerald-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: '+3%'
    },
    {
      id: 'focus',
      icon: Sun,
      label: 'Foco',
      value: Math.round(focus),
      unit: '%',
      color: 'from-yellow-500 to-orange-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: '+2%'
    },
    {
      id: 'heartrate',
      icon: Heart,
      label: 'Freq. Cardíaca',
      value: Math.round(heartRate),
      unit: 'bpm',
      color: 'from-red-500 to-pink-600',
      trend: 'down' as 'up' | 'down' | 'neutral',
      trendValue: '-15%'
    }
  ];

  const currentGuidedPhase = guidedPhases[currentPhase] || guidedPhases[guidedPhases.length - 1];
  const phaseProgress = (phaseTime / currentGuidedPhase.duration) * 100;

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
        value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
        unit: 'min',
        label: 'Tempo de Meditação'
      }}
    >
      <div className="space-y-6">
        {/* Configurações */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Tipo de Meditação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{type.name}</div>
                      <div className="text-xs text-slate-400">{type.description}</div>
                      <div className="text-xs text-blue-400">{type.duration} min recomendado</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Som Ambiente</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {ambientSounds.map((sound) => {
                  const IconComponent = sound.icon;
                  return (
                    <motion.button
                      key={sound.name}
                      onClick={() => setSelectedSound(sound)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedSound.name === sound.name
                          ? 'border-green-400 bg-green-500/20'
                          : 'border-slate-600 bg-slate-800/50 hover:border-green-400/50'
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                      <div className="text-xs text-white font-medium">{sound.name}</div>
                      <div className="text-xs text-slate-400">{sound.description}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Padrão de Respiração</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {breathingPatterns.map((pattern) => (
                  <motion.button
                    key={pattern.name}
                    onClick={() => setSelectedBreathing(pattern)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedBreathing.name === pattern.name
                        ? 'border-purple-400 bg-purple-500/20'
                        : 'border-slate-600 bg-slate-800/50 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="text-lg font-bold text-white">{pattern.name}</div>
                    <div className="text-xs text-slate-400">{pattern.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {isActive && (
          <>
            {/* Métricas */}
            <MetricsGrid metrics={metrics} columns={4} />

            {/* Fase Atual da Meditação */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="text-center space-y-4">
                <h4 className="text-lg font-semibold text-white">Guia da Meditação</h4>
                
                <motion.div
                  key={currentPhase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="text-2xl font-bold text-blue-400">{currentGuidedPhase.name}</div>
                  <div className="text-slate-300 max-w-md mx-auto">{currentGuidedPhase.instruction}</div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, phaseProgress)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    Fase {currentPhase + 1} de {guidedPhases.length} • 
                    {Math.floor(phaseTime / 60)}:{(phaseTime % 60).toString().padStart(2, '0')} / 
                    {Math.floor(currentGuidedPhase.duration / 60)}:{(currentGuidedPhase.duration % 60).toString().padStart(2, '0')}
                  </div>
                </motion.div>
              </div>
            </PremiumCard>

            {/* Círculo de Respiração */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="text-center space-y-4">
                <h4 className="text-lg font-semibold text-white">Guia de Respiração</h4>
                
                <div className="flex justify-center">
                  <motion.div
                    className={`w-32 h-32 rounded-full flex items-center justify-center relative ${
                      breathPhase === 'inhale' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                      breathPhase === 'hold1' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
                      breathPhase === 'exhale' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                      'bg-gradient-to-r from-yellow-400 to-orange-400'
                    }`}
                    animate={{
                      scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'exhale' ? 0.8 : 1
                    }}
                    transition={{
                      duration: breathPhase === 'inhale' ? selectedBreathing.inhale :
                                breathPhase === 'hold1' ? selectedBreathing.hold1 :
                                breathPhase === 'exhale' ? selectedBreathing.exhale :
                                selectedBreathing.hold2,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="text-white text-center">
                      <div className="text-lg font-bold">
                        {breathPhase === 'inhale' ? 'Inspire' :
                         breathPhase === 'hold1' ? 'Segure' :
                         breathPhase === 'exhale' ? 'Expire' :
                         'Pausa'}
                      </div>
                      <div className="text-sm">{selectedBreathing.name}</div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="text-sm text-slate-400">
                  Ciclos Completos: {breathCycle}
                </div>
              </div>
            </PremiumCard>

            {/* Progresso das Fases */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Progresso da Sessão</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fases Concluídas</span>
                  <span className="text-white">{completedPhases.length}/{guidedPhases.length}</span>
                </div>
                <div className="flex gap-2">
                  {guidedPhases.map((phase, index) => (
                    <div
                      key={phase.name}
                      className={`flex-1 h-2 rounded-full ${
                        completedPhases.includes(phase.name) ? 'bg-green-400' :
                        index === currentPhase ? 'bg-blue-400' :
                        'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{Math.round(relaxation)}%</div>
                    <div className="text-xs text-slate-400">Relaxamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{Math.round(50 - stressLevel)}%</div>
                    <div className="text-xs text-slate-400">Redução de Stress</div>
                  </div>
                </div>
              </div>
            </PremiumCard>
          </>
        )}
      </div>
    </ModernActivityBase>
  );
}
