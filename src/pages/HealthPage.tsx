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
import { HealthDashboard } from "@/components/health/HealthDashboard";
import { DailyCheckinManager } from "@/components/health/DailyCheckinManager";

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
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 glass-card bg-navy-800/50 border-navy-600/30">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-accent-orange data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="weight" className="data-[state=active]:bg-accent-orange data-[state=active]:text-white">
              Peso
            </TabsTrigger>
            <TabsTrigger value="heart" className="data-[state=active]:bg-accent-orange data-[state=active]:text-white">
              Coração
            </TabsTrigger>
            <TabsTrigger value="sleep" className="data-[state=active]:bg-accent-orange data-[state=active]:text-white">
              Sono
            </TabsTrigger>
            <TabsTrigger value="more" className="data-[state=active]:bg-accent-orange data-[state=active]:text-white">
              Mais
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="weight" className="mt-0">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="heart" className="mt-0">
            <HeartRateMonitor />
          </TabsContent>

          <TabsContent value="sleep" className="mt-0">
            <SleepTracker />
          </TabsContent>

          <TabsContent value="more" className="mt-0">
            <HydrationTracker />
            <MoodTracker />
            <BloodPressureTracker />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Sistema de Check-ins Inteligente */}
      <DailyCheckinManager />
    </div>
  );
}
