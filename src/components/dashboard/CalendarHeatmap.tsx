
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Activity, Flame, TrendingUp } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { useState } from "react";

export function CalendarHeatmap() {
  const { activities, getActivityTrends } = useHealth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const trends = getActivityTrends();

  // Create heat map data for the last 30 days
  const heatmapData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayActivities = activities.filter(activity => 
      activity.date.toISOString().split('T')[0] === dateStr
    );
    
    const intensity = dayActivities.length > 0 ? Math.min(dayActivities.length * 25, 100) : 0;
    
    return {
      date,
      intensity,
      activities: dayActivities.length,
      calories: dayActivities.reduce((sum, a) => sum + a.calories, 0)
    };
  }).reverse();

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 25) return "bg-green-200";
    if (intensity < 50) return "bg-green-400";
    if (intensity < 75) return "bg-green-600";
    return "bg-green-800";
  };

  const selectedDateData = heatmapData.find(
    d => d.date.toDateString() === selectedDate?.toDateString()
  );

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Mapa de Atividades - Últimos 30 Dias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Intensidade de Atividades</h3>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.slice(-28).map((day, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-sm ${getIntensityColor(day.intensity)} cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all`}
                  title={`${day.date.toLocaleDateString('pt-BR')}: ${day.activities} atividades, ${day.calories} cal`}
                  onClick={() => setSelectedDate(day.date)}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
              </div>
              <span>Mais</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Detalhes do Dia Selecionado</h3>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                {selectedDate?.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
              {selectedDateData ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{selectedDateData.activities} atividades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{selectedDateData.calories} calorias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Intensidade: {selectedDateData.intensity}%</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nenhuma atividade registrada</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
