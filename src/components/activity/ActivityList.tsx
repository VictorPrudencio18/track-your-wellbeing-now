
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseActivities } from '@/hooks/useSupabaseActivities';
import { Activity, Calendar, Clock, TrendingUp } from 'lucide-react';

export function ActivityList() {
  const { activities, isLoading, error } = useSupabaseActivities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-navy-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-navy-800 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-red-500/20">
        <CardContent className="p-6 text-center">
          <div className="text-red-400 mb-2">Erro ao carregar atividades</div>
          <div className="text-sm text-navy-400">{error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-12 text-center">
          <Activity className="w-12 h-12 text-navy-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhuma atividade encontrada</h3>
          <p className="text-navy-400">Comece a registrar suas atividades para vê-las aqui.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent-orange" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-4 border border-navy-600/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent-orange/20 rounded-lg border border-accent-orange/30">
                    <Activity className="w-4 h-4 text-accent-orange" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{activity.activity_type}</h4>
                    <div className="flex items-center gap-4 text-sm text-navy-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration ? `${Math.round(activity.duration / 60)}min` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-accent-orange font-bold">
                    {activity.calories_burned || 0} cal
                  </div>
                  <div className="text-sm text-navy-400">
                    {activity.distance ? `${activity.distance.toFixed(1)} km` : ''}
                  </div>
                </div>
              </div>
              
              {activity.notes && (
                <div className="text-sm text-navy-300 bg-navy-800/30 p-3 rounded-lg">
                  {activity.notes}
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-3 text-xs text-navy-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Intensidade: {activity.intensity || 'Moderada'}
                </span>
                {activity.mood_after && (
                  <span>Humor pós-atividade: {activity.mood_after}/10</span>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
