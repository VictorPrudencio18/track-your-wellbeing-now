
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWeeklyGoals } from "@/hooks/useWeeklyGoals";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function WeeklyGoalsCard() {
  const { user, loading: authLoading } = useAuth();
  const { goals, isLoading: goalsLoading } = useWeeklyGoals();
  const navigate = useNavigate();

  const currentWeekGoals = goals.filter(goal => {
    const now = new Date();
    const weekStart = new Date(goal.week_start_date);
    const weekEnd = new Date(goal.week_end_date);
    return now >= weekStart && now <= weekEnd;
  }).slice(0, 5);

  const completedGoals = currentWeekGoals.filter(goal => goal.is_completed);

  if (authLoading || goalsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20 h-full"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-navy-700/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20 h-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Target className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Metas Semanais</h3>
            <p className="text-navy-400 text-sm">Faça login para ver suas metas</p>
          </div>
        </div>
        <Alert className="glass-card border-accent-orange/20">
          <AlertCircle className="h-4 w-4 text-accent-orange" />
          <AlertDescription className="text-white">
            Faça login para ver suas metas semanais.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Target className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Metas Semanais</h3>
            <p className="text-navy-400 text-sm">
              {currentWeekGoals.length > 0 
                ? `${completedGoals.length} de ${currentWeekGoals.length} concluídas`
                : 'Nenhuma meta definida'
              }
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/dashboard')}
          size="sm"
          className="bg-accent-orange hover:bg-accent-orange/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Gerenciar
        </Button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {currentWeekGoals.length > 0 ? (
          currentWeekGoals.map((goal, index) => {
            const completed = goal.is_completed;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + (index * 0.1) }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  completed 
                    ? 'bg-accent-orange/10 border-accent-orange/30' 
                    : 'bg-navy-800/30 border-navy-700/30 hover:border-navy-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {completed ? (
                      <CheckCircle className="w-5 h-5 text-accent-orange" />
                    ) : (
                      <Clock className="w-5 h-5 text-navy-400" />
                    )}
                    <div className="flex-1">
                      <span className={`font-medium ${completed ? 'text-white' : 'text-navy-300'}`}>
                        {goal.title}
                      </span>
                      <div className="text-xs text-navy-400 mt-1">
                        {goal.current_value.toFixed(goal.goal_type === 'distance' ? 1 : 0)}/{goal.target_value.toFixed(goal.goal_type === 'distance' ? 1 : 0)} {goal.unit}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${completed ? 'text-accent-orange' : 'text-navy-400'}`}>
                    {Math.round(goal.completion_percentage)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <Progress 
                  value={goal.completion_percentage} 
                  className="h-2 bg-navy-700/50"
                />
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400 text-sm mb-3">
              Nenhuma meta definida para esta semana.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              size="sm"
              variant="outline"
              className="glass-card border-navy-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Meta
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
