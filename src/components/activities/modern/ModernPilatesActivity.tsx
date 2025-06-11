
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { 
  Sparkles,
  Target,
  Clock,
  Heart,
  Flame,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ArrowLeft
} from 'lucide-react';

interface PilatesSession {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  focusArea: string[];
  exercises: number;
  estimatedCalories: number;
}

const pilateSessions: PilatesSession[] = [
  {
    id: 'morning-flow',
    name: 'Morning Flow',
    level: 'beginner',
    duration: 15,
    focusArea: ['Core', 'Postura'],
    exercises: 8,
    estimatedCalories: 90
  },
  {
    id: 'core-power',
    name: 'Core Power',
    level: 'intermediate',
    duration: 25,
    focusArea: ['Core', 'Força'],
    exercises: 12,
    estimatedCalories: 150
  },
  {
    id: 'full-body-challenge',
    name: 'Full Body Challenge',
    level: 'advanced',
    duration: 40,
    focusArea: ['Corpo inteiro', 'Resistência'],
    exercises: 18,
    estimatedCalories: 240
  }
];

export function ModernPilatesActivity() {
  const [selectedSession, setSelectedSession] = useState<PilatesSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [heartRate, setHeartRate] = useState(75);
  const [calories, setCalories] = useState(0);
  const [currentExercise, setCurrentExercise] = useState(1);
  const createActivity = useCreateActivity();

  const metrics = [
    {
      id: 'heart-rate',
      label: 'Batimentos',
      value: heartRate,
      unit: 'BPM',
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      id: 'calories',
      label: 'Calorias',
      value: calories,
      unit: 'cal',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      id: 'exercise',
      label: 'Exercício',
      value: currentExercise,
      unit: `/${selectedSession?.exercises || 0}`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 'time',
      label: 'Tempo',
      value: Math.floor(duration / 60),
      unit: 'min',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    }
  ];

  // Timer e simulação de métricas
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simular variação das métricas
        setHeartRate(prev => {
          const variation = (Math.random() - 0.5) * 8;
          return Math.max(65, Math.min(140, Math.round(prev + variation)));
        });

        setCalories(prev => prev + (selectedSession?.estimatedCalories || 150) / ((selectedSession?.duration || 30) * 60));

        // Avançar exercício a cada 2 minutos (simulado)
        if (duration % 120 === 0 && duration > 0) {
          setCurrentExercise(prev => Math.min(prev + 1, selectedSession?.exercises || 1));
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, selectedSession]);

  const handleStart = (session: PilatesSession) => {
    setSelectedSession(session);
    setIsActive(true);
    setIsPaused(false);
    setDuration(0);
    setCalories(0);
    setCurrentExercise(1);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (selectedSession && duration > 0) {
      // Salvar atividade no banco
      const completionRate = (currentExercise / selectedSession.exercises) * 100;
      const intensityLevel = heartRate > 110 ? 'high' : heartRate > 85 ? 'medium' : 'low';

      createActivity.mutate({
        type: 'pilates',
        duration: duration,
        calories_burned: Math.round(calories),
        distance: null,
        performance_zones: {
          completion_rate: completionRate,
          intensity_level: intensityLevel,
          exercises_completed: currentExercise,
          total_exercises: selectedSession.exercises,
          focus_areas: selectedSession.focusArea,
          session_name: selectedSession.name,
          avg_heart_rate: heartRate
        },
        completed_at: new Date().toISOString()
      });
    }

    setIsActive(false);
    setIsPaused(false);
    setDuration(0);
    setCalories(0);
    setCurrentExercise(1);
    setHeartRate(75);
    setSelectedSession(null);
  };

  const handleBack = () => {
    setSelectedSession(null);
    setIsActive(false);
    setIsPaused(false);
    setDuration(0);
    setCalories(0);
    setCurrentExercise(1);
    setHeartRate(75);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  if (!selectedSession || !isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Pilates</h1>
                <p className="text-slate-400">Fortaleça seu core e melhore sua postura com exercícios de Pilates</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {pilateSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass-card hover:bg-white/10 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{session.name}</h3>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={`${getLevelColor(session.level)} text-white`}>
                            {getLevelLabel(session.level)}
                          </Badge>
                          {session.focusArea.map((area) => (
                            <Badge key={area} variant="outline" className="text-gray-300 border-gray-500">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">{session.duration}min</div>
                        <div className="text-sm text-gray-400">~{session.estimatedCalories} cal</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {session.exercises} exercícios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {session.estimatedCalories} cal
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => handleStart(session)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModernActivityBase
      title={`Pilates - ${selectedSession.name}`}
      icon={<Sparkles />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={() => {}}
      onPause={handlePause}
      onStop={handleStop}
      onBack={handleBack}
      primaryMetric={{
        value: formatTime(duration),
        unit: '',
        label: 'Tempo Decorrido'
      }}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="mb-4">
              <Progress 
                value={(duration / (selectedSession.duration * 60)) * 100} 
                className="h-3 mb-2" 
              />
              <p className="text-gray-400 text-center">
                Exercício {currentExercise} de {selectedSession.exercises}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Métricas */}
        <MetricsGrid metrics={metrics} />

        {/* Área de Foco Atual */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Foco Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSession.focusArea.map((area) => (
                <Badge key={area} className="bg-purple-600 text-white">
                  {area}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-purple-300 text-sm">
                💡 Mantenha o core sempre ativado e respire profundamente durante os movimentos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas da Sessão */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progresso da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {Math.round((currentExercise / selectedSession.exercises) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Exercícios Completos</div>
              </div>
              
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {Math.round((duration / (selectedSession.duration * 60)) * 100)}%
                </div>
                <div className="text-sm text-gray-400">Tempo Decorrido</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernActivityBase>
  );
}
