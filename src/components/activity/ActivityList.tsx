
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseActivities } from '@/hooks/useSupabaseActivities';
import { Activity, Calendar } from 'lucide-react';

export function ActivityList() {
  const { data: activities, isLoading } = useSupabaseActivities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-navy-700/30 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent-orange" />
            Lista de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass-card border-navy-600/20 bg-navy-800/20 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{activity.name || activity.type}</h4>
                      <p className="text-navy-400 text-sm">
                        {activity.completed_at && new Date(activity.completed_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-accent-orange font-bold">
                        {activity.duration ? `${Math.round(activity.duration / 60)}min` : '-'}
                      </div>
                      {activity.distance && (
                        <div className="text-navy-400 text-sm">
                          {activity.distance.toFixed(1)}km
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-navy-500 mx-auto mb-4" />
              <p className="text-navy-400">Nenhuma atividade encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
