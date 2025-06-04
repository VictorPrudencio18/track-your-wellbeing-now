
import { motion } from "framer-motion";
import { Activity, Clock, MapPin, Zap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActivities } from "@/hooks/useSupabaseActivities";
import { useAuth } from "@/hooks/useAuth";

export function SupabaseRecentActivitiesCard() {
  const { user, loading: authLoading } = useAuth();
  const { data: activities, isLoading, error } = useActivities();

  if (authLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-navy-700/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Activity className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Atividades Recentes</h3>
            <p className="text-navy-400 text-sm">Faça login para ver suas atividades</p>
          </div>
        </div>
        <Alert className="glass-card border-accent-orange/20">
          <AlertCircle className="h-4 w-4 text-accent-orange" />
          <AlertDescription className="text-white">
            Faça login para ver suas atividades recentes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Activity className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Atividades Recentes</h3>
            <p className="text-navy-400 text-sm">Erro ao carregar atividades</p>
          </div>
        </div>
        <Alert className="glass-card border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Erro ao carregar atividades. Tente atualizar a página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    return `${minutes} min`;
  };

  const formatDistance = (distance: number | null) => {
    if (!distance) return "-";
    return `${distance.toFixed(1)} km`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'running':
        return Activity;
      case 'walking':
        return MapPin;
      case 'cycling':
        return Activity;
      default:
        return Activity;
    }
  };

  const getActivityName = (type: string, name?: string) => {
    if (name) return name;
    
    switch (type) {
      case 'running':
        return 'Corrida';
      case 'walking':
        return 'Caminhada';
      case 'cycling':
        return 'Ciclismo';
      case 'swimming':
        return 'Natação';
      case 'gym':
        return 'Academia';
      case 'yoga':
        return 'Yoga';
      case 'dance':
        return 'Dança';
      case 'hiking':
        return 'Trilha';
      default:
        return 'Atividade';
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Agora mesmo';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    return `${diffDays} dias atrás`;
  };

  const recentActivities = activities?.slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
          <Activity className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Atividades Recentes</h3>
          <p className="text-navy-400 text-sm">
            {recentActivities.length > 0 
              ? `${recentActivities.length} atividades recentes`
              : 'Nenhuma atividade registrada'
            }
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/30">
                <div className="w-10 h-10 bg-navy-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-navy-700 rounded w-1/2"></div>
                  <div className="h-3 bg-navy-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.4 + (index * 0.1) }}
                className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/30 border border-navy-700/30 hover:border-navy-600/50 transition-all duration-300"
              >
                <div className="p-2 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                  <ActivityIcon className="w-4 h-4 text-accent-orange" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">
                      {getActivityName(activity.type, activity.name)}
                    </span>
                    <span className="text-xs text-navy-400">
                      {getTimeAgo(activity.completed_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-navy-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(activity.duration)}
                    </div>
                    {activity.distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {formatDistance(activity.distance)}
                      </div>
                    )}
                    {activity.calories && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {activity.calories} cal
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <p className="text-navy-400 text-sm">
              Nenhuma atividade registrada ainda.
            </p>
            <p className="text-navy-500 text-xs mt-2">
              Registre sua primeira atividade para começar!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
