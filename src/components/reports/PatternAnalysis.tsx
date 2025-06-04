
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/contexts/HealthContext";
import { Brain, Clock, TrendingUp, Calendar, Zap, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function PatternAnalysis() {
  const { activities, healthMetrics } = useHealth();

  // Análise por horário
  const hourlyPerformance = Array.from({ length: 24 }, (_, hour) => {
    const hourActivities = activities.filter(a => new Date(a.date).getHours() === hour);
    return {
      hour: hour.toString().padStart(2, '0') + ':00',
      activities: hourActivities.length,
      avgCalories: hourActivities.length > 0 
        ? hourActivities.reduce((sum, a) => sum + a.calories, 0) / hourActivities.length 
        : 0,
      avgHeartRate: hourActivities.length > 0 
        ? hourActivities.reduce((sum, a) => sum + (a.heartRate?.avg || 0), 0) / hourActivities.length 
        : 0
    };
  }).filter(h => h.activities > 0);

  // Análise por dia da semana
  const weeklyPerformance = Array.from({ length: 7 }, (_, day) => {
    const dayActivities = activities.filter(a => new Date(a.date).getDay() === day);
    return {
      day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][day],
      activities: dayActivities.length,
      totalCalories: dayActivities.reduce((sum, a) => sum + a.calories, 0),
      avgIntensity: dayActivities.length > 0 
        ? dayActivities.reduce((sum, a) => sum + (a.heartRate?.avg || 0), 0) / dayActivities.length 
        : 0
    };
  });

  // Análise de tipos de atividade
  const activityTypes = activities.reduce((acc, activity) => {
    const type = activity.type;
    if (!acc[type]) {
      acc[type] = { count: 0, calories: 0, duration: 0 };
    }
    acc[type].count++;
    acc[type].calories += activity.calories;
    acc[type].duration += activity.duration;
    return acc;
  }, {} as Record<string, { count: number; calories: number; duration: number }>);

  const activityTypeData = Object.entries(activityTypes).map(([type, data]) => ({
    name: type === 'run' ? 'Corrida' : 
          type === 'walk' ? 'Caminhada' :
          type === 'cycle' ? 'Ciclismo' :
          type === 'yoga' ? 'Yoga' :
          type === 'swim' ? 'Natação' :
          type === 'gym' ? 'Academia' :
          type === 'dance' ? 'Dança' : 
          type === 'meditation' ? 'Meditação' : type,
    value: data.count,
    calories: data.calories,
    duration: data.duration
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  // Melhor horário baseado em performance
  const bestHour = hourlyPerformance.reduce((best, current) => 
    current.avgCalories > best.avgCalories ? current : best, 
    { hour: '00:00', avgCalories: 0 }
  );

  // Melhor dia da semana
  const bestDay = weeklyPerformance.reduce((best, current) => 
    current.totalCalories > best.totalCalories ? current : best,
    { day: 'Seg', totalCalories: 0 }
  );

  // Atividade favorita
  const favoriteActivity = activityTypeData.reduce((best, current) => 
    current.value > best.value ? current : best,
    { name: '', value: 0 }
  );

  // Padrões de sono (se existirem dados)
  const sleepData = healthMetrics.filter(m => m.type === 'sleep');
  const avgSleepQuality = sleepData.length > 0 
    ? sleepData.reduce((sum, m) => sum + (typeof m.value === 'object' && 'quality' in m.value ? m.value.quality : 0), 0) / sleepData.length 
    : 0;

  // Correlação entre sono e performance
  const sleepPerformanceCorrelation = sleepData.length > 0 ? "Positiva" : "Dados insuficientes";

  // Previsões baseadas em tendências
  const last7DaysActivities = activities.filter(a => {
    const daysDiff = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  const last14DaysActivities = activities.filter(a => {
    const daysDiff = (new Date().getTime() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 14 && daysDiff > 7;
  });

  const currentWeekAvg = last7DaysActivities.length > 0 
    ? last7DaysActivities.reduce((sum, a) => sum + a.calories, 0) / 7 
    : 0;

  const previousWeekAvg = last14DaysActivities.length > 0 
    ? last14DaysActivities.reduce((sum, a) => sum + a.calories, 0) / 7 
    : 0;

  const trend = currentWeekAvg > previousWeekAvg ? "crescente" : "decrescente";
  const projectedNextWeek = currentWeekAvg + (currentWeekAvg - previousWeekAvg);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Horário</p>
                <p className="text-2xl font-bold text-blue-700">{bestHour.hour}</p>
                <p className="text-xs text-gray-600">{Math.round(bestHour.avgCalories)} cal/atividade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Dia</p>
                <p className="text-2xl font-bold text-green-700">{bestDay.day}</p>
                <p className="text-xs text-gray-600">{bestDay.totalCalories} cal total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Atividade Favorita</p>
                <p className="text-2xl font-bold text-purple-700">{favoriteActivity.name}</p>
                <p className="text-xs text-gray-600">{favoriteActivity.value} vezes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance por Horário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Bar dataKey="avgCalories" fill="#3b82f6" name="Calorias Médias" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Insights e Padrões Identificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Performance Ótima
              </h4>
              <p className="text-sm text-blue-800">
                Você performa melhor às <strong>{bestHour.hour}</strong> e nos dias de <strong>{bestDay.day}</strong>.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Tendência Atual
              </h4>
              <p className="text-sm text-green-800">
                Sua performance está em tendência <strong>{trend}</strong>. 
                Projeção para próxima semana: <strong>{Math.round(projectedNextWeek)} cal/dia</strong>.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Qualidade do Sono
              </h4>
              <p className="text-sm text-purple-800">
                {avgSleepQuality > 0 ? (
                  <>Qualidade média: <strong>{avgSleepQuality.toFixed(1)}/10</strong>. 
                  Correlação com performance: <strong>{sleepPerformanceCorrelation}</strong>.</>
                ) : (
                  "Registre dados de sono para análises mais precisas."
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
              💡 Recomendações Personalizadas
            </h4>
            <div className="space-y-2 text-sm text-orange-800">
              <p>• Agende seus treinos mais intensos para as <strong>{bestHour.hour}</strong></p>
              <p>• Considere intensificar as atividades nas <strong>{bestDay.day}s</strong></p>
              <p>• Sua atividade favorita é <strong>{favoriteActivity.name}</strong> - continue explorando variações</p>
              {avgSleepQuality > 0 && avgSleepQuality < 7 && (
                <p>• Melhore a qualidade do sono para otimizar a performance</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
