
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityHeatmap } from "@/components/reports/ActivityHeatmap";
import { PerformanceComparison } from "@/components/reports/PerformanceComparison";
import { PatternAnalysis } from "@/components/reports/PatternAnalysis";
import { ReportExporter } from "@/components/reports/ReportExporter";
import { BarChart3, Brain, FileText, Calendar } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Visualizações e Relatórios 📊
        </h1>
        <p className="text-gray-600 mt-1">Analytics avançados, padrões e relatórios exportáveis</p>
      </div>

      <Tabs defaultValue="heatmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Mapa de Calor
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Comparações
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Padrões
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap">
          <ActivityHeatmap />
        </TabsContent>

        <TabsContent value="comparison">
          <PerformanceComparison />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternAnalysis />
        </TabsContent>

        <TabsContent value="reports">
          <ReportExporter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
