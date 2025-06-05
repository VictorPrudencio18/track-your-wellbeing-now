
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { useGoalRecommendations } from '@/hooks/useGoalRecommendations';
import { WeeklyGoalsOverview } from './WeeklyGoalsOverview';
import { GoalCreationWizard } from './GoalCreationWizard';
import { GoalRecommendations } from './GoalRecommendations';
import { WeeklyCalendarView } from './WeeklyCalendarView';
import { GoalAnalytics } from './GoalAnalytics';
import { Target, Calendar, TrendingUp, Lightbulb, Plus, Sparkles } from 'lucide-react';

export function WeeklyGoalsSystem() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const { goals, isLoading } = useWeeklyGoals();
  const { recommendations, generateRecommendations } = useGoalRecommendations();

  const activeGoals = goals.filter(goal => !goal.is_completed);
  const completedGoals = goals.filter(goal => goal.is_completed);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-navy-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-navy-700/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Sistema de Metas Semanais</h2>
          <p className="text-navy-400">Defina, acompanhe e conquiste suas metas fitness</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => generateRecommendations.mutate()}
            disabled={generateRecommendations.isPending}
            variant="outline"
            className="glass-card border-navy-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generateRecommendations.isPending ? 'Gerando...' : 'IA Sugestões'}
          </Button>
          
          <Button
            onClick={() => setShowCreationWizard(true)}
            className="bg-accent-orange hover:bg-accent-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Metas Ativas',
            value: activeGoals.length,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'from-blue-500/10 to-blue-600/5'
          },
          {
            label: 'Concluídas',
            value: completedGoals.length,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'from-green-500/10 to-green-600/5'
          },
          {
            label: 'Taxa de Sucesso',
            value: goals.length > 0 ? `${Math.round((completedGoals.length / goals.length) * 100)}%` : '0%',
            icon: Calendar,
            color: 'text-purple-400',
            bgColor: 'from-purple-500/10 to-purple-600/5'
          },
          {
            label: 'Recomendações',
            value: recommendations.length,
            icon: Lightbulb,
            color: 'text-orange-400',
            bgColor: 'from-orange-500/10 to-orange-600/5'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`glass-card border-navy-600/20 bg-gradient-to-br ${stat.bgColor} hover-lift`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-navy-300 border-navy-600">
                    {typeof stat.value === 'string' ? stat.value : stat.value}
                  </Badge>
                </div>
                <div className="text-sm text-navy-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="glass-card bg-navy-800/50 border-navy-600/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-orange">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-accent-orange">
            Calendário
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-accent-orange">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-accent-orange">
            Recomendações
            {recommendations.length > 0 && (
              <Badge className="ml-2 bg-accent-orange text-white">
                {recommendations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WeeklyGoalsOverview />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <WeeklyCalendarView />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <GoalAnalytics />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <GoalRecommendations />
        </TabsContent>
      </Tabs>

      {/* Goal Creation Wizard Modal */}
      {showCreationWizard && (
        <GoalCreationWizard onClose={() => setShowCreationWizard(false)} />
      )}
    </div>
  );
}
