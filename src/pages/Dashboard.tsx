
import { motion } from "framer-motion";
import { AdvancedStatsGrid } from "@/components/dashboard/AdvancedStatsGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import { SupabaseStatsCards } from "@/components/dashboard/SupabaseStatsCards";
import { SupabaseActivityTracker } from "@/components/activities/SupabaseActivityTracker";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Acompanhe seu progresso e conquiste seus objetivos
        </p>
      </div>

      {/* Supabase Stats Cards */}
      <SupabaseStatsCards />
      
      {/* Activity Tracker */}
      <SupabaseActivityTracker />

      {/* Original components for backwards compatibility */}
      <AdvancedStatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityChart />
        <CalendarHeatmap />
      </div>
    </motion.div>
  );
}
