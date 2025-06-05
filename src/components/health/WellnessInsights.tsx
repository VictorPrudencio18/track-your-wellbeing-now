
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Brain, Heart, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface WellnessData {
  date: string;
  wellness_score: number;
  sleep_quality: number;
  stress_level: number;
  energy_level: number;
  hydration_glasses: number;
}

export function WellnessInsights() {
  const { user } = useAuth();

  const { data: wellnessData, isLoading } = useQuery({
    queryKey: ['wellness-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('daily_health_checkins')
        .select('checkin_date, wellness_score, sleep_quality, stress_level, energy_level, hydration_glasses')
        .eq('user_id', user.id)
        .gte('checkin_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('checkin_date', { ascending: true });

      if (error) throw error;
      
      return data.map(item => ({
        date: new Date(item.checkin_date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        wellness_score: item.wellness_score || 0,
        sleep_quality: item.sleep_quality || 0,
        stress_level: item.stress_level || 0,
        energy_level: item.energy_level || 0,
        hydration_glasses: item.hydration_glasses || 0,
      })) as WellnessData[];
    },
    enabled: !!user,
  });

  const getLatestScore = () => {
    if (!wellnessData || wellnessData.length === 0) return 0;
    return wellnessData[wellnessData.length - 1]?.wellness_score || 0;
  };

  const getTrend = () => {
    if (!wellnessData || wellnessData.length < 2) return 0;
    const latest = wellnessData[wellnessData.length - 1]?.wellness_score || 0;
    const previous = wellnessData[wellnessData.length - 2]?.wellness_score || 0;
    return latest - previous;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getInsights = () => {
    if (!wellnessData || wellnessData.length < 3) return [];

    const insights = [];
    const avgHydration = wellnessData.reduce((sum, day) => sum + day.hydration_glasses, 0) / wellnessData.length;
    const avgSleep = wellnessData.reduce((sum, day) => sum + day.sleep_quality, 0) / wellnessData.length;
    const avgStress = wellnessData.reduce((sum, day) => sum + day.stress_level, 0) / wellnessData.length;

    if (avgHydration < 6) {
      insights.push({
        icon: Droplets,
        text: "Tente beber mais água! A hidratação adequada pode melhorar seu bem-estar.",
        color: "text-blue-400"
      });
    }

    if (avgSleep < 3) {
      insights.push({
        icon: Heart,
        text: "Sua qualidade de sono pode melhorar. Considere uma rotina de relaxamento antes de dormir.",
        color: "text-purple-400"
      });
    }

    if (avgStress > 7) {
      insights.push({
        icon: Brain,
        text: "Níveis de stress elevados. Que tal experimentar meditação ou exercícios de respiração?",
        color: "text-orange-400"
      });
    }

    return insights;
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-navy-600/30 bg-navy-800/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-navy-700 rounded w-1/2"></div>
            <div className="h-32 bg-navy-700/30 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestScore = getLatestScore();
  const trend = getTrend();
  const insights = getInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Score Overview */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent-orange" />
            Score de Bem-estar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(latestScore)}`}>
                {latestScore.toFixed(1)}
              </div>
              <div className="text-navy-400 text-sm">de 100 pontos</div>
            </div>
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className={trend > 0 ? 'text-green-400' : 'text-red-400'}>
                {Math.abs(trend).toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Chart */}
      {wellnessData && wellnessData.length > 0 && (
        <Card className="glass-card border-navy-600/30 bg-navy-800/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wellnessData}>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wellness_score" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="glass-card border-navy-600/30 bg-navy-800/50">
          <CardHeader>
            <CardTitle className="text-white text-sm">Insights Personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <insight.icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
                <p className="text-navy-300 text-sm leading-relaxed">
                  {insight.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
