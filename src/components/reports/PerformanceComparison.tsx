
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/contexts/HealthContext";
import { TrendingUp, TrendingDown, Target, Trophy, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState } from "react";

export function PerformanceComparison() {
  const { activities } = useHealth();
  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month'>('week');

  const now = new Date();
  const periodDays = comparisonPeriod === 'week' ? 7 : 30;
  const currentPeriodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  const previousPeriodStart = new Date(currentPeriodStart.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const currentPeriodActivities = activities.filter(
    activity => activity.date >= currentPeriodStart && activity.date <= now
  );
  
  const previousPeriodActivities = activities.filter(
    activity => activity.date >= previousPeriodStart && activity.date < currentPeriodStart
  );

  const getStats = (activities: typeof currentPeriodActivities) => ({
    totalActivities: activities.length,
    totalCalories: activities.reduce((sum, a) => sum + a.calories, 0),
    totalDistance: activities.reduce((sum, a) => sum + (a.distance || 0), 0),
    avgDuration: activities.length > 0 ? activities.reduce((sum, a) => sum + a.duration, 0) / activities.length : 0,
    avgHeartRate: activities.length > 0 
      ? activities.reduce((sum, a) => sum + (a.heartRate?.avg || 0), 0) / activities.length 
      : 0
  });

  const currentStats = getStats(currentPeriodActivities);
  const previousStats = getStats(previousPeriodActivities);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const improvements = [
    {
      metric: 'Atividades',
      current: currentStats.totalActivities,
      previous: previousStats.totalActivities,
      unit: '',
      icon: Target
    },
    {
      metric: 'Calorias',
      current: currentStats.totalCalories,
      previous: previousStats.totalCalories,
      unit: 'cal',
      icon: Zap
    },
    {
      metric: 'Distância',
      current: currentStats.totalDistance,
      previous: previousStats.totalDistance,
      unit: 'km',
      icon: TrendingUp
    },
    {
      metric: 'Duração Média',
      current: Math.round(currentStats.avgDuration),
      previous: Math.round(previousStats.avgDuration),
      unit: 'min',
      icon: Trophy
    }
  ];

  // Personal Bests (PBs)
  const personalBests = {
    longestRun: activities
      .filter(a => a.type === 'run')
      .sort((a, b) => (b.distance || 0) - (a.distance || 0))[0],
    mostCalories: activities
      .sort((a, b) => b.calories - a.calories)[0],
    longestDuration: activities
      .sort((a, b) => b.duration - a.duration)[0]
  };

  const comparisonData = Array.from({ length: periodDays }, (_, i) => {
    const date = new Date(currentPeriodStart.getTime() + i * 24 * 60 * 60 * 1000);
    const currentDayActivities = currentPeriodActivities.filter(
      a => a.date.toDateString() === date.toDateString()
    );
    
    const prevDate = new Date(previousPeriodStart.getTime() + i * 24 * 60 * 60 * 1000);
    const previousDayActivities = previousPeriodActivities.filter(
      a => a.date.toDateString() === prevDate.toDateString()
    );

    return {
      day: i + 1,
      current: currentDayActivities.reduce((sum, a) => sum + a.calories, 0),
      previous: previousDayActivities.reduce((sum, a) => sum + a.calories, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Comparação de Performance</h2>
        <div className="flex gap-2">
          <Button
            variant={comparisonPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setComparisonPeriod('week')}
          >
            Semanal
          </Button>
          <Button
            variant={comparisonPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setComparisonPeriod('month')}
          >
            Mensal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {improvements.map((item, index) => {
          const change = calculateChange(item.current, item.previous);
          const isImproved = change > 0;
          const Icon = item.icon;

          return (
            <Card key={index} className={`${isImproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isImproved ? 'text-green-600' : 'text-red-600'}`} />
                  <Badge variant={isImproved ? 'default' : 'destructive'} className="text-xs">
                    {isImproved ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(change).toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{item.metric}</p>
                <p className="text-lg font-bold">
                  {item.current.toFixed(1)} {item.unit}
                </p>
                <p className="text-xs text-gray-500">
                  Anterior: {item.previous.toFixed(1)} {item.unit}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparação Diária - Calorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                  }} 
                />
                <Bar dataKey="previous" fill="#ef4444" name="Período Anterior" radius={[2, 2, 0, 0]} />
                <Bar dataKey="current" fill="#22c55e" name="Período Atual" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Recordes Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalBests.longestRun && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">🏃 Maior Distância</h4>
                <p className="text-2xl font-bold text-blue-700">{personalBests.longestRun.distance?.toFixed(1)} km</p>
                <p className="text-sm text-blue-600">{personalBests.longestRun.name}</p>
                <p className="text-xs text-gray-600">{personalBests.longestRun.date.toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            
            {personalBests.mostCalories && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">🔥 Mais Calorias</h4>
                <p className="text-2xl font-bold text-orange-700">{personalBests.mostCalories.calories} cal</p>
                <p className="text-sm text-orange-600">{personalBests.mostCalories.name}</p>
                <p className="text-xs text-gray-600">{personalBests.mostCalories.date.toLocaleDateString('pt-BR')}</p>
              </div>
            )}
            
            {personalBests.longestDuration && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">⏱️ Maior Duração</h4>
                <p className="text-2xl font-bold text-purple-700">{Math.floor(personalBests.longestDuration.duration / 60)}h {personalBests.longestDuration.duration % 60}min</p>
                <p className="text-sm text-purple-600">{personalBests.longestDuration.name}</p>
                <p className="text-xs text-gray-600">{personalBests.longestDuration.date.toLocaleDateString('pt-BR')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
