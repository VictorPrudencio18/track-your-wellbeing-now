
import { useState, useEffect, useCallback } from 'react';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { toast } from '@/hooks/use-toast';

export interface PilatesExercise {
  id: string;
  name: string;
  duration: number;
  reps?: number;
  sets?: number;
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  modifications?: string[];
}

export interface PilatesWorkout {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: PilatesExercise[];
  focusArea: string[];
  estimatedCalories: number;
  description: string;
}

export interface PilatesSession {
  workout: PilatesWorkout;
  startTime: Date;
  currentExercise: number;
  completedExercises: string[];
  totalDuration: number;
  isActive: boolean;
  isPaused: boolean;
  heartRate: number;
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
}

export function usePilatesTracker() {
  const [session, setSession] = useState<PilatesSession | null>(null);
  const [timer, setTimer] = useState(0);
  const createActivity = useCreateActivity();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (session?.isActive && !session?.isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        
        // Atualizar métricas da sessão
        setSession(prev => {
          if (!prev) return prev;
          
          const caloriesPerSecond = prev.workout.estimatedCalories / (prev.workout.duration * 60);
          const intensityMultiplier = prev.intensity === 'low' ? 0.8 : prev.intensity === 'high' ? 1.2 : 1;
          
          return {
            ...prev,
            totalDuration: prev.totalDuration + 1,
            caloriesBurned: prev.caloriesBurned + (caloriesPerSecond * intensityMultiplier),
            heartRate: Math.max(60, Math.min(160, prev.heartRate + (Math.random() - 0.5) * 8))
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session?.isActive, session?.isPaused]);

  const startWorkout = useCallback((workout: PilatesWorkout, intensity: 'low' | 'medium' | 'high' = 'medium') => {
    const newSession: PilatesSession = {
      workout,
      startTime: new Date(),
      currentExercise: 0,
      completedExercises: [],
      totalDuration: 0,
      isActive: true,
      isPaused: false,
      heartRate: intensity === 'low' ? 70 : intensity === 'medium' ? 85 : 100,
      caloriesBurned: 0,
      intensity
    };

    setSession(newSession);
    setTimer(0);

    toast({
      title: "Pilates iniciado! 🧘‍♀️",
      description: `${workout.name} - ${workout.duration} minutos`,
    });
  }, []);

  const pauseWorkout = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev;
      
      const newPausedState = !prev.isPaused;
      
      toast({
        title: newPausedState ? "Treino pausado" : "Treino retomado",
        description: newPausedState ? "Descanse um pouco" : "Continue quando estiver pronto!",
      });

      return {
        ...prev,
        isPaused: newPausedState
      };
    });
  }, []);

  const completeExercise = useCallback((exerciseId: string) => {
    setSession(prev => {
      if (!prev) return prev;

      const updatedCompleted = [...prev.completedExercises, exerciseId];
      const nextExerciseIndex = prev.currentExercise + 1;

      toast({
        title: "Exercício concluído! ✨",
        description: `${prev.workout.exercises[prev.currentExercise].name} finalizado`,
      });

      return {
        ...prev,
        completedExercises: updatedCompleted,
        currentExercise: nextExerciseIndex >= prev.workout.exercises.length ? prev.currentExercise : nextExerciseIndex
      };
    });
  }, []);

  const skipExercise = useCallback(() => {
    setSession(prev => {
      if (!prev) return prev;

      const nextExerciseIndex = prev.currentExercise + 1;
      
      if (nextExerciseIndex >= prev.workout.exercises.length) {
        return prev;
      }

      return {
        ...prev,
        currentExercise: nextExerciseIndex
      };
    });
  }, []);

  const endWorkout = useCallback(async (forceEnd = false) => {
    if (!session) return;

    const finalCalories = Math.round(session.caloriesBurned);
    const finalDuration = session.totalDuration;

    try {
      await createActivity.mutateAsync({
        type: 'pilates',
        duration: finalDuration,
        calories: finalCalories,
        name: `Pilates - ${session.workout.name}`,
        notes: `Nível: ${session.workout.level}, Intensidade: ${session.intensity}, Exercícios: ${session.completedExercises.length}/${session.workout.exercises.length}`,
        performance_zones: {
          avg_heart_rate: session.heartRate,
          intensity_level: session.intensity,
          completed_exercises: session.completedExercises.length,
          total_exercises: session.workout.exercises.length,
          completion_rate: (session.completedExercises.length / session.workout.exercises.length) * 100,
          focus_areas: session.workout.focusArea
        }
      });

      toast({
        title: "Treino de Pilates concluído! 🎉",
        description: `${Math.round(finalDuration / 60)} minutos • ${finalCalories} calorias`,
      });

      setSession(null);
      setTimer(0);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar o treino. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [session, createActivity]);

  const resetWorkout = useCallback(() => {
    setSession(null);
    setTimer(0);
  }, []);

  // Calcular progressos
  const getWorkoutProgress = useCallback(() => {
    if (!session) return 0;
    
    const exerciseProgress = session.currentExercise / session.workout.exercises.length;
    const timeProgress = session.totalDuration / (session.workout.duration * 60);
    
    return Math.max(exerciseProgress, timeProgress) * 100;
  }, [session]);

  const getCurrentExerciseProgress = useCallback(() => {
    if (!session || session.currentExercise >= session.workout.exercises.length) return 100;
    
    const currentExercise = session.workout.exercises[session.currentExercise];
    if (!currentExercise) return 0;
    
    // Calcular baseado no tempo decorrido do exercício atual
    const exerciseStartTime = session.completedExercises.length * 120; // Assumindo 2 min por exercício
    const exerciseElapsedTime = Math.max(0, session.totalDuration - exerciseStartTime);
    
    return Math.min(100, (exerciseElapsedTime / currentExercise.duration) * 100);
  }, [session]);

  const isWorkoutComplete = useCallback(() => {
    if (!session) return false;
    return session.completedExercises.length === session.workout.exercises.length;
  }, [session]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    session,
    timer,
    startWorkout,
    pauseWorkout,
    completeExercise,
    skipExercise,
    endWorkout,
    resetWorkout,
    getWorkoutProgress,
    getCurrentExerciseProgress,
    isWorkoutComplete,
    formatTime,
    isLoading: createActivity.isPending
  };
}
