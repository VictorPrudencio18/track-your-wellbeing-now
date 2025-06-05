
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { 
  Target, 
  Plus, 
  Calendar,
  TrendingUp,
  Award,
  Save,
  X,
  CheckCircle
} from 'lucide-react';

export function GoalsManager() {
  const { healthGoals, createHealthGoal, updateGoalProgress } = useAdvancedHealth();
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_category: 'fitness',
    goal_title: '',
    goal_description: '',
    target_value: '',
    unit: '',
    target_date: '',
    priority: 1
  });

  const handleCreateGoal = () => {
    if (!newGoal.goal_title || !newGoal.target_value) return;
    
    createHealthGoal.mutate({
      goal_category: newGoal.goal_category,
      goal_title: newGoal.goal_title,
      goal_description: newGoal.goal_description,
      target_value: parseFloat(newGoal.target_value),
      unit: newGoal.unit,
      target_date: newGoal.target_date,
      priority: newGoal.priority
    });
    
    setNewGoal({
      goal_category: 'fitness',
      goal_title: '',
      goal_description: '',
      target_value: '',
      unit: '',
      target_date: '',
      priority: 1
    });
    setIsCreatingGoal(false);
  };

  const calculateProgress = (goal: any) => {
    if (!goal.target_value) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getGoalStatusColor = (progress: number) => {
    if (progress >= 100) return 'text-green-400 bg-green-500/20';
    if (progress >= 70) return 'text-blue-400 bg-blue-500/20';
    if (progress >= 40) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const goalCategories = [
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrição' },
    { value: 'sleep', label: 'Sono' },
    { value: 'mental_health', label: 'Saúde Mental' },
    { value: 'weight', label: 'Peso' },
    { value: 'general', label: 'Geral' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Metas de Saúde</h2>
          <p className="text-navy-400">Defina e acompanhe seus objetivos de bem-estar</p>
        </div>
        <Button 
          onClick={() => setIsCreatingGoal(true)}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {isCreatingGoal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-6 border border-navy-600/30 bg-navy-800/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Criar Nova Meta</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCreatingGoal(false)}
              className="text-navy-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-navy-300">Título da Meta</Label>
              <Input
                value={newGoal.goal_title}
                onChange={(e) => setNewGoal({ ...newGoal, goal_title: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="Ex: Perder 5kg em 3 meses"
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Categoria</Label>
              <select
                value={newGoal.goal_category}
                onChange={(e) => setNewGoal({ ...newGoal, goal_category: e.target.value })}
                className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
              >
                {goalCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label className="text-navy-300">Valor Alvo</Label>
              <Input
                type="number"
                step="0.01"
                value={newGoal.target_value}
                onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="Digite o valor"
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Unidade</Label>
              <Input
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="kg, min, vezes, etc."
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Data Limite</Label>
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-navy-300">Descrição (opcional)</Label>
              <Input
                value={newGoal.goal_description}
                onChange={(e) => setNewGoal({ ...newGoal, goal_description: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="Descreva sua meta e como pretende alcançá-la"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleCreateGoal}
              disabled={!newGoal.goal_title || !newGoal.target_value}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Save className="w-4 h-4 mr-2" />
              Criar Meta
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingGoal(false)}
              className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {healthGoals.map((goal, index) => {
          const progress = calculateProgress(goal);
          const isCompleted = progress >= 100;
          const statusColor = getGoalStatusColor(progress);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group overflow-hidden relative">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-lg">
                        <Target className="w-5 h-5 text-accent-orange" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg group-hover:text-accent-orange transition-colors">
                          {goal.goal_title}
                        </CardTitle>
                        <Badge className={`${statusColor} mt-1`}>
                          {goal.goal_category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {goal.goal_description && (
                    <p className="text-navy-400 text-sm">{goal.goal_description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-300">Progresso</span>
                      <span className="text-accent-orange font-semibold">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm text-navy-400">
                      <span>{goal.current_value} {goal.unit}</span>
                      <span>{goal.target_value} {goal.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-navy-700/30">
                    <div className="text-navy-400 text-sm">
                      {goal.target_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
                        onClick={() => {
                          const newValue = prompt(`Atualizar progresso para "${goal.goal_title}"\nValor atual: ${goal.current_value} ${goal.unit}\nNovo valor:`);
                          if (newValue && !isNaN(parseFloat(newValue))) {
                            updateGoalProgress.mutate({
                              goalId: goal.id,
                              currentValue: parseFloat(newValue)
                            });
                          }
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Atualizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {healthGoals.length === 0 && (
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-accent-orange" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Defina suas Metas</h3>
            <p className="text-navy-400 mb-6 leading-relaxed">
              Estabeleça objetivos claros para alcançar seus resultados de saúde e bem-estar
            </p>
            <Button 
              onClick={() => setIsCreatingGoal(true)}
              className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Meta
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
