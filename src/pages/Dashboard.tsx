
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
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { data: vivaData } = useVivaScore();
  const { data: correlationData } = useCorrelationAnalysis();
  const { todayCheckin, last7Days } = useDailyCheckins();
  const { data: activities } = useActivities();

  // Mock data para demonstração visual
  const todayMetrics = {
    mood: todayCheckin?.mood_rating || 7,
    energy: todayCheckin?.energy_level || 6,
    hydration: 7,
    sleep: todayCheckin?.sleep_quality || 8,
    steps: 8542,
    calories: 2134,
    heartRate: 78,
    workouts: 1,
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-12"
      >
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-orange/5 to-transparent blur-3xl" />
          
          <div className="relative z-10 mb-8">
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

        {/* Dashboard principal em grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Coluna Principal - Score e Insights */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Score VIVA Holográfico */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card border-navy-700/30 p-8 rounded-3xl relative overflow-hidden"
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 via-transparent to-purple-500/5" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-accent-orange/10 to-transparent rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Brain className="w-6 h-6 text-accent-orange" />
                    Score VIVA Unificado
                  </h2>
                  <p className="text-navy-400">Análise integrada de todos os seus dados de bem-estar</p>
                </div>

                <div className="flex justify-center">
                  <HolographicScoreRing
                    score={vivaData?.score || 87}
                    trend={vivaData?.trendPercentage || 5}
                    level={vivaData?.level || 'excellent'}
                    breakdown={vivaData?.breakdown || {
                      physical: 85,
                      mental: 89,
                      sleep: 92,
                      energy: 82
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Métricas de Hoje */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                Status de Hoje
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
                  progress={(todayMetrics.steps / 10000) * 100}
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
              transition={{ duration: 0.6, delay: 0.6 }}
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

            {/* Wellbeing Overview Enhanced */}
            <WellbeingOverview />

            {/* Mental Health Dashboard */}
            <MentalHealthDashboard />

            {/* Sistema Preditivo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
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
              transition={{ duration: 0.6, delay: 1.0 }}
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
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <UserProfileCard />
            </motion.div>

            {/* Estatísticas Rápidas Premium */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                  progress={(todayMetrics.calories / 2500) * 100}
                  icon={Zap}
                  color="orange"
                  size="sm"
                />
                
                <AdvancedMetricCard
                  title="Freq. Cardíaca"
                  value={`${todayMetrics.heartRate} bpm`}
                  progress={75}
                  icon={Heart}
                  color="red"
                  size="sm"
                />
                
                <AdvancedMetricCard
                  title="Treinos"
                  value={todayMetrics.workouts}
                  target="1"
                  progress={100}
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
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <WeeklyGoalsCard />
            </motion.div>

            {/* Conquistas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <AchievementsCard />
            </motion.div>

            {/* Smart Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
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
          transition={{ duration: 0.6, delay: 1.2 }}
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
          transition={{ duration: 0.6, delay: 1.4 }}
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
          transition={{ duration: 0.6, delay: 1.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ModernActivityChart />
          <SupabaseRecentActivitiesCard />
        </motion.div>

        {/* Histórico de Check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Histórico de Check-ins
            </h3>
          </div>
          <DailyHistoryCarousel />
        </motion.div>

        {/* Chat IA VIVA Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <VivaAIChat />
        </motion.div>
      </motion.div>
    </div>
  );
}
