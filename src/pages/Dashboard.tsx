
import { motion } from "framer-motion";
import { Activity, Target, Zap, TrendingUp, Calendar, Award, Heart, Clock } from "lucide-react";
import { HealthStatsCard } from "@/components/ui/health-stats-card";
import { ModernActivityChart } from "@/components/dashboard/ModernActivityChart";
import { WeeklyGoalsCard } from "@/components/dashboard/WeeklyGoalsCard";
import { RecentActivitiesCard } from "@/components/dashboard/RecentActivitiesCard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";

export default function Dashboard() {
  const mainStats = [
    {
      title: "Passos Hoje",
      value: "8,750",
      icon: Activity,
      subtitle: "Meta: 10,000",
      trend: { value: 12, isPositive: true },
      target: 10000,
      delay: 0
    },
    {
      title: "Distância Semanal", 
      value: "21.0 km",
      icon: Target,
      subtitle: "Meta: 25 km",
      trend: { value: 8, isPositive: true },
      delay: 0.1
    },
    {
      title: "Tempo Ativo",
      value: "4h 32m",
      icon: Clock,
      subtitle: "Meta: 5h 00m",
      trend: { value: 15, isPositive: true },
      delay: 0.2
    },
    {
      title: "Calorias Queimadas",
      value: "2,340",
      icon: Zap,
      subtitle: "Hoje",
      trend: { value: 5, isPositive: true },
      delay: 0.3
    }
  ];

  const secondaryStats = [
    {
      title: "Freq. Cardíaca Média",
      value: "142 bpm",
      icon: Heart,
      subtitle: "Zona aeróbica",
      delay: 0.4
    },
    {
      title: "Sequência Atual",
      value: "12 dias",
      icon: TrendingUp,
      subtitle: "Recorde pessoal",
      trend: { value: 20, isPositive: true },
      delay: 0.5
    },
    {
      title: "Treinos Semanais",
      value: "4/5",
      icon: Award,
      subtitle: "80% concluído",
      delay: 0.6
    },
    {
      title: "Próximo Objetivo",
      value: "Corrida 5k",
      icon: Calendar,
      subtitle: "Em 3 dias",
      delay: 0.7
    }
  ];

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
        <div className="glass-card-premium rounded-3xl p-8 border border-accent-orange/20">
          <div className="relative z-10">
            <motion.h1 
              className="text-5xl font-bold gradient-text-premium mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Dashboard
            </motion.h1>
            <motion.p 
              className="text-xl text-white/80 max-w-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Acompanhe seu progresso e conquiste seus objetivos com estilo
            </motion.p>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-orange/10 rounded-full blur-xl animate-gentle-float" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-accent-orange/5 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <HealthStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            subtitle={stat.subtitle}
            trend={stat.trend}
            target={stat.target}
            delay={stat.delay}
            className="hover:border-accent-orange/30 transition-all duration-300"
          />
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {secondaryStats.map((stat, index) => (
          <HealthStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            subtitle={stat.subtitle}
            trend={stat.trend}
            delay={stat.delay}
            className="hover:border-accent-orange/20 transition-all duration-300"
          />
        ))}
      </div>

      {/* Charts and Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart - takes 2 columns */}
        <div className="lg:col-span-2">
          <ModernActivityChart />
        </div>
        
        {/* Weekly Goals - takes 1 column */}
        <div>
          <WeeklyGoalsCard />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivitiesCard />
        <AchievementsCard />
      </div>
    </motion.div>
  );
}
