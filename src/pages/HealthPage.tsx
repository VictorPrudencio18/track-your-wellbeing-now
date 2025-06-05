
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, Activity, Plus } from "lucide-react";
import { HealthDashboard } from "@/components/health/HealthDashboard";

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Sistema de Saúde</h1>
          <p className="text-navy-400">Monitore seus indicadores de saúde e bem-estar</p>
        </motion.div>

        <Tabs defaultValue="dashboard" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-5 mb-8 glass-card bg-navy-800/50 border-navy-600/30 p-2 h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-accent-orange data-[state=active]:text-navy-900 text-white hover:bg-navy-700/50 transition-all duration-200 py-3 font-medium"
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="weight" 
                className="data-[state=active]:bg-accent-orange data-[state=active]:text-navy-900 text-white hover:bg-navy-700/50 transition-all duration-200 py-3 font-medium"
              >
                <Scale className="w-4 h-4 mr-2" />
                Peso
              </TabsTrigger>
              <TabsTrigger 
                value="heart" 
                className="data-[state=active]:bg-accent-orange data-[state=active]:text-navy-900 text-white hover:bg-navy-700/50 transition-all duration-200 py-3 font-medium"
              >
                <Heart className="w-4 h-4 mr-2" />
                Coração
              </TabsTrigger>
              <TabsTrigger 
                value="sleep" 
                className="data-[state=active]:bg-accent-orange data-[state=active]:text-navy-900 text-white hover:bg-navy-700/50 transition-all duration-200 py-3 font-medium"
              >
                <Moon className="w-4 h-4 mr-2" />
                Sono
              </TabsTrigger>
              <TabsTrigger 
                value="more" 
                className="data-[state=active]:bg-accent-orange data-[state=active]:text-navy-900 text-white hover:bg-navy-700/50 transition-all duration-200 py-3 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Mais
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <HydrationTracker />
                  </div>
                  <div className="space-y-8">
                    <MoodTracker />
                    <BloodPressureTracker />
                  </div>
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
