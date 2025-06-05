
import React from "react";
import { motion } from "framer-motion";
import { SupabaseStatsCards } from "@/components/dashboard/SupabaseStatsCards";
import { ModernActivityChart } from "@/components/dashboard/ModernActivityChart";
import { SupabaseRecentActivitiesCard } from "@/components/dashboard/SupabaseRecentActivitiesCard";
import { WeeklyGoalsCard } from "@/components/dashboard/WeeklyGoalsCard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { VivaAIChat } from "@/components/dashboard/VivaAIChat";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";

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
          Painel Principal
        </h1>
        <p className="text-navy-300 text-lg">
          Acompanhe seu progresso e conquiste seus objetivos
        </p>
      </div>

      {/* Stats Cards */}
      <SupabaseStatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <ModernActivityChart />
          <SupabaseRecentActivitiesCard />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <UserProfileCard />
          <WeeklyGoalsCard />
          <AchievementsCard />
        </div>
      </div>

      {/* AI Chat */}
      <VivaAIChat />
    </motion.div>
  );
}
