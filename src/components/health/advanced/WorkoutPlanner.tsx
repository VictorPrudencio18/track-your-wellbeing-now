
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, 
  Plus, 
  Clock, 
  Target, 
  Calendar,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Award
} from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  duration?: number;
  rest: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  duration_weeks: number;
  exercises: Exercise[];
  progress: number;
}

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Treino de Força Iniciante',
    description: 'Programa básico focado em desenvolver força e massa muscular',
    difficulty: 2,
    duration_weeks: 8,
    exercises: [
      { name: 'Agachamento', sets: 3, reps: '8-12', weight: 60, rest: 90 },
      { name: 'Supino', sets: 3, reps: '8-10', weight: 50, rest: 120 },
      { name: 'Remada', sets: 3, reps: '8-12', weight: 40, rest: 90 },
    ],
    progress: 65
  },
  {
    id: '2',
    name: 'HIIT Cardio',
    description: 'Treino intervalado de alta intensidade para queima de gordura',
    difficulty: 4,
    duration_weeks: 4,
    exercises: [
      { name: 'Burpees', sets: 4, reps: '30s', rest: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: '30s', rest: 30 },
      { name: 'Jump Squats', sets: 4, reps: '30s', rest: 30 },
    ],
    progress: 80
  }
];

const mockActiveSession = {
  workoutName: 'Treino de Força Iniciante',
  currentExercise: 'Agachamento',
  currentSet: 2,
  totalSets: 3,
  timeElapsed: 1240, // em segundos
  isActive: true,
  isPaused: false
};

export function WorkoutPlanner() {
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [activeSession, setActiveSession] = useState(mockActiveSession);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return { label: 'Iniciante', color: 'bg-green-500/20 text-green-400' };
    if (level <= 3) return { label: 'Intermediário', color: 'bg-yellow-500/20 text-yellow-400' };
    return { label: 'Avançado', color: 'bg-red-500/20 text-red-400' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Planejador de Treinos
          </h2>
          <p className="text-navy-400">
            Crie, acompanhe e execute seus treinos personalizados
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreatingPlan(true)}
          className="bg-accent-orange hover:bg-accent-orange/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Plano
        </Button>
      </motion.div>

      {/* Sessão Ativa */}
      {activeSession.isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-accent-orange/30 bg-gradient-to-r from-accent-orange/10 to-navy-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-accent-orange/20 rounded-lg">
                  <Dumbbell className="w-5 h-5 text-accent-orange" />
                </div>
                Treino em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatTime(activeSession.timeElapsed)}
                  </div>
                  <div className="text-navy-400 text-sm">Tempo Decorrido</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-orange mb-1">
                    {activeSession.currentSet}/{activeSession.totalSets}
                  </div>
                  <div className="text-navy-400 text-sm">Série Atual</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-white mb-1">
                    {activeSession.currentExercise}
                  </div>
                  <div className="text-navy-400 text-sm">Exercício Atual</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-card border-navy-600"
                >
                  {activeSession.isPaused ? (
                    <><Play className="w-5 h-5 mr-2" />Continuar</>
                  ) : (
                    <><Pause className="w-5 h-5 mr-2" />Pausar</>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-card border-navy-600"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reiniciar Série
                </Button>
                
                <Button
                  variant="destructive"
                  size="lg"
                >
                  Finalizar Treino
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Planos de Treino */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Meus Planos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockWorkoutPlans.map((plan, index) => {
            const difficulty = getDifficultyLabel(plan.difficulty);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg mb-2">
                          {plan.name}
                        </CardTitle>
                        <p className="text-navy-400 text-sm">
                          {plan.description}
                        </p>
                      </div>
                      <Badge className={difficulty.color}>
                        {difficulty.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-accent-orange font-semibold">
                          {plan.exercises.length}
                        </div>
                        <div className="text-xs text-navy-400">Exercícios</div>
                      </div>
                      <div>
                        <div className="text-accent-orange font-semibold">
                          {plan.duration_weeks}
                        </div>
                        <div className="text-xs text-navy-400">Semanas</div>
                      </div>
                      <div>
                        <div className="text-accent-orange font-semibold">
                          {plan.difficulty}/5
                        </div>
                        <div className="text-xs text-navy-400">Intensidade</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-navy-300">Progresso</span>
                        <span className="text-white">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="glass-card border-navy-600"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Estatísticas */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Estatísticas da Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              icon: Calendar, 
              label: 'Treinos Realizados', 
              value: '4', 
              subtitle: 'Meta: 5/semana',
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10'
            },
            { 
              icon: Clock, 
              label: 'Tempo Total', 
              value: '3h 45m', 
              subtitle: 'Esta semana',
              color: 'text-green-400',
              bgColor: 'bg-green-400/10'
            },
            { 
              icon: TrendingUp, 
              label: 'Calorias Queimadas', 
              value: '1,240', 
              subtitle: 'Estimativa total',
              color: 'text-orange-400',
              bgColor: 'bg-orange-400/10'
            },
            { 
              icon: Award, 
              label: 'Novo Recorde', 
              value: '85kg', 
              subtitle: 'Supino',
              color: 'text-purple-400',
              bgColor: 'bg-purple-400/10'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-navy-300 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-navy-500">
                    {stat.subtitle}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Criação de Plano */}
      {isCreatingPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCreatingPlan(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card bg-navy-800 p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Criar Novo Plano de Treino
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-navy-300 text-sm font-medium mb-2">
                  Nome do Plano
                </label>
                <Input 
                  placeholder="Ex: Treino de Força Avançado"
                  className="glass-card border-navy-600 bg-navy-700/50"
                />
              </div>
              
              <div>
                <label className="block text-navy-300 text-sm font-medium mb-2">
                  Descrição
                </label>
                <Textarea 
                  placeholder="Descreva os objetivos e características do treino..."
                  className="glass-card border-navy-600 bg-navy-700/50"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-navy-300 text-sm font-medium mb-2">
                    Dificuldade
                  </label>
                  <Select>
                    <SelectTrigger className="glass-card border-navy-600 bg-navy-700/50">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Iniciante</SelectItem>
                      <SelectItem value="2">Intermediário</SelectItem>
                      <SelectItem value="3">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-navy-300 text-sm font-medium mb-2">
                    Duração (semanas)
                  </label>
                  <Input 
                    type="number"
                    placeholder="4"
                    className="glass-card border-navy-600 bg-navy-700/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingPlan(false)}
                  className="flex-1 glass-card border-navy-600"
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                  onClick={() => setIsCreatingPlan(false)}
                >
                  Criar Plano
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
