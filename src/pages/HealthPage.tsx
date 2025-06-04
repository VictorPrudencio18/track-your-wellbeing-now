
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile, Activity, Zap, Target, Calendar } from "lucide-react";
import { HealthStatsCard } from "@/components/ui/health-stats-card";
import { useHealth } from "@/contexts/HealthContext";

export default function HealthPage() {
  const { goals, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const healthStats = [
    {
      title: "Frequência Cardíaca",
      value: 72,
      icon: Heart,
      suffix: " bpm",
      subtitle: "Repouso médio",
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Sono",
      value: 7.5,
      target: 8,
      icon: Moon,
      suffix: "h",
      subtitle: "Última noite",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Hidratação",
      value: 2.1,
      target: 2.5,
      icon: Droplets,
      suffix: "L",
      subtitle: "Hoje",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Peso",
      value: 72.5,
      target: 70,
      icon: Scale,
      suffix: "kg",
      subtitle: "Meta: 70kg"
    },
    {
      title: "Humor",
      value: 8.2,
      icon: Smile,
      suffix: "/10",
      subtitle: "Média semanal",
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Pressão Arterial",
      value: "120/80",
      icon: Activity,
      suffix: " mmHg",
      subtitle: "Normal"
    }
  ];

  const quickStats = [
    {
      label: "Meta de Passos",
      value: "8.540",
      target: "10.000",
      percentage: 85,
      icon: Activity
    },
    {
      label: "Calorias Queimadas",
      value: "1.240",
      target: "1.500",
      percentage: 83,
      icon: Zap
    },
    {
      label: "Metas Semanais",
      value: "3",
      target: "5",
      percentage: 60,
      icon: Target
    },
    {
      label: "Dias Ativos",
      value: "5",
      target: "7",
      percentage: 71,
      icon: Calendar
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.1) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 relative z-10"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="glass-card rounded-3xl p-12 border border-navy-600/20">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-5xl font-bold text-white mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Centro de Saúde Vital 🏥
                </motion.h1>
                <motion.p 
                  className="text-xl text-navy-400 leading-relaxed mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Monitore suas métricas vitais com tecnologia premium e insights avançados
                </motion.p>
                
                {/* Quick Stats Row */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {quickStats.map((stat, index) => (
                    <div key={index} className="glass-card-subtle rounded-xl p-4 border border-navy-600/10">
                      <div className="flex items-center gap-2 mb-2">
                        <stat.icon className="w-4 h-4 text-accent-orange" />
                        <span className="text-xs text-navy-400">{stat.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-lg font-bold text-white">{stat.value}</span>
                        <span className="text-xs text-navy-500">/ {stat.target}</span>
                      </div>
                      <div className="w-full bg-navy-700/30 rounded-full h-1.5">
                        <motion.div
                          className="bg-accent-orange rounded-full h-1.5"
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 + (index * 0.1) }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Hero Icon */}
              <motion.div 
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="w-32 h-32 rounded-full bg-accent-orange/10 border border-accent-orange/20 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-accent-orange" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {healthStats.map((stat, index) => (
            <HealthStatsCard
              key={stat.title}
              title={stat.title}
              value={`${stat.value}${stat.suffix || ''}`}
              icon={stat.icon}
              subtitle={stat.subtitle}
              trend={stat.trend}
              target={stat.target}
              delay={0.1 * index}
            />
          ))}
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card rounded-3xl p-8 border border-navy-600/20"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Métricas Detalhadas</h2>
            <p className="text-navy-400">Acompanhe cada aspecto da sua saúde com precisão</p>
          </div>

          <Tabs defaultValue="sleep" className="space-y-8">
            <div className="relative">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 glass-card p-2 h-auto border border-navy-600/20 gap-1">
                {[
                  { value: "sleep", icon: Moon, label: "Sono", color: "from-indigo-500 to-purple-500" },
                  { value: "heart", icon: Heart, label: "Coração", color: "from-red-500 to-pink-500" },
                  { value: "hydration", icon: Droplets, label: "Hidratação", color: "from-blue-500 to-cyan-500" },
                  { value: "weight", icon: Scale, label: "Peso", color: "from-green-500 to-emerald-500" },
                  { value: "mood", icon: Smile, label: "Humor", color: "from-yellow-500 to-orange-500" },
                  { value: "pressure", icon: TrendingUp, label: "Pressão", color: "from-purple-500 to-violet-500" }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="group relative flex flex-col items-center gap-2 data-[state=active]:bg-accent-orange/10 data-[state=active]:text-white rounded-xl transition-all duration-300 border border-transparent data-[state=active]:border-accent-orange/20 p-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className={`p-2 rounded-lg bg-gradient-to-br ${tab.color} bg-opacity-20 group-data-[state=active]:bg-opacity-30`}
                    >
                      <tab.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-xs font-medium text-white/80 group-data-[state=active]:text-white hidden sm:inline">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content with Enhanced Animation */}
            {[
              { value: "sleep", component: SleepTracker },
              { value: "heart", component: HeartRateMonitor },
              { value: "hydration", component: HydrationTracker },
              { value: "weight", component: WeightTracker },
              { value: "mood", component: MoodTracker },
              { value: "pressure", component: BloodPressureTracker }
            ].map(({ value, component: Component }) => (
              <TabsContent key={value} value={value}>
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-6"
                >
                  <Component />
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
