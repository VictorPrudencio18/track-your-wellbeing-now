
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNutrition } from '@/hooks/useNutrition';
import { 
  Apple, 
  Plus, 
  Target, 
  TrendingUp,
  Clock,
  Utensils,
  BarChart3,
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react';

export function NutritionCenter() {
  const { activePlan, todayMeals, dailyTotals, createNutritionPlan, logMeal } = useNutrition();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);

  const [newPlan, setNewPlan] = useState({
    plan_name: '',
    plan_type: 'general',
    calorie_target: 2000,
    description: '',
  });

  const [newMeal, setNewMeal] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    total_calories: 0,
    notes: '',
  });

  const handleCreatePlan = () => {
    createNutritionPlan.mutate(newPlan);
    setIsCreatingPlan(false);
    setNewPlan({
      plan_name: '',
      plan_type: 'general',
      calorie_target: 2000,
      description: '',
    });
  };

  const handleLogMeal = () => {
    logMeal.mutate(newMeal);
    setIsLoggingMeal(false);
    setNewMeal({
      meal_type: 'breakfast',
      meal_name: '',
      total_calories: 0,
      notes: '',
    });
  };

  const calorieProgress = activePlan?.calorie_target ? 
    (dailyTotals.calories / activePlan.calorie_target) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Centro de Nutrição
        </h1>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Monitore sua alimentação, crie planos nutricionais e acompanhe seus objetivos
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Calorias Hoje</p>
                  <p className="text-2xl font-bold text-white">
                    {dailyTotals.calories}
                  </p>
                  <p className="text-xs text-navy-500">
                    Meta: {activePlan?.calorie_target || 2000}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Apple className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <Progress value={Math.min(calorieProgress, 100)} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Refeições</p>
                  <p className="text-2xl font-bold text-white">
                    {todayMeals.length}
                  </p>
                  <p className="text-xs text-navy-500">hoje</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Utensils className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Proteína</p>
                  <p className="text-2xl font-bold text-white">
                    {dailyTotals.protein.toFixed(1)}g
                  </p>
                  <p className="text-xs text-navy-500">consumida</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Status</p>
                  <p className="text-lg font-bold text-white">
                    {activePlan ? 'Ativo' : 'Sem Plano'}
                  </p>
                  <p className="text-xs text-navy-500">
                    {activePlan ? activePlan.plan_name : 'Criar plano'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${activePlan ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                  {activePlan ? (
                    <Star className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-orange-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border border-navy-600/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-orange">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="meals" className="data-[state=active]:bg-accent-orange">
            <Utensils className="w-4 h-4 mr-2" />
            Refeições
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-accent-orange">
            <Target className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-accent-orange">
            <Calendar className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Macros do Dia */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white">Macronutrientes Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-300">Proteína</span>
                      <span className="text-white">{dailyTotals.protein.toFixed(1)}g</span>
                    </div>
                    <Progress value={(dailyTotals.protein / 150) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-300">Carboidratos</span>
                      <span className="text-white">{dailyTotals.carbs.toFixed(1)}g</span>
                    </div>
                    <Progress value={(dailyTotals.carbs / 300) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-300">Gorduras</span>
                      <span className="text-white">{dailyTotals.fat.toFixed(1)}g</span>
                    </div>
                    <Progress value={(dailyTotals.fat / 100) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plano Ativo */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white">Plano Nutricional Ativo</CardTitle>
              </CardHeader>
              <CardContent>
                {activePlan ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-white">{activePlan.plan_name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {activePlan.plan_type}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Meta Calórica</span>
                        <span className="text-white">{activePlan.calorie_target} kcal</span>
                      </div>
                      <Progress value={calorieProgress} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-navy-400 mb-4">Nenhum plano ativo</p>
                    <Button 
                      onClick={() => setActiveTab('plans')}
                      className="bg-accent-orange hover:bg-accent-orange/80"
                    >
                      Criar Plano
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Refeições */}
        <TabsContent value="meals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Refeições de Hoje</h2>
            <Button 
              onClick={() => setIsLoggingMeal(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Refeição
            </Button>
          </div>

          {isLoggingMeal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
            >
              <h3 className="text-xl font-bold text-white mb-4">Nova Refeição</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-navy-300 text-sm">Tipo de Refeição</label>
                  <select
                    value={newMeal.meal_type}
                    onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                  >
                    <option value="breakfast">Café da Manhã</option>
                    <option value="lunch">Almoço</option>
                    <option value="dinner">Jantar</option>
                    <option value="snack">Lanche</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Nome da Refeição</label>
                  <Input
                    value={newMeal.meal_name}
                    onChange={(e) => setNewMeal({ ...newMeal, meal_name: e.target.value })}
                    placeholder="Ex: Salada de Frango"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Calorias</label>
                  <Input
                    type="number"
                    value={newMeal.total_calories}
                    onChange={(e) => setNewMeal({ ...newMeal, total_calories: Number(e.target.value) })}
                    placeholder="300"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Observações</label>
                  <Input
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    placeholder="Observações opcionais"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={handleLogMeal} className="bg-accent-orange hover:bg-accent-orange/80">
                  Registrar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLoggingMeal(false)}
                  className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {todayMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">
                            {meal.meal_type === 'breakfast' ? 'Café da Manhã' :
                             meal.meal_type === 'lunch' ? 'Almoço' :
                             meal.meal_type === 'dinner' ? 'Jantar' : 'Lanche'}
                          </Badge>
                          <span className="text-navy-400 text-sm">
                            {new Date(meal.meal_time).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold">
                          {meal.meal_name || 'Refeição sem nome'}
                        </h3>
                        {meal.notes && (
                          <p className="text-navy-400 text-sm mt-1">{meal.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {meal.total_calories || 0} kcal
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Planos */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Planos Nutricionais</h2>
            <Button 
              onClick={() => setIsCreatingPlan(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          {isCreatingPlan && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
            >
              <h3 className="text-xl font-bold text-white mb-4">Criar Novo Plano</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-navy-300 text-sm">Nome do Plano</label>
                  <Input
                    value={newPlan.plan_name}
                    onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                    placeholder="Ex: Plano de Emagrecimento"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Tipo do Plano</label>
                  <select
                    value={newPlan.plan_type}
                    onChange={(e) => setNewPlan({ ...newPlan, plan_type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                  >
                    <option value="general">Geral</option>
                    <option value="weight_loss">Emagrecimento</option>
                    <option value="muscle_gain">Ganho de Massa</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="therapeutic">Terapêutico</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Meta Calórica Diária</label>
                  <Input
                    type="number"
                    value={newPlan.calorie_target}
                    onChange={(e) => setNewPlan({ ...newPlan, calorie_target: Number(e.target.value) })}
                    placeholder="2000"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-navy-300 text-sm">Descrição</label>
                  <Textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Descreva os objetivos e características do plano"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleCreatePlan} className="bg-accent-orange hover:bg-accent-orange/80">
                    Criar Plano
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreatingPlan(false)}
                    className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activePlan && (
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{activePlan.plan_name}</CardTitle>
                  <Badge className="bg-green-500/20 text-green-400">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-navy-400 text-sm">Tipo</span>
                      <p className="text-white">{activePlan.plan_type}</p>
                    </div>
                    <div>
                      <span className="text-navy-400 text-sm">Meta Calórica</span>
                      <p className="text-white">{activePlan.calorie_target} kcal</p>
                    </div>
                  </div>
                  <div className="text-navy-400 text-sm">
                    Criado em {new Date(activePlan.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Histórico Nutricional</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Análises em Desenvolvimento</h3>
              <p className="text-navy-400">
                Relatórios detalhados e análises nutricionais estarão disponíveis em breve
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
