
import { motion } from "framer-motion";
import { Activity, Clock, MapPin, Zap, AlertCircle, TrendingUp, Calendar, Award, Target, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActivities } from "@/hooks/useSupabaseActivities";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function SupabaseRecentActivitiesCard() {
  const { user, loading: authLoading } = useAuth();
  const { data: activities, isLoading, error } = useActivities();

  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="glass-card-ultra border-navy-600/30 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-navy-700/30 rounded-xl"></div>
              ))}
            </div>
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
        transition={{ duration: 0.6, delay: 1.2 }}
        className="glass-card-ultra border-navy-600/30 rounded-3xl relative overflow-hidden"
      >
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-blue-500/15 to-transparent rounded-full blur-2xl" />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Atividades Recentes</h3>
              <p className="text-navy-300 text-lg">Faça login para ver suas atividades</p>
            </div>
          </div>
          
          <Alert className="glass-card border-accent-orange/20 bg-accent-orange/10">
            <AlertCircle className="h-5 w-5 text-accent-orange" />
            <AlertDescription className="text-white text-lg">
              Faça login para ver suas atividades recentes e acompanhar seu progresso.
            </AlertDescription>
          </Alert>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="glass-card-ultra border-navy-600/30 rounded-3xl relative overflow-hidden"
      >
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-red-500/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Atividades Recentes</h3>
              <p className="text-navy-300 text-lg">Erro ao carregar atividades</p>
            </div>
          </div>
          
          <Alert className="glass-card border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-white text-lg">
              Erro ao carregar atividades. Tente atualizar a página.
            </AlertDescription>
          </Alert>
        </div>
      </motion.div>
    );
  }

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  const formatDistance = (distance: number | null) => {
    if (!distance) return null;
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

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'running':
        return 'from-red-500 to-red-600';
      case 'walking':
        return 'from-green-500 to-green-600';
      case 'cycling':
        return 'from-blue-500 to-blue-600';
      case 'swimming':
        return 'from-cyan-500 to-cyan-600';
      case 'gym':
        return 'from-purple-500 to-purple-600';
      case 'yoga':
        return 'from-pink-500 to-pink-600';
      case 'dance':
        return 'from-yellow-500 to-yellow-600';
      case 'hiking':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
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
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return `${Math.floor(diffDays / 7)} semanas atrás`;
  };

  const recentActivities = activities?.slice(0, 5) || [];
  const totalActivities = activities?.length || 0;
  const totalDuration = activities?.reduce((acc, act) => acc + act.duration, 0) || 0;
  const totalCalories = activities?.reduce((acc, act) => acc + (act.calories || 0), 0) || 0;
  const thisWeekActivities = activities?.filter(act => {
    const actDate = new Date(act.completed_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return actDate >= weekAgo;
  })?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="glass-card-ultra border-navy-600/30 rounded-3xl relative overflow-hidden"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-blue-500/15 to-transparent rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-xl" />
      
      <div className="relative z-10 p-8">
        {/* Header Premium */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Atividades Recentes
              </h3>
              <p className="text-navy-300 text-lg">
                {recentActivities.length > 0 
                  ? `Suas últimas ${recentActivities.length} atividades registradas`
                  : 'Nenhuma atividade registrada ainda'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-400/10 border-green-400/30 text-green-400 px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {thisWeekActivities} esta semana
            </Badge>
            <Badge variant="outline" className="bg-blue-400/10 border-blue-400/30 text-blue-400 px-3 py-1">
              <Award className="w-3 h-3 mr-1" />
              {totalActivities} total
            </Badge>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {totalActivities > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-navy-800/60 to-navy-700/60 backdrop-blur-sm p-4 rounded-2xl border border-navy-600/30">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-navy-300">Tempo Total</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}min
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-navy-800/60 to-navy-700/60 backdrop-blur-sm p-4 rounded-2xl border border-navy-600/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-navy-300">Calorias</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {totalCalories.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-navy-800/60 to-navy-700/60 backdrop-blur-sm p-4 rounded-2xl border border-navy-600/30">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-navy-300">Meta Semanal</span>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold text-white">
                  {thisWeekActivities}/5
                </div>
                <Progress value={(thisWeekActivities / 5) * 100} className="h-2 bg-navy-800/50" />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4 p-6 rounded-2xl bg-navy-800/30 border border-navy-700/30">
                    <div className="w-12 h-12 bg-navy-700 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-navy-700 rounded w-1/2"></div>
                      <div className="h-4 bg-navy-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const colorGradient = getActivityColor(activity.type);
                const distance = formatDistance(activity.distance);
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative overflow-hidden"
                  >
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-navy-800/60 to-navy-700/60 backdrop-blur-sm border border-navy-600/30 hover:border-navy-500/50 transition-all duration-300 cursor-pointer">
                      
                      {/* Activity Icon */}
                      <div className={`p-3 bg-gradient-to-r ${colorGradient} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <ActivityIcon className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Activity Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-white text-lg group-hover:text-accent-orange transition-colors">
                              {getActivityName(activity.type, activity.name)}
                            </h4>
                            <p className="text-navy-400 text-sm">
                              {getTimeAgo(activity.completed_at)}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-navy-500 group-hover:text-accent-orange group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        
                        {/* Metrics */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 bg-navy-800/40 px-3 py-1.5 rounded-lg">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-medium">
                              {formatDuration(activity.duration)}
                            </span>
                          </div>
                          
                          {distance && (
                            <div className="flex items-center gap-2 bg-navy-800/40 px-3 py-1.5 rounded-lg">
                              <MapPin className="w-4 h-4 text-green-400" />
                              <span className="text-white font-medium">{distance}</span>
                            </div>
                          )}
                          
                          {activity.calories && (
                            <div className="flex items-center gap-2 bg-navy-800/40 px-3 py-1.5 rounded-lg">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span className="text-white font-medium">{activity.calories} cal</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hover shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 -skew-x-12 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ 
                        x: '100%',
                        transition: { duration: 0.8 }
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center py-12"
            >
              <div className="relative">
                <div className="p-6 bg-gradient-to-br from-navy-800/60 to-navy-700/60 backdrop-blur-sm rounded-3xl border border-navy-600/30 inline-block">
                  <Activity className="w-16 h-16 text-navy-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    Nenhuma atividade ainda
                  </h4>
                  <p className="text-navy-400 text-lg mb-4">
                    Registre sua primeira atividade para começar!
                  </p>
                  <Badge variant="outline" className="bg-accent-orange/10 border-accent-orange/30 text-accent-orange px-4 py-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Comece hoje mesmo
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Subtle shimmer effect on card hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 -skew-x-12"
        whileHover={{ 
          opacity: 1,
          x: ['-100%', '100%'],
          transition: { duration: 0.8 }
        }}
      />
    </motion.div>
  );
}
