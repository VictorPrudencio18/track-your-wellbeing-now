
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Plus, Edit3, Trophy, TrendingUp } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";

export function GoalsProgressSection() {
  const { goals, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const getGoalProgress = (goal: any) => {
    switch (goal.type) {
      case 'steps':
        return (goal.current / goal.target) * 100;
      case 'distance':
        return (weeklyStats.totalDistance / goal.target) * 100;
      case 'workouts':
        return (weeklyStats.totalWorkouts / goal.target) * 100;
      default:
        return (goal.current / goal.target) * 100;
    }
  };

  const getGoalLabel = (type: string) => {
    switch (type) {
      case 'steps': return 'Passos Diários';
      case 'distance': return 'Distância Semanal';
      case 'workouts': return 'Treinos Semanais';
      case 'calories': return 'Calorias Semanais';
      case 'weight': return 'Meta de Peso';
      case 'sleep': return 'Horas de Sono';
      default: return type;
    }
  };

  const getGoalUnit = (type: string) => {
    switch (type) {
      case 'steps': return 'passos';
      case 'distance': return 'km';
      case 'workouts': return 'treinos';
      case 'calories': return 'cal';
      case 'weight': return 'kg';
      case 'sleep': return 'h';
      default: return '';
    }
  };

  const getGoalCurrent = (goal: any) => {
    switch (goal.type) {
      case 'distance':
        return weeklyStats.totalDistance;
      case 'workouts':
        return weeklyStats.totalWorkouts;
      default:
        return goal.current;
    }
  };

  const completedGoals = goals.filter(goal => getGoalProgress(goal) >= 100);
  const activeGoals = goals.filter(goal => getGoalProgress(goal) < 100);

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progresso das Metas
            </CardTitle>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Nova Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <div className="text-sm text-green-700">Metas Concluídas</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
              <div className="text-sm text-blue-700">Metas Ativas</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(goals.reduce((sum, goal) => sum + getGoalProgress(goal), 0) / goals.length)}%
              </div>
              <div className="text-sm text-purple-700">Progresso Médio</div>
            </div>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              const current = getGoalCurrent(goal);
              const isCompleted = progress >= 100;

              return (
                <div 
                  key={goal.id} 
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {isCompleted && <Trophy className="w-5 h-5 text-yellow-500" />}
                      <div>
                        <h3 className="font-medium text-gray-900">{getGoalLabel(goal.type)}</h3>
                        <p className="text-sm text-gray-600">
                          {current.toLocaleString()} / {goal.target.toLocaleString()} {getGoalUnit(goal.type)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${
                        isCompleted ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {Math.round(progress)}%
                      </span>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`}
                    />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-75" />
                    )}
                  </div>

                  {goal.period && (
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Período: {goal.period === 'daily' ? 'Diário' : goal.period === 'weekly' ? 'Semanal' : 'Mensal'}</span>
                      {!isCompleted && progress > 0 && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Faltam {(goal.target - current).toLocaleString()} {getGoalUnit(goal.type)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
