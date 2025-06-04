
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useHealth } from "@/contexts/HealthContext";
import { useState } from "react";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Activity } from "lucide-react";

export function InteractiveCharts() {
  const { getActivityTrends, activities } = useHealth();
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar' | 'pie'>('area');
  const trends = getActivityTrends();

  const chartData = trends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
    atividades: trend.activities,
    calorias: trend.calories,
  }));

  // Data for pie chart - activity types distribution
  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(activityTypes).map(([type, count]) => ({
    name: type === 'run' ? 'Corrida' : 
          type === 'walk' ? 'Caminhada' :
          type === 'cycle' ? 'Ciclismo' :
          type === 'yoga' ? 'Yoga' :
          type === 'swim' ? 'Natação' :
          type === 'gym' ? 'Academia' :
          type === 'dance' ? 'Dança' : 
          type === 'meditation' ? 'Meditação' : type,
    value: count,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="calorias" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="atividades" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="calorias" 
              stackId="1" 
              stroke="#3b82f6" 
              fill="url(#colorCalorias)" 
            />
            <Area 
              type="monotone" 
              dataKey="atividades" 
              stackId="1" 
              stroke="#10b981" 
              fill="url(#colorAtividades)" 
            />
            <defs>
              <linearGradient id="colorCalorias" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAtividades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }} 
            />
            <Legend />
            <Bar dataKey="calorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atividades" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Analytics Interativos
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={chartType === 'area' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('area')}
              className="flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              Área
            </Button>
            <Button 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('line')}
              className="flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              Linha
            </Button>
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('bar')}
              className="flex items-center gap-1"
            >
              <BarChart3 className="w-3 h-3" />
              Barras
            </Button>
            <Button 
              variant={chartType === 'pie' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('pie')}
              className="flex items-center gap-1"
            >
              <PieChartIcon className="w-3 h-3" />
              Pizza
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
