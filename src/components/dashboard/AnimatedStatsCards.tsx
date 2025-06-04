
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Target, Zap, TrendingUp, Heart, Award } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedNumber({ value, duration = 1000, suffix = "", prefix = "" }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

export function AnimatedStatsCards() {
  const { goals, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const stepsGoal = goals.find(g => g.type === 'steps');
  const distanceGoal = goals.find(g => g.type === 'distance');
  const workoutGoal = goals.find(g => g.type === 'workouts');

  const stats = [
    {
      title: "Passos Hoje",
      value: stepsGoal?.current || 0,
      target: stepsGoal?.target || 10000,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      suffix: "",
      progress: stepsGoal ? (stepsGoal.current / stepsGoal.target) * 100 : 0,
    },
    {
      title: "Meta Semanal",
      value: weeklyStats.totalDistance,
      target: distanceGoal?.target || 25,
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      suffix: " km",
      progress: distanceGoal ? (weeklyStats.totalDistance / distanceGoal.target) * 100 : 0,
    },
    {
      title: "Calorias Queimadas",
      value: weeklyStats.totalCalories,
      target: 3500,
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      suffix: "",
      progress: (weeklyStats.totalCalories / 3500) * 100,
    },
    {
      title: "Freq. Cardíaca",
      value: Math.round(weeklyStats.avgHeartRate),
      target: 150,
      icon: Heart,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      suffix: " bpm",
      progress: (Math.round(weeklyStats.avgHeartRate) / 150) * 100,
    },
    {
      title: "Treinos Completos",
      value: weeklyStats.totalWorkouts,
      target: workoutGoal?.target || 5,
      icon: Award,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      suffix: "",
      progress: workoutGoal ? (weeklyStats.totalWorkouts / workoutGoal.target) * 100 : 0,
    },
    {
      title: "Melhoria Semanal",
      value: 15,
      target: 20,
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      suffix: "%",
      progress: 75,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 group">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${stat.color} p-6 text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                  <p className="text-white/90 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold mb-1">
                    <AnimatedNumber 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={1500}
                    />
                  </p>
                  <p className="text-white/80 text-xs">
                    Meta: {stat.target.toLocaleString()}{stat.suffix}
                  </p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-full`}>
                  <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Progresso</span>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(stat.progress)}%
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={stat.progress} 
                  className="h-3" 
                />
                <div 
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r opacity-50 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(stat.progress, 100)}%`,
                    background: `linear-gradient(to right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">0</span>
                <span className="text-gray-500">{stat.target.toLocaleString()}{stat.suffix}</span>
              </div>

              {stat.progress >= 100 && (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Award className="w-3 h-3" />
                  Meta atingida! 🎉
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
