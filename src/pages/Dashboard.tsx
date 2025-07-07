import React from "react";
import { motion } from "framer-motion";
import { SupabaseStatsCards } from "@/components/dashboard/SupabaseStatsCards";
import { SupabaseRecentActivitiesCard } from "@/components/dashboard/SupabaseRecentActivitiesCard";
import { WeeklyGoalsCard } from "@/components/dashboard/WeeklyGoalsCard";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { SleepWellnessIntegration } from "@/components/dashboard/SleepWellnessIntegration";
import { WellnessThermometers } from "@/components/dashboard/WellnessThermometers";

import { useAuth } from "@/hooks/useAuth";

import { 
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-orange/10 via-orange-500/5 to-accent-orange/10 border border-accent-orange/20 p-8"
        >
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Olá, {user?.email?.split('@')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-xl text-navy-300 mb-6">
              Bem-vindo ao seu dashboard de bem-estar. Acompanhe seu progresso e conquiste seus objetivos.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent-orange/20 to-transparent rounded-full blur-3xl"></div>
        </motion.div>

        {/* Check-ins Rápidos */}
        <WellnessThermometers />

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna da Esquerda */}
          <div className="lg:col-span-8 space-y-8">
            <SupabaseRecentActivitiesCard />
            <SleepWellnessIntegration />
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-4 space-y-8">
            <SupabaseStatsCards />
            <UserProfileCard />
            <WeeklyGoalsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
