
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWeeklyGoals, WeeklyGoal } from '@/hooks/useWeeklyGoals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { Target, Clock, CheckCircle, TrendingUp, Calendar, Flame, Dumbbell, Heart } from 'lucide-react';

export function WeeklyGoalsOverview() {
  const { goals, updateGoal } = useWeeklyGoals();
  const { progress } = useDailyProgress();

  const currentWeekGoals = goals.filter(goal => {
    const now = new Date();
    const weekStart = new Date(goal.week_start_date);
    const weekEnd = new Date(goal.week_end_date);
    return now >= weekStart && now <= weekEnd;
  });

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'endurance': return Target;
      case 'strength': return Dumbbell;
      case 'flexibility': return Heart;
      case 'weight_loss': return Flame;
      case 'muscle_gain': return Dumbbell;
      case 'wellness': return Heart;
      default: return Target;
    }
  };

  const getGoalColor = (type: string) => {
    switch (type) {
      case 'endurance': return 'text-blue-400';
      case 'strength': return 'text-purple-400';
      case 'flexibility': return 'text-green-400';
      case 'weight_loss': return 'text-orange-400';
      case 'muscle_gain': return 'text-red-400';
      case 'wellness': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 5: return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 4: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 3: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 2: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getDifficultyStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  };

  return (
    <div className="space-y-6">
      {/* Current Week Goals */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent-orange" />
          Metas da Semana Atual
        </h3>
        
        {currentWeekGoals.length === 0 ? (
          <Card className="glass-card border-navy-600/30 bg-navy-800/30">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-navy-500 mx-auto mb-4" />
              <p className="text-navy-400 mb-4">Nenhuma meta definida para esta semana</p>
              <p className="text-navy-500 text-sm">
                Defina suas metas semanais para acompanhar seu progresso!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentWeekGoals.map((goal, index) => {
              const Icon = getGoalIcon(goal.goal_type);
              const iconColor = getGoalColor(goal.goal_type);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/30 bg-navy-800/30 hover:bg-navy-800/50 transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r from-navy-700 to-navy-600`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
                            <p className="text-navy-400 text-sm">{goal.description}</p>
                          </div>
                        </div>
                        
                        {goal.is_completed && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          Prioridade {goal.priority}
                        </Badge>
                        <Badge variant="outline" className="text-navy-300 border-navy-600">
                          {getDifficultyStars(goal.difficulty_level)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-navy-400">Progresso</span>
                          <span className="text-white font-medium">
                            {Math.round(goal.completion_percentage)}%
                          </span>
                        </div>
                        <Progress 
                          value={goal.completion_percentage} 
                          className="h-2 bg-navy-700"
                        />
                      </div>
                      
                      {/* Values */}
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">
                            {goal.current_value.toFixed(1)}
                          </div>
                          <div className="text-xs text-navy-400">Atual</div>
                        </div>
                        <div className="text-navy-500">/</div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-accent-orange">
                            {goal.target_value.toFixed(1)}
                          </div>
                          <div className="text-xs text-navy-400">{goal.unit}</div>
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div className="text-xs text-navy-500 flex items-center justify-between">
                        <span>{new Date(goal.week_start_date).toLocaleDateString('pt-BR')}</span>
                        <span>→</span>
                        <span>{new Date(goal.week_end_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      {goal.is_completed && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-medium">
                              Meta Concluída!
                            </span>
                          </div>
                          {goal.completed_at && (
                            <div className="text-xs text-green-300 mt-1">
                              Finalizada em {new Date(goal.completed_at).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Goals */}
      {goals.length > currentWeekGoals.length && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-orange" />
            Histórico Recente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals
              .filter(goal => !currentWeekGoals.includes(goal))
              .slice(0, 8)
              .map((goal, index) => {
                const Icon = getGoalIcon(goal.goal_type);
                const iconColor = getGoalColor(goal.goal_type);
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="glass-card border-navy-600/20 bg-navy-800/20 hover:bg-navy-800/40 transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className={`w-4 h-4 ${iconColor}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">
                              {goal.title}
                            </div>
                            <div className="text-xs text-navy-400">
                              {new Date(goal.week_start_date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          {goal.is_completed && (
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Progress 
                            value={goal.completion_percentage} 
                            className="h-1.5"
                          />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-navy-400">
                              {Math.round(goal.completion_percentage)}%
                            </span>
                            <span className="text-navy-400">
                              {goal.current_value.toFixed(1)}/{goal.target_value.toFixed(1)} {goal.unit}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
