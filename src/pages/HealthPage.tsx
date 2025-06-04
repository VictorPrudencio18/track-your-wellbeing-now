
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile, Activity, Zap } from "lucide-react";
import { HealthStatsCard } from "@/components/ui/health-stats-card";
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
      trend: { value: 12, isPositive: true },
      subtitle: "Meta diária"
    },
    {
      title: "Frequência Cardíaca",
      value: 72,
      icon: Heart,
      suffix: " bpm",
      subtitle: "Repouso médio"
    },
    {
      title: "Hidratação",
      value: 2.1,
      target: 2.5,
      icon: Droplets,
      suffix: "L",
      trend: { value: 8, isPositive: true },
      subtitle: "Hoje"
    },
    {
      title: "Sono",
      value: 7.5,
      target: 8,
      icon: Moon,
      suffix: "h",
      subtitle: "Última noite"
    },
    {
      title: "Energia",
      value: 85,
      icon: Zap,
      suffix: "%",
      trend: { value: 15, isPositive: true },
      subtitle: "Nível atual"
    },
    {
      title: "Peso",
      value: 72.5,
      target: 70,
      icon: Scale,
      suffix: "kg",
      subtitle: "Meta: 70kg"
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
          <div className="glass-card rounded-2xl p-12 border border-navy-600/20">
            <motion.h1 
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Centro de Saúde Vital 🏥
            </motion.h1>
            <motion.p 
              className="text-xl text-navy-400 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Monitore suas métricas vitais com tecnologia premium e insights avançados
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs defaultValue="sleep" className="space-y-8">
            <div className="relative">
              <TabsList className="grid w-full grid-cols-6 glass-card p-2 h-auto border border-navy-600/20">
                {[
                  { value: "sleep", icon: Moon, label: "Sono" },
                  { value: "heart", icon: Heart, label: "Coração" },
                  { value: "hydration", icon: Droplets, label: "Hidratação" },
                  { value: "weight", icon: Scale, label: "Peso" },
                  { value: "mood", icon: Smile, label: "Humor" },
                  { value: "pressure", icon: TrendingUp, label: "Pressão" }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="group relative flex items-center gap-2 data-[state=active]:bg-accent-orange/10 data-[state=active]:text-white rounded-xl transition-all duration-300 border border-transparent data-[state=active]:border-accent-orange/20"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="p-2 rounded-lg bg-accent-orange/10 group-data-[state=active]:bg-accent-orange/20"
                    >
                      <tab.icon className="w-4 h-4 text-accent-orange" />
                    </motion.div>
                    <span className="hidden sm:inline font-medium text-white/80 group-data-[state=active]:text-white">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
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
                  <div className="glass-card rounded-2xl p-8 border border-navy-600/20">
                    <Component />
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
