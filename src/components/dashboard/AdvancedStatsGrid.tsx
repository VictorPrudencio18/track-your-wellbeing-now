
import { Activity, MapPin, Clock, Zap, Heart, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHealth } from "@/contexts/HealthContext";

export function AdvancedStatsGrid() {
  const { goals, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const stepsGoal = goals.find(g => g.type === 'steps');
  const distanceGoal = goals.find(g => g.type === 'distance');
  const workoutGoal = goals.find(g => g.type === 'workouts');

  const stats = [
    {
      title: "Passos Hoje",
      value: stepsGoal?.current.toLocaleString() || "0",
      target: stepsGoal?.target.toLocaleString() || "10,000",
      progress: stepsGoal ? (stepsGoal.current / stepsGoal.target) * 100 : 0,
      icon: Activity,
      gradient: "from-blue-500 to-blue-600",
      change: "+12% vs ontem",
    },
    {
      title: "Distância Semanal",
      value: `${weeklyStats.totalDistance.toFixed(1)} km`,
      target: `${distanceGoal?.target || 25} km`,
      progress: distanceGoal ? (weeklyStats.totalDistance / distanceGoal.target) * 100 : 0,
      icon: MapPin,
      gradient: "from-green-500 to-green-600",
      change: "+8% vs semana passada",
    },
    {
      title: "Tempo Ativo",
      value: "4h 32m",
      target: "5h 00m",
      progress: 90,
      icon: Clock,
      gradient: "from-purple-500 to-purple-600",
      change: "+15min vs ontem",
    },
    {
      title: "Calorias Queimadas",
      value: weeklyStats.totalCalories.toLocaleString(),
      target: "3,500",
      progress: (weeklyStats.totalCalories / 3500) * 100,
      icon: Zap,
      gradient: "from-orange-500 to-orange-600",
      change: "+180 vs ontem",
    },
    {
      title: "Freq. Cardíaca Média",
      value: `${Math.round(weeklyStats.avgHeartRate)} bpm`,
      target: "140-160 bpm",
      progress: 75,
      icon: Heart,
      gradient: "from-red-500 to-red-600",
      change: "Zona aeróbica",
    },
    {
      title: "Treinos Semanais",
      value: `${weeklyStats.totalWorkouts}`,
      target: `${workoutGoal?.target || 5}`,
      progress: workoutGoal ? (weeklyStats.totalWorkouts / workoutGoal.target) * 100 : 0,
      icon: Target,
      gradient: "from-indigo-500 to-indigo-600",
      change: "No ritmo da meta",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${stat.gradient} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-white/90 text-xs mt-1">Meta: {stat.target}</p>
                </div>
                <stat.icon className="w-8 h-8 text-white/90" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-medium">{Math.round(stat.progress)}%</span>
              </div>
              <Progress value={stat.progress} className="h-2 mb-3" />
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
