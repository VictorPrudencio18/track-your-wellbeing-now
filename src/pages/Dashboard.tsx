
import { motion } from "framer-motion";
import { RecentActivity } from "@/components/RecentActivity";
import { ActivitySelection } from "@/components/ActivitySelection";
import { Calendar, Zap, TrendingUp, Award, Target, Activity } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { AnimatedStatsCards } from "@/components/dashboard/AnimatedStatsCards";
import { InteractiveCharts } from "@/components/dashboard/InteractiveCharts";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import { GoalsProgressSection } from "@/components/dashboard/GoalsProgressSection";
import { PremiumCard } from "@/components/ui/premium-card";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { CountUp } from "@/components/animations/count-up";
import { ProgressRing } from "@/components/ui/progress-ring";

export default function Dashboard() {
  const { activities } = useHealth();

  const transformedActivities = activities.slice(0, 5).map(activity => ({
    id: activity.id,
    type: activity.type,
    duration: `${Math.floor(activity.duration / 60)}:${(activity.duration % 60).toString().padStart(2, '0')}`,
    distance: activity.distance ? `${activity.distance.toFixed(1)} km` : undefined,
    date: activity.date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    }),
    calories: activity.calories,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl" />
        <PremiumCard glass className="relative p-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-5xl font-bold text-gradient mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Dashboard Elite 🚀
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Analytics premium do seu progresso fitness
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden lg:block"
            >
              <ProgressRing 
                progress={85} 
                size={120} 
                gradient="primary"
                label="Meta Semanal"
              />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.div>
        </PremiumCard>
      </motion.div>

      {/* Animated Stats Cards */}
      <StaggerContainer>
        <AnimatedStatsCards />
      </StaggerContainer>

      {/* Interactive Charts & Weekly Summary */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <InteractiveCharts />
        </div>
        
        <PremiumCard glass className="space-y-6 p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Resumo Semanal
          </h3>
          
          <div className="space-y-4">
            <motion.div 
              className="flex items-center justify-between p-4 bg-gradient-success rounded-lg border-0 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Streak Ativo</p>
                  <p className="text-xs opacity-90">Dias consecutivos</p>
                </div>
              </div>
              <CountUp 
                end={7} 
                suffix=" dias"
                className="text-2xl font-bold"
              />
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between p-4 bg-gradient-accent rounded-lg border-0 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Melhoria</p>
                  <p className="text-xs opacity-90">vs semana passada</p>
                </div>
              </div>
              <CountUp 
                end={15} 
                suffix="%"
                className="text-2xl font-bold"
              />
            </motion.div>

            <motion.div 
              className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200 dark:border-purple-800"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  🏆 Conquista Desbloqueada
                </h4>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Primeira semana completa de exercícios! Continue assim! 💪
              </p>
            </motion.div>
          </div>
        </PremiumCard>
      </StaggerContainer>

      {/* Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <CalendarHeatmap />
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <GoalsProgressSection />
      </motion.div>

      {/* Quick Actions */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PremiumCard glass className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Atividades Recentes
          </h2>
          <RecentActivity activities={transformedActivities} />
        </PremiumCard>
        
        <PremiumCard glass className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Início Rápido
          </h2>
          <ActivitySelection onSelectActivity={(type) => {
            console.log(`Starting activity: ${type}`);
          }} />
        </PremiumCard>
      </StaggerContainer>
    </motion.div>
  );
}
