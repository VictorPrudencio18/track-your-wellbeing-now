
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategorizedCheckins } from '@/hooks/useCategorizedCheckins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Scale, 
  Moon, 
  Sparkles,
  ChevronLeft, 
  ChevronRight,
  Target,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CategoryCheckinCard } from './CategoryCheckinCard';

const categoryConfig = {
  peso: {
    name: 'Peso & Nutrição',
    icon: Scale,
    color: 'from-green-500 to-green-600',
    description: 'Acompanhe seu peso e hábitos alimentares'
  },
  coracao: {
    name: 'Saúde Cardiovascular',
    icon: Heart,
    color: 'from-red-500 to-red-600',
    description: 'Monitore sua saúde do coração e energia'
  },
  sono: {
    name: 'Qualidade do Sono',
    icon: Moon,
    color: 'from-purple-500 to-purple-600',
    description: 'Avalie e melhore seu descanso'
  },
  mais: {
    name: 'Bem-estar Geral',
    icon: Sparkles,
    color: 'from-blue-500 to-blue-600',
    description: 'Humor, produtividade e gratidão'
  }
};

export function CategorizedCheckinsCarousel() {
  const { 
    unansweredByCategory, 
    categoryStats, 
    timeOfDay, 
    isLoading,
    respondToCheckin 
  } = useCategorizedCheckins();
  
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  
  const availableCategories = Object.keys(unansweredByCategory);
  const currentCategory = availableCategories[currentCategoryIndex];
  const currentPrompts = currentCategory ? unansweredByCategory[currentCategory] : [];
  const currentPrompt = currentPrompts[currentPromptIndex];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-navy-700/30 rounded-lg w-1/3"></div>
          <div className="h-48 bg-navy-700/30 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (availableCategories.length === 0) {
    return (
      <Card className="glass-card border-navy-600/30 bg-navy-800/50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Todos os check-ins concluídos! 🎉
          </h3>
          <p className="text-navy-400">
            Você completou todos os check-ins disponíveis para este período.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTimeGreeting = () => {
    switch (timeOfDay) {
      case 'morning': return 'Bom dia! Como você está se sentindo?';
      case 'afternoon': return 'Boa tarde! Como está seu dia?';
      case 'evening': return 'Boa noite! Como foi seu dia?';
      default: return 'Como você está se sentindo?';
    }
  };

  const nextCategory = () => {
    const nextIndex = (currentCategoryIndex + 1) % availableCategories.length;
    setCurrentCategoryIndex(nextIndex);
    setCurrentPromptIndex(0);
  };

  const previousCategory = () => {
    const prevIndex = currentCategoryIndex === 0 ? availableCategories.length - 1 : currentCategoryIndex - 1;
    setCurrentCategoryIndex(prevIndex);
    setCurrentPromptIndex(0);
  };

  const nextPrompt = () => {
    if (currentPromptIndex < currentPrompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      nextCategory();
    }
  };

  const handleResponse = async (value: any) => {
    if (!currentPrompt) return;

    try {
      await respondToCheckin.mutateAsync({
        promptKey: currentPrompt.prompt_key,
        value,
        category: currentPrompt.category
      });
      
      // Avançar para próxima pergunta automaticamente
      setTimeout(() => {
        nextPrompt();
      }, 500);
    } catch (error) {
      console.error('Error responding to checkin:', error);
    }
  };

  const currentConfig = currentCategory ? categoryConfig[currentCategory as keyof typeof categoryConfig] : null;
  const currentStats = categoryStats.find(s => s.category === currentCategory);

  return (
    <div className="space-y-6">
      {/* Header com saudação e horário */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-navy-400">
          <Clock className="w-4 h-4" />
          <span>{timeOfDay === 'morning' ? 'Manhã' : timeOfDay === 'afternoon' ? 'Tarde' : 'Noite'}</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          {getTimeGreeting()}
        </h2>
        <p className="text-navy-400">
          Vamos fazer um check-in rápido do seu bem-estar
        </p>
      </motion.div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const stats = categoryStats.find(s => s.category === key);
          const IconComponent = config.icon;
          
          return (
            <Card key={key} className="glass-card border-navy-600/30 bg-navy-800/30 hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} bg-opacity-20`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-navy-400 font-medium">
                    {config.name.split(' ')[0]}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-white">
                    {stats?.score.toFixed(0) || 0}%
                  </div>
                  <Progress 
                    value={stats?.completionRate || 0} 
                    className="h-1"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Carrossel principal */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentConfig && (
                <>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${currentConfig.color} shadow-lg`}>
                    <currentConfig.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {currentConfig.name}
                    </CardTitle>
                    <p className="text-navy-400 text-sm">
                      {currentConfig.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-navy-300 border-navy-600">
                {currentPromptIndex + 1} de {currentPrompts.length}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousCategory}
                  className="text-navy-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextCategory}
                  className="text-navy-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Indicador de progresso da categoria */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-navy-400">
              <span>Progresso da categoria</span>
              <span>{Math.round(((currentPromptIndex + 1) / currentPrompts.length) * 100)}%</span>
            </div>
            <Progress 
              value={((currentPromptIndex + 1) / currentPrompts.length) * 100} 
              className="h-2"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <AnimatePresence mode="wait">
            {currentPrompt && (
              <motion.div
                key={`${currentCategory}-${currentPromptIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryCheckinCard
                  prompt={currentPrompt}
                  onResponse={handleResponse}
                  isLoading={respondToCheckin.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Progresso geral */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent-orange" />
              <div>
                <div className="font-medium text-white">Progresso Geral</div>
                <div className="text-sm text-navy-400">
                  {categoryStats.reduce((sum, cat) => sum + cat.totalResponses, 0)} respostas hoje
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {Math.round(categoryStats.reduce((sum, cat) => sum + cat.completionRate, 0) / categoryStats.length)}%
              </div>
              <div className="text-xs text-navy-400">Completo</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
