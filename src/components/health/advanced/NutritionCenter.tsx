
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNutrition } from '@/hooks/useNutrition';
import { 
  Apple, 
  Plus, 
  Target, 
  TrendingUp,
  Clock,
  Zap,
  Droplets,
  Camera,
  Search,
  Star,
  AlertCircle
} from 'lucide-react';

const mockFoodDatabase = [
  { name: 'Peito de Frango (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Arroz Integral (100g)', calories: 112, protein: 2.3, carbs: 22, fat: 0.9 },
  { name: 'Brócolis (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Banana Média', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Aveia (50g)', calories: 190, protein: 6.5, carbs: 32, fat: 3.5 },
];

const mealTypes = [
  { id: 'breakfast', label: 'Café da Manhã', icon: '🌅' },
  { id: 'lunch', label: 'Almoço', icon: '☀️' },
  { id: 'snack', label: 'Lanche', icon: '🍎' },
  { id: 'dinner', label: 'Jantar', icon: '🌙' },
];

export function NutritionCenter() {
  const { activePlan, todayMeals, dailyTotals, logMeal } = useNutrition();
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingFood, setIsAddingFood] = useState(false);

  const filteredFoods = mockFoodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMealsByType = (type: string) => {
    return todayMeals.filter(meal => meal.meal_type === type);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 80) return 'bg-red-500';
    if (percentage <= 120) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const calorieProgress = activePlan?.calorie_target 
    ? (dailyTotals.calories / activePlan.calorie_target) * 100 
    : 0;

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
            Centro de Nutrição
          </h2>
          <p className="text-navy-400">
            Monitore sua alimentação e atinja suas metas nutricionais
          </p>
        </div>
        
        <Button
          onClick={() => setIsAddingFood(true)}
          className="bg-accent-orange hover:bg-accent-orange/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Alimento
        </Button>
      </motion.div>

      {/* Resumo Diário */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-green-500/10 to-navy-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              Resumo Nutricional de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {dailyTotals.calories}
                </div>
                <div className="text-sm text-navy-400 mb-2">
                  / {activePlan?.calorie_target || 2000} kcal
                </div>
                <Progress 
                  value={Math.min(calorieProgress, 100)} 
                  className="h-2"
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {dailyTotals.protein}g
                </div>
                <div className="text-sm text-navy-400">Proteína</div>
                <div className="text-xs text-navy-500">
                  Meta: {activePlan?.macros_target?.protein || 120}g
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {dailyTotals.carbs}g
                </div>
                <div className="text-sm text-navy-400">Carboidratos</div>
                <div className="text-xs text-navy-500">
                  Meta: {activePlan?.macros_target?.carbs || 200}g
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {dailyTotals.fat}g
                </div>
                <div className="text-sm text-navy-400">Gorduras</div>
                <div className="text-xs text-navy-500">
                  Meta: {activePlan?.macros_target?.fat || 60}g
                </div>
              </div>
            </div>

            {/* Gráfico de Macros */}
            <div className="space-y-3">
              <div className="text-sm text-navy-300 font-medium">Distribuição de Macronutrientes</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400">Proteína</span>
                    <span className="text-white">
                      {Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-navy-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-400"
                      style={{ 
                        width: `${Math.min((dailyTotals.protein * 4 / dailyTotals.calories) * 100, 100) || 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-400">Carboidratos</span>
                    <span className="text-white">
                      {Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-navy-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-400"
                      style={{ 
                        width: `${Math.min((dailyTotals.carbs * 4 / dailyTotals.calories) * 100, 100) || 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-400">Gorduras</span>
                    <span className="text-white">
                      {Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100) || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-navy-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-yellow-400"
                      style={{ 
                        width: `${Math.min((dailyTotals.fat * 9 / dailyTotals.calories) * 100, 100) || 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Refeições do Dia */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Refeições de Hoje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mealTypes.map((mealType, index) => {
            const meals = getMealsByType(mealType.id);
            const totalCalories = meals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
            
            return (
              <motion.div
                key={mealType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <span className="text-2xl">{mealType.icon}</span>
                      {mealType.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-orange mb-1">
                        {totalCalories}
                      </div>
                      <div className="text-sm text-navy-400">calorias</div>
                    </div>
                    
                    {meals.length > 0 ? (
                      <div className="space-y-2">
                        {meals.slice(0, 2).map((meal, mealIndex) => (
                          <div key={mealIndex} className="text-xs text-navy-300 bg-navy-700/30 p-2 rounded">
                            {meal.meal_name || 'Refeição sem nome'}
                          </div>
                        ))}
                        {meals.length > 2 && (
                          <div className="text-xs text-navy-400 text-center">
                            +{meals.length - 2} mais
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-navy-500 text-sm mb-2">
                          Nenhuma refeição registrada
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full glass-card border-navy-600"
                      onClick={() => setSelectedMealType(mealType.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights Nutricionais */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Insights Nutricionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Energia Adequada',
              description: 'Você está consumindo a quantidade ideal de calorias para seus objetivos.',
              status: 'positive',
              color: 'text-green-400',
              bgColor: 'bg-green-400/10'
            },
            {
              icon: AlertCircle,
              title: 'Baixa Proteína',
              description: 'Considere adicionar mais fontes de proteína nas suas refeições.',
              status: 'warning',
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10'
            },
            {
              icon: Droplets,
              title: 'Hidratação',
              description: 'Mantenha o bom trabalho com a hidratação! Continue bebendo água.',
              status: 'positive',
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10'
            }
          ].map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${insight.bgColor}`}>
                      <insight.icon className={`w-6 h-6 ${insight.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">
                        {insight.title}
                      </h4>
                      <p className="text-navy-400 text-sm">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Estatísticas da Semana */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Estatísticas da Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              icon: Target, 
              label: 'Meta Calórica', 
              value: '89%', 
              subtitle: 'Média semanal',
              color: 'text-green-400',
              bgColor: 'bg-green-400/10'
            },
            { 
              icon: TrendingUp, 
              label: 'Consistência', 
              value: '6/7', 
              subtitle: 'Dias registrados',
              color: 'text-blue-400',
              bgColor: 'bg-blue-400/10'
            },
            { 
              icon: Star, 
              label: 'Melhor Dia', 
              value: 'Terça', 
              subtitle: '98% da meta',
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-400/10'
            },
            { 
              icon: Apple, 
              label: 'Refeições', 
              value: '23', 
              subtitle: 'Total da semana',
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

      {/* Modal de Adicionar Alimento */}
      {isAddingFood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddingFood(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card bg-navy-800 p-8 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Adicionar Alimento
            </h3>
            
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400 w-4 h-4" />
                <Input
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-card border-navy-600 bg-navy-700/50 pl-10"
                />
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredFoods.map((food, index) => (
                  <div 
                    key={index}
                    className="glass-card bg-navy-700/30 p-4 rounded-lg hover:bg-navy-700/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{food.name}</div>
                        <div className="text-sm text-navy-400">
                          {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • G: {food.fat}g
                        </div>
                      </div>
                      <Button size="sm" className="bg-accent-orange hover:bg-accent-orange/80">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingFood(false)}
                  className="flex-1 glass-card border-navy-600"
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Escanear Código
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
