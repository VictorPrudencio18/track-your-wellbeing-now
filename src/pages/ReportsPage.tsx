
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityHeatmap } from "@/components/reports/ActivityHeatmap";
import { PerformanceComparison } from "@/components/reports/PerformanceComparison";
import { PatternAnalysis } from "@/components/reports/PatternAnalysis";
import { ReportExporter } from "@/components/reports/ReportExporter";
import { BarChart3, Brain, FileText, Calendar } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";

export default function ReportsPage() {
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
            Visualizações e Relatórios 📊
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Analytics avançados, padrões e relatórios exportáveis
          </motion.p>
        </PremiumCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 glass-card p-2 h-auto">
            {[
              { value: "heatmap", icon: Calendar, label: "Mapa de Calor" },
              { value: "comparison", icon: BarChart3, label: "Comparações" },
              { value: "patterns", icon: Brain, label: "Padrões" },
              { value: "reports", icon: FileText, label: "Relatórios" }
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

          <TabsContent value="heatmap">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ActivityHeatmap />
            </motion.div>
          </TabsContent>

          <TabsContent value="comparison">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PerformanceComparison />
            </motion.div>
          </TabsContent>

          <TabsContent value="patterns">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PatternAnalysis />
            </motion.div>
          </TabsContent>

          <TabsContent value="reports">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ReportExporter />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
