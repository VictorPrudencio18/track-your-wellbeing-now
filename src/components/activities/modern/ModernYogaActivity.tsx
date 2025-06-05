
import React, { useState, useEffect } from 'react';
import { Waves, Timer, Heart, Zap, Target, Sparkles, Sun, Brain, Flame, RotateCcw } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface ModernYogaActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const yogaStyles = [
  { name: 'Hatha', description: 'Posturas lentas e relaxantes', intensity: 1, color: 'from-green-500 to-emerald-600' },
  { name: 'Vinyasa', description: 'Fluxo dinâmico de movimentos', intensity: 3, color: 'from-blue-500 to-cyan-600' },
  { name: 'Ashtanga', description: 'Sequência vigorosa e atlética', intensity: 4, color: 'from-orange-500 to-red-600' },
  { name: 'Yin', description: 'Posturas passivas e meditativas', intensity: 1, color: 'from-purple-500 to-pink-600' },
  { name: 'Hot Yoga', description: 'Prática em ambiente aquecido', intensity: 4, color: 'from-red-500 to-orange-600' },
  { name: 'Kundalini', description: 'Foco em energia e espiritualidade', intensity: 2, color: 'from-indigo-500 to-purple-600' }
];

const breathingTechniques = [
  { name: 'Ujjayi', pattern: '4-4-4-4', description: 'Respiração oceânica' },
  { name: 'Anulom Vilom', pattern: '4-2-4-2', description: 'Respiração alternada' },
  { name: 'Bhramari', pattern: '4-0-6-0', description: 'Respiração da abelha' },
  { name: 'Kapalabhati', pattern: '1-0-1-0', description: 'Respiração do fogo' }
];

const chakras = [
  { name: 'Muladhara', color: 'from-red-500 to-pink-600' },
  { name: 'Manipura', color: 'from-blue-500 to-cyan-600' },
  { name: 'Svadhisthana', color: 'from-orange-500 to-red-600' },
  { name: 'Anahata', color: 'from-purple-500 to-pink-600' },
  { name: 'Sahasrara', color: 'from-indigo-500 to-purple-600' }
];

const poses = [
  { name: 'Montanha (Tadasana)', duration: 60, difficulty: 1, chakra: 'Muladhara' },
  { name: 'Saudação ao Sol', duration: 120, difficulty: 2, chakra: 'Manipura' },
  { name: 'Guerreiro I', duration: 90, difficulty: 2, chakra: 'Svadhisthana' },
  { name: 'Guerreiro II', duration: 90, difficulty: 2, chakra: 'Svadhisthana' },
  { name: 'Triângulo', duration: 75, difficulty: 2, chakra: 'Manipura' },
  { name: 'Cão Olhando para Baixo', duration: 60, difficulty: 1, chakra: 'Anahata' },
  { name: 'Cobra', duration: 45, difficulty: 2, chakra: 'Anahata' },
  { name: 'Criança', duration: 120, difficulty: 1, chakra: 'Sahasrara' },
  { name: 'Árvore', duration: 60, difficulty: 3, chakra: 'Muladhara' },
  { name: 'Lótus', duration: 300, difficulty: 4, chakra: 'Sahasrara' }
];

export function ModernYogaActivity({ onComplete, onCancel }: ModernYogaActivityProps) {
  const createActivity = useCreateActivity();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(yogaStyles[0]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [heartRate, setHeartRate] = useState(72);
  const [mindfulness, setMindfulness] = useState(50);
  const [flexibility, setFlexibility] = useState(60);
  const [energy, setEnergy] = useState(100);
  const [selectedBreathing, setSelectedBreathing] = useState(breathingTechniques[0]);
  const [breathingPhase, setBreathingPhase] = useState('inspire');
  const [breathTimer, setBreathTimer] = useState(0);
  const [completedPoses, setCompletedPoses] = useState<string[]>([]);
  const [posesCompleted, setPosesCompleted] = useState(0);
  const [currentChakra, setCurrentChakra] = useState(chakras[0]);
  const [currentPoses, setCurrentPoses] = useState(poses);
  const [calories, setCalories] = useState(0);
  const [avgHeartRate, setAvgHeartRate] = useState(72);
  const [balance, setBalance] = useState(60);
  const [breathingCycles, setBreathingCycles] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setPoseTime(prev => prev + 1);
        setBreathTimer(prev => prev + 1);
        
        // Simulação de métricas
        setHeartRate(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 2)));
        setMindfulness(prev => Math.min(100, prev + 0.1));
        setFlexibility(prev => Math.min(100, prev + 0.05));
        setEnergy(prev => Math.max(20, prev - 0.02));
        
        // Contador de respiração
        if (duration % 8 === 0) {
          setBreathCount(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    const sessionData = {
      type: 'yoga' as const,
      name: `Yoga ${selectedStyle.name}`,
      duration,
      calories: Math.round(calories),
      avg_heart_rate: Math.round(avgHeartRate),
      max_heart_rate: Math.round(heartRate),
      notes: `Estilo: ${selectedStyle.name} | Respiração: ${selectedBreathing.name} | Poses: ${posesCompleted} | Chakra: ${currentChakra.name}`,
      gps_data: {
        yoga_style: selectedStyle.name,
        breathing_technique: selectedBreathing.name,
        poses_completed: posesCompleted,
        poses_total: currentPoses.length,
        current_chakra: currentChakra.name,
        mindfulness_score: Math.round(mindfulness),
        flexibility_score: Math.round(flexibility),
        energy_score: Math.round(energy),
        balance_score: Math.round(balance),
        breathing_cycles: breathingCycles,
        session_intensity: selectedStyle.intensity,
        completion_rate: (posesCompleted / currentPoses.length) * 100
      }
    };
    
    try {
      await createActivity.mutateAsync(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving yoga activity:', error);
      onComplete(sessionData); // Still complete the activity even if save fails
    }
  };

  const nextPose = () => {
    if (currentPoseIndex < poses.length - 1) {
      if (!completedPoses.includes(poses[currentPoseIndex].name)) {
        setCompletedPoses(prev => [...prev, poses[currentPoseIndex].name]);
      }
      setCurrentPoseIndex(prev => prev + 1);
      setPoseTime(0);
    }
  };

  const previousPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(prev => prev - 1);
      setPoseTime(0);
    }
  };

  const resetPoseTimer = () => {
    setPoseTime(0);
  };

  const metrics = [
    {
      id: 'heartrate',
      icon: Heart,
      label: 'Frequência Cardíaca',
      value: Math.round(heartRate),
      unit: 'bpm',
      color: 'from-red-500 to-pink-600',
      trend: (heartRate > 75 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: '2%'
    },
    {
      id: 'breaths',
      icon: Waves,
      label: 'Respirações',
      value: breathCount,
      unit: 'ciclos',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'mindfulness',
      icon: Brain,
      label: 'Mindfulness',
      value: Math.round(mindfulness),
      unit: '%',
      color: 'from-purple-500 to-indigo-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: '5%'
    },
    {
      id: 'energy',
      icon: Flame,
      label: 'Energia',
      value: Math.round(energy),
      unit: '%',
      color: 'from-orange-500 to-yellow-600',
      trend: (energy > 50 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: '3%'
    }
  ];

  const currentPose = poses[currentPoseIndex];

  return (
    <ModernActivityBase
      title="Yoga"
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
        label: 'Duração da Sessão'
      }}
    >
      <div className="space-y-6">
        {/* Seleção de Estilo */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha seu Estilo</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {yogaStyles.map((style) => (
                <motion.button
                  key={style.name}
                  onClick={() => setSelectedStyle(style)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedStyle.name === style.name
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-purple-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-2`} />
                  <div className="text-left">
                    <div className="font-semibold text-white">{style.name}</div>
                    <div className="text-xs text-slate-400">{style.description}</div>
                    <div className="text-xs text-purple-400">
                      Intensidade: {'●'.repeat(style.intensity)}{'○'.repeat(5-style.intensity)}
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

            {/* Pose Atual */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">
                    Pose {currentPoseIndex + 1} de {poses.length}
                  </span>
                  <span className="text-sm text-purple-400">
                    Chakra: {currentPose.chakra}
                  </span>
                </div>
                
                <motion.div
                  key={currentPose.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <h3 className="text-2xl font-bold text-white">{currentPose.name}</h3>
                  
                  <div className="text-4xl font-mono text-purple-400">
                    {Math.floor(poseTime / 60)}:{(poseTime % 60).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                    <Timer className="w-4 h-4" />
                    Tempo recomendado: {currentPose.duration}s
                  </div>
                  
                  <div className="flex justify-center gap-2">
                    <Button
                      onClick={previousPose}
                      disabled={currentPoseIndex === 0}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      ← Anterior
                    </Button>
                    <Button
                      onClick={resetPoseTimer}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={nextPose}
                      disabled={currentPoseIndex === poses.length - 1}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      Próxima →
                    </Button>
                  </div>
                </motion.div>
              </div>
            </PremiumCard>

            {/* Guia de Respiração */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="text-center space-y-4">
                <h4 className="text-lg font-semibold text-white">Guia de Respiração</h4>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {breathingTechniques.map((pattern) => (
                    <button
                      key={pattern.name}
                      onClick={() => setSelectedBreathing(pattern)}
                      className={`p-2 rounded-lg text-xs transition-all ${
                        selectedBreathing.name === pattern.name
                          ? 'bg-blue-500/20 border border-blue-400 text-blue-400'
                          : 'bg-slate-800 border border-slate-600 text-slate-400 hover:border-blue-400/50'
                      }`}
                    >
                      {pattern.name}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-semibold text-blue-400">
                    {selectedBreathing.name}
                  </div>
                  <div className="text-sm text-slate-400">
                    {selectedBreathing.description}
                  </div>
                  <div className="text-lg text-white">
                    Padrão: {selectedBreathing.pattern}
                  </div>
                </div>

                {/* Círculo de Respiração */}
                <div className="flex justify-center">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center"
                    animate={{
                      scale: breathingPhase === 'inspire' ? 1.2 : 0.8
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  >
                    <Waves className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </div>
            </PremiumCard>

            {/* Progresso das Poses */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Progresso da Sessão</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Poses Concluídas</span>
                  <span className="text-white">{completedPoses.length}/{poses.length}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedPoses.length / poses.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {poses.map((pose, index) => (
                    <div
                      key={pose.name}
                      className={`w-3 h-3 rounded-full ${
                        completedPoses.includes(pose.name)
                          ? 'bg-green-400'
                          : index === currentPoseIndex
                          ? 'bg-purple-400'
                          : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </PremiumCard>
          </>
        )}
      </div>
    </ModernActivityBase>
  );
}
