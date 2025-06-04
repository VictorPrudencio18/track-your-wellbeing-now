
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile, Activity, Zap, Target, Calendar, Plus, User, Clock, Award } from "lucide-react";
import { HealthStatsCard } from "@/components/ui/health-stats-card";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";

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
      icon: Activity,
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Calorias Queimadas",
      value: "1.240",
      target: "1.500",
      percentage: 83,
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    },
    {
      label: "Metas Semanais",
      value: "3",
      target: "5",
      percentage: 60,
      icon: Target,
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Dias Ativos",
      value: "5",
      target: "7",
      percentage: 71,
      icon: Calendar,
      color: "from-green-500 to-green-600"
    }
  ];

  const healthMetrics = [
    {
      title: "Repouso",
      value: "65",
      unit: "bpm",
      status: "Excelente",
      icon: Heart,
      color: "from-red-400 to-red-500",
      bgColor: "from-red-50 to-pink-50"
    },
    {
      title: "Média Exercício",
      value: "145",
      unit: "bpm",
      status: "Zona Aeróbica",
      icon: Activity,
      color: "from-blue-400 to-blue-500",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      title: "Máximo",
      value: "190",
      unit: "bpm",
      status: "Teórico (idade)",
      icon: Zap,
      color: "from-orange-400 to-orange-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      title: "Variabilidade",
      value: "45",
      unit: "ms",
      status: "Boa recuperação",
      icon: TrendingUp,
      color: "from-green-400 to-green-500",
      bgColor: "from-green-50 to-emerald-50"
    }
  ];

  const todaysSummary = [
    { metric: "Sono", value: "7h 30min", target: "8h", progress: 94 },
    { metric: "Hidratação", value: "2.1L", target: "2.5L", progress: 84 },
    { metric: "Exercícios", value: "45min", target: "60min", progress: 75 },
    { metric: "Passos", value: "8.540", target: "10.000", progress: 85 }
  ];

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
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
      
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-12 border border-navy-600/20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0">
            <div className="flex-1">
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="p-3 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                  <Heart className="w-8 h-8 text-accent-orange" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    Centro de Saúde Vital 🏥
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4 text-navy-400" />
                    <span className="text-navy-400">Bem-vindo de volta!</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-lg sm:text-xl text-navy-400 leading-relaxed mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Monitore suas métricas vitais com tecnologia premium e insights avançados para uma vida mais saudável
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button className="bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Métrica
                </Button>
                <Button variant="outline" className="border-navy-600/30 text-white hover:bg-navy-800/50">
                  <Clock className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
                <Button variant="outline" className="border-navy-600/30 text-white hover:bg-navy-800/50">
                  <Award className="w-4 h-4 mr-2" />
                  Conquistas
                </Button>
              </motion.div>
              
              {/* Today's Summary */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {todaysSummary.map((item, index) => (
                  <div key={index} className="glass-card-subtle rounded-xl p-3 sm:p-4 border border-navy-600/10">
                    <div className="text-xs text-navy-400 mb-1">{item.metric}</div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-sm sm:text-base font-bold text-white">{item.value}</span>
                      <span className="text-xs text-navy-500">/ {item.target}</span>
                    </div>
                    <div className="w-full bg-navy-700/30 rounded-full h-1.5">
                      <motion.div
                        className="bg-accent-orange rounded-full h-1.5"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.6 + (index * 0.1) }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Hero Icon - Hidden on mobile, visible on lg+ */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 border border-accent-orange/20 flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-16 h-16 text-accent-orange" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Health Metrics Cards - Responsive Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-navy-600/20"
      >
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Métricas Detalhadas</h2>
          <p className="text-navy-400">Acompanhe cada aspecto da sua saúde com precisão</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className={`rounded-2xl p-4 sm:p-6 bg-gradient-to-br ${metric.bgColor} border border-gray-200/50 hover-lift`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 sm:p-3 bg-gradient-to-br ${metric.color} rounded-full`}>
                  <metric.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{metric.title}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl sm:text-2xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">{metric.unit}</span>
                </div>
                <p className="text-xs text-gray-600">{metric.status}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="heart" className="space-y-6 sm:space-y-8">
          <div className="relative overflow-x-auto">
            <TabsList className="flex w-full min-w-max sm:grid sm:grid-cols-3 lg:grid-cols-6 glass-card p-2 h-auto border border-navy-600/20 gap-1">
              {[
                { value: "heart", icon: Heart, label: "Coração", color: "from-red-500 to-pink-500" },
                { value: "sleep", icon: Moon, label: "Sono", color: "from-indigo-500 to-purple-500" },
                { value: "hydration", icon: Droplets, label: "Hidratação", color: "from-blue-500 to-cyan-500" },
                { value: "weight", icon: Scale, label: "Peso", color: "from-green-500 to-emerald-500" },
                { value: "mood", icon: Smile, label: "Humor", color: "from-yellow-500 to-orange-500" },
                { value: "pressure", icon: TrendingUp, label: "Pressão", color: "from-purple-500 to-violet-500" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="group relative flex flex-col items-center gap-2 data-[state=active]:bg-accent-orange/10 data-[state=active]:text-white rounded-xl transition-all duration-300 border border-transparent data-[state=active]:border-accent-orange/20 p-3 min-w-[80px] sm:min-w-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className={`p-2 rounded-lg bg-gradient-to-br ${tab.color} bg-opacity-20 group-data-[state=active]:bg-opacity-30`}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-white/80 group-data-[state=active]:text-white text-center">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content with Enhanced Animation */}
          {[
            { value: "heart", component: HeartRateMonitor },
            { value: "sleep", component: SleepTracker },
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
    </div>
  );
}
