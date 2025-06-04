
import { motion } from "framer-motion";
import { SleepTracker } from "@/components/health/SleepTracker";
import { HeartRateMonitor } from "@/components/health/HeartRateMonitor";
import { HydrationTracker } from "@/components/health/HydrationTracker";
import { WeightTracker } from "@/components/health/WeightTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { BloodPressureTracker } from "@/components/health/BloodPressureTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Moon, Droplets, Scale, TrendingUp, Smile } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";

export default function HealthPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PremiumCard glass className="p-8 border-0">
          <motion.h1 
            className="text-4xl font-bold text-gradient mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Monitoramento de Saúde Vital 🏥
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Acompanhe suas métricas vitais e bem-estar completo
          </motion.p>
        </PremiumCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Tabs defaultValue="sleep" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 glass-card p-2 h-auto">
            {[
              { value: "sleep", icon: Moon, label: "Sono" },
              { value: "heart", icon: Heart, label: "Coração" },
              { value: "hydration", icon: Droplets, label: "Hidratação" },
              { value: "weight", icon: Scale, label: "Peso" },
              { value: "mood", icon: Smile, label: "Humor" },
              { value: "pressure", icon: TrendingUp, label: "Pressão" }
            ].map((tab, index) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <tab.icon className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sleep">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SleepTracker />
            </motion.div>
          </TabsContent>

          <TabsContent value="heart">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HeartRateMonitor />
            </motion.div>
          </TabsContent>

          <TabsContent value="hydration">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HydrationTracker />
            </motion.div>
          </TabsContent>

          <TabsContent value="weight">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <WeightTracker />
            </motion.div>
          </TabsContent>

          <TabsContent value="mood">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MoodTracker />
            </motion.div>
          </TabsContent>

          <TabsContent value="pressure">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <BloodPressureTracker />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
