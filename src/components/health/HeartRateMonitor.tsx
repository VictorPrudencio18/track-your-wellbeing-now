
import { Heart, Activity, TrendingUp, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHealth } from "@/contexts/HealthContext";
import { motion } from "framer-motion";
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';

export function HeartRateMonitor() {
  const { activities } = useHealth();

  const heartRateData = [
    { time: '06:00', bpm: 65 },
    { time: '08:00', bpm: 72 },
    { time: '10:00', bpm: 68 },
    { time: '12:00', bpm: 75 },
    { time: '14:00', bpm: 145 },
    { time: '16:00', bpm: 70 },
    { time: '18:00', bpm: 78 },
    { time: '20:00', bpm: 72 },
    { time: '22:00', bpm: 68 },
  ];

  const zones = [
    { name: 'Repouso', range: '50-70% FC Máx', color: '#3b82f6', percentage: 65 },
    { name: 'Queima de Gordura', range: '70-85% FC Máx', color: '#10b981', percentage: 20 },
    { name: 'Aeróbico', range: '85-95% FC Máx', color: '#f59e0b', percentage: 12 },
    { name: 'Anaeróbico', range: '95-100% FC Máx', color: '#ef4444', percentage: 3 },
  ];

  const avgHeartRate = activities
    .filter(activity => activity.heartRate)
    .reduce((sum, activity) => sum + (activity.heartRate?.avg || 0), 0) / 
    (activities.filter(activity => activity.heartRate).length || 1);

  const maxHeartRate = 220 - 30;
  const restingHeartRate = 65;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Monitor Cardíaco</h2>
        <p className="text-navy-400">Acompanhe sua frequência cardíaca e zonas de treino</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Repouso"
          value={restingHeartRate}
          unit="bpm"
          subtitle="Excelente"
          icon={Heart}
          color="text-red-400"
          delay={0}
        />
        
        <MetricCard
          title="Média Exercício"
          value={Math.round(avgHeartRate)}
          unit="bpm"
          subtitle="Zona Aeróbica"
          icon={Activity}
          color="text-blue-400"
          delay={0.1}
        />
        
        <MetricCard
          title="Máximo"
          value={maxHeartRate}
          unit="bpm"
          subtitle="Teórico (idade)"
          icon={Zap}
          color="text-orange-400"
          delay={0.2}
        />
        
        <MetricCard
          title="Variabilidade"
          value={45}
          unit="ms"
          subtitle="Boa recuperação"
          icon={TrendingUp}
          color="text-green-400"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Heart Rate Chart */}
        <ChartContainer 
          title="Frequência Cardíaca - Hoje" 
          subtitle="Monitoramento em tempo real"
          delay={0.4}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '12px',
                    color: '#f8fafc',
                    backdropFilter: 'blur(10px)'
                  }} 
                  labelStyle={{ color: '#f59e0b' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bpm" 
                  stroke="#ef4444" 
                  fill="url(#colorHeartRate)" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-400">Estado Atual</p>
                <p className="text-lg font-semibold text-white">72 bpm - Repouso</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </ChartContainer>

        {/* Training Zones */}
        <ChartContainer 
          title="Zonas de Treino" 
          subtitle="Distribuição do tempo por zona"
          delay={0.5}
        >
          <div className="space-y-6">
            {zones.map((zone, index) => (
              <motion.div 
                key={index} 
                className="space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <p className="font-medium text-sm text-white">{zone.name}</p>
                      <p className="text-xs text-navy-400">{zone.range}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white">{zone.percentage}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-navy-700/50 rounded-full h-3">
                    <motion.div
                      className="h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: zone.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">Dica de Treino</h4>
                <p className="text-xs text-navy-300 leading-relaxed">
                  Para queima ótima de gordura, mantenha-se na zona de 70-85% da FC máxima por 30-45 minutos.
                </p>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
