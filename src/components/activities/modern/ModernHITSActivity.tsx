import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, Square, RotateCcw, Zap, Target, Activity, Clock, FileText, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface ModernHITSActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

interface HITSProtocol {
  name: string;
  workTime: number; // seconds
  restTime: number; // seconds
  rounds: number;
  description: string;
  color: string;
}

const hitsProtocols: HITSProtocol[] = [
  {
    name: 'Tabata',
    workTime: 20,
    restTime: 10,
    rounds: 8,
    description: '20s trabalho / 10s descanso - 8 rounds',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: 'EMOM',
    workTime: 30,
    restTime: 30,
    rounds: 10,
    description: '30s trabalho / 30s descanso - 10 rounds',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'AMRAP',
    workTime: 60,
    restTime: 15,
    rounds: 6,
    description: '60s trabalho / 15s descanso - 6 rounds',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Sprint',
    workTime: 45,
    restTime: 15,
    rounds: 8,
    description: '45s trabalho / 15s descanso - 8 rounds',
    color: 'from-purple-500 to-pink-500'
  }
];

const suggestedExercises = [
  'Burpees', 'Mountain Climbers', 'Jump Squats', 'Push-ups', 'High Knees',
  'Jumping Jacks', 'Plank Jacks', 'Lunges', 'Russian Twists', 'Sprint in Place'
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
  const [hearRateEstimate, setHeartRateEstimate] = useState(120);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate total session time
  const sessionDuration = selectedProtocol.rounds * (selectedProtocol.workTime + selectedProtocol.restTime);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
        
        if (isWorkPhase) {
          setCurrentTime(prev => {
            if (prev >= selectedProtocol.workTime) {
              setIsWorkPhase(false);
              setCurrentTime(0);
              // Heart rate increases during work
              setHeartRateEstimate(prev => Math.min(180, prev + 5));
              return 0;
            }
            return prev + 1;
          });
        } else {
          setCurrentTime(prev => {
            if (prev >= selectedProtocol.restTime) {
              if (currentRound >= selectedProtocol.rounds) {
                setIsActive(false);
                setIsCompleted(true);
                return prev;
              }
              setCurrentRound(prev => prev + 1);
              setIsWorkPhase(true);
              setCurrentTime(0);
              // Heart rate decreases during rest
              setHeartRateEstimate(prev => Math.max(100, prev - 3));
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
  }, [isActive, isPaused, isWorkPhase, currentRound, selectedProtocol]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentTime(0);
    setTotalTime(0);
    setCurrentRound(1);
    setIsWorkPhase(true);
    setHeartRateEstimate(120);
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
  };

  const handleCompleteHITS = async () => {
    const sessionData = {
      type: 'hits' as const,
      name: `HITS ${selectedProtocol.name}`,
      duration: totalTime,
      notes: `${notes ? notes + ' | ' : ''}${feeling ? 'Como se sentiu: ' + feeling + ' | ' : ''}Protocolo: ${selectedProtocol.name} | Exercícios: ${selectedExercises.join(', ')} | Rounds completados: ${currentRound - 1}/${selectedProtocol.rounds}`,
      avg_heart_rate: hearRateEstimate,
      max_heart_rate: Math.round(hearRateEstimate * 1.15),
      calories: Math.round(totalTime / 60 * 12), // Estimate based on HITS intensity
      gps_data: {
        protocol: selectedProtocol.name,
        work_time: selectedProtocol.workTime,
        rest_time: selectedProtocol.restTime,
        total_rounds: selectedProtocol.rounds,
        completed_rounds: currentRound - 1,
        exercises: selectedExercises,
        session_intensity: 'high',
        user_notes: notes,
        feeling_after: feeling,
        estimated_heart_rate: hearRateEstimate
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
    setSelectedExercises(selectedExercises.filter(e => e !== exercise));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="text-white hover:bg-white/10"
          >
            ← Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6" />
            HITS Training
          </h1>
          <div></div>
        </div>

        {/* Timer Display */}
        {(isActive || isCompleted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <PremiumCard className="p-8 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                {/* Current Phase */}
                <div className={`text-6xl font-mono font-bold transition-colors duration-300 ${
                  isWorkPhase ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {formatTime(currentTime)}
                </div>
                
                {/* Phase Indicator */}
                <div className={`text-xl font-semibold transition-colors duration-300 ${
                  isWorkPhase ? 'text-red-300' : 'text-blue-300'
                }`}>
                  {isWorkPhase ? '🔥 TRABALHO' : '😌 DESCANSO'}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      isWorkPhase ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                {/* Round Info */}
                <div className="flex justify-center gap-8 text-slate-300">
                  <div>Round: <span className="text-white font-bold">{currentRound}/{selectedProtocol.rounds}</span></div>
                  <div>Tempo Total: <span className="text-white font-bold">{formatTime(totalTime)}</span></div>
                  <div>BPM: <span className="text-red-400 font-bold">{hearRateEstimate}</span></div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}

        {/* Control Buttons */}
        {(isActive || isPaused) && !isCompleted && (
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
              {isPaused ? 'Continuar' : 'Pausar'}
            </Button>
            <Button
              onClick={handleStop}
              variant="destructive"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Square className="w-5 h-5 mr-2" />
              Finalizar
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        )}

        {/* Protocol Selection */}
        {!isActive && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha o Protocolo HITS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hitsProtocols.map((protocol) => (
                <motion.button
                  key={protocol.name}
                  onClick={() => setSelectedProtocol(protocol)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedProtocol.name === protocol.name
                      ? 'border-red-400 bg-red-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-red-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${protocol.color} mb-4`} />
                  <div className="text-left">
                    <div className="font-bold text-xl text-white mb-2">{protocol.name}</div>
                    <div className="text-slate-300 text-sm">{protocol.description}</div>
                    <div className="text-slate-400 text-xs mt-2">
                      Total: {Math.round((protocol.rounds * (protocol.workTime + protocol.restTime)) / 60)} min
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Exercise Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Exercícios Selecionados</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedExercises.map((exercise, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-red-500/30"
                    onClick={() => removeExercise(exercise)}
                  >
                    {exercise} ✕
                  </span>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-white font-medium">Exercícios Sugeridos</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedExercises.filter(ex => !selectedExercises.includes(ex)).map((exercise) => (
                    <button
                      key={exercise}
                      onClick={() => addExercise(exercise)}
                      className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-slate-600 transition-colors"
                    >
                      + {exercise}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customExercise}
                  onChange={(e) => setCustomExercise(e.target.value)}
                  placeholder="Adicionar exercício personalizado..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomExercise()}
                />
                <Button onClick={addCustomExercise} variant="outline">
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleStart}
                size="lg"
                disabled={selectedExercises.length === 0}
                className="px-12 py-4 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <Play className="w-6 h-6 mr-2" />
                Iniciar HITS
              </Button>
            </div>
          </motion.div>
        )}

        {/* Post-workout Form */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-white text-center mb-6">
              🔥 HITS Concluído! 
            </h3>
            
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Como você se sentiu após o treino?
              </h4>
              <Textarea
                placeholder="Descreva como você se sente agora... (ex: exausto mas satisfeito, energizado, queimado)"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                className="mb-4 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                rows={3}
              />
            </PremiumCard>

            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Anotações da Sessão (opcional)
              </h4>
              <Textarea
                placeholder="Adicione suas anotações sobre o treino... dificuldades, observações, progressos"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mb-4 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                rows={4}
              />
            </PremiumCard>

            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Resumo da Sessão</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocolo:</span>
                  <span className="text-white">{selectedProtocol.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duração:</span>
                  <span className="text-white">{formatTime(totalTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rounds:</span>
                  <span className="text-white">{currentRound - 1}/{selectedProtocol.rounds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Exercícios:</span>
                  <span className="text-white">{selectedExercises.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">BPM Médio:</span>
                  <span className="text-red-400">{hearRateEstimate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calorias Est.:</span>
                  <span className="text-white">{Math.round(totalTime / 60 * 12)}</span>
                </div>
              </div>
            </PremiumCard>

            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="px-8 py-3 text-lg"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCompleteHITS}
                className="px-8 py-3 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                Salvar HITS
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}