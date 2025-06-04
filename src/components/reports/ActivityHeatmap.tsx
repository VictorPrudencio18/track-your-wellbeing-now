
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealth } from "@/contexts/HealthContext";
import { Calendar, Clock, TrendingUp } from "lucide-react";

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
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 20) return "bg-blue-200";
    if (intensity < 40) return "bg-blue-400";
    if (intensity < 60) return "bg-blue-600";
    if (intensity < 80) return "bg-blue-700";
    return "bg-blue-900";
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Mapa de Calor - Atividades por Horário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-25 gap-1 text-xs">
              <div></div>
              {hours.map(hour => (
                <div key={hour} className="text-center text-gray-500 font-medium">
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
              
              {heatmapData.map((dayData, dayIndex) => (
                <React.Fragment key={dayIndex}>
                  <div className="text-right pr-2 text-gray-600 font-medium flex items-center">
                    {dayNames[dayIndex]}
                  </div>
                  {dayData.map((slot, hourIndex) => (
                    <div
                      key={`${dayIndex}-${hourIndex}`}
                      className={`w-6 h-6 rounded-sm ${getIntensityColor(slot.intensity)} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}
                      title={`${dayNames[dayIndex]} ${hourIndex}:00 - ${slot.count} atividades, ${slot.calories} cal`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Menos ativo</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-900 rounded-sm"></div>
              </div>
              <span>Mais ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Horário</p>
                <p className="text-2xl font-bold text-blue-700">
                  {bestPerformanceHour.hour.toString().padStart(2, '0')}:00
                </p>
                <p className="text-xs text-gray-600">{bestPerformanceHour.calories} cal em média</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Dia Mais Ativo</p>
                <p className="text-2xl font-bold text-green-700">
                  {dayNames[mostActiveDay.day]}
                </p>
                <p className="text-xs text-gray-600">{mostActiveDay.totalActivities} atividades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
