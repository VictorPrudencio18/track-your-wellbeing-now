
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHealth } from '@/contexts/HealthContext';
import { TrendingUp, TrendingDown, Calendar, Target, Flame, Clock, Route } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Bar, Area, AreaChart } from 'recharts';

export function AdvancedMetricsComparison() {
  const { activities } = useHealth();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [comparisonType, setComparisonType] = useState<'period' | 'goals' | 'trends'>('period');

  const getDaysCount = () => {
    switch (timeframe) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };

  const getTimeframeData = (days: number) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    return activities.filter(activity => activity.date >= startDate && activity.date <= endDate);
  };

  const currentPeriodData = getTimeframeData(getDaysCount());
  const previousPeriodData = getTimeframeData(getDaysCount() * 2).slice(0, getDaysCount());

  const calculateMetrics = (data: typeof activities) => ({
    totalWorkouts: data.length,
    totalCalories: data.reduce((sum, a) => sum + a.calories, 0),
    totalDistance: data.reduce((sum, a) => sum + (a.distance || 0), 0),
    totalDuration: data.reduce((sum, a) => sum + a.duration, 0),
    avgCaloriesPerWorkout: data.length > 0 ? data.reduce((sum, a) => sum + a.calories, 0) / data.length : 0,
    avgDuration: data.length > 0 ? data.reduce((sum, a) => sum + a.duration, 0) / data.length : 0,
    avgHeartRate: data.length > 0 ? data.reduce((sum, a) => sum + (a.heartRate?.avg || 0), 0) / data.length : 0
  });

  const currentMetrics = calculateMetrics(currentPeriodData);
  const previousMetrics = calculateMetrics(previousPeriodData);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const metricsComparison = [
    {
      label: 'Workouts Totais',
      current: currentMetrics.totalWorkouts,
      previous: previousMetrics.totalWorkouts,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/10 to-blue-600/5'
    },
    {
      label: 'Calorias Queimadas',
      current: currentMetrics.totalCalories,
      previous: previousMetrics.totalCalories,
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'from-orange-500/10 to-orange-600/5'
    },
    {
      label: 'Distância Percorrida',
      current: currentMetrics.totalDistance,
      previous: previousMetrics.totalDistance,
      icon: Route,
      color: 'text-green-400',
      bgColor: 'from-green-500/10 to-green-600/5',
      unit: 'km'
    },
    {
      label: 'Tempo de Exercício',
      current: Math.round(currentMetrics.totalDuration / 60),
      previous: Math.round(previousMetrics.totalDuration / 60),
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/5',
      unit: 'h'
    }
  ];

  // Dados para o gráfico radar de performance
  const radarData = [
    {
      subject: 'Frequência',
      current: Math.min((currentMetrics.totalWorkouts / 20) * 100, 100),
      previous: Math.min((previousMetrics.totalWorkouts / 20) * 100, 100),
      fullMark: 100
    },
    {
      subject: 'Intensidade',
      current: Math.min((currentMetrics.avgCaloriesPerWorkout / 400) * 100, 100),
      previous: Math.min((previousMetrics.avgCaloriesPerWorkout / 400) * 100, 100),
      fullMark: 100
    },
    {
      subject: 'Duração',
      current: Math.min((currentMetrics.avgDuration / 60) * 100, 100),
      previous: Math.min((previousMetrics.avgDuration / 60) * 100, 100),
      fullMark: 100
    },
    {
      subject: 'Distância',
      current: Math.min((currentMetrics.totalDistance / 50) * 100, 100),
      previous: Math.min((previousMetrics.totalDistance / 50) * 100, 100),
      fullMark: 100
    },
    {
      subject: 'Consistência',
      current: Math.min((currentMetrics.totalWorkouts / getDaysCount()) * 100 * 7, 100),
      previous: Math.min((previousMetrics.totalWorkouts / getDaysCount()) * 100 * 7, 100),
      fullMark: 100
    }
  ];

  // Dados para tendência temporal
  const trendData = Array.from({ length: getDaysCount() }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (getDaysCount() - 1 - i));
    
    const dayActivities = currentPeriodData.filter(
      activity => activity.date.toDateString() === date.toDateString()
    );
    
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      calories: dayActivities.reduce((sum, a) => sum + a.calories, 0),
      workouts: dayActivities.length,
      duration: dayActivities.reduce((sum, a) => sum + a.duration, 0)
    };
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {[
              { key: '7d' as const, label: '7 Dias' },
              { key: '30d' as const, label: '30 Dias' },
              { key: '90d' as const, label: '90 Dias' }
            ].map(period => (
              <Button
                key={period.key}
                variant={timeframe === period.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(period.key)}
                className={timeframe === period.key ? 
                  'bg-accent-orange hover:bg-accent-orange/90' : 
                  'border-navy-600 text-navy-300 hover:bg-navy-700/50'
                }
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          {[
            { key: 'period' as const, label: 'Período' },
            { key: 'goals' as const, label: 'Metas' },
            { key: 'trends' as const, label: 'Tendências' }
          ].map(type => (
            <Button
              key={type.key}
              variant={comparisonType === type.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setComparisonType(type.key)}
              className={comparisonType === type.key ? 
                'bg-navy-600 hover:bg-navy-700' : 
                'border-navy-600 text-navy-300 hover:bg-navy-700/50'
              }
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsComparison.map((metric, index) => {
          const change = calculateChange(metric.current, metric.previous);
          const isPositive = change >= 0;
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`glass-card border-navy-600/20 bg-gradient-to-br ${metric.bgColor} hover-lift`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.bgColor}`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <Badge 
                      variant={isPositive ? 'default' : 'destructive'}
                      className={`${isPositive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(change).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-navy-400">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">
                      {typeof metric.current === 'number' ? metric.current.toFixed(metric.unit === 'km' ? 1 : 0) : metric.current}
                      {metric.unit && <span className="text-sm text-navy-400 ml-1">{metric.unit}</span>}
                    </p>
                    <p className="text-xs text-navy-500">
                      Anterior: {typeof metric.previous === 'number' ? metric.previous.toFixed(metric.unit === 'km' ? 1 : 0) : metric.previous}
                      {metric.unit && ` ${metric.unit}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="glass-card border-navy-600/20 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-orange" />
              Análise de Performance Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Radar 
                    name="Período Atual" 
                    dataKey="current" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Período Anterior" 
                    dataKey="previous" 
                    stroke="#6B7280" 
                    fill="#6B7280" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="glass-card border-navy-600/20 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-orange" />
              Tendência Temporal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar 
                    dataKey="workouts" 
                    fill="#3B82F6" 
                    name="Workouts"
                    radius={[2, 2, 0, 0]}
                    opacity={0.7}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Calorias"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
