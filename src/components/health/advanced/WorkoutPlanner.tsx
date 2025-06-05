
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Dumbbell, 
  Timer, 
  Target, 
  TrendingUp,
  Calendar,
  Star,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WorkoutPlanner() {
  const { workoutPlans, createWorkoutPlan, isLoading } = useAdvancedHealth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    difficulty_level: 1,
    duration_weeks: 4,
    workout_data: [] as any[],
  });

  const difficultyLabels = {
    1: 'Iniciante',
    2: 'Básico',
    3: 'Intermediário',
    4: 'Avançado',
    5: 'Expert'
  };

  const handleCreatePlan = async () => {
    try {
      await createWorkoutPlan.mutateAsync(newPlan);
      setNewPlan({
        name: '',
        description: '',
        difficulty_level: 1,
        duration_weeks: 4,
        workout_data: [],
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating workout plan:', error);
    }
  };

  const startTimer = (planId: string) => {
    setActiveTimer(planId);
    setTimerSeconds(0);
    
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);

    // Store interval in a way that can be cleared later
    (window as any).workoutTimer = interval;
  };

  const stopTimer = () => {
    if ((window as any).workoutTimer) {
      clearInterval((window as any).workoutTimer);
    }
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Planejador de Treinos</h1>
            <p className="text-navy-300 text-lg">Crie e gerencie seus planos de treino personalizados</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-navy-600/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Criar Novo Plano de Treino</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <label className="text-sm font-medium text-navy-300 mb-2 block">Nome do Plano</label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Treino de Força Iniciante"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-navy-300 mb-2 block">Descrição</label>
                  <Textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva os objetivos e características do plano..."
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Nível de Dificuldade</label>
                    <Select 
                      value={newPlan.difficulty_level.toString()} 
                      onValueChange={(value) => setNewPlan(prev => ({ ...prev, difficulty_level: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-navy-800/50 border-navy-600/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-navy-800 border-navy-600/30">
                        {Object.entries(difficultyLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} className="text-white">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Duração (semanas)</label>
                    <Input
                      type="number"
                      value={newPlan.duration_weeks}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, duration_weeks: parseInt(e.target.value) || 4 }))}
                      min="1"
                      max="52"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreatePlan}
                    disabled={!newPlan.name.trim()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Criar Plano
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Planos de Treino */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {workoutPlans?.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="glass-card-ultra border-navy-600/30 hover:border-blue-500/50 transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{plan.name}</CardTitle>
                      <p className="text-navy-300 text-sm line-clamp-2">{plan.description}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-blue-400/10 border-blue-400/30 text-blue-400 ml-2"
                    >
                      {difficultyLabels[plan.difficulty_level as keyof typeof difficultyLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-navy-800/40 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-navy-300">Duração</span>
                      </div>
                      <div className="text-white font-semibold">{plan.duration_weeks} semanas</div>
                    </div>
                    
                    <div className="bg-navy-800/40 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-navy-300">Progresso</span>
                      </div>
                      <div className="text-white font-semibold">0%</div>
                    </div>
                  </div>
                  
                  {/* Timer */}
                  {activeTimer === plan.id ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-mono font-bold text-green-400 mb-2">
                          {formatTime(timerSeconds)}
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={stopTimer}>
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setTimerSeconds(0)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      onClick={() => startTimer(plan.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Treino
                    </Button>
                  )}
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-300">Progresso Semanal</span>
                      <span className="text-white">0/7 dias</span>
                    </div>
                    <Progress value={0} className="h-2 bg-navy-800/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Card para Criar Novo Plano */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (workoutPlans?.length || 0) * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 border-dashed hover:border-blue-500/50 transition-all duration-300 h-full cursor-pointer group"
                  onClick={() => setIsCreateModalOpen(true)}>
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <div className="p-4 bg-blue-500/20 rounded-2xl mx-auto w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Criar Novo Plano</h3>
                <p className="text-navy-300">Adicione um novo plano de treino personalizado</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Workout Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card-ultra border-navy-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Dumbbell className="w-6 h-6 text-blue-400" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-16">
                  <div className="text-center">
                    <Timer className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm">Treino Rápido</div>
                  </div>
                </Button>
                
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-16">
                  <div className="text-center">
                    <Target className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm">Definir Meta</div>
                  </div>
                </Button>
                
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 h-16">
                  <div className="text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-sm">Ver Progresso</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
