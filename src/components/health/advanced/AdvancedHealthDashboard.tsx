
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useDeviceIntegrations } from '@/hooks/useDeviceIntegrations';
import { MetricsManager } from './MetricsManager';
import { GoalsManager } from './GoalsManager';
import { InsightsCenter } from './InsightsCenter';
import { 
  Heart, 
  TrendingUp, 
  Target, 
  Brain,
  Activity,
  Zap,
  Scale,
  Clock,
  Plus,
  BarChart3
} from 'lucide-react';

export function AdvancedHealthDashboard() {
  const { healthMetrics, healthGoals, healthInsights, overallScore, isLoading } = useAdvancedHealth();
  const { todayCheckin } = useDailyCheckins();
  const { deviceIntegrations } = useDeviceIntegrations();
  const [activeTab, setActiveTab] = useState('overview');

  // Calcular estatísticas do dashboard
  const totalMetrics = healthMetrics.length;
  const activeGoals = healthGoals.filter(g => g.is_active).length;
  const unreadInsights = healthInsights.filter(i => !i.is_read).length;
  const connectedDevices = deviceIntegrations.filter(d => d.integration_status === 'connected').length;

  // Métricas recentes por categoria
  const getRecentMetricsByCategory = (category: string) => {
    return healthMetrics
      .filter(m => m.metric_category === category)
      .sort((a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime())
      .slice(0, 3);
  };

  const vitalMetrics = getRecentMetricsByCategory('vitals');
  const bodyMetrics = getRecentMetricsByCategory('body');

  // Score de progresso das metas
  const goalsProgress = healthGoals.length > 0 
    ? healthGoals.reduce((acc, goal) => {
        const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
        return acc + Math.min(progress, 100);
      }, 0) / healthGoals.length
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com Score Geral */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-orange/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-500/10 rounded-3xl border border-red-500/20">
              <Heart className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-red-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard Avançado
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Visão completa da sua saúde e bem-estar
              </p>
            </div>
          </div>
          
          {/* Score Geral */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 border-4 border-accent-orange/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-orange">{overallScore.toFixed(0)}</div>
                  <div className="text-xs text-navy-400">Score Geral</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Métricas Registradas',
            value: totalMetrics,
            subtitle: 'total',
            icon: BarChart3,
            color: 'from-blue-500/20 to-blue-600/10',
            iconColor: 'text-blue-400',
            trend: 'Esta semana'
          },
          {
            label: 'Metas Ativas',
            value: activeGoals,
            subtitle: 'em progresso',
            icon: Target,
            color: 'from-green-500/20 to-emerald-600/10',
            iconColor: 'text-green-400',
            trend: `${goalsProgress.toFixed(1)}% progresso médio`
          },
          {
            label: 'Insights Novos',
            value: unreadInsights,
            subtitle: 'não lidos',
            icon: Brain,
            color: 'from-purple-500/20 to-purple-600/10',
            iconColor: 'text-purple-400',
            trend: 'Baseados nos seus dados'
          },
          {
            label: 'Dispositivos',
            value: connectedDevices,
            subtitle: 'conectados',
            icon: Activity,
            color: 'from-orange-500/20 to-orange-600/10',
            iconColor: 'text-orange-400',
            trend: 'Sincronização automática'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-navy-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white group-hover:text-accent-orange transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-xs text-navy-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl border border-white/10`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-xs text-navy-400 bg-navy-700/30 rounded-lg px-3 py-2">
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 h-auto">
            {[
              { value: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { value: 'metrics', label: 'Métricas', icon: TrendingUp },
              { value: 'goals', label: 'Metas', icon: Target },
              { value: 'insights', label: 'Insights', icon: Brain }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-orange data-[state=active]:to-accent-orange/80 data-[state=active]:text-white transition-all duration-300 hover:text-white"
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Métricas Vitais Recentes */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    Sinais Vitais Recentes
                    <Badge className="bg-red-500/20 text-red-400 ml-auto">
                      {vitalMetrics.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vitalMetrics.length > 0 ? (
                    vitalMetrics.map((metric, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl"
                      >
                        <div>
                          <div className="text-white font-medium">{metric.metric_name}</div>
                          <div className="text-red-400 text-sm">
                            {new Date(metric.measurement_date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-red-400 font-bold">
                            {metric.value} {metric.unit}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-navy-400">
                      <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum sinal vital registrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Composição Corporal */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Scale className="w-5 h-5 text-blue-400" />
                    </div>
                    Composição Corporal
                    <Badge className="bg-blue-500/20 text-blue-400 ml-auto">
                      {bodyMetrics.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bodyMetrics.length > 0 ? (
                    bodyMetrics.map((metric, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl"
                      >
                        <div>
                          <div className="text-white font-medium">{metric.metric_name}</div>
                          <div className="text-blue-400 text-sm">
                            {new Date(metric.measurement_date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 font-bold">
                            {metric.value} {metric.unit}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-navy-400">
                      <Scale className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma métrica corporal registrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status do Check-in de Hoje */}
            {todayCheckin && (
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                    Check-in de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{todayCheckin.hydration_glasses || 0}</div>
                      <div className="text-navy-400 text-sm">Copos de Água</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {todayCheckin.sleep_quality ? `${todayCheckin.sleep_quality}/5` : 'N/A'}
                      </div>
                      <div className="text-navy-400 text-sm">Qualidade do Sono</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {todayCheckin.energy_level ? `${todayCheckin.energy_level}/10` : 'N/A'}
                      </div>
                      <div className="text-navy-400 text-sm">Nível de Energia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-orange">
                        {todayCheckin.wellness_score?.toFixed(0) || '0'}
                      </div>
                      <div className="text-navy-400 text-sm">Score de Bem-estar</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 mt-8">
            <MetricsManager />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6 mt-8">
            <GoalsManager />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6 mt-8">
            <InsightsCenter />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
