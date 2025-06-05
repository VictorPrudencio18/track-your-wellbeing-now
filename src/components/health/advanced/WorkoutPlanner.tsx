
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { 
  Plus, 
  Play, 
  Pause, 
  CheckCircle, 
  Target, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar,
  Dumbbell,
  Edit3,
  Trash2,
  Save,
  X
} from 'lucide-react';

export function WorkoutPlanner() {
  const createActivity = useCreateActivity();
  const [activeTab, setActiveTab] = useState('plans');
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'gym',
    duration: '',
    exercises: [] as Array<{name: string, sets: string, reps: string, weight: string}>
  });

  const [workoutLog, setWorkoutLog] = useState({
    type: 'gym',
    duration: '',
    calories: '',
    notes: ''
  });

  // Mock workout plans - em uma implementação real, viria do banco de dados
  const workoutPlans = [
    {
      id: '1',
      name: 'Plano de Força Iniciante',
      description: 'Programa focado no desenvolvimento de força básica',
      difficulty_level: 2,
      duration_weeks: 8,
      sessions_per_week: 3,
      progress: 50
    },
    {
      id: '2',
      name: 'Cardio Intensivo',
      description: 'Treinos de alta intensidade para queima de gordura',
      difficulty_level: 4,
      duration_weeks: 6,
      sessions_per_week: 4,
      progress: 75
    }
  ];

  const addExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, { name: '', sets: '', reps: '', weight: '' }]
    });
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updatedExercises = newWorkout.exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setNewWorkout({ ...newWorkout, exercises: updatedExercises });
  };

  const removeExercise = (index: number) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter((_, i) => i !== index)
    });
  };

  const handleLogWorkout = () => {
    if (!workoutLog.type || !workoutLog.duration) return;
    
    createActivity.mutate({
      name: `Treino ${workoutLog.type}`,
      type: workoutLog.type as any,
      duration: parseInt(workoutLog.duration) * 60, // converter para segundos
      calories: workoutLog.calories ? parseInt(workoutLog.calories) : undefined,
      notes: workoutLog.notes,
      completed_at: new Date().toISOString()
    });
    
    setWorkoutLog({
      type: 'gym',
      duration: '',
      calories: '',
      notes: ''
    });
    setIsLogging(false);
  };

  const activityTypes = [
    { value: 'gym', label: 'Academia' },
    { value: 'running', label: 'Corrida' },
    { value: 'cycling', label: 'Ciclismo' },
    { value: 'swimming', label: 'Natação' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'dance', label: 'Dança' },
    { value: 'hiking', label: 'Caminhada' },
    { value: 'walking', label: 'Caminhada Leve' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-3xl border border-blue-500/20">
              <Dumbbell className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Planejador de Treinos
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Crie, acompanhe e registre seus treinos personalizados
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => setIsLogging(true)}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Treino
        </Button>
        <Button 
          onClick={() => setIsCreatingWorkout(true)}
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <Target className="w-4 h-4 mr-2" />
          Criar Plano
        </Button>
      </div>

      {/* Quick Workout Log Modal */}
      {isLogging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/90 backdrop-blur-xl max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Registrar Treino</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsLogging(false)}
                  className="text-navy-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-navy-300 text-sm">Tipo de Treino</label>
                <select
                  value={workoutLog.type}
                  onChange={(e) => setWorkoutLog({ ...workoutLog, type: e.target.value })}
                  className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white mt-1"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-navy-300 text-sm">Duração (minutos)</label>
                <Input
                  type="number"
                  value={workoutLog.duration}
                  onChange={(e) => setWorkoutLog({ ...workoutLog, duration: e.target.value })}
                  className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                  placeholder="Ex: 45"
                />
              </div>
              
              <div>
                <label className="text-navy-300 text-sm">Calorias (opcional)</label>
                <Input
                  type="number"
                  value={workoutLog.calories}
                  onChange={(e) => setWorkoutLog({ ...workoutLog, calories: e.target.value })}
                  className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                  placeholder="Ex: 300"
                />
              </div>
              
              <div>
                <label className="text-navy-300 text-sm">Notas (opcional)</label>
                <Textarea
                  value={workoutLog.notes}
                  onChange={(e) => setWorkoutLog({ ...workoutLog, notes: e.target.value })}
                  className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                  placeholder="Como foi o treino hoje?"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleLogWorkout}
                  disabled={!workoutLog.type || !workoutLog.duration || createActivity.isPending}
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createActivity.isPending ? 'Salvando...' : 'Registrar'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogging(false)}
                  className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Workout Plan Modal */}
      {isCreatingWorkout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/90 backdrop-blur-xl max-w-2xl w-full my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Criar Plano de Treino</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsCreatingWorkout(false)}
                  className="text-navy-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-navy-300 text-sm">Nome do Plano</label>
                  <Input
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    placeholder="Ex: Treino de Força"
                  />
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Tipo</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white mt-1"
                  >
                    {activityTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Exercícios</h4>
                  <Button 
                    onClick={addExercise}
                    size="sm"
                    variant="outline"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {newWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-navy-700/30 rounded-lg">
                      <Input
                        placeholder="Nome do exercício"
                        value={exercise.name}
                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm"
                      />
                      <Input
                        placeholder="Séries"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm w-20"
                      />
                      <Input
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm w-20"
                      />
                      <Input
                        placeholder="Peso"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm w-20"
                      />
                      <Button
                        onClick={() => removeExercise(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {newWorkout.exercises.length === 0 && (
                    <div className="text-center py-8 text-navy-400">
                      <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum exercício adicionado</p>
                      <p className="text-sm">Clique em "Adicionar" para começar</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-navy-700/30">
                <Button 
                  onClick={() => {
                    console.log('Criando plano:', newWorkout);
                    setNewWorkout({
                      name: '',
                      type: 'gym',
                      duration: '',
                      exercises: []
                    });
                    setIsCreatingWorkout(false);
                  }}
                  disabled={!newWorkout.name}
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Criar Plano
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingWorkout(false)}
                  className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 h-auto">
          {[
            { value: 'plans', label: 'Planos', icon: Target },
            { value: 'progress', label: 'Progresso', icon: TrendingUp },
            { value: 'calendar', label: 'Calendário', icon: Calendar }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-orange data-[state=active]:to-accent-orange/80 data-[state=active]:text-white transition-all duration-300 hover:text-white"
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="plans" className="space-y-6 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workoutPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
                          <Dumbbell className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                            {plan.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-500/20 text-blue-400">
                              Nível {plan.difficulty_level}
                            </Badge>
                            <Badge className="bg-navy-700/50 text-navy-300">
                              {plan.duration_weeks} semanas
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-navy-400">{plan.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Progresso</span>
                        <span className="text-blue-400 font-semibold">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-navy-700/30">
                      <div className="text-navy-400 text-sm">
                        {plan.sessions_per_week}x por semana
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Iniciar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 mt-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Acompanhamento de Progresso</h3>
              <p className="text-navy-400 leading-relaxed">
                Análises detalhadas do seu progresso nos treinos estarão disponíveis em breve
              </p>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6 mt-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Calendário de Treinos</h3>
              <p className="text-navy-400 leading-relaxed">
                Planejamento e agendamento de treinos com visualização em calendário
              </p>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
