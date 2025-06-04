
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useActivities } from '@/hooks/useSupabaseActivities';
import { useUserScores } from '@/hooks/useSupabaseScores';
import { useAuth } from '@/hooks/useAuth';

export function SupabaseStatsCards() {
  const { user, loading: authLoading } = useAuth();
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useActivities();
  const { data: userScores, isLoading: scoresLoading, error: scoresError } = useUserScores();

  if (authLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Faça login para ver suas estatísticas de atividades e pontuação.
        </AlertDescription>
      </Alert>
    );
  }

  if (activitiesError || scoresError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar estatísticas. Tente atualizar a página.
        </AlertDescription>
      </Alert>
    );
  }

  if (activitiesLoading || scoresLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalActivities = activities?.length || 0;
  const totalDistance = activities?.reduce((sum, activity) => sum + (activity.distance || 0), 0) || 0;
  const totalCalories = activities?.reduce((sum, activity) => sum + (activity.calories || 0), 0) || 0;
  const currentStreak = userScores?.current_streak || 0;

  const stats = [
    {
      title: "Total de Atividades",
      value: totalActivities.toString(),
      icon: Activity,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Distância Total",
      value: `${totalDistance.toFixed(1)} km`,
      icon: Target,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Calorias Queimadas",
      value: totalCalories.toLocaleString(),
      icon: Zap,
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Sequência Atual",
      value: `${currentStreak} dias`,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${stat.gradient} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-white/90" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
