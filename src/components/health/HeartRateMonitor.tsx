
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, TrendingUp, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";

export function HeartRateMonitor() {
  const { activities } = useHealth();

  // Simulated heart rate data for demonstration
  const heartRateData = [
    { time: '06:00', bpm: 65 },
    { time: '08:00', bpm: 72 },
    { time: '10:00', bpm: 68 },
    { time: '12:00', bpm: 75 },
    { time: '14:00', bpm: 145 }, // During workout
    { time: '16:00', bpm: 70 },
    { time: '18:00', bpm: 78 },
    { time: '20:00', bpm: 72 },
    { time: '22:00', bpm: 68 },
  ];

  const zones = [
    { name: 'Repouso', range: '50-70', color: '#3b82f6', percentage: 65 },
    { name: 'Queima de Gordura', range: '70-85', color: '#10b981', percentage: 20 },
    { name: 'Aeróbico', range: '85-95', color: '#f59e0b', percentage: 12 },
    { name: 'Anaeróbico', range: '95-100', color: '#ef4444', percentage: 3 },
  ];

  const avgHeartRate = activities
    .filter(activity => activity.heartRate)
    .reduce((sum, activity) => sum + (activity.heartRate?.avg || 0), 0) / 
    (activities.filter(activity => activity.heartRate).length || 1);

  const maxHeartRate = 220 - 30; // Assuming age 30
  const restingHeartRate = 65;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Repouso</p>
                <p className="text-2xl font-bold text-red-700">{restingHeartRate} bpm</p>
                <p className="text-xs text-green-600">Excelente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média Exercício</p>
                <p className="text-2xl font-bold text-blue-700">{Math.round(avgHeartRate)} bpm</p>
                <p className="text-xs text-blue-600">Zona Aeróbica</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Máximo</p>
                <p className="text-2xl font-bold text-orange-700">{maxHeartRate} bpm</p>
                <p className="text-xs text-gray-600">Teórico (idade)</p>
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
                <p className="text-sm text-gray-600">Variabilidade</p>
                <p className="text-2xl font-bold text-green-700">45 ms</p>
                <p className="text-xs text-green-600">Boa recuperação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequência Cardíaca - Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heartRateData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#ef4444" 
                    fill="url(#colorHeartRate)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zonas de Treino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {zones.map((zone, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{zone.name}</p>
                      <p className="text-xs text-gray-600">{zone.range}% FC Máx</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{zone.percentage}%</span>
                </div>
                <Progress value={zone.percentage} className="h-2" />
              </div>
            ))}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Dica:</strong> Para queima ótima de gordura, mantenha-se na zona de 70-85% da FC máxima por 30-45 minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
