
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { useDailyProgress } from '@/hooks/useDailyProgress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

export function GoalAnalytics() {
  const { goals } = useWeeklyGoals();
  const { progress } = useDailyProgress();

  // Calcular estatísticas
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.is_completed).length;
  const successRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const averageCompletion = totalGoals > 0 ? goals.reduce((sum, g) => sum + g.completion_percentage, 0) / totalGoals : 0;

  // Dados para gráfico de progresso ao longo do tempo
  const progressData = progress
    .reduce((acc, p) => {
      const date = p.progress_date;
      const existing = acc.find(item => item.date === date);
      
      if (existing) {
        existing.totalProgress += p.cumulative_value;
        existing.activities += p.activities_count;
      } else {
        acc.push({
          date,
          totalProgress: p.cumulative_value,
          activities: p.activities_count,
          formattedDate: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        });
      }
      
      return acc;
    }, [] as any[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); // Últimas 2 semanas

  // Dados para gráfico de tipos de meta
  const goalTypeData = goals.reduce((acc, goal) => {
    const type = goal.goal_type;
    const existing = acc.find(item => item.type === type);
    
    if (existing) {
      existing.count += 1;
      existing.completed += goal.is_completed ? 1 : 0;
    } else {
      acc.push({
        type,
        count: 1,
        completed: goal.is_completed ? 1 : 0,
        name: type === 'endurance' ? 'Resistência' : 
              type === 'strength' ? 'Força' : 
              type === 'flexibility' ? 'Flexibilidade' : 
              type === 'weight_loss' ? 'Perda de Peso' :
              type === 'muscle_gain' ? 'Ganho Muscular' :
              type === 'wellness' ? 'Bem-estar' : type
      });
    }
    
    return acc;
  }, [] as any[]);

  // Dados para gráfico de completude por semana
  const weeklyCompletionData = goals
    .reduce((acc, goal) => {
      const weekKey = `${goal.week_start_date} - ${goal.week_end_date}`;
      const existing = acc.find(item => item.week === weekKey);
      
      if (existing) {
        existing.total += 1;
        existing.completed += goal.is_completed ? 1 : 0;
      } else {
        acc.push({
          week: weekKey,
          total: 1,
          completed: goal.is_completed ? 1 : 0,
          shortWeek: new Date(goal.week_start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        });
      }
      
      return acc;
    }, [] as any[])
    .map(item => ({
      ...item,
      completionRate: item.total > 0 ? (item.completed / item.total) * 100 : 0
    }))
    .slice(-8); // Últimas 8 semanas

  const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Total de Metas',
            value: totalGoals,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'from-blue-500/10 to-blue-600/5'
          },
          {
            title: 'Metas Concluídas',
            value: completedGoals,
            icon: Award,
            color: 'text-green-400',
            bgColor: 'from-green-500/10 to-green-600/5'
          },
          {
            title: 'Taxa de Sucesso',
            value: `${successRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-purple-400',
            bgColor: 'from-purple-500/10 to-purple-600/5'
          },
          {
            title: 'Completude Média',
            value: `${averageCompletion.toFixed(1)}%`,
            icon: Calendar,
            color: 'text-orange-400',
            bgColor: 'from-orange-500/10 to-orange-600/5'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`glass-card border-navy-600/20 bg-gradient-to-br ${stat.bgColor} hover-lift`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-navy-400">{stat.title}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Over Time */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Progresso ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalProgress" 
                    stroke="#F59E0B" 
                    fill="#F59E0B"
                    fillOpacity={0.3}
                    name="Progresso Total"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Goal Types Distribution */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Distribuição por Tipo de Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {goalTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Completion Rate */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Taxa de Completude Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="shortWeek" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                    formatter={(value: any) => [`${value.toFixed(1)}%`, 'Taxa de Completude']}
                  />
                  <Bar 
                    dataKey="completionRate" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Count Trend */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Atividades Diárias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activities" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Atividades"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
