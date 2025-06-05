
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Heart, Zap, Mountain, Timer } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { GPSState } from '@/hooks/useGPS';
import { ActivityData } from '@/hooks/useActivityTracker';

interface LiveChartsProps {
  data: ActivityData;
  gpsState: GPSState;
  isActive: boolean;
}

interface ChartDataPoint {
  time: number;
  pace: number;
  speed: number;
  heartRate: number;
  elevation: number;
  distance: number;
}

export function LiveCharts({ data, gpsState, isActive }: LiveChartsProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activeChart, setActiveChart] = useState<'pace' | 'speed' | 'heartRate' | 'elevation'>('pace');

  useEffect(() => {
    if (isActive && data.duration > 0) {
      const newDataPoint: ChartDataPoint = {
        time: data.duration,
        pace: (data.pace || 0) / 60, // Converter para minutos por km
        speed: (data.currentSpeed || 0) * 3.6, // Converter para km/h
        heartRate: data.heartRate || 0,
        elevation: data.elevationGain || 0,
        distance: data.distance || 0
      };

      setChartData(prev => {
        const newData = [...prev, newDataPoint];
        // Manter apenas os últimos 300 pontos (5 minutos se atualizando a cada segundo)
        return newData.slice(-300);
      });
    }
  }, [data.duration, data.pace, data.currentSpeed, data.heartRate, data.elevationGain, isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (paceMinutes: number) => {
    if (typeof paceMinutes !== 'number' || isNaN(paceMinutes)) return '0:00';
    const minutes = Math.floor(paceMinutes);
    const seconds = Math.floor((paceMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const chartConfigs = {
    pace: {
      title: 'Pace (min/km)',
      icon: Timer,
      color: '#60a5fa',
      dataKey: 'pace',
      formatter: formatPace,
      target: 7, // 7 min/km como referência
    },
    speed: {
      title: 'Velocidade (km/h)',
      icon: Zap,
      color: '#a78bfa',
      dataKey: 'speed',
      formatter: (value: number) => `${(value || 0).toFixed(1)} km/h`,
      target: 8.5, // 8.5 km/h como referência
    },
    heartRate: {
      title: 'Frequência Cardíaca (bpm)',
      icon: Heart,
      color: '#f87171',
      dataKey: 'heartRate',
      formatter: (value: number) => `${Math.round(value || 0)} bpm`,
      target: 150, // 150 bpm como referência
    },
    elevation: {
      title: 'Elevação Acumulada (m)',
      icon: Mountain,
      color: '#34d399',
      dataKey: 'elevation',
      formatter: (value: number) => `${Math.round(value || 0)}m`,
      target: null,
    }
  };

  const currentConfig = chartConfigs[activeChart];

  // Safely get the current value with fallback
  const getCurrentValue = () => {
    const value = data[currentConfig.dataKey as keyof ActivityData] as number;
    return value || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Seletor de gráficos */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(chartConfigs).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <motion.button
              key={key}
              onClick={() => setActiveChart(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeChart === key
                  ? 'bg-accent-orange text-navy-900 font-medium'
                  : 'glass-card text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {config.title.split(' ')[0]}
            </motion.button>
          );
        })}
      </div>

      {/* Gráfico principal */}
      <PremiumCard glass className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <currentConfig.icon className="w-6 h-6" style={{ color: currentConfig.color }} />
            {currentConfig.title}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {currentConfig.formatter(getCurrentValue())}
            </div>
            <div className="text-sm text-navy-400">Atual</div>
          </div>
        </div>

        <div className="h-80">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="time"
                  tickFormatter={formatTime}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => currentConfig.formatter(value).split(' ')[0]}
                />
                {currentConfig.target && (
                  <ReferenceLine 
                    y={currentConfig.target} 
                    stroke="#f59e0b" 
                    strokeDasharray="5 5"
                    label={{ value: "Meta", position: "top", fill: "#f59e0b" }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey={currentConfig.dataKey}
                  stroke={currentConfig.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: currentConfig.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-navy-400">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aguardando dados para gerar o gráfico...</p>
                <p className="text-sm mt-2">Inicie a atividade para ver as métricas em tempo real</p>
              </div>
            </div>
          )}
        </div>
      </PremiumCard>

      {/* Estatísticas do gráfico */}
      <div className="grid grid-cols-2 gap-4">
        <PremiumCard glass className="p-4">
          <h4 className="text-sm font-medium text-white mb-3">Análise de Variabilidade</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-navy-400">Mínimo</span>
              <span className="text-sm text-white">
                {chartData.length > 0 
                  ? currentConfig.formatter(Math.min(...chartData.map(d => (d[currentConfig.dataKey as keyof ChartDataPoint] as number) || 0)))
                  : '--'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-navy-400">Máximo</span>
              <span className="text-sm text-white">
                {chartData.length > 0 
                  ? currentConfig.formatter(Math.max(...chartData.map(d => (d[currentConfig.dataKey as keyof ChartDataPoint] as number) || 0)))
                  : '--'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-navy-400">Média</span>
              <span className="text-sm text-white">
                {chartData.length > 0 
                  ? currentConfig.formatter(
                      chartData.reduce((sum, d) => sum + ((d[currentConfig.dataKey as keyof ChartDataPoint] as number) || 0), 0) / chartData.length
                    )
                  : '--'
                }
              </span>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard glass className="p-4">
          <h4 className="text-sm font-medium text-white mb-3">Tendência Recente</h4>
          <div className="space-y-2">
            {chartData.length >= 2 && (
              <>
                <div className="flex justify-between">
                  <span className="text-xs text-navy-400">Últimos 30s</span>
                  <span className="text-sm text-white">
                    {currentConfig.formatter(
                      chartData.slice(-30).reduce((sum, d) => sum + ((d[currentConfig.dataKey as keyof ChartDataPoint] as number) || 0), 0) / 
                      Math.min(30, chartData.length)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-navy-400">Últimos 60s</span>
                  <span className="text-sm text-white">
                    {currentConfig.formatter(
                      chartData.slice(-60).reduce((sum, d) => sum + ((d[currentConfig.dataKey as keyof ChartDataPoint] as number) || 0), 0) / 
                      Math.min(60, chartData.length)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-navy-400">Tendência</span>
                  <span className={`text-sm font-medium ${
                    chartData.length >= 10 &&
                    ((chartData[chartData.length - 1][currentConfig.dataKey as keyof ChartDataPoint] as number) || 0) > 
                    ((chartData[chartData.length - 10][currentConfig.dataKey as keyof ChartDataPoint] as number) || 0)
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {chartData.length >= 10 ? (
                      ((chartData[chartData.length - 1][currentConfig.dataKey as keyof ChartDataPoint] as number) || 0) > 
                      ((chartData[chartData.length - 10][currentConfig.dataKey as keyof ChartDataPoint] as number) || 0)
                        ? '↗ Subindo'
                        : '↘ Descendo'
                    ) : '--'}
                  </span>
                </div>
              </>
            )}
          </div>
        </PremiumCard>
      </div>

      {/* Mapa de calor de intensidade */}
      <PremiumCard glass className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-orange" />
          Mapa de Intensidade da Sessão
        </h3>
        <div className="h-32">
          {chartData.length > 10 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time"
                  tickFormatter={formatTime}
                  stroke="#94a3b8"
                  fontSize={10}
                />
                <YAxis hide />
                <Area
                  type="monotone"
                  dataKey={currentConfig.dataKey}
                  stroke={currentConfig.color}
                  fillOpacity={1}
                  fill="url(#intensityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-navy-400">
              <p className="text-sm">Acumulando dados para análise de intensidade...</p>
            </div>
          )}
        </div>
      </PremiumCard>
    </motion.div>
  );
}
