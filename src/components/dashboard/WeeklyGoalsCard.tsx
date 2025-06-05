
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGoals } from "@/hooks/useSupabaseGoals";
import { useActivities } from "@/hooks/useSupabaseActivities";
import { useAuth } from "@/hooks/useAuth";

export function WeeklyGoalsCard() {
  const { user, loading: authLoading } = useAuth();
  const { data: goals, isLoading: goalsLoading, error: goalsError } = useGoals();
  const { data: activities } = useActivities();

  const calculateGoalProgress = (goal: any) => {
    if (!activities) return 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentActivities = activities.filter(activity => 
      new Date(activity.completed_at) >= oneWeekAgo
    );
    
    switch (goal.goal_type) {
      case 'distance':
        const totalDistance = recentActivities.reduce((sum, activity) => 
          sum + (activity.distance || 0), 0
        );
        return Math.min(100, (totalDistance / (goal.target_value || 1)) * 100);
        
      case 'duration':
        const totalDuration = recentActivities.reduce((sum, activity) => 
          sum + (activity.duration / 60), 0
        ); // Convert seconds to minutes
        return Math.min(100, (totalDuration / (goal.target_value || 1)) * 100);
        
      case 'frequency':
        const activityCount = recentActivities.length;
        return Math.min(100, (activityCount / (goal.target_value || 1)) * 100);
        
      default:
        return Math.min(100, ((goal.current_value || 0) / (goal.target_value || 1)) * 100);
    }
  };

  const getGoalDisplayName = (goal: any) => {
    return goal.title || goal.description || 'Meta';
  };

  if (authLoading || goalsLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
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

  if (goalsError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Target className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Metas Semanais</h3>
            <p className="text-navy-400 text-sm">Erro ao carregar metas</p>
          </div>
        </div>
        <Alert className="glass-card border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Erro ao carregar metas. Tente atualizar a página.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const weeklyGoals = goals?.slice(0, 3) || [];
  const completedGoals = weeklyGoals.filter(goal => calculateGoalProgress(goal) >= 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="glass-card rounded-3xl p-6 hover-lift border border-navy-600/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
          <Target className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Metas Semanais</h3>
          <p className="text-navy-400 text-xs">
            {weeklyGoals.length > 0 
              ? `${completedGoals.length} de ${weeklyGoals.length} concluídas`
              : 'Nenhuma meta definida'
            }
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {weeklyGoals.length > 0 ? (
          weeklyGoals.map((goal, index) => {
            const progress = calculateGoalProgress(goal);
            const completed = progress >= 100;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + (index * 0.1) }}
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  completed 
                    ? 'bg-accent-orange/10 border-accent-orange/30' 
                    : 'bg-navy-800/30 border-navy-700/30 hover:border-navy-600/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {completed ? (
                      <CheckCircle className="w-4 h-4 text-accent-orange" />
                    ) : (
                      <Clock className="w-4 h-4 text-navy-400" />
                    )}
                    <span className={`font-medium text-sm ${completed ? 'text-white' : 'text-navy-300'}`}>
                      {getGoalDisplayName(goal)}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${completed ? 'text-accent-orange' : 'text-navy-400'}`}>
                    {Math.round(progress)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-navy-700/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      completed ? 'bg-accent-orange' : 'bg-navy-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 1.4 + (index * 0.1) }}
                  />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <Target className="w-10 h-10 text-navy-500 mx-auto mb-3" />
            <p className="text-navy-400 text-sm">
              Nenhuma meta definida ainda.
            </p>
            <p className="text-navy-500 text-xs mt-1">
              Defina suas metas para acompanhar seu progresso!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
