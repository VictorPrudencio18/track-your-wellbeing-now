
import { Activity, Target, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MinimalStatsCard } from '@/components/ui/minimal-stats-card';
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
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-navy-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-navy-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <Alert className="glass-card border-accent-orange/20">
        <AlertCircle className="h-4 w-4 text-accent-orange" />
        <AlertDescription className="text-white">
          Faça login para ver suas estatísticas de atividades e pontuação.
        </AlertDescription>
      </Alert>
    );
  }

  if (activitiesError || scoresError) {
    return (
      <Alert className="glass-card border-red-500/20">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-white">
          Erro ao carregar estatísticas. Tente atualizar a página.
        </AlertDescription>
      </Alert>
    );
  }

  if (activitiesLoading || scoresLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-navy-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-navy-700 rounded w-1/2"></div>
            </div>
          </div>
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
      value: totalActivities,
      icon: Activity,
      delay: 0
    },
    {
      title: "Distância Total",
      value: `${totalDistance.toFixed(1)} km`,
      icon: Target,
      delay: 0.1
    },
    {
      title: "Calorias Queimadas",
      value: totalCalories.toLocaleString(),
      icon: Zap,
      delay: 0.2
    },
    {
      title: "Sequência Atual",
      value: `${currentStreak} dias`,
      icon: TrendingUp,
      delay: 0.3
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <MinimalStatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          delay={stat.delay}
        />
      ))}
    </div>
  );
}
