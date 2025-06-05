
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Utensils, 
  Camera, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  Apple,
  Coffee,
  Beef,
  Wheat
} from 'lucide-react';
import { useNutrition } from '@/hooks/useNutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function NutritionCenter() {
  const { nutritionPlans, mealLogs, todayMeals, logMeal, createNutritionPlan } = useNutrition();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  const [newMeal, setNewMeal] = useState({
    meal_type: '',
    meal_name: '',
    foods: [] as any[],
    total_calories: 0,
    satisfaction_rating: 5,
    notes: '',
  });

  const [newPlan, setNewPlan] = useState({
    plan_name: '',
    plan_type: 'general',
    calorie_target: 2000,
    macros_target: {
      protein: 25,
      carbs: 45,
      fats: 30
    },
    restrictions: [] as any[],
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Café da Manhã', icon: Coffee, color: 'text-yellow-400' },
    { value: 'lunch', label: 'Almoço', icon: Utensils, color: 'text-green-400' },
    { value: 'dinner', label: 'Jantar', icon: Beef, color: 'text-red-400' },
    { value: 'snack', label: 'Lanche', icon: Apple, color: 'text-purple-400' },
  ];

  const planTypes = [
    { value: 'general', label: 'Geral' },
    { value: 'weight_loss', label: 'Perda de Peso' },
    { value: 'muscle_gain', label: 'Ganho de Massa' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'therapeutic', label: 'Terapêutico' },
  ];

  const handleLogMeal = async () => {
    try {
      await logMeal.mutateAsync({
        ...newMeal,
        meal_time: new Date().toISOString(),
      });
      setNewMeal({
        meal_type: '',
        meal_name: '',
        foods: [],
        total_calories: 0,
        satisfaction_rating: 5,
        notes: '',
      });
      setIsMealModalOpen(false);
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleCreatePlan = async () => {
    try {
      await createNutritionPlan.mutateAsync(newPlan);
      setNewPlan({
        plan_name: '',
        plan_type: 'general',
        calorie_target: 2000,
        macros_target: {
          protein: 25,
          carbs: 45,
          fats: 30
        },
        restrictions: [],
      });
      setIsPlanModalOpen(false);
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
    }
  };

  const todayCalories = todayMeals?.reduce((sum, meal) => sum + (meal.total_calories || 0), 0) || 0;
  const calorieTarget = nutritionPlans?.[0]?.calorie_target || 2000;
  const calorieProgress = (todayCalories / calorieTarget) * 100;

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
            <h1 className="text-4xl font-bold text-white mb-2">Centro de Nutrição</h1>
            <p className="text-navy-300 text-lg">Gerencie sua alimentação e planos nutricionais</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isMealModalOpen} onOpenChange={setIsMealModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Refeição
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-navy-600/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Registrar Nova Refeição</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-navy-300 mb-2 block">Tipo de Refeição</label>
                      <Select value={newMeal.meal_type} onValueChange={(value) => setNewMeal(prev => ({ ...prev, meal_type: value }))}>
                        <SelectTrigger className="bg-navy-800/50 border-navy-600/30 text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-800 border-navy-600/30">
                          {mealTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-white">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-navy-300 mb-2 block">Calorias</label>
                      <Input
                        type="number"
                        value={newMeal.total_calories}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, total_calories: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        className="bg-navy-800/50 border-navy-600/30 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Nome da Refeição</label>
                    <Input
                      value={newMeal.meal_name}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, meal_name: e.target.value }))}
                      placeholder="Ex: Salada Caesar com Frango"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Notas</label>
                    <Textarea
                      value={newMeal.notes}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre a refeição..."
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Satisfação (1-10)</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newMeal.satisfaction_rating}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, satisfaction_rating: parseInt(e.target.value) || 5 }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsMealModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleLogMeal}
                      disabled={!newMeal.meal_type || !newMeal.meal_name}
                      className="bg-gradient-to-r from-green-500 to-green-600"
                    >
                      Registrar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-navy-600/30 text-white hover:bg-navy-800/50">
                  <Target className="w-4 h-4 mr-2" />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-navy-600/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Criar Plano Nutricional</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-2 block">Nome do Plano</label>
                    <Input
                      value={newPlan.plan_name}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, plan_name: e.target.value }))}
                      placeholder="Ex: Plano de Emagrecimento"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-navy-300 mb-2 block">Tipo de Plano</label>
                      <Select value={newPlan.plan_type} onValueChange={(value) => setNewPlan(prev => ({ ...prev, plan_type: value }))}>
                        <SelectTrigger className="bg-navy-800/50 border-navy-600/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-800 border-navy-600/30">
                          {planTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-white">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-navy-300 mb-2 block">Meta de Calorias</label>
                      <Input
                        type="number"
                        value={newPlan.calorie_target}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, calorie_target: parseInt(e.target.value) || 2000 }))}
                        className="bg-navy-800/50 border-navy-600/30 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-navy-300 mb-3 block">Distribuição de Macronutrientes (%)</label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-navy-400 mb-1 block">Proteína</label>
                        <Input
                          type="number"
                          value={newPlan.macros_target.protein}
                          onChange={(e) => setNewPlan(prev => ({ 
                            ...prev, 
                            macros_target: { ...prev.macros_target, protein: parseInt(e.target.value) || 25 }
                          }))}
                          className="bg-navy-800/50 border-navy-600/30 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-navy-400 mb-1 block">Carboidratos</label>
                        <Input
                          type="number"
                          value={newPlan.macros_target.carbs}
                          onChange={(e) => setNewPlan(prev => ({ 
                            ...prev, 
                            macros_target: { ...prev.macros_target, carbs: parseInt(e.target.value) || 45 }
                          }))}
                          className="bg-navy-800/50 border-navy-600/30 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-navy-400 mb-1 block">Gorduras</label>
                        <Input
                          type="number"
                          value={newPlan.macros_target.fats}
                          onChange={(e) => setNewPlan(prev => ({ 
                            ...prev, 
                            macros_target: { ...prev.macros_target, fats: parseInt(e.target.value) || 30 }
                          }))}
                          className="bg-navy-800/50 border-navy-600/30 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsPlanModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleCreatePlan}
                      disabled={!newPlan.plan_name.trim()}
                      className="bg-gradient-to-r from-green-500 to-green-600"
                    >
                      Criar Plano
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Resumo do Dia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card-ultra border-navy-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="w-6 h-6 text-green-400" />
                Resumo de Hoje
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              {/* Progress de Calorias */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-navy-300 font-medium">Calorias Consumidas</span>
                  <span className="text-white text-lg font-bold">
                    {todayCalories} / {calorieTarget} kcal
                  </span>
                </div>
                <Progress value={Math.min(calorieProgress, 100)} className="h-3 bg-navy-800/50" />
                <div className="flex justify-between text-sm text-navy-400 mt-2">
                  <span>Meta: {calorieTarget} kcal</span>
                  <span>{Math.round(calorieProgress)}% atingido</span>
                </div>
              </div>
              
              {/* Refeições de Hoje */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mealTypes.map((mealType) => {
                  const meal = todayMeals?.find(m => m.meal_type === mealType.value);
                  const Icon = mealType.icon;
                  
                  return (
                    <div key={mealType.value} className="bg-navy-800/40 rounded-xl p-4 border border-navy-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${mealType.color}`} />
                        <span className="text-xs text-navy-300">{mealType.label}</span>
                      </div>
                      {meal ? (
                        <div>
                          <div className="text-white font-semibold text-sm mb-1">{meal.meal_name}</div>
                          <div className="text-xs text-navy-400">{meal.total_calories} kcal</div>
                        </div>
                      ) : (
                        <div className="text-navy-500 text-sm">Não registrado</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Planos Nutricionais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card-ultra border-navy-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-6 h-6 text-blue-400" />
                Planos Nutricionais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nutritionPlans && nutritionPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nutritionPlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-navy-800/40 rounded-xl p-6 border border-navy-700/30 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{plan.plan_name}</h3>
                          <Badge variant="outline" className="bg-green-400/10 border-green-400/30 text-green-400 mt-2">
                            {planTypes.find(t => t.value === plan.plan_type)?.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-xl">{plan.calorie_target}</div>
                          <div className="text-navy-400 text-sm">kcal/dia</div>
                        </div>
                      </div>
                      
                      {/* Macros */}
                      <div className="space-y-3">
                        <div className="text-sm text-navy-300 font-medium">Distribuição de Macros</div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-red-400 font-semibold">{plan.macros_target.protein}%</div>
                            <div className="text-xs text-navy-400">Proteína</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-semibold">{plan.macros_target.carbs}%</div>
                            <div className="text-xs text-navy-400">Carboidratos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold">{plan.macros_target.fats}%</div>
                            <div className="text-xs text-navy-400">Gorduras</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Utensils className="w-16 h-16 text-navy-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhum plano nutricional</h3>
                  <p className="text-navy-400 mb-4">Crie seu primeiro plano nutricional para começar!</p>
                  <Button 
                    onClick={() => setIsPlanModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    Criar Primeiro Plano
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Histórico de Refeições */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card-ultra border-navy-600/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-6 h-6 text-purple-400" />
                Histórico Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealLogs && mealLogs.length > 0 ? (
                <div className="space-y-4">
                  {mealLogs.slice(0, 10).map((meal, index) => {
                    const mealType = mealTypes.find(t => t.value === meal.meal_type);
                    const Icon = mealType?.icon || Utensils;
                    
                    return (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-navy-800/40 rounded-xl border border-navy-700/30"
                      >
                        <div className={`p-2 rounded-lg ${mealType?.color === 'text-yellow-400' ? 'bg-yellow-400/20' : 
                                                         mealType?.color === 'text-green-400' ? 'bg-green-400/20' : 
                                                         mealType?.color === 'text-red-400' ? 'bg-red-400/20' : 'bg-purple-400/20'}`}>
                          <Icon className={`w-5 h-5 ${mealType?.color || 'text-purple-400'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{meal.meal_name}</h4>
                          <div className="flex items-center gap-4 text-sm text-navy-400">
                            <span>{mealType?.label}</span>
                            <span>{meal.total_calories} kcal</span>
                            <span>{new Date(meal.meal_time).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        {meal.satisfaction_rating && (
                          <div className="text-right">
                            <div className="text-white font-semibold">{meal.satisfaction_rating}/10</div>
                            <div className="text-xs text-navy-400">Satisfação</div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-navy-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nenhuma refeição registrada</h3>
                  <p className="text-navy-400">Comece registrando suas refeições para acompanhar sua nutrição!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
