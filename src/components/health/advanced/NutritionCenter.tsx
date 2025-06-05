
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Apple, 
  Plus, 
  Camera,
  Calculator,
  Target,
  TrendingUp,
  Clock,
  Utensils,
  Droplets,
  Zap,
  Save,
  X,
  Search
} from 'lucide-react';

export function NutritionCenter() {
  const [activeTab, setActiveTab] = useState('today');
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [mealLog, setMealLog] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    foods: [] as Array<{name: string, quantity: string, calories: string}>,
    notes: ''
  });

  // Mock data - em uma implementação real, viria do banco de dados
  const todayNutrition = {
    calories: { consumed: 1450, target: 2000 },
    protein: { consumed: 85, target: 120 },
    carbs: { consumed: 180, target: 250 },
    fat: { consumed: 65, target: 80 },
    water: { consumed: 6, target: 8 }
  };

  const recentMeals = [
    {
      id: '1',
      meal_type: 'breakfast',
      meal_name: 'Café da Manhã Saudável',
      foods: [
        { name: 'Aveia', quantity: '50g', calories: 190 },
        { name: 'Banana', quantity: '1 unidade', calories: 105 },
        { name: 'Leite Desnatado', quantity: '200ml', calories: 90 }
      ],
      total_calories: 385,
      meal_time: '08:30'
    },
    {
      id: '2',
      meal_type: 'lunch',
      meal_name: 'Almoço Balanceado',
      foods: [
        { name: 'Arroz Integral', quantity: '100g', calories: 130 },
        { name: 'Frango Grelhado', quantity: '150g', calories: 165 },
        { name: 'Brócolis', quantity: '100g', calories: 25 }
      ],
      total_calories: 320,
      meal_time: '12:45'
    }
  ];

  const mealTypes = [
    { value: 'breakfast', label: 'Café da Manhã', icon: '🌅' },
    { value: 'morning_snack', label: 'Lanche da Manhã', icon: '🍎' },
    { value: 'lunch', label: 'Almoço', icon: '🍽️' },
    { value: 'afternoon_snack', label: 'Lanche da Tarde', icon: '🥨' },
    { value: 'dinner', label: 'Jantar', icon: '🌙' },
    { value: 'late_snack', label: 'Ceia', icon: '🌃' }
  ];

  const addFood = () => {
    setMealLog({
      ...mealLog,
      foods: [...mealLog.foods, { name: '', quantity: '', calories: '' }]
    });
  };

  const updateFood = (index: number, field: string, value: string) => {
    const updatedFoods = mealLog.foods.map((food, i) => 
      i === index ? { ...food, [field]: value } : food
    );
    setMealLog({ ...mealLog, foods: updatedFoods });
  };

  const removeFood = (index: number) => {
    setMealLog({
      ...mealLog,
      foods: mealLog.foods.filter((_, i) => i !== index)
    });
  };

  const calculateProgress = (consumed: number, target: number) => {
    return Math.min((consumed / target) * 100, 100);
  };

  const getMealTypeLabel = (type: string) => {
    return mealTypes.find(mt => mt.value === type)?.label || type;
  };

  const getMealTypeIcon = (type: string) => {
    return mealTypes.find(mt => mt.value === type)?.icon || '🍽️';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-600/10 rounded-3xl border border-green-500/20">
              <Apple className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-400 to-emerald-400 bg-clip-text text-transparent">
                Central de Nutrição
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Monitore sua alimentação e atinja seus objetivos nutricionais
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Macros Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { key: 'calories', label: 'Calorias', icon: Zap, color: 'text-orange-400', data: todayNutrition.calories },
          { key: 'protein', label: 'Proteína', icon: Target, color: 'text-red-400', data: todayNutrition.protein },
          { key: 'carbs', label: 'Carboidratos', icon: Apple, color: 'text-blue-400', data: todayNutrition.carbs },
          { key: 'fat', label: 'Gordura', icon: Droplets, color: 'text-yellow-400', data: todayNutrition.fat },
          { key: 'water', label: 'Água (copos)', icon: Droplets, color: 'text-cyan-400', data: todayNutrition.water }
        ].map((macro, index) => (
          <motion.div
            key={macro.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <macro.icon className={`w-5 h-5 ${macro.color}`} />
                  <div className="text-sm text-navy-300">{macro.label}</div>
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${macro.color}`}>
                    {macro.data.consumed}
                  </div>
                  <div className="text-xs text-navy-400">
                    de {macro.data.target} {macro.key === 'water' ? 'copos' : 'cal'}
                  </div>
                  <Progress 
                    value={calculateProgress(macro.data.consumed, macro.data.target)} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => setIsLoggingMeal(true)}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar Refeição
        </Button>
        <Button 
          variant="outline"
          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
        >
          <Camera className="w-4 h-4 mr-2" />
          Foto da Refeição
        </Button>
        <Button 
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculadora Nutricional
        </Button>
      </div>

      {/* Meal Logging Modal */}
      {isLoggingMeal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/90 backdrop-blur-xl max-w-2xl w-full my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Registrar Refeição</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsLoggingMeal(false)}
                  className="text-navy-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-navy-300 text-sm">Tipo de Refeição</label>
                  <select
                    value={mealLog.meal_type}
                    onChange={(e) => setMealLog({ ...mealLog, meal_type: e.target.value })}
                    className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white mt-1"
                  >
                    {mealTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-navy-300 text-sm">Nome da Refeição</label>
                  <Input
                    value={mealLog.meal_name}
                    onChange={(e) => setMealLog({ ...mealLog, meal_name: e.target.value })}
                    className="bg-navy-800/50 border-navy-600/30 text-white mt-1"
                    placeholder="Ex: Café da manhã saudável"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Alimentos</h4>
                  <Button 
                    onClick={addFood}
                    size="sm"
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {mealLog.foods.map((food, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-navy-700/30 rounded-lg">
                      <Input
                        placeholder="Nome do alimento"
                        value={food.name}
                        onChange={(e) => updateFood(index, 'name', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm flex-1"
                      />
                      <Input
                        placeholder="Qtd"
                        value={food.quantity}
                        onChange={(e) => updateFood(index, 'quantity', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm w-20"
                      />
                      <Input
                        placeholder="Cal"
                        type="number"
                        value={food.calories}
                        onChange={(e) => updateFood(index, 'calories', e.target.value)}
                        className="bg-navy-800/50 border-navy-600/30 text-white text-sm w-20"
                      />
                      <Button
                        onClick={() => removeFood(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {mealLog.foods.length === 0 && (
                    <div className="text-center py-8 text-navy-400">
                      <Apple className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum alimento adicionado</p>
                      <p className="text-sm">Clique em "Adicionar" para começar</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-navy-700/30">
                <Button 
                  onClick={() => {
                    console.log('Registrando refeição:', mealLog);
                    setMealLog({
                      meal_type: 'breakfast',
                      meal_name: '',
                      foods: [],
                      notes: ''
                    });
                    setIsLoggingMeal(false);
                  }}
                  disabled={!mealLog.meal_name || mealLog.foods.length === 0}
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Registrar Refeição
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLoggingMeal(false)}
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
            { value: 'today', label: 'Hoje', icon: Clock },
            { value: 'history', label: 'Histórico', icon: TrendingUp },
            { value: 'plans', label: 'Planos', icon: Target }
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

        <TabsContent value="today" className="space-y-6 mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-green-400" />
              Refeições de Hoje
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentMeals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getMealTypeIcon(meal.meal_type)}</div>
                          <div>
                            <CardTitle className="text-white text-lg">{meal.meal_name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-green-500/20 text-green-400">
                                {getMealTypeLabel(meal.meal_type)}
                              </Badge>
                              <span className="text-navy-400 text-sm">{meal.meal_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-accent-orange font-bold text-lg">
                            {meal.total_calories} cal
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        {meal.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="flex items-center justify-between text-sm">
                            <span className="text-navy-300">
                              {food.name} ({food.quantity})
                            </span>
                            <span className="text-navy-400">{food.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add Meal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setIsLoggingMeal(true)}
              >
                <Card className="glass-card border-navy-600/20 bg-navy-800/30 backdrop-blur-xl border-dashed h-full flex items-center justify-center">
                  <CardContent className="text-center p-10">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium">Adicionar Refeição</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-8">
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-5 h-5" />
              <Input 
                placeholder="Buscar por alimentos ou refeições..." 
                className="pl-10 bg-navy-800/50 border-navy-600/30 text-white"
              />
            </div>
          </div>
          
          <div className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Histórico Nutricional</h3>
              <p className="text-navy-400 leading-relaxed">
                Visualização completa do histórico de refeições e padrões alimentares em desenvolvimento
              </p>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 mt-8">
          <div className="text-center py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Planos Nutricionais</h3>
              <p className="text-navy-400 leading-relaxed">
                Planos personalizados baseados em seus objetivos e preferências alimentares
              </p>
              <Button 
                className="mt-6 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Plano
              </Button>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
