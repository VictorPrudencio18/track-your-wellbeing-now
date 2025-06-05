
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
import { VivaScoreOverview } from "@/components/dashboard/VivaScoreOverview";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { WellbeingOverview } from "@/components/dashboard/WellbeingOverview";
import { MentalHealthDashboard } from "@/components/dashboard/MentalHealthDashboard";
import { SmartAlertsSection } from "@/components/dashboard/SmartAlertsSection";
import { PredictiveWellnessPanel } from "@/components/dashboard/PredictiveWellnessPanel";
import { BehavioralPatternsPanel } from "@/components/dashboard/BehavioralPatternsPanel";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard VIVA+
        </h1>
        <p className="text-navy-300 text-lg">
          Análise Inteligente do seu Bem-estar e Qualidade de Vida
        </p>
      </div>

      {/* FASE 2: Wellbeing Overview Section */}
      <WellbeingOverview />

      {/* Nova estrutura focada em bem-estar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal - Score VIVA e Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Score VIVA Unificado */}
          <VivaScoreOverview />
          
          {/* Smart Insights & Alerts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SmartInsights />
            <SmartAlertsSection />
          </div>
          
          {/* Mental Health Dashboard */}
          <MentalHealthDashboard />
          
          {/* FASE 3: Predictive Wellness System */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔮 Sistema Preditivo de Bem-estar
            </h2>
            <PredictiveWellnessPanel />
          </div>
          
          {/* Histórico de Check-ins */}
          <DailyHistoryCarousel />
        </div>

        {/* Coluna Lateral - Informações Complementares */}
        <div className="space-y-8">
          {/* Perfil do Usuário */}
          <UserProfileCard />
          
          {/* Estatísticas Rápidas */}
          <div className="space-y-6">
            <SupabaseStatsCards />
          </div>
          
          {/* Metas Semanais */}
          <WeeklyGoalsCard />
          
          {/* Conquistas */}
          <AchievementsCard />
        </div>
      </div>

      {/* FASE 3: Behavioral Patterns Analysis */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🧠 Análise de Padrões Comportamentais
        </h2>
        <BehavioralPatternsPanel />
      </div>

      {/* Seção de Atividades e Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModernActivityChart />
        <SupabaseRecentActivitiesCard />
      </div>

      {/* Chat IA VIVA - Agora com contexto dos insights */}
      <VivaAIChat />
    </motion.div>
  );
}
