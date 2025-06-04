
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, TrendingUp, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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
    { name: 'Repouso', range: '50-70% FC Máx', color: '#3b82f6', percentage: 65 },
    { name: 'Queima de Gordura', range: '70-85% FC Máx', color: '#10b981', percentage: 20 },
    { name: 'Aeróbico', range: '85-95% FC Máx', color: '#f59e0b', percentage: 12 },
    { name: 'Anaeróbico', range: '95-100% FC Máx', color: '#ef4444', percentage: 3 },
  ];

  const avgHeartRate = activities
    .filter(activity => activity.heartRate)
    .reduce((sum, activity) => sum + (activity.heartRate?.avg || 0), 0) / 
    (activities.filter(activity => activity.heartRate).length || 1);

  const maxHeartRate = 220 - 30; // Assuming age 30
  const restingHeartRate = 65;

  const metricsCards = [
    {
      title: "Repouso",
      value: restingHeartRate,
      unit: "bpm",
      status: "Excelente",
      icon: Heart,
      color: "from-red-400 to-red-500",
      bgGradient: "from-red-50 to-pink-50"
    },
    {
      title: "Média Exercício",
      value: Math.round(avgHeartRate),
      unit: "bpm",
      status: "Zona Aeróbica",
      icon: Activity,
      color: "from-blue-400 to-blue-500",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      title: "Máximo",
      value: maxHeartRate,
      unit: "bpm",
      status: "Teórico (idade)",
      icon: Zap,
      color: "from-orange-400 to-orange-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      title: "Variabilidade",
      value: 45,
      unit: "ms",
      status: "Boa recuperação",
      icon: TrendingUp,
      color: "from-green-400 to-green-500",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Cards Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricsCards.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${metric.bgGradient} border border-gray-200/50 hover-lift`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 sm:p-3 bg-gradient-to-br ${metric.color} rounded-full`}>
                <metric.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">{metric.title}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                  {metric.value}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">{metric.unit}</span>
              </div>
              <p className="text-xs text-gray-600">{metric.status}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-navy-600/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Frequência Cardíaca - Hoje</h3>
              <p className="text-sm text-navy-400">Monitoramento em tempo real</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
          </div>
          
          <div className="h-64 sm:h-80">
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
          
          {/* Current Status */}
          <div className="mt-4 p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-navy-400">Estado Atual</p>
                <p className="text-lg font-semibold text-white">72 bpm - Repouso</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Training Zones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card rounded-2xl p-6 border border-navy-600/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Zonas de Treino</h3>
              <p className="text-sm text-navy-400">Distribuição do tempo por zona</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            {zones.map((zone, index) => (
              <motion.div 
                key={index} 
                className="space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
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
                  <div className="w-full bg-navy-700/50 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: zone.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.percentage}%` }}
                      transition={{ duration: 1, delay: 0.6 + (index * 0.1) }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Training Tip */}
          <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
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
        </motion.div>
      </div>
    </div>
  );
}
