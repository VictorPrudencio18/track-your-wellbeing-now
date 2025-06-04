
import { motion } from "framer-motion";
import { Activity, Target, Zap, TrendingUp, Calendar, Award, Heart, Clock } from "lucide-react";
import { SupabaseStatsCards } from "@/components/dashboard/SupabaseStatsCards";
import { ModernActivityChart } from "@/components/dashboard/ModernActivityChart";
import { WeeklyGoalsCard } from "@/components/dashboard/WeeklyGoalsCard";
import { SupabaseRecentActivitiesCard } from "@/components/dashboard/SupabaseRecentActivitiesCard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { ContentCarousel } from "@/components/dashboard/ContentCarousel";
import { VivaAIChat } from "@/components/dashboard/VivaAIChat";
import { SupabaseActivityTracker } from "@/components/activities/SupabaseActivityTracker";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="glass-card-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-navy-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-navy-700 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-navy-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-navy-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="glass-card-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-accent-orange/20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text-premium mb-4">
              Dashboard
            </h1>
            <Alert className="glass-card border-accent-orange/20 max-w-md mx-auto">
              <AlertCircle className="h-4 w-4 text-accent-orange" />
              <AlertDescription className="text-white">
                Faça login para acessar seu dashboard e acompanhar suas atividades.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8"
    >
      {/* Hero Header - Responsivo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-accent-orange/20">
          <div className="relative z-10">
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text-premium mb-2 sm:mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Dashboard
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Acompanhe seu progresso real e conquiste seus objetivos
            </motion.p>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-32 sm:h-32 bg-accent-orange/10 rounded-full blur-xl animate-gentle-float" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-40 sm:h-40 bg-accent-orange/5 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </motion.div>

      {/* Estatísticas Reais do Supabase */}
      <SupabaseStatsCards />

      {/* Registrar Nova Atividade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SupabaseActivityTracker />
      </motion.div>

      {/* Charts and Activities Section - Layout responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Chart - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <ModernActivityChart />
        </div>
        
        {/* Weekly Goals - takes 1 column */}
        <div>
          <WeeklyGoalsCard />
        </div>
      </div>

      {/* Content Carousel Section */}
      <ContentCarousel />

      {/* Content and AI Chat Section - Stack em mobile */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activities */}
        <div className="order-2 xl:order-1">
          <SupabaseRecentActivitiesCard />
        </div>
        
        {/* AI Chat */}
        <div className="order-1 xl:order-2">
          <VivaAIChat />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <AchievementsCard />
      </div>
    </motion.div>
  );
}
