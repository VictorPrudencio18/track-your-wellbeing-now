
import { motion } from "framer-motion";
import { Activity, Clock, MapPin, Zap } from "lucide-react";

export function RecentActivitiesCard() {
  const activities = [
    {
      type: "Corrida",
      duration: "32 min",
      distance: "5.2 km",
      calories: 420,
      time: "2h atrás",
      icon: Activity
    },
    {
      type: "Yoga",
      duration: "45 min", 
      distance: "-",
      calories: 180,
      time: "Ontem",
      icon: Clock
    },
    {
      type: "Caminhada",
      duration: "25 min",
      distance: "2.1 km", 
      calories: 150,
      time: "Ontem",
      icon: MapPin
    }
  ];

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
          <p className="text-navy-400 text-sm">Últimas sessões de treino</p>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.4 + (index * 0.1) }}
            className="flex items-center gap-4 p-4 rounded-xl bg-navy-800/30 border border-navy-700/30 hover:border-navy-600/50 transition-all duration-300"
          >
            <div className="p-2 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
              <activity.icon className="w-4 h-4 text-accent-orange" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white">{activity.type}</span>
                <span className="text-xs text-navy-400">{activity.time}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-navy-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.duration}
                </div>
                {activity.distance !== "-" && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activity.distance}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {activity.calories} cal
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
