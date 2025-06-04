
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/contexts/HealthContext";
import { FileText, Download, Calendar, TrendingUp, Target, Zap, PieChart, BarChart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ReportExporter() {
  const { activities, healthMetrics, getWeeklyStats } = useHealth();
  const [isGenerating, setIsGenerating] = useState(false);
  const weeklyStats = getWeeklyStats();

  const generateWeeklyReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const reportData = {
        period: "Última Semana",
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        endDate: new Date().toLocaleDateString('pt-BR'),
        stats: weeklyStats,
        activities: activities.slice(0, 7),
        insights: {
          bestDay: "Segunda-feira",
          bestTime: "18:00",
          improvement: "+15%"
        }
      };

      const reportContent = `
=== RELATÓRIO SEMANAL DE FITNESS ===
Período: ${reportData.startDate} - ${reportData.endDate}

ESTATÍSTICAS GERAIS:
- Total de Treinos: ${reportData.stats.totalWorkouts}
- Distância Total: ${reportData.stats.totalDistance.toFixed(1)} km
- Calorias Queimadas: ${reportData.stats.totalCalories}
- FC Média: ${Math.round(reportData.stats.avgHeartRate)} bpm

ATIVIDADES:
${reportData.activities.map(a => 
  `- ${a.name}: ${a.duration}min, ${a.calories}cal`
).join('\n')}

INSIGHTS:
- Melhor dia: ${reportData.insights.bestDay}
- Melhor horário: ${reportData.insights.bestTime}
- Melhoria: ${reportData.insights.improvement}

Gerado em: ${new Date().toLocaleString('pt-BR')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-semanal-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
    }, 2000);
  };

  const generateMonthlyReport = () => {
    setIsGenerating(true);
    
    const monthlyActivities = activities.filter(a => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return a.date >= monthAgo;
    });

    setTimeout(() => {
      const monthlyStats = {
        totalActivities: monthlyActivities.length,
        totalCalories: monthlyActivities.reduce((sum, a) => sum + a.calories, 0),
        totalDistance: monthlyActivities.reduce((sum, a) => sum + (a.distance || 0), 0),
        avgDuration: monthlyActivities.length > 0 
          ? monthlyActivities.reduce((sum, a) => sum + a.duration, 0) / monthlyActivities.length 
          : 0
      };

      const reportContent = `
=== RELATÓRIO MENSAL DE FITNESS ===
Período: Últimos 30 dias

ESTATÍSTICAS MENSAIS:
- Total de Treinos: ${monthlyStats.totalActivities}
- Distância Total: ${monthlyStats.totalDistance.toFixed(1)} km
- Calorias Queimadas: ${monthlyStats.totalCalories}
- Duração Média: ${Math.round(monthlyStats.avgDuration)} min

PROGRESSÃO:
- Treinos por semana: ${(monthlyStats.totalActivities / 4).toFixed(1)}
- Calorias por dia: ${(monthlyStats.totalCalories / 30).toFixed(1)}

Gerado em: ${new Date().toLocaleString('pt-BR')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-mensal-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
    }, 2000);
  };

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const currentWeekStart = new Date();
  currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

  const reportTypes = [
    {
      title: "Relatório Semanal",
      description: "Análise detalhada dos últimos 7 dias",
      period: `${currentWeekStart.toLocaleDateString('pt-BR')} - ${new Date().toLocaleDateString('pt-BR')}`,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/10 to-blue-600/5",
      stats: [
        { label: "Treinos", value: weeklyStats.totalWorkouts },
        { label: "Calorias", value: weeklyStats.totalCalories },
        { label: "Distância", value: `${weeklyStats.totalDistance.toFixed(1)} km` }
      ],
      action: generateWeeklyReport
    },
    {
      title: "Relatório Mensal",
      description: "Visão completa do mês atual",
      period: currentMonth,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/10 to-green-600/5",
      stats: [
        { label: "Média Semanal", value: `${(weeklyStats.totalWorkouts * 4).toFixed(0)} treinos` },
        { label: "Meta Mensal", value: "85% atingida" },
        { label: "Progresso", value: "+12% vs anterior" }
      ],
      action: generateMonthlyReport
    }
  ];

  const dataStats = [
    {
      icon: Target,
      value: activities.length,
      label: "Atividades",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      value: activities.reduce((sum, a) => sum + a.calories, 0),
      label: "Calorias Total",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      value: `${activities.reduce((sum, a) => sum + (a.distance || 0), 0).toFixed(1)} km`,
      label: "Distância Total",
      color: "from-green-500 to-green-600"
    },
    {
      icon: PieChart,
      value: healthMetrics.length,
      label: "Métricas Saúde",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Report Generation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <Card className={`glass-card border-navy-600/20 bg-gradient-to-br ${report.bgColor} hover-lift overflow-hidden relative`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-r ${report.color} rounded-2xl`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-xl">{report.title}</CardTitle>
                    <p className="text-navy-300 text-sm mt-1">{report.description}</p>
                    <p className="text-navy-400 text-xs mt-2">{report.period}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {report.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-navy-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={report.action}
                  disabled={isGenerating}
                  className={`w-full bg-gradient-to-r ${report.color} hover:opacity-90 text-white border-0 shadow-lg`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Gerando..." : `Baixar ${report.title}`}
                </Button>
              </CardContent>

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Data Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="glass-card border-navy-600/20 bg-navy-800/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <BarChart className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-white">Dados Disponíveis para Relatórios</CardTitle>
                <p className="text-navy-400 text-sm mt-1">Resumo completo das suas informações</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {dataStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                  className="text-center p-4 rounded-2xl bg-navy-700/30 border border-navy-600/20 hover-lift"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-navy-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
