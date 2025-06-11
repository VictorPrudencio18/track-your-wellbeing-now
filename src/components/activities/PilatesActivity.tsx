
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Clock, 
  Flame,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';

interface Exercise {
  id: string;
  name: string;
  duration: number; // em segundos
  description: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  benefits: string[];
  image?: string;
}

interface PilatesWorkout {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // em minutos
  exercises: Exercise[];
  focusArea: string[];
  estimatedCalories: number;
  description: string;
}

const pilatesWorkouts: PilatesWorkout[] = [
  {
    id: 'core-foundation',
    name: 'Core Foundation',
    level: 'beginner',
    duration: 20,
    focusArea: ['Core', 'Postura', 'Respiração'],
    estimatedCalories: 120,
    description: 'Exercícios fundamentais para fortalecer o core e melhorar a postura',
    exercises: [
      {
        id: 'breathing',
        name: 'Respiração Pilates',
        duration: 180,
        description: 'Respiração lateral torácica para ativação do core',
        targetMuscles: ['Diafragma', 'Core profundo'],
        difficulty: 'beginner',
        instructions: [
          'Deite-se de costas com joelhos flexionados',
          'Coloque as mãos nas costelas laterais',
          'Inspire expandindo as costelas lateralmente',
          'Expire contraindo suavemente o core'
        ],
        benefits: ['Ativação do core', 'Melhora da postura', 'Redução do estresse']
      },
      {
        id: 'hundred',
        name: 'The Hundred',
        duration: 300,
        description: 'Exercício clássico de aquecimento e fortalecimento do core',
        targetMuscles: ['Core', 'Flexores do pescoço'],
        difficulty: 'beginner',
        instructions: [
          'Deite-se com pernas em table top',
          'Levante a cabeça e ombros do chão',
          'Bombeie os braços para cima e para baixo',
          'Respire: 5 inspirações, 5 expirações'
        ],
        benefits: ['Aquecimento', 'Fortalecimento do core', 'Coordenação respiratória']
      },
      {
        id: 'roll-up',
        name: 'Roll Up',
        duration: 240,
        description: 'Movimento fluido para fortalecer o core e melhorar a flexibilidade da coluna',
        targetMuscles: ['Core', 'Flexores da coluna'],
        difficulty: 'intermediate',
        instructions: [
          'Deite-se com braços estendidos acima da cabeça',
          'Role lentamente vértebra por vértebra',
          'Alcance os dedos dos pés',
          'Retorne lentamente à posição inicial'
        ],
        benefits: ['Fortalecimento do core', 'Flexibilidade da coluna', 'Controle motor']
      }
    ]
  },
  {
    id: 'full-body-flow',
    name: 'Full Body Flow',
    level: 'intermediate',
    duration: 35,
    focusArea: ['Corpo inteiro', 'Fluidez', 'Força'],
    estimatedCalories: 210,
    description: 'Sequência fluida trabalhando todo o corpo com movimentos encadeados',
    exercises: [
      {
        id: 'single-leg-stretch',
        name: 'Single Leg Stretch',
        duration: 300,
        description: 'Alternância de pernas mantendo estabilidade do core',
        targetMuscles: ['Core', 'Flexores do quadril'],
        difficulty: 'intermediate',
        instructions: [
          'Posição de table top com cabeça elevada',
          'Estenda uma perna enquanto puxa a outra',
          'Alterne as pernas de forma controlada',
          'Mantenha o core sempre ativado'
        ],
        benefits: ['Coordenação', 'Estabilidade do core', 'Flexibilidade']
      },
      {
        id: 'teaser',
        name: 'Teaser',
        duration: 360,
        description: 'Movimento avançado de equilíbrio e força do core',
        targetMuscles: ['Core', 'Flexores do quadril', 'Equilíbrio'],
        difficulty: 'advanced',
        instructions: [
          'Deite-se com braços estendidos',
          'Role até posição em V',
          'Mantenha pernas estendidas em ângulo',
          'Retorne controladamente'
        ],
        benefits: ['Força do core', 'Equilíbrio', 'Controle motor']
      }
    ]
  }
];

export function PilatesActivity() {
  const [selectedWorkout, setSelectedWorkout] = useState<PilatesWorkout | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [heartRate, setHeartRate] = useState(85);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  const { toast } = useToast();
  const createActivity = useCreateActivity();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return time - 1;
        });
        
        // Simular variação do batimento cardíaco
        setHeartRate(prev => {
          const variation = (Math.random() - 0.5) * 10;
          const baseRate = intensity === 'low' ? 70 : intensity === 'medium' ? 85 : 100;
          return Math.max(60, Math.min(160, Math.round(baseRate + variation)));
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, intensity]);

  const startWorkout = (workout: PilatesWorkout) => {
    setSelectedWorkout(workout);
    setCurrentExercise(0);
    setTimeLeft(workout.exercises[0].duration);
    setSessionStartTime(new Date());
    setCompletedExercises([]);
    setIsActive(true);
    setIsPaused(false);

    toast({
      title: "Pilates iniciado! 🧘‍♀️",
      description: `Começando ${workout.name} - ${workout.duration} minutos`,
    });
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Treino retomado" : "Treino pausado",
      description: isPaused ? "Continue quando estiver pronto!" : "Descanse um pouco",
    });
  };

  const resetWorkout = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentExercise(0);
    setTimeLeft(selectedWorkout?.exercises[0].duration || 0);
    setCompletedExercises([]);
    setSessionStartTime(null);
  };

  const handleExerciseComplete = () => {
    if (!selectedWorkout) return;

    const exercise = selectedWorkout.exercises[currentExercise];
    setCompletedExercises(prev => [...prev, exercise.id]);

    if (soundEnabled) {
      // Som de conclusão (implementar com Web Audio API se necessário)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+H1vmsiBzbH1O/FiSgELYHO8dePPgccaLvt355NGAxQp+PwtmMcBjiP1/LNeSsFJHfH8N2QQAoUXrPp66hVFApGnt/1vmsiBzPH1O/FiSgELYDO8dePPgccaLrm3Z9NGAxPnuH1vmsiBzPEQ...'); // Simplified beep
    }

    toast({
      title: "Exercício concluído! ✨",
      description: `${exercise.name} finalizado com sucesso`,
    });

    if (currentExercise < selectedWorkout.exercises.length - 1) {
      // Próximo exercício
      setTimeout(() => {
        setCurrentExercise(prev => prev + 1);
        setTimeLeft(selectedWorkout.exercises[currentExercise + 1].duration);
      }, 2000);
    } else {
      // Treino completo
      completeWorkout();
    }
  };

  const completeWorkout = async () => {
    if (!selectedWorkout || !sessionStartTime) return;

    const duration = Math.round((Date.now() - sessionStartTime.getTime()) / 1000);
    const calories = Math.round(selectedWorkout.estimatedCalories * (intensity === 'low' ? 0.8 : intensity === 'high' ? 1.2 : 1));

    try {
      await createActivity.mutateAsync({
        type: 'pilates',
        duration,
        calories,
        name: `Pilates - ${selectedWorkout.name}`,
        notes: `Nível: ${selectedWorkout.level}, Intensidade: ${intensity}, Exercícios: ${completedExercises.length}/${selectedWorkout.exercises.length}`,
        performance_zones: {
          avg_heart_rate: heartRate,
          intensity_level: intensity,
          completed_exercises: completedExercises.length,
          total_exercises: selectedWorkout.exercises.length
        }
      });

      toast({
        title: "Treino de Pilates concluído! 🎉",
        description: `${duration / 60} minutos • ${calories} calorias queimadas`,
      });

      setIsActive(false);
      setSelectedWorkout(null);
      setCurrentExercise(0);
      setCompletedExercises([]);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar o treino. Tente novamente.",
        variant: "destructive",
      });
    }
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

  const getIntensityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!selectedWorkout) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Pilates</h1>
          </motion.div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Fortaleça seu core, melhore sua postura e encontre equilíbrio através dos movimentos fluidos do Pilates
          </p>
        </div>

        {/* Seletor de Intensidade */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Intensidade do Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Button
                  key={level}
                  variant={intensity === level ? 'default' : 'outline'}
                  onClick={() => setIntensity(level)}
                  className={`${intensity === level ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  <span className={getIntensityColor(level === intensity ? 'white' : level)}>
                    {level === 'low' ? 'Leve' : level === 'medium' ? 'Moderada' : 'Intensa'}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Treinos Disponíveis */}
        <div className="grid gap-4">
          {pilatesWorkouts.map((workout) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-card hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{workout.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{workout.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={`${getLevelColor(workout.level)} text-white`}>
                          {workout.level === 'beginner' ? 'Iniciante' : 
                           workout.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                        </Badge>
                        {workout.focusArea.map((area) => (
                          <Badge key={area} variant="outline" className="text-gray-300 border-gray-500">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{workout.duration}min</div>
                      <div className="text-sm text-gray-400">~{workout.estimatedCalories} cal</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {workout.exercises.length} exercícios
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {Math.round(workout.estimatedCalories * (intensity === 'low' ? 0.8 : intensity === 'high' ? 1.2 : 1))} cal
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => startWorkout(workout)}
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
    );
  }

  // Interface do treino ativo
  const currentExerciseData = selectedWorkout.exercises[currentExercise];
  const progress = ((selectedWorkout.exercises[currentExercise].duration - timeLeft) / selectedWorkout.exercises[currentExercise].duration) * 100;
  const overallProgress = ((currentExercise + (1 - timeLeft / currentExerciseData.duration)) / selectedWorkout.exercises.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header do Treino Ativo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">{selectedWorkout.name}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
          <span>Exercício {currentExercise + 1}/{selectedWorkout.exercises.length}</span>
          <span>•</span>
          <span>Nível {selectedWorkout.level === 'beginner' ? 'Iniciante' : 
                         selectedWorkout.level === 'intermediate' ? 'Intermediário' : 'Avançado'}</span>
        </div>
      </motion.div>

      {/* Progresso Geral */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progresso Geral</span>
            <span className="text-sm text-gray-300">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Timer e Controles Principais */}
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <div className="mb-6">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-6xl font-bold text-white mb-2"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <h2 className="text-xl text-gray-300 mb-2">{currentExerciseData.name}</h2>
            <p className="text-gray-400 text-sm">{currentExerciseData.description}</p>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-3 mb-2" />
            <div className="text-sm text-gray-400">
              {selectedWorkout.exercises[currentExercise].duration - timeLeft}s / {selectedWorkout.exercises[currentExercise].duration}s
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={resetWorkout}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              onClick={pauseWorkout}
              className={`${isPaused 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-yellow-600 hover:bg-yellow-700'
              } text-white px-8`}
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métricas em Tempo Real */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{heartRate}</div>
            <div className="text-xs text-gray-400">BPM</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {sessionStartTime ? formatTime(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)) : '0:00'}
            </div>
            <div className="text-xs text-gray-400">Duração</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {sessionStartTime ? Math.round((Date.now() - sessionStartTime.getTime()) / 1000 / 60 * (selectedWorkout.estimatedCalories / selectedWorkout.duration)) : 0}
            </div>
            <div className="text-xs text-gray-400">Calorias</div>
          </CardContent>
        </Card>
      </div>

      {/* Instruções do Exercício Atual */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Instruções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentExerciseData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-300 text-sm">{instruction}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-sm text-gray-400">Músculos trabalhados:</span>
              {currentExerciseData.targetMuscles.map((muscle) => (
                <Badge key={muscle} variant="outline" className="text-purple-300 border-purple-500">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Exercícios */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Exercícios da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedWorkout.exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === currentExercise 
                    ? 'bg-purple-600/20 border border-purple-500' 
                    : completedExercises.includes(exercise.id)
                    ? 'bg-green-600/20'
                    : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {completedExercises.includes(exercise.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : index === currentExercise ? (
                    <div className="w-5 h-5 bg-purple-500 rounded-full animate-pulse" />
                  ) : (
                    <div className="w-5 h-5 bg-gray-600 rounded-full" />
                  )}
                  <div>
                    <div className="text-white font-medium">{exercise.name}</div>
                    <div className="text-gray-400 text-sm">{formatTime(exercise.duration)}</div>
                  </div>
                </div>
                <Badge 
                  className={`${getLevelColor(exercise.difficulty)} text-white`}
                  variant="secondary"
                >
                  {exercise.difficulty === 'beginner' ? 'Iniciante' : 
                   exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
