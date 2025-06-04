
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealth } from "@/contexts/HealthContext";
import { Calendar, Clock, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

export function ActivityHeatmap() {
  const { activities } = useHealth();

  // Create heatmap data for the last 7 days and 24 hours
  const generateHeatmapData = () => {
    const today = new Date();
    const data = [];

    // Generate data for the last 7 days
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - dayOffset);
      
      const dayData = {
        date: currentDate,
        dayName: currentDate.toLocaleDateString('pt-BR', { weekday: 'short' }),
        hours: []
      };

      // Generate data for each hour of the day
      for (let hour = 0; hour < 24; hour++) {
        const activitiesInHour = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return (
            activityDate.toDateString() === currentDate.toDateString() &&
            activityDate.getHours() === hour
          );
        });

        const totalCalories = activitiesInHour.reduce((sum, a) => sum + a.calories, 0);
        const intensity = Math.min(activitiesInHour.length * 25, 100);

        dayData.hours.push({
          hour,
          count: activitiesInHour.length,
          calories: totalCalories,
          intensity
        });
      }

      data.push(dayData);
    }

    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-navy-800/40 border-navy-700/20";
    if (intensity < 25) return "bg-blue-500/30 border-blue-400/30";
    if (intensity < 50) return "bg-blue-500/50 border-blue-400/50";
    if (intensity < 75) return "bg-blue-500/70 border-blue-400/70";
    return "bg-blue-500 border-blue-400";
  };

  // Calculate insights
  const bestPerformanceData = heatmapData
    .flatMap(day => day.hours.map(hour => ({ ...hour, day: day.dayName })))
    .reduce((best, current) => current.calories > best.calories ? current : best, { hour: 0, calories: 0, day: '' });

  const mostActiveDay = heatmapData
    .map(day => ({
      name: day.dayName,
      totalActivities: day.hours.reduce((sum, hour) => sum + hour.count, 0)
    }))
    .reduce((best, current) => current.totalActivities > best.totalActivities ? current : best, { name: '', totalActivities: 0 });

  const totalActivities = heatmapData.reduce((sum, day) => 
    sum + day.hours.reduce((daySum, hour) => daySum + hour.count, 0), 0
  );

  const avgDailyActivities = totalActivities / 7;

  // Generate hour labels (show every 4 hours for better readability)
  const hourLabels = Array.from({ length: 6 }, (_, i) => i * 4);

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
                  <p className="text-sm text-navy-400 mt-1">Padrões de exercício dos últimos 7 dias</p>
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
              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Hour labels */}
                  <div className="flex mb-2">
                    <div className="w-16"></div>
                    {hourLabels.map(hour => (
                      <div 
                        key={hour} 
                        className="flex-1 text-center text-xs text-navy-400 font-medium"
                        style={{ marginLeft: hour === 0 ? '0' : '0' }}
                      >
                        {hour.toString().padStart(2, '0')}h
                      </div>
                    ))}
                  </div>
                  
                  {/* Days and activity cells */}
                  {heatmapData.map((dayData, dayIndex) => (
                    <div key={dayIndex} className="flex items-center mb-2">
                      <div className="w-16 text-right pr-3 text-sm text-navy-300 font-medium">
                        {dayData.dayName}
                      </div>
                      <div className="flex-1 flex gap-1">
                        {dayData.hours.map((hourData, hourIndex) => (
                          <motion.div
                            key={`${dayIndex}-${hourIndex}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              duration: 0.2, 
                              delay: (dayIndex * 24 + hourIndex) * 0.002 
                            }}
                            className={`flex-1 h-8 rounded-sm border cursor-pointer transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-400/50 ${getIntensityColor(hourData.intensity)}`}
                            title={`${dayData.dayName} ${hourData.hour}:00 - ${hourData.count} atividades, ${hourData.calories} cal`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-navy-400 pt-4 border-t border-navy-600/20">
                <span>Menos ativo</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-navy-800/40 border border-navy-700/20 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/30 border border-blue-400/30 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/50 border border-blue-400/50 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500/70 border border-blue-400/70 rounded-sm"></div>
                  <div className="w-3 h-3 bg-blue-500 border border-blue-400 rounded-sm"></div>
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
                    {bestPerformanceData.hour.toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-xs text-blue-400">{bestPerformanceData.calories} cal</p>
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
                    {mostActiveDay.name}
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
