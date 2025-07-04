import React from "react";
import { motion } from "framer-motion";
import { SupabaseStatsCards } from "@/components/dashboard/SupabaseStatsCards";
import { ModernActivityChart } from "@/components/dashboard/ModernActivityChart";
import { SupabaseRecentActivitiesCard } from "@/components/dashboard/SupabaseRecentActivitiesCard";
import { WeeklyGoalsCard } from "@/components/dashboard/WeeklyGoalsCard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { VivaAIChat } from "@/components/dashboard/VivaAIChat";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { DailyHistoryCarousel } from "@/components/health/DailyHistoryCarousel";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { WellbeingOverview } from "@/components/dashboard/WellbeingOverview";
import { MentalHealthDashboard } from "@/components/dashboard/MentalHealthDashboard";
import { SmartAlertsSection } from "@/components/dashboard/SmartAlertsSection";
import { PredictiveWellnessPanel } from "@/components/dashboard/PredictiveWellnessPanel";
import { BehavioralPatternsPanel } from "@/components/dashboard/BehavioralPatternsPanel";
import { SleepWellnessIntegration } from "@/components/dashboard/SleepWellnessIntegration";
import { EnvironmentalFactorsPanel } from "@/components/dashboard/EnvironmentalFactorsPanel";
import { WellnessThermometers } from "@/components/dashboard/WellnessThermometers";
import { FloatingCheckinBox } from "@/components/wellness/FloatingCheckinBox";

// Novos componentes premium
import { HolographicScoreRing } from "@/components/ui/holographic-score-ring";
import { ParticleBackground } from "@/components/ui/particle-background";
import { PremiumInsightCard } from "@/components/ui/premium-insight-card";
import { AdvancedMetricCard } from "@/components/ui/advanced-metric-card";

import { useVivaScore } from "@/hooks/useVivaScore";
import { useCorrelationAnalysis } from "@/hooks/useCorrelationAnalysis";
import { useDailyCheckins } from "@/hooks/useDailyCheckins";
import { useActivities } from "@/hooks/useSupabaseActivities";

import { 
  Sparkles, 
  Brain, 
  Heart, 
  Zap, 
  Moon, 
  Activity,
  TrendingUp,
  Target,
  Award,
  Users,
  MapPin,
  Clock,
  Calendar
} from "lucide-react";

export default function Dashboard() {
  const { data: vivaData } = useVivaScore();
  const { data: correlationData } = useCorrelationAnalysis();
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: activities } = useActivities();

  const todayStr = new Date().toISOString().split('T')[0];

  const todayActivities = activities?.filter(act => {
    if (!act.completed_at) return false;
    const activityDate = new Date(act.completed_at);
    return activityDate.toISOString().split('T')[0] === todayStr;
  }) || [];

  const calculatedWorkouts = todayActivities.length;
  const calculatedCalories = todayActivities.reduce((sum, act) => sum + (act.calories || 0), 0);
  const totalDistanceTodayMeters = todayActivities.reduce((sum, act) => sum + (act.distance || 0), 0);
  const calculatedSteps = Math.round(totalDistanceTodayMeters * 1.312);

  const hrActivities = todayActivities.filter(act => act.avg_heart_rate && act.avg_heart_rate > 0);
  const calculatedHeartRate = hrActivities.length > 0 ? Math.round(hrActivities.reduce((sum, act) => sum + (act.avg_heart_rate || 0), 0) / hrActivities.length) : 0;

  const todayMetrics = {
    mood: todayCheckin?.mood_rating || 0,
    energy: todayCheckin?.energy_level || 0,
    hydration: todayCheckin?.hydration_glasses || 0,
    sleep: todayCheckin?.sleep_quality || 0,
    steps: calculatedSteps,
    calories: calculatedCalories,
    heartRate: calculatedHeartRate,
    workouts: calculatedWorkouts,
  };

  const insights = correlationData?.insights || [
    {
      type: 'positive',
      title: 'Exercício & Humor',
      description: 'Seus exercícios matinais aumentam o humor em 23% durante o dia',
      confidence: 87,
      actionable: 'Continue mantendo a rotina de exercícios pela manhã',
      category: 'Atividade Física'
    },
    {
      type: 'neutral',
      title: 'Sono & Produtividade',
      description: 'Noites com 8+ horas de sono resultam em 34% mais produtividade',
      confidence: 76,
      actionable: 'Tente dormir antes das 22h para otimizar o descanso',
      category: 'Sono'
    },
    {
      type: 'negative',
      title: 'Stress & Alimentação',
      description: 'Níveis altos de stress correlacionam com escolhas alimentares menos saudáveis',
      confidence: 82,
      actionable: 'Pratique 5 minutos de respiração quando se sentir estressado',
      category: 'Bem-estar Mental'
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Particle Background */}
      <ParticleBackground density="medium" color="#f59e0b" className="fixed inset-0 z-0" />
      
      {/* Floating Checkin Box */}
      <FloatingCheckinBox />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-8"
      >
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-orange/5 to-transparent blur-3xl" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotateY: [0, 5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="p-3 bg-gradient-to-br from-accent-orange to-orange-500 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-accent-orange to-white bg-clip-text text-transparent">
                Dashboard VIVA+
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-navy-300 text-xl max-w-2xl mx-auto leading-relaxed"
            >
              Inteligência Artificial aplicada ao seu Bem-estar e Qualidade de Vida
            </motion.p>
          </div>
        </motion.div>

        {/* Termômetros de Bem-estar - Nova seção no topo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <WellnessThermometers />
        </motion.div>

        {/* Histórico de Atividades - Movido para o topo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Histórico de Atividades
            </h3>
          </div>
          <DailyHistoryCarousel />
        </motion.div>

        {/* Dashboard principal em grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Coluna Principal - Score e Insights */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Score VIVA Holográfico Melhorado */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card-ultra border-accent-orange/20 p-8 rounded-3xl relative overflow-hidden"
            >
              {/* Background effects melhorados */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-purple-500/5 to-blue-500/10" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-accent-orange/20 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-accent-orange to-orange-600 rounded-xl">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    Score VIVA Unificado
                  </h2>
                  <p className="text-navy-300 text-lg">Análise integrada de todos os seus dados de bem-estar</p>
                </div>

                <div className="flex justify-center">
                  <HolographicScoreRing
                    score={vivaData?.score || 46}
                    trend={vivaData?.trendPercentage || 5}
                    level={vivaData?.level || 'needs_attention'}
                    breakdown={vivaData?.breakdown || {
                      physical: 42,
                      mental: 38,
                      sleep: 55,
                      energy: 48
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Bem-estar Hoje - Card Melhorado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card-holographic border-navy-600/30 rounded-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Bem-estar Hoje</h3>
                      <p className="text-navy-300">Status atual dos seus indicadores</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
                    <span className="text-red-400 font-medium">Atenção Necessária</span>
                  </div>
                </div>

                <WellbeingOverview />
              </div>
            </motion.div>

            {/* Métricas de Hoje */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                Métricas de Desempenho
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdvancedMetricCard
                  title="Humor"
                  value={`${todayMetrics.mood}/10`}
                  progress={(todayMetrics.mood / 10) * 100}
                  trend={12}
                  icon={Heart}
                  color="red"
                  category="Bem-estar"
                />
                
                <AdvancedMetricCard
                  title="Energia"
                  value={`${todayMetrics.energy}/10`}
                  progress={(todayMetrics.energy / 10) * 100}
                  trend={-3}
                  icon={Zap}
                  color="orange"
                  category="Vitalidade"
                />
                
                <AdvancedMetricCard
                  title="Sono"
                  value={`${todayMetrics.sleep}/10`}
                  progress={(todayMetrics.sleep / 10) * 100}
                  trend={8}
                  icon={Moon}
                  color="indigo"
                  category="Descanso"
                />
                
                <AdvancedMetricCard
                  title="Atividade"
                  value={`${todayMetrics.steps.toLocaleString()}`}
                  target="10.000"
                  progress={Math.min(100, (todayMetrics.steps / 10000) * 100)}
                  trend={15}
                  icon={Activity}
                  color="green"
                  category="Exercício"
                />
              </div>
            </motion.div>

            {/* Insights Inteligentes Premium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent-orange" />
                Insights da IA
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <PremiumInsightCard
                    key={index}
                    insight={insight}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>

            {/* Mental Health Dashboard */}
            <MentalHealthDashboard />

            {/* Sistema Preditivo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Sistema Preditivo de Bem-estar
                </h3>
              </div>
              <PredictiveWellnessPanel />
            </motion.div>

            {/* Padrões Comportamentais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Análise de Padrões Comportamentais
                </h3>
              </div>
              <BehavioralPatternsPanel />
            </motion.div>
          </div>

          {/* Sidebar - Informações Complementares */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Perfil do Usuário Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <UserProfileCard />
            </motion.div>

            {/* Estatísticas Rápidas Premium */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-orange" />
                Métricas Rápidas
              </h4>
              <div className="space-y-4">
                <AdvancedMetricCard
                  title="Calorias"
                  value={todayMetrics.calories.toLocaleString()}
                  target="2.500"
                  progress={Math.min(100, (todayMetrics.calories / 2500) * 100)}
                  icon={Zap}
                  color="orange"
                  size="sm"
                />
                
                <AdvancedMetricCard
                  title="Freq. Cardíaca"
                  value={todayMetrics.heartRate > 0 ? `${todayMetrics.heartRate} bpm` : 'N/A'}
                  progress={todayMetrics.heartRate > 0 ? Math.min(100, (todayMetrics.heartRate / 80) * 60) : 0}
                  icon={Heart}
                  color="red"
                  size="sm"
                />
                
                <AdvancedMetricCard
                  title="Treinos"
                  value={todayMetrics.workouts.toString()}
                  target="1"
                  progress={Math.min(100, (todayMetrics.workouts / 1) * 100)}
                  icon={Award}
                  color="green"
                  size="sm"
                />
              </div>
            </motion.div>

            {/* Metas Semanais */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <WeeklyGoalsCard />
            </motion.div>

            {/* Conquistas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <AchievementsCard />
            </motion.div>

            {/* Smart Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <SmartAlertsSection />
            </motion.div>
          </div>
        </div>

        {/* Seções Completas em Largura Total */}
        
        {/* Integração Sono-Bem-estar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Integração Sono-Bem-estar
            </h3>
          </div>
          <SleepWellnessIntegration />
        </motion.div>

        {/* Fatores Ambientais e Sociais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Fatores Ambientais e Sociais
            </h3>
          </div>
          <EnvironmentalFactorsPanel />
        </motion.div>

        {/* Seção de Atividades e Progresso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ModernActivityChart />
          <SupabaseRecentActivitiesCard />
        </motion.div>

        {/* Chat IA VIVA Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <VivaAIChat />
        </motion.div>
      </motion.div>
    </div>
  );
}
