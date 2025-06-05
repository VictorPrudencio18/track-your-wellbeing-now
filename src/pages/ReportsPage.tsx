
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityHeatmap } from "@/components/reports/ActivityHeatmap";
import { PerformanceComparison } from "@/components/reports/PerformanceComparison";
import { PatternAnalysis } from "@/components/reports/PatternAnalysis";
import { ReportExporter } from "@/components/reports/ReportExporter";
import { AdvancedDataTable } from "@/components/reports/AdvancedDataTable";
import { AdvancedMetricsComparison } from "@/components/reports/AdvancedMetricsComparison";
import { BarChart3, Brain, FileText, Calendar, TrendingUp, Download, Target, Zap, Database, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/contexts/HealthContext";

export default function ReportsPage() {
  const { activities, getWeeklyStats } = useHealth();
  const weeklyStats = getWeeklyStats();

  const quickStats = [
    {
      label: "Total de Atividades",
      value: activities.length,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      label: "Calorias Queimadas",
      value: activities.reduce((sum, a) => sum + a.calories, 0),
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      label: "Distância Total",
      value: `${activities.reduce((sum, a) => sum + (a.distance || 0), 0).toFixed(1)} km`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      label: "Média Semanal",
      value: `${weeklyStats.totalWorkouts}/sem`,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-navy-600/20 bg-gradient-to-br from-navy-800/60 via-navy-800/40 to-navy-700/50 backdrop-blur-xl">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight">
                      Analytics & Relatórios
                      <span className="block text-2xl md:text-3xl xl:text-4xl bg-gradient-to-r from-accent-orange to-yellow-400 bg-clip-text text-transparent mt-2">
                        Avançados
                      </span>
                    </h1>
                    <p className="text-lg text-navy-300 mt-3 max-w-2xl">
                      Análises detalhadas, comparações temporais e insights inteligentes da sua performance atlética
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-xl px-6 py-3 text-lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exportar Relatório
                </Button>
                <Button 
                  variant="outline" 
                  className="border-navy-400/30 bg-navy-800/50 text-white hover:bg-navy-700/50 px-6 py-3 text-lg backdrop-blur-sm"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  IA Insights Pro
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/20 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-green-400 to-teal-400 rounded-full blur-3xl"></div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card rounded-3xl border border-navy-600/20 overflow-hidden bg-gradient-to-br from-navy-800/40 to-navy-900/60 backdrop-blur-xl"
      >
        <Tabs defaultValue="advanced-metrics" className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-navy-800/60 p-2 h-auto rounded-2xl backdrop-blur-sm border border-navy-600/30">
              {[
                { 
                  value: "advanced-metrics", 
                  icon: LineChart, 
                  label: "Métricas Avançadas",
                  color: "from-orange-500 to-orange-600",
                  description: "Comparações detalhadas"
                },
                { 
                  value: "data-table", 
                  icon: Database, 
                  label: "Dados Detalhados",
                  color: "from-purple-500 to-purple-600",
                  description: "Tabela completa"
                },
                { 
                  value: "heatmap", 
                  icon: Calendar, 
                  label: "Mapa de Calor",
                  color: "from-blue-500 to-blue-600",
                  description: "Padrões de atividade"
                },
                { 
                  value: "comparison", 
                  icon: BarChart3, 
                  label: "Comparações",
                  color: "from-green-500 to-green-600",
                  description: "Performance temporal"
                },
                { 
                  value: "patterns", 
                  icon: Brain, 
                  label: "Padrões IA",
                  color: "from-cyan-500 to-cyan-600",
                  description: "Análise inteligente"
                },
                { 
                  value: "reports", 
                  icon: FileText, 
                  label: "Exportação",
                  color: "from-pink-500 to-pink-600",
                  description: "Relatórios PDF"
                }
              ].map((tab, index) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-navy-600/90 data-[state=active]:to-navy-700/70 data-[state=active]:text-white rounded-xl transition-all duration-300 text-center min-h-[100px] group hover:bg-navy-700/50 text-white/90 border border-transparent data-[state=active]:border-navy-500/50 data-[state=active]:shadow-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-lg bg-gradient-to-r ${tab.color} group-data-[state=active]:shadow-xl shadow-md`}
                  >
                    <tab.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <span className="text-sm font-semibold block text-white">{tab.label}</span>
                    <span className="text-xs text-navy-300 group-data-[state=active]:text-navy-200 block mt-1">
                      {tab.description}
                    </span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-6">
            <TabsContent value="advanced-metrics" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Análise de Métricas Avançadas</h2>
                    <p className="text-navy-300">Comparações detalhadas com gráficos radar e tendências temporais</p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-4 py-2">
                    🚀 Premium Analytics
                  </Badge>
                </div>
                <AdvancedMetricsComparison />
              </motion.div>
            </TabsContent>

            <TabsContent value="data-table" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Dados Detalhados das Atividades</h2>
                    <p className="text-navy-300">Tabela completa com filtros, ordenação e exportação</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-2">
                    📊 Data Mining
                  </Badge>
                </div>
                <AdvancedDataTable />
              </motion.div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Mapa de Calor de Atividades</h2>
                    <p className="text-navy-300">Visualize seus padrões de exercício ao longo do tempo</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    Último mês
                  </Badge>
                </div>
                <ActivityHeatmap />
              </motion.div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Análise Comparativa</h2>
                    <p className="text-navy-300">Compare sua performance entre diferentes períodos</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Tendência ↗️
                  </Badge>
                </div>
                <PerformanceComparison />
              </motion.div>
            </TabsContent>

            <TabsContent value="patterns" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Análise de Padrões com IA</h2>
                    <p className="text-navy-300">Insights inteligentes sobre seus hábitos de exercício</p>
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    IA Powered
                  </Badge>
                </div>
                <PatternAnalysis />
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Relatórios Exportáveis</h2>
                    <p className="text-navy-300">Gere e baixe relatórios detalhados dos seus dados</p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                    PDF/Excel
                  </Badge>
                </div>
                <ReportExporter />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
