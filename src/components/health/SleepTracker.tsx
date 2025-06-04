
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Clock, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function SleepTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [bedTime, setBedTime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(8);

  const sleepData = healthMetrics
    .filter(metric => metric.type === 'sleep')
    .slice(0, 7)
    .map(metric => ({
      hours: typeof metric.value === 'object' ? (metric.value as any).hours : 7,
      quality: typeof metric.value === 'object' ? (metric.value as any).quality : 8,
      date: metric.date.toLocaleDateString('pt-BR', { weekday: 'short' })
    }));

  const avgSleep = sleepData.reduce((sum, data) => sum + data.hours, 0) / (sleepData.length || 1);
  const avgQuality = sleepData.reduce((sum, data) => sum + data.quality, 0) / (sleepData.length || 1);

  const sleepPhases = [
    { name: 'Sono Profundo', value: 32, color: '#1e40af' },
    { name: 'Sono Leve', value: 45, color: '#3b82f6' },
    { name: 'REM', value: 18, color: '#60a5fa' },
    { name: 'Acordado', value: 5, color: '#93c5fd' },
  ];

  const handleLogSleep = () => {
    const bedHour = parseInt(bedTime.split(':')[0]);
    const bedMin = parseInt(bedTime.split(':')[1]);
    const wakeHour = parseInt(wakeTime.split(':')[0]);
    const wakeMin = parseInt(wakeTime.split(':')[1]);
    
    let sleepHours = (wakeHour + (wakeMin / 60)) - (bedHour + (bedMin / 60));
    if (sleepHours < 0) sleepHours += 24; // Handle overnight sleep

    addHealthMetric({
      type: 'sleep',
      value: { hours: parseFloat(sleepHours.toFixed(1)), quality },
      date: new Date(),
      notes: `Dormiu às ${bedTime}, acordou às ${wakeTime}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-full">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média de Sono</p>
                <p className="text-2xl font-bold text-indigo-700">{avgSleep.toFixed(1)}h</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.5h vs semana passada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualidade</p>
                <p className="text-2xl font-bold text-blue-700">{avgQuality.toFixed(1)}/10</p>
                <Progress value={avgQuality * 10} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-full">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Eficiência</p>
                <p className="text-2xl font-bold text-amber-700">92%</p>
                <p className="text-xs text-gray-600">Tempo na cama</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Registrar Sono
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedTime">Hora de Dormir</Label>
                <Input
                  id="bedTime"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="wakeTime">Hora de Acordar</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="quality">Qualidade do Sono (1-10)</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="quality"
                  type="number"
                  min="1"
                  max="10"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-20"
                />
                <Progress value={quality * 10} className="flex-1" />
                <span className="text-sm font-medium">{quality}/10</span>
              </div>
            </div>
            <Button onClick={handleLogSleep} className="w-full">
              Registrar Sono
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fases do Sono</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sleepPhases}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sleepPhases.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {sleepPhases.map((phase, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: phase.color }}
                    />
                    <span className="text-sm">{phase.name}</span>
                  </div>
                  <span className="text-sm font-medium">{phase.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
