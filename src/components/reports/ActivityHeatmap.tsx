
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealth } from "@/contexts/HealthContext";
import { Calendar, Clock, TrendingUp, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";

export function ActivityHeatmap() {
  const { activities } = useHealth();

  // Create heatmap data for hours of the day (0-23) and days of the week (0-6)
  const heatmapData = Array.from({ length: 7 }, (_, dayIndex) => {
    return Array.from({ length: 24 }, (_, hourIndex) => {
      const activitiesInSlot = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getDay() === dayIndex && activityDate.getHours() === hourIndex;
      });
      
      return {
        day: dayIndex,
        hour: hourIndex,
        count: activitiesInSlot.length,
        calories: activitiesInSlot.reduce((sum, a) => sum + a.calories, 0),
        intensity: Math.min(activitiesInSlot.length * 20, 100)
      };
    });
  });

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-navy-800/30";
    if (intensity < 20) return "bg-blue-500/20";
    if (intensity < 40) return "bg-blue-500/40";
    if (intensity < 60) return "bg-blue-500/60";
    if (intensity < 80) return "bg-blue-500/80";
    return "bg-blue-500";
  };

  const bestPerformanceHour = heatmapData
    .flat()
    .reduce((best, current) => current.calories > best.calories ? current : best, { hour: 0, calories: 0 });

  const mostActiveDay = heatmapData
    .map((dayData, dayIndex) => ({
      day: dayIndex,
      totalActivities: dayData.reduce((sum, slot) => sum + slot.count, 0)
    }))
    .reduce((best, current) => current.totalActivities > best.totalActivities ? current : best);

  const totalActivities = heatmapData.flat().reduce((sum, slot) => sum + slot.count, 0);
  const avgDailyActivities = totalActivities / 7;

  return (
    <div className="space-y-6">
      {/* Main Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card border-navy-600/20 bg-navy-800/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Mapa de Calor - Atividades por Horário</CardTitle>
                  <p className="text-sm text-navy-400 mt-1">Padrões de exercício da última semana</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{totalActivities}</p>
                <p className="text-sm text-navy-400">Total de atividades</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-25 gap-1 text-xs overflow-x-auto">
                <div></div>
                {hours.map(hour => (
                  <div key={hour} className="text-center text-navy-400 font-medium min-w-[20px]">
                    {hour.toString().padStart(2, '0')}
                  </div>
                ))}
                
                {heatmapData.map((dayData, dayIndex) => (
                  <React.Fragment key={dayIndex}>
                    <div className="text-right pr-2 text-navy-300 font-medium flex items-center justify-end min-w-[40px]">
                      {dayNames[dayIndex]}
                    </div>
                    {dayData.map((slot, hourIndex) => (
                      <motion.div
                        key={`${dayIndex}-${hourIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, delay: (dayIndex * 24 + hourIndex) * 0.001 }}
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-sm ${getIntensityColor(slot.intensity)} cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all duration-200 hover:scale-110`}
                        title={`${dayNames[dayIndex]} ${hourIndex}:00 - ${slot.count} atividades, ${slot.calories} cal`}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-navy-400 pt-4 border-t border-navy-600/20">
                <span>Menos ativo</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-navy-800/30 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/20 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/40 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/60 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/80 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                </div>
                <span>Mais ativo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-600/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-400 mb-1">Melhor Horário</p>
                  <p className="text-2xl font-bold text-white">
                    {bestPerformanceHour.hour.toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-xs text-blue-400">{bestPerformanceHour.calories} cal em média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-600/20 bg-gradient-to-br from-green-500/10 to-green-600/5 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-400 mb-1">Dia Mais Ativo</p>
                  <p className="text-2xl font-bold text-white">
                    {dayNames[mostActiveDay.day]}
                  </p>
                  <p className="text-xs text-green-400">{mostActiveDay.totalActivities} atividades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-card border-navy-600/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-400 mb-1">Média Diária</p>
                  <p className="text-2xl font-bold text-white">
                    {avgDailyActivities.toFixed(1)}
                  </p>
                  <p className="text-xs text-orange-400">atividades por dia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
