
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Heart, Timer, Waves, Pause, Play, Volume2, VolumeX, Zap, FileText, Clock } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { Textarea } from '@/components/ui/textarea';
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState('');
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
      }, 1000);

      // Lógica de fases
      phaseTimer = setTimeout(() => {
        if (currentPhaseIndex < phases.length - 1) {
          const updatedPhases = [...phases];
          updatedPhases[currentPhaseIndex].completed = true;
          setPhases(updatedPhases);
          setCurrentPhaseIndex(currentPhaseIndex + 1);
          setCurrentPhase(updatedPhases[currentPhaseIndex + 1].name);
        }
      }, phases[currentPhaseIndex].duration * 60 * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [isActive, isPaused, selectedType, phases, currentPhaseIndex]);

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

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleCompleteMeditation = async () => {
    const sessionData = {
      type: 'yoga' as const, // Changed from 'meditation' to 'yoga' as meditation is not a valid type in DB
      name: `Meditação ${selectedType.name}`,
      duration,
      notes: `${notes ? notes + ' | ' : ''}${feeling ? 'Como se sentiu: ' + feeling + ' | ' : ''}Tipo: ${selectedType.name} | Som: ${selectedSound.name} | Respiração: ${breathingPattern.name} | Fase Final: ${currentPhase}`,
      gps_data: {
        meditation_type: selectedType.name,
        ambient_sound: selectedSound.name,
        breathing_pattern: breathingPattern.name,
        phases_completed: phases.filter(p => p.completed).length,
        final_phase: currentPhase,
        user_notes: notes,
        feeling_after: feeling,
        breathing_cycles: Math.round(duration / (breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale + breathingPattern.pause))
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
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
            <Brain className="w-6 h-6" />
            Meditação
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
              <div className="flex items-center justify-center gap-4 mb-4">
                <Clock className="w-8 h-8 text-blue-400" />
                <div className="text-6xl font-mono font-bold text-white">
                  {formatTime(duration)}
                </div>
              </div>
              <div className="text-slate-400">Tempo de Meditação</div>
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
              Finalizar Meditação
            </Button>
          </div>
        )}

        {/* Seleção de Tipo de Meditação */}
        {!isActive && !isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
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

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleStart}
                size="lg"
                className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-6 h-6 mr-2" />
                Iniciar Meditação
              </Button>
            </div>
          </motion.div>
        )}

        {/* Durante a meditação */}
        {isActive && !isCompleted && (
          <>
            {/* Controle de Volume */}
            {selectedSound.sound && (
              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700 mb-6">
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
                  <div className="text-sm text-slate-400">Fase Atual: {currentPhase}</div>
                </div>
                
                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`text-slate-400 ${phase.completed ? 'line-through' : ''}`}>{phase.name}</span>
                      <span className="text-white">{phase.completed ? '✅' : index === currentPhaseIndex ? '⏳' : '⏸️'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </>
        )}

        {/* Formulário pós-meditação */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-white text-center mb-6">
              🧘‍♀️ Meditação Concluída! 
            </h3>
            
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Como você se sentiu após a meditação?
              </h4>
              <Textarea
                placeholder="Descreva como você se sente agora... (ex: mais calmo, relaxado, focado, energizado)"
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
                placeholder="Adicione suas anotações sobre a sessão... pensamentos, insights, observações"
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
                  <span className="text-slate-400">Tipo:</span>
                  <span className="text-white">{selectedType.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duração:</span>
                  <span className="text-white">{formatTime(duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Som Ambiente:</span>
                  <span className="text-white">{selectedSound.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Respiração:</span>
                  <span className="text-white">{breathingPattern.name}</span>
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
                onClick={handleCompleteMeditation}
                className="px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Salvar Meditação
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
