
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/contexts/HealthContext";
import { FileText, Download, Calendar, TrendingUp, Target, Zap } from "lucide-react";
import { useState } from "react";

export function ReportExporter() {
  const { activities, healthMetrics, getWeeklyStats } = useHealth();
  const [isGenerating, setIsGenerating] = useState(false);
  const weeklyStats = getWeeklyStats();

  const generateWeeklyReport = () => {
    setIsGenerating(true);
    
    // Simulação de geração de PDF
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

      // Criar um blob com os dados do relatório (simulado)
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

ATIVIDADES MAIS FREQUENTES:
${activities
  .reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
}

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Relatórios Exportáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relatório Semanal */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Relatório Semanal</h3>
                  <p className="text-sm text-blue-700">
                    {currentWeekStart.toLocaleDateString('pt-BR')} - {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Treinos</span>
                  <Badge variant="secondary">{weeklyStats.totalWorkouts}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Calorias</span>
                  <Badge variant="secondary">{weeklyStats.totalCalories}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Distância</span>
                  <Badge variant="secondary">{weeklyStats.totalDistance.toFixed(1)} km</Badge>
                </div>
              </div>

              <Button 
                onClick={generateWeeklyReport} 
                disabled={isGenerating}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Gerando..." : "Baixar Relatório Semanal"}
              </Button>
            </div>

            {/* Relatório Mensal */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-full">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Relatório Mensal</h3>
                  <p className="text-sm text-green-700">{currentMonth}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Média Semanal</span>
                  <Badge variant="secondary">{(weeklyStats.totalWorkouts * 4).toFixed(0)} treinos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meta Mensal</span>
                  <Badge variant="secondary">85% atingida</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progresso</span>
                  <Badge variant="default">+12% vs mês anterior</Badge>
                </div>
              </div>

              <Button 
                onClick={generateMonthlyReport} 
                disabled={isGenerating}
                variant="outline"
                className="w-full border-green-200 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Gerando..." : "Baixar Relatório Mensal"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Dados Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Disponíveis para Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-800">{activities.length}</p>
              <p className="text-sm text-gray-600">Atividades</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-gray-800">
                {activities.reduce((sum, a) => sum + a.calories, 0)}
              </p>
              <p className="text-sm text-gray-600">Calorias Total</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-gray-800">
                {activities.reduce((sum, a) => sum + (a.distance || 0), 0).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">Km Total</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-gray-800">{healthMetrics.length}</p>
              <p className="text-sm text-gray-600">Métricas Saúde</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
