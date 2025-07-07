import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, Square, RotateCcw, Zap, Target, Activity, Clock, FileText, Heart, Volume2, VolumeX, Settings, Trophy, Flame, Bolt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface ModernHITSActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

interface HITSProtocol {
  name: string;
  workTime: number;
  restTime: number;
  rounds: number;
  description: string;
  color: string;
  icon: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Extremo';
}

const hitsProtocols: HITSProtocol[] = [
  {
    name: 'Tabata',
    workTime: 20,
    restTime: 10,
    rounds: 8,
    description: '20s trabalho / 10s descanso',
    color: 'from-red-500 via-orange-500 to-yellow-500',
    icon: '⚡',
    difficulty: 'Intermediário'
  },
  {
    name: 'EMOM',
    workTime: 30,
    restTime: 30,
    rounds: 10,
    description: '30s trabalho / 30s descanso',
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    icon: '⏱️',
    difficulty: 'Iniciante'
  },
  {
    name: 'AMRAP',
    workTime: 60,
    restTime: 15,
    rounds: 6,
    description: '60s trabalho / 15s descanso',
    color: 'from-green-500 via-emerald-500 to-lime-500',
    icon: '🎯',
    difficulty: 'Avançado'
  },
  {
    name: 'Beast Mode',
    workTime: 45,
    restTime: 15,
    rounds: 12,
    description: '45s trabalho / 15s descanso',
    color: 'from-purple-500 via-fuchsia-500 to-pink-500',
    icon: '🔥',
    difficulty: 'Extremo'
  },
  {
    name: 'Quick Burn',
    workTime: 15,
    restTime: 45,
    rounds: 6,
    description: '15s trabalho / 45s descanso',
    color: 'from-amber-500 via-orange-500 to-red-500',
    icon: '⚡',
    difficulty: 'Iniciante'
  },
  {
    name: 'Endurance',
    workTime: 90,
    restTime: 30,
    rounds: 5,
    description: '90s trabalho / 30s descanso',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
    icon: '💪',
    difficulty: 'Avançado'
  }
];

const exerciseCategories = {
  'Cardio': ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees', 'Jumping Jacks', 'Sprint in Place', 'Jump Rope'],
  'Força': ['Push-ups', 'Squats', 'Lunges', 'Plank', 'Pike Push-ups', 'Diamond Push-ups', 'Wall Sit'],
  'Core': ['Russian Twists', 'Bicycle Crunches', 'Plank Jacks', 'Dead Bug', 'Hollow Body Hold', 'V-ups'],
  'Funcional': ['Bear Crawl', 'Crab Walk', 'Inchworm', 'Turkish Get-up', 'Single Leg Deadlift', 'Lateral Lunges']
};

const motivationalPhrases = [
  "Força total! 💪",
  "Você consegue! 🔥",
  "Não desista agora! ⚡",
  "Supere seus limites! 🚀",
  "Foco no objetivo! 🎯",
  "Último round! 🏆"
];

export function ModernHITSActivity({ onComplete, onCancel }: ModernHITSActivityProps) {
  const createActivity = useCreateActivity();
  
  const [selectedProtocol, setSelectedProtocol] = useState(hitsProtocols[0]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>(['Burpees']);
  const [customExercise, setCustomExercise] = useState('');
  const [heartRateEstimate, setHeartRateEstimate] = useState(120);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motivationEnabled, setMotivationEnabled] = useState(true);
  const [intensity, setIntensity] = useState([75]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sessionDuration = selectedProtocol.rounds * (selectedProtocol.workTime + selectedProtocol.restTime);
  const totalProgress = ((currentRound - 1) * (selectedProtocol.workTime + selectedProtocol.restTime) + 
                        (isWorkPhase ? currentTime : selectedProtocol.workTime + currentTime)) / sessionDuration * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
        
        if (isWorkPhase) {
          setCurrentTime(prev => {
            if (prev >= selectedProtocol.workTime - 1) {
              setIsWorkPhase(false);
              setCurrentTime(0);
              setHeartRateEstimate(prev => Math.min(180, prev + 8));
              if (soundEnabled) playSound('work-end');
              return 0;
            }
            return prev + 1;
          });
        } else {
          setCurrentTime(prev => {
            if (prev >= selectedProtocol.restTime - 1) {
              if (currentRound >= selectedProtocol.rounds) {
                setIsActive(false);
                setIsCompleted(true);
                if (soundEnabled) playSound('complete');
                return prev;
              }
              setCurrentRound(prev => prev + 1);
              setCurrentExerciseIndex(prev => (prev + 1) % selectedExercises.length);
              setIsWorkPhase(true);
              setCurrentTime(0);
              setHeartRateEstimate(prev => Math.max(110, prev - 5));
              if (soundEnabled) playSound('rest-end');
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, isWorkPhase, currentRound, selectedProtocol, soundEnabled, selectedExercises.length]);

  const playSound = (type: 'work-end' | 'rest-end' | 'complete') => {
    if (!soundEnabled) return;
    
    // Simple beep sounds using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequency = type === 'complete' ? 800 : type === 'work-end' ? 600 : 400;
    const duration = type === 'complete' ? 0.5 : 0.2;
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentTime(0);
    setTotalTime(0);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setHeartRateEstimate(120 + (intensity[0] - 50) / 2);
    setCurrentExerciseIndex(0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setCurrentTime(0);
    setTotalTime(0);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setHeartRateEstimate(120);
    setCurrentExerciseIndex(0);
  };

  const handleCompleteHITS = async () => {
    const caloriesEstimate = Math.round(totalTime / 60 * (12 + intensity[0] / 10));
    const sessionData = {
      type: 'hits' as const,
      name: `HITS ${selectedProtocol.name}`,
      duration: totalTime,
      notes: `${notes ? notes + ' | ' : ''}${feeling ? 'Como se sentiu: ' + feeling + ' | ' : ''}Protocolo: ${selectedProtocol.name} | Exercícios: ${selectedExercises.join(', ')} | Rounds completados: ${currentRound - 1}/${selectedProtocol.rounds} | Intensidade: ${intensity[0]}%`,
      avg_heart_rate: Math.round(heartRateEstimate * 0.9),
      max_heart_rate: Math.round(heartRateEstimate * 1.1),
      calories: caloriesEstimate,
      gps_data: {
        protocol: selectedProtocol.name,
        work_time: selectedProtocol.workTime,
        rest_time: selectedProtocol.restTime,
        total_rounds: selectedProtocol.rounds,
        completed_rounds: currentRound - 1,
        exercises: selectedExercises,
        session_intensity: intensity[0] >= 80 ? 'extreme' : intensity[0] >= 60 ? 'high' : 'moderate',
        user_notes: notes,
        feeling_after: feeling,
        estimated_heart_rate: heartRateEstimate,
        difficulty_level: selectedProtocol.difficulty,
        completion_rate: ((currentRound - 1) / selectedProtocol.rounds) * 100
      }
    };
    
    try {
      await createActivity.mutateAsync(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving HITS activity:', error);
      onComplete(sessionData);
    }
  };

  const addExercise = (exercise: string) => {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exercise: string) => {
    if (selectedExercises.length > 1) {
      setSelectedExercises(selectedExercises.filter(e => e !== exercise));
    }
  };

  const addCustomExercise = () => {
    if (customExercise.trim() && !selectedExercises.includes(customExercise.trim())) {
      setSelectedExercises([...selectedExercises, customExercise.trim()]);
      setCustomExercise('');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentPhaseTime = isWorkPhase ? selectedProtocol.workTime : selectedProtocol.restTime;
  const progressPercent = (currentTime / currentPhaseTime) * 100;
  const circleCircumference = 2 * Math.PI * 90; // raio 90
  const circleProgress = circleCircumference - (progressPercent / 100) * circleCircumference;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-400';
      case 'Intermediário': return 'text-yellow-400';
      case 'Avançado': return 'text-orange-400';
      case 'Extremo': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            ← Voltar
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <h1 className="text-4xl font-black text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                HITS TRAINING
              </h1>
              <p className="text-slate-400 mt-1">High Intensity Interval Training</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/10"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <PremiumCard className="p-6 bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Sons de Transição</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Frases Motivacionais</label>
                    <div className="flex items-center gap-2">
                      <Switch checked={motivationEnabled} onCheckedChange={setMotivationEnabled} />
                      <Zap className={`w-4 h-4 ${motivationEnabled ? 'text-yellow-400' : 'text-slate-500'}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Intensidade: {intensity[0]}%</label>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      max={100}
                      min={30}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Display */}
        {(isActive || isCompleted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <PremiumCard className="p-8 bg-slate-900/80 backdrop-blur-xl border-slate-700/50 relative overflow-hidden">
              {/* Background Effects */}
              <div className={`absolute inset-0 bg-gradient-to-br ${isWorkPhase ? 'from-red-500/5 to-orange-500/5' : 'from-blue-500/5 to-cyan-500/5'} transition-all duration-1000`} />
              
              <div className="relative z-10 space-y-6">
                {/* Circular Timer */}
                <div className="relative w-64 h-64 mx-auto">
                  <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background Circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-700"
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={circleProgress}
                      className={`transition-all duration-1000 ${isWorkPhase ? 'text-red-400' : 'text-blue-400'}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Timer Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-mono font-black transition-colors duration-300 ${
                      isWorkPhase ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {formatTime(currentTime)}
                    </div>
                    <div className={`text-lg font-bold mt-2 transition-colors duration-300 ${
                      isWorkPhase ? 'text-red-300' : 'text-blue-300'
                    }`}>
                      {isWorkPhase ? '🔥 TRABALHO' : '😌 DESCANSO'}
                    </div>
                  </div>
                </div>

                {/* Current Exercise */}
                {isWorkPhase && selectedExercises.length > 0 && (
                  <motion.div
                    key={currentExerciseIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-white mb-2">
                      {selectedExercises[currentExerciseIndex]}
                    </div>
                    {motivationEnabled && (
                      <div className="text-lg text-yellow-400 font-medium">
                        {motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]}
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Session Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{currentRound}</div>
                    <div className="text-sm text-slate-400">Round</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedProtocol.rounds}</div>
                    <div className="text-sm text-slate-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatTime(totalTime)}</div>
                    <div className="text-sm text-slate-400">Tempo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{heartRateEstimate}</div>
                    <div className="text-sm text-slate-400">BPM</div>
                  </div>
                </div>

                {/* Total Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Progresso da Sessão</span>
                    <span>{Math.round(totalProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* Control Buttons */}
        {(isActive || isPaused) && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg bg-slate-800/50 backdrop-blur border-slate-600 hover:bg-slate-700/50 text-white"
            >
              {isPaused ? <Play className="w-6 h-6 mr-2" /> : <Pause className="w-6 h-6 mr-2" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              size="lg"
              className="px-8 py-4 text-lg bg-red-600/80 hover:bg-red-600"
            >
              <Square className="w-6 h-6 mr-2" />
              Finalizar
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg bg-slate-800/50 backdrop-blur border-slate-600 hover:bg-slate-700/50 text-white"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              Reset
            </Button>
          </motion.div>
        )}

        {/* Protocol Selection */}
        {!isActive && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Escolha seu Protocolo HITS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hitsProtocols.map((protocol) => (
                  <motion.button
                    key={protocol.name}
                    onClick={() => setSelectedProtocol(protocol)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                      selectedProtocol.name === protocol.name
                        ? 'border-red-400 bg-red-500/20 shadow-lg shadow-red-500/25'
                        : 'border-slate-600 bg-slate-800/50 hover:border-red-400/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${protocol.color} opacity-10`} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">{protocol.icon}</div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(protocol.difficulty)} bg-current/10`}>
                          {protocol.difficulty}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-2xl text-white mb-2">{protocol.name}</div>
                        <div className="text-slate-300 text-sm mb-3">{protocol.description}</div>
                        <div className="text-slate-400 text-xs">
                          <div>🔄 {protocol.rounds} rounds</div>
                          <div>⏱️ {Math.round((protocol.rounds * (protocol.workTime + protocol.restTime)) / 60)} min total</div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Exercise Selection */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white text-center">Selecione seus Exercícios</h3>
              
              {/* Selected Exercises */}
              <PremiumCard className="p-6 bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4">Exercícios Selecionados ({selectedExercises.length})</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedExercises.map((exercise, index) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-red-500/30 transition-all border border-red-500/30"
                      onClick={() => removeExercise(exercise)}
                    >
                      {exercise} 
                      {selectedExercises.length > 1 && <span className="text-red-400 hover:text-red-300">✕</span>}
                    </motion.span>
                  ))}
                </div>
              </PremiumCard>
              
              {/* Exercise Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(exerciseCategories).map(([category, exercises]) => (
                  <PremiumCard key={category} className="p-4 bg-slate-900/50 backdrop-blur border-slate-700/50">
                    <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                      {category}
                    </h5>
                    <div className="space-y-2">
                      {exercises.filter(ex => !selectedExercises.includes(ex)).slice(0, 4).map((exercise) => (
                        <button
                          key={exercise}
                          onClick={() => addExercise(exercise)}
                          className="w-full text-left px-3 py-2 bg-slate-800/50 text-slate-300 rounded-lg text-sm hover:bg-slate-700/50 transition-colors border border-slate-600/50 hover:border-blue-500/50"
                        >
                          + {exercise}
                        </button>
                      ))}
                      {exercises.filter(ex => !selectedExercises.includes(ex)).length > 4 && (
                        <div className="text-xs text-slate-500 text-center pt-1">
                          +{exercises.filter(ex => !selectedExercises.includes(ex)).length - 4} mais
                        </div>
                      )}
                    </div>
                  </PremiumCard>
                ))}
              </div>
              
              {/* Custom Exercise */}
              <PremiumCard className="p-6 bg-slate-900/50 backdrop-blur border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4">Exercício Personalizado</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    placeholder="Digite um exercício personalizado..."
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomExercise()}
                  />
                  <Button 
                    onClick={addCustomExercise} 
                    variant="outline"
                    className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
                  >
                    Adicionar
                  </Button>
                </div>
              </PremiumCard>
            </div>

            {/* Start Button */}
            <motion.div 
              className="flex justify-center mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleStart}
                size="lg"
                disabled={selectedExercises.length === 0}
                className="px-16 py-6 text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 shadow-lg shadow-red-500/25 disabled:opacity-50"
              >
                <Bolt className="w-8 h-8 mr-3" />
                INICIAR HITS
                <Flame className="w-8 h-8 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Post-workout Form */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-4xl font-bold text-white mb-2">
                🔥 HITS Concluído!
              </h3>
              <p className="text-slate-400">Parabéns! Você completou mais um treino intenso.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumCard className="p-6 bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Como você se sentiu?
                </h4>
                <Textarea
                  placeholder="Descreva como você se sente... (ex: exausto mas satisfeito, energizado, queimado)"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  rows={4}
                />
              </PremiumCard>

              <PremiumCard className="p-6 bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Anotações da Sessão
                </h4>
                <Textarea
                  placeholder="Adicione suas anotações sobre o treino..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  rows={4}
                />
              </PremiumCard>
            </div>

            <PremiumCard className="p-6 bg-slate-900/80 backdrop-blur-xl border-slate-700/50">
              <h4 className="text-lg font-semibold text-white mb-6 text-center">📊 Resumo da Sessão</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">{selectedProtocol.name}</div>
                  <div className="text-sm text-slate-400">Protocolo</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{formatTime(totalTime)}</div>
                  <div className="text-sm text-slate-400">Duração</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{currentRound - 1}/{selectedProtocol.rounds}</div>
                  <div className="text-sm text-slate-400">Rounds</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">{Math.round(totalTime / 60 * (12 + intensity[0] / 10))}</div>
                  <div className="text-sm text-slate-400">Calorias</div>
                </div>
              </div>
            </PremiumCard>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-8 py-3 text-lg bg-slate-800/50 backdrop-blur border-slate-600 hover:bg-slate-700/50 text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCompleteHITS}
                className="px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Salvar HITS
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}