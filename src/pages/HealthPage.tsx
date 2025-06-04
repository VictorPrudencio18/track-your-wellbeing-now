
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile, Activity, Zap } from "lucide-react";
import { HolographicCard } from "@/components/ui/holographic-card";
import { ParticleBackground } from "@/components/ui/particle-background";
import { FloatingElements } from "@/components/ui/floating-elements";
import { AdvancedStatsCard } from "@/components/ui/advanced-stats-card";
import { useHealth } from "@/contexts/HealthContext";

export default function HealthPage() {
  const { goals, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const healthStats = [
    {
      title: "Passos Hoje",
      value: 8540,
      target: 10000,
      icon: Activity,
      color: "blue" as const,
      trend: { value: 12, isPositive: true },
      subtitle: "Meta diária"
    },
    {
      title: "Frequência Cardíaca",
      value: 72,
      icon: Heart,
      color: "pink" as const,
      suffix: " bpm",
      subtitle: "Repouso médio"
    },
    {
      title: "Hidratação",
      value: 2.1,
      target: 2.5,
      icon: Droplets,
      color: "cyan" as const,
      suffix: "L",
      trend: { value: 8, isPositive: true },
      subtitle: "Hoje"
    },
    {
      title: "Sono",
      value: 7.5,
      target: 8,
      icon: Moon,
      color: "purple" as const,
      suffix: "h",
      subtitle: "Última noite"
    },
    {
      title: "Energia",
      value: 85,
      icon: Zap,
      color: "orange" as const,
      suffix: "%",
      trend: { value: 15, isPositive: true },
      subtitle: "Nível atual"
    },
    {
      title: "Peso",
      value: 72.5,
      target: 70,
      icon: Scale,
      color: "green" as const,
      suffix: "kg",
      subtitle: "Meta: 70kg"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <ParticleBackground className="opacity-30" />
      <FloatingElements count={15} variant="mixed" className="opacity-20" />
      
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
          <HolographicCard 
            variant="cosmic" 
            className="p-8 border-0 relative overflow-hidden"
            glow={true}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10" />
            <div className="relative z-10">
              <motion.h1 
                className="text-5xl font-bold gradient-text-premium mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Centro de Saúde Vital 🏥
              </motion.h1>
              <motion.p 
                className="text-xl text-white/80 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Monitore suas métricas vitais com tecnologia premium e insights avançados
              </motion.p>
            </div>
            
            {/* Floating Elements */}
            <FloatingElements count={8} variant="sparkles" className="opacity-30" />
          </HolographicCard>
        </motion.div>

        {/* Advanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {healthStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <AdvancedStatsCard
                {...stat}
                variant="holographic"
                showProgress={!!stat.target}
                animated={true}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs defaultValue="sleep" className="space-y-8">
            <div className="relative">
              <TabsList className="grid w-full grid-cols-6 glass-card-premium p-2 h-auto border border-white/20">
                {[
                  { value: "sleep", icon: Moon, label: "Sono", color: "from-purple-500 to-purple-600" },
                  { value: "heart", icon: Heart, label: "Coração", color: "from-pink-500 to-pink-600" },
                  { value: "hydration", icon: Droplets, label: "Hidratação", color: "from-cyan-500 to-cyan-600" },
                  { value: "weight", icon: Scale, label: "Peso", color: "from-green-500 to-green-600" },
                  { value: "mood", icon: Smile, label: "Humor", color: "from-yellow-500 to-yellow-600" },
                  { value: "pressure", icon: TrendingUp, label: "Pressão", color: "from-red-500 to-red-600" }
                ].map((tab, index) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="group relative flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/10 data-[state=active]:to-white/5 data-[state=active]:text-white rounded-xl transition-all duration-300 border border-transparent data-[state=active]:border-white/20"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className={`p-2 rounded-lg bg-gradient-to-r ${tab.color} group-data-[state=active]:shadow-lg`}
                    >
                      <tab.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="hidden sm:inline font-medium">{tab.label}</span>
                    
                    {/* Active indicator */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-data-[state=active]:opacity-100"
                      layoutId="activeTab"
                      transition={{ duration: 0.3 }}
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content with Enhanced Animations */}
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
                >
                  <HolographicCard variant="glass" className="p-8" glow={true}>
                    <Component />
                  </HolographicCard>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
