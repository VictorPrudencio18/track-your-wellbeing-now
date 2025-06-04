
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActivities } from "@/hooks/useSupabaseActivities";
import { useAuth } from "@/hooks/useAuth";

export function ModernActivityChart() {
  const { user, loading: authLoading } = useAuth();
  const { data: activities, isLoading, error } = useActivities();

  const generateChartData = () => {
    if (!activities || activities.length === 0) {
      // Return mock data for better UX when no activities exist
      return [
        { day: 'Seg', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Ter', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Qua', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Qui', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Sex', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Sáb', atividades: 0, calorias: 0, passos: 0 },
        { day: 'Dom', atividades: 0, calorias: 0, passos: 0 }
      ];
    }

    const now = new Date();
    const weekData = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.completed_at);
        return activityDate >= dayStart && activityDate <= dayEnd;
      });
      
      const totalCalories = dayActivities.reduce((sum, activity) => 
        sum + (activity.calories || 0), 0
      );
      
      const totalDistance = dayActivities.reduce((sum, activity) => 
        sum + (activity.distance || 0), 0
      );
      
      // Estimate steps based on distance (rough estimate: 1km = 1300 steps)
      const estimatedSteps = Math.round(totalDistance * 1300);
      
      weekData.push({
        day: dayName,
        atividades: dayActivities.length,
        calorias: totalCalories,
        passos: estimatedSteps
      });
    }
    
    return weekData;
  };

  if (authLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="h-80 bg-navy-700/30 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                <TrendingUp className="w-5 h-5 text-accent-orange" />
              </div>
              <h3 className="text-xl font-bold text-white">Atividade Semanal</h3>
            </div>
            <p className="text-navy-400 text-sm">Faça login para ver seu progresso</p>
          </div>
        </div>
        <Alert className="glass-card border-accent-orange/20">
          <AlertCircle className="h-4 w-4 text-accent-orange" />
          <AlertDescription className="text-white">
            Faça login para ver seu gráfico de atividades semanais.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                <TrendingUp className="w-5 h-5 text-accent-orange" />
              </div>
              <h3 className="text-xl font-bold text-white">Atividade Semanal</h3>
            </div>
            <p className="text-navy-400 text-sm">Erro ao carregar dados</p>
          </div>
        </div>
        <Alert className="glass-card border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Erro ao carregar gráfico de atividades. Tente atualizar a página.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const data = generateChartData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
            </div>
            <h3 className="text-xl font-bold text-white">Atividade Semanal</h3>
          </div>
          <p className="text-navy-400 text-sm">Progresso dos últimos 7 dias</p>
        </div>
        
        <div className="flex items-center gap-2 text-accent-orange bg-accent-orange/10 px-4 py-2 rounded-xl border border-accent-orange/20">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Esta semana</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                border: '1px solid rgba(245, 158, 11, 0.2)', 
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }} 
              labelStyle={{ color: '#f59e0b' }}
            />
            <Area 
              type="monotone" 
              dataKey="calorias" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fill="url(#caloriesGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="passos" 
              stroke="#64748b" 
              strokeWidth={2}
              fill="url(#stepsGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-navy-700/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent-orange rounded-full"></div>
          <span className="text-sm text-navy-400">Calorias</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-navy-500 rounded-full"></div>
          <span className="text-sm text-navy-400">Passos (estimativa)</span>
        </div>
      </div>
    </motion.div>
  );
}
