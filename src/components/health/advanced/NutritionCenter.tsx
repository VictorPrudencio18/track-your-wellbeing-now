
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
  Plus, 
  Apple, 
  Target, 
  TrendingUp,
  Calendar,
  Camera,
  Star,
  Clock,
  Utensils,
  ChefHat,
  BarChart3
} from 'lucide-react';

export function NutritionCenter() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    foods: [],
    total_calories: 0,
    satisfaction_rating: 5,
    notes: '',
  });

  const { 
    activePlan, 
    todayMeals, 
    dailyTotals, 
    isLoading, 
    createNutritionPlan, 
    logMeal 
  } = useNutrition();

  const handleLogMeal = () => {
    logMeal.mutate(newMeal);
    setIsLoggingMeal(false);
    setNewMeal({
      meal_type: 'breakfast',
      meal_name: '',
      foods: [],
      total_calories: 0,
      satisfaction_rating: 5,
      notes: '',
    });
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Café da Manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeIcon = (type: string) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[type as keyof typeof icons] || '🍽️';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-orange" />
      </div>
    );
  }

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
          Gerencie seus planos nutricionais, registre refeições e acompanhe sua evolução
        </p>
      </motion.div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border border-navy-600/30">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-accent-orange">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="meals" className="data-[state=active]:bg-accent-orange">
            <Utensils className="w-4 h-4 mr-2" />
            Refeições
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-accent-orange">
            <ChefHat className="w-4 h-4 mr-2" />
            Planos
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-accent-orange">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análises
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Resumo do Dia */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{dailyTotals.calories}</div>
                  <div className="text-navy-400 text-sm">Calorias Consumidas</div>
                  {activePlan?.calorie_target && (
                    <div className="mt-2">
                      <Progress 
                        value={(dailyTotals.calories / activePlan.calorie_target) * 100}
                        className="h-2"
                      />
                      <div className="text-xs text-navy-400 mt-1">
                        Meta: {activePlan.calorie_target} kcal
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Apple className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{Math.round(dailyTotals.protein)}g</div>
                  <div className="text-navy-400 text-sm">Proteínas</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{Math.round(dailyTotals.carbs)}g</div>
                  <div className="text-navy-400 text-sm">Carboidratos</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{Math.round(dailyTotals.fat)}g</div>
                  <div className="text-navy-400 text-sm">Gorduras</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Refeições de Hoje */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Refeições de Hoje</h2>
              <Button 
                onClick={() => setIsLoggingMeal(true)}
                className="bg-accent-orange hover:bg-accent-orange/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Registrar Refeição
              </Button>
            </div>

            {todayMeals.length === 0 ? (
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Utensils className="w-8 h-8 text-accent-orange" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Nenhuma refeição registrada</h3>
                  <p className="text-navy-400 mb-4">
                    Comece registrando sua primeira refeição do dia
                  </p>
                  <Button 
                    onClick={() => setIsLoggingMeal(true)}
                    className="bg-accent-orange hover:bg-accent-orange/80"
                  >
                    Registrar Primeira Refeição
                  </Button>
                </CardContent>
              </Card>
            ) : (
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
                          <div className="flex items-start gap-4">
                            <div className="text-2xl">
                              {getMealTypeIcon(meal.meal_type)}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                {meal.meal_name || getMealTypeLabel(meal.meal_type)}
                              </h3>
                              <p className="text-navy-400 text-sm">
                                {new Date(meal.meal_time).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              {meal.notes && (
                                <p className="text-navy-300 text-sm mt-1">{meal.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">
                              {meal.total_calories || 0} kcal
                            </div>
                            {meal.satisfaction_rating && (
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-navy-400 text-sm">
                                  {meal.satisfaction_rating}/10
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Registro de Refeições */}
        <TabsContent value="meals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Registro de Refeições</h2>
            <Button 
              onClick={() => setIsLoggingMeal(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Refeição
            </Button>
          </div>

          {isLoggingMeal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
            >
              <h3 className="text-xl font-bold text-white mb-4">Registrar Nova Refeição</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="text-navy-300 text-sm">Calorias Totais</label>
                    <Input
                      type="number"
                      value={newMeal.total_calories}
                      onChange={(e) => setNewMeal({ ...newMeal, total_calories: Number(e.target.value) })}
                      placeholder="0"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Nome da Refeição (opcional)</label>
                  <Input
                    value={newMeal.meal_name}
                    onChange={(e) => setNewMeal({ ...newMeal, meal_name: e.target.value })}
                    placeholder="Ex: Salada de frango grelhado"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>

                <div>
                  <label className="text-navy-300 text-sm">Satisfação (1-10)</label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={newMeal.satisfaction_rating}
                    onChange={(e) => setNewMeal({ ...newMeal, satisfaction_rating: Number(e.target.value) })}
                    className="bg-navy-800/50"
                  />
                  <div className="flex justify-between text-xs text-navy-400 mt-1">
                    <span>Muito insatisfeito</span>
                    <span className="text-white font-medium">{newMeal.satisfaction_rating}</span>
                    <span>Muito satisfeito</span>
                  </div>
                </div>

                <div>
                  <label className="text-navy-300 text-sm">Observações</label>
                  <Textarea
                    value={newMeal.notes}
                    onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                    placeholder="Como você se sentiu? Alguma observação sobre a refeição?"
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleLogMeal} 
                    className="bg-accent-orange hover:bg-accent-orange/80"
                    disabled={logMeal.isPending}
                  >
                    {logMeal.isPending ? 'Salvando...' : 'Salvar Refeição'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsLoggingMeal(false)}
                    className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Lista de refeições seria aqui */}
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Histórico de Refeições</h3>
              <p className="text-navy-400">
                Funcionalidade em desenvolvimento para visualizar histórico completo
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Planos Nutricionais */}
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Planos Nutricionais</h2>
            <Button className="bg-accent-orange hover:bg-accent-orange/80">
              <Plus className="w-4 h-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          {activePlan ? (
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {activePlan.plan_name}
                  <Badge className="bg-green-500/20 text-green-400">Ativo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-navy-900/30 rounded-lg">
                    <div className="text-lg font-bold text-white">
                      {activePlan.calorie_target || 'N/A'}
                    </div>
                    <div className="text-navy-400 text-sm">Meta Calórica</div>
                  </div>
                  <div className="text-center p-4 bg-navy-900/30 rounded-lg">
                    <div className="text-lg font-bold text-white">
                      {activePlan.plan_type}
                    </div>
                    <div className="text-navy-400 text-sm">Tipo do Plano</div>
                  </div>
                  <div className="text-center p-4 bg-navy-900/30 rounded-lg">
                    <div className="text-lg font-bold text-white">
                      {activePlan.restrictions?.length || 0}
                    </div>
                    <div className="text-navy-400 text-sm">Restrições</div>
                  </div>
                  <div className="text-center p-4 bg-navy-900/30 rounded-lg">
                    <div className="text-lg font-bold text-white">
                      {new Date(activePlan.start_date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-navy-400 text-sm">Data de Início</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-accent-orange" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum Plano Ativo</h3>
                <p className="text-navy-400 mb-6">
                  Crie seu primeiro plano nutricional personalizado
                </p>
                <Button className="bg-accent-orange hover:bg-accent-orange/80">
                  Criar Plano
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Análises */}
        <TabsContent value="analysis" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Análises Nutricionais</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Análises Avançadas</h3>
              <p className="text-navy-400">
                Relatórios detalhados e insights sobre seus hábitos alimentares em desenvolvimento
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
