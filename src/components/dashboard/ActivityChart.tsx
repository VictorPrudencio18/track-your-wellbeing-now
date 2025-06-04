
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useHealth } from "@/contexts/HealthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ActivityChart() {
  const { getActivityTrends } = useHealth();
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const trends = getActivityTrends();

  const chartData = trends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('pt-BR', { weekday: 'short' }),
    atividades: trend.activities,
    calorias: trend.calories,
  }));

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
            <Line type="monotone" dataKey="calorias" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
            <Line type="monotone" dataKey="atividades" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
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
            <Area type="monotone" dataKey="calorias" stackId="1" stroke="#3b82f6" fill="url(#colorCalorias)" />
            <Area type="monotone" dataKey="atividades" stackId="1" stroke="#10b981" fill="url(#colorAtividades)" />
            <defs>
              <linearGradient id="colorCalorias" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAtividades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
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
            <Bar dataKey="calorias" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atividades" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tendência de Atividades (7 dias)</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={chartType === 'area' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('area')}
            >
              Área
            </Button>
            <Button 
              variant={chartType === 'line' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('line')}
            >
              Linha
            </Button>
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setChartType('bar')}
            >
              Barra
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
