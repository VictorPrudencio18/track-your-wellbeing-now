
import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Minus, Timer, Target, TrendingUp, Zap, RotateCcw } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: Set[];
  notes?: string;
}

interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  restTime?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

interface ModernGymActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const exerciseCategories = [
  { value: 'chest', label: 'Peito', exercises: ['Supino Reto', 'Supino Inclinado', 'Flexão', 'Crucifixo'] },
  { value: 'back', label: 'Costas', exercises: ['Puxada', 'Remada', 'Barra Fixa', 'Remada Curvada'] },
  { value: 'legs', label: 'Pernas', exercises: ['Agachamento', 'Leg Press', 'Cadeira Extensora', 'Mesa Flexora'] },
  { value: 'shoulders', label: 'Ombros', exercises: ['Desenvolvimento', 'Elevação Lateral', 'Remada Alta'] },
  { value: 'arms', label: 'Braços', exercises: ['Rosca Direta', 'Tríceps Testa', 'Martelo', 'Mergulho'] },
  { value: 'core', label: 'Core', exercises: ['Prancha', 'Abdominal', 'Russian Twist', 'Mountain Climber'] }
];

export function ModernGymActivity({ onComplete, onCancel }: ModernGymActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setCalories(prev => prev + 0.2); // ~12 cal/min
        
        if (isResting && restTimer > 0) {
          setRestTimer(prev => {
            if (prev <= 1) {
              setIsResting(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, isResting, restTimer]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    if (exercises.length === 0) {
      addExercise();
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
    
    onComplete({
      type: 'gym',
      name: 'Musculação Avançada',
      duration,
      exercises,
      totalSets,
      completedSets,
      totalVolume,
      calories: Math.round(calories),
      date: new Date()
    });
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      category: 'chest',
      sets: [{
        id: Date.now().toString(),
        reps: 10,
        weight: 0,
        completed: false
      }]
    };
    setExercises(prev => [...prev, newExercise]);
    setCurrentExercise(newExercise);
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    ));
  };

  const addSet = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: Set = {
      id: Date.now().toString(),
      reps: lastSet.reps,
      weight: lastSet.weight,
      completed: false
    };

    updateExercise(exerciseId, {
      sets: [...exercise.sets, newSet]
    });
  };

  const completeSet = (exerciseId: string, setId: string, rpe?: number) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const updatedSets = exercise.sets.map(set => 
      set.id === setId ? { ...set, completed: true, rpe } : set
    );

    updateExercise(exerciseId, { sets: updatedSets });

    // Calcular volume
    const completedSet = exercise.sets.find(set => set.id === setId);
    if (completedSet) {
      setTotalVolume(prev => prev + (completedSet.reps * completedSet.weight));
    }

    // Iniciar timer de descanso
    setRestTimer(90); // 90 segundos
    setIsResting(true);
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<Set>) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const updatedSets = exercise.sets.map(set => 
      set.id === setId ? { ...set, ...updates } : set
    );

    updateExercise(exerciseId, { sets: updatedSets });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = exercises.reduce((sum, ex) => sum + ex.sets.filter(set => set.completed).length, 0);
  const avgRPE = exercises.reduce((sum, ex) => {
    const completedSetsWithRPE = ex.sets.filter(set => set.completed && set.rpe);
    return sum + completedSetsWithRPE.reduce((rpeSum, set) => rpeSum + (set.rpe || 0), 0);
  }, 0) / completedSets || 0;

  const metrics = [
    {
      id: 'sets',
      icon: Target,
      label: 'Séries',
      value: `${completedSets}/${totalSets}`,
      unit: '',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'volume',
      icon: TrendingUp,
      label: 'Volume',
      value: Math.round(totalVolume),
      unit: 'kg',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'exercises',
      icon: Dumbbell,
      label: 'Exercícios',
      value: exercises.length,
      unit: '',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: Math.round(calories),
      unit: 'kcal',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'rpe',
      icon: RotateCcw,
      label: 'RPE Médio',
      value: avgRPE.toFixed(1),
      unit: '/10',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'rest',
      icon: Timer,
      label: 'Descanso',
      value: isResting ? formatTime(restTimer) : '--:--',
      unit: '',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <ModernActivityBase
      title="Musculação Pro"
      icon={<Dumbbell className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: completedSets.toString(),
        unit: `/${totalSets} séries`,
        label: 'Progresso do Treino'
      }}
    >
      <div className="space-y-6">
        {/* Timer de Descanso */}
        {isResting && (
          <PremiumCard className="p-4 bg-orange-900/50 border-orange-700">
            <div className="text-center">
              <Timer className="w-8 h-8 mx-auto text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-orange-400">{formatTime(restTimer)}</div>
              <div className="text-sm text-orange-300">Tempo de descanso</div>
            </div>
          </PremiumCard>
        )}

        {/* Métricas Principais */}
        <MetricsGrid metrics={metrics} />

        {/* Lista de Exercícios */}
        <div className="space-y-4">
          {exercises.map((exercise, exerciseIndex) => (
            <PremiumCard key={exercise.id} className="p-4 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                {/* Cabeçalho do Exercício */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Select 
                      value={exercise.category} 
                      onValueChange={(value) => updateExercise(exercise.id, { category: value })}
                    >
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={exercise.name} 
                      onValueChange={(value) => updateExercise(exercise.id, { name: value })}
                    >
                      <SelectTrigger className="flex-1 bg-slate-800 border-slate-600">
                        <SelectValue placeholder="Selecione o exercício" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseCategories
                          .find(cat => cat.value === exercise.category)
                          ?.exercises.map(ex => (
                            <SelectItem key={ex} value={ex}>
                              {ex}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Séries */}
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2 text-xs text-slate-400 font-medium">
                    <div>Série</div>
                    <div>Reps</div>
                    <div>Peso</div>
                    <div>RPE</div>
                    <div>Ação</div>
                  </div>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className="grid grid-cols-5 gap-2 items-center p-2 bg-slate-800/50 rounded">
                      <div className="text-sm font-medium text-slate-300">#{setIndex + 1}</div>
                      
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                        className="h-8 bg-slate-700 border-slate-600"
                        disabled={set.completed}
                      />
                      
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) => updateSet(exercise.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                          className="h-8 bg-slate-700 border-slate-600"
                          disabled={set.completed}
                        />
                        <span className="text-xs text-slate-500">kg</span>
                      </div>
                      
                      <Select 
                        value={set.rpe?.toString() || ''} 
                        onValueChange={(value) => updateSet(exercise.id, set.id, { rpe: parseInt(value) })}
                        disabled={!set.completed}
                      >
                        <SelectTrigger className="h-8 bg-slate-700 border-slate-600">
                          <SelectValue placeholder="RPE" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button
                        onClick={() => completeSet(exercise.id, set.id, set.rpe)}
                        disabled={set.completed}
                        size="sm"
                        variant={set.completed ? "secondary" : "default"}
                        className="h-8"
                      >
                        {set.completed ? "✓" : "OK"}
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => addSet(exercise.id)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 border-slate-600 hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Série
                  </Button>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>

        {/* Adicionar Exercício */}
        <Button
          onClick={addExercise}
          variant="outline"
          className="w-full border-slate-600 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Exercício
        </Button>

        {/* Resumo da Sessão */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo da Sessão</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">Volume Total</div>
              <div className="text-xl font-bold text-white">{Math.round(totalVolume)} kg</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Tempo de Treino</div>
              <div className="text-xl font-bold text-white">{formatTime(duration)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Taxa de Conclusão</div>
              <div className="text-xl font-bold text-white">
                {totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0}%
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Intensidade Média</div>
              <div className="text-xl font-bold text-white">
                {avgRPE > 0 ? avgRPE.toFixed(1) : '0.0'}/10
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </ModernActivityBase>
  );
}
