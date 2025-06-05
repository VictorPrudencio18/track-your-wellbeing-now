
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Filter,
  Download,
  Brain,
  Moon,
  Zap,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSleepRecords } from '@/hooks/useSleep';
import { SleepTrendChart } from '@/components/ui/sleep-trend-chart';
import { SleepMetricsCard } from '@/components/ui/sleep-metrics-card';
import { HolographicScoreRing } from '@/components/ui/holographic-score-ring';

export function SleepAnalytics() {
  const { data: sleepRecords, isLoading } = useSleepRecords();
  const [timeRange, setTimeRange] = useState('30');

  // Mock advanced data for demo
  const mockAnalyticsData = [
    { date: '01/12', score: 72, duration: 7.5, quality: 7.2, efficiency: 85, deepSleep: 1.8, remSleep: 1.9 },
    { date: '02/12', score: 68, duration: 6.8, quality: 6.8, efficiency: 82, deepSleep: 1.5, remSleep: 1.7 },
    { date: '03/12', score: 75, duration: 8.1, quality: 7.8, efficiency: 88, deepSleep: 2.1, remSleep: 2.0 },
    { date: '04/12', score: 71, duration: 7.2, quality: 7.1, efficiency: 86, deepSleep: 1.7, remSleep: 1.8 },
    { date: '05/12', score: 78, duration: 8.3, quality: 8.2, efficiency: 91, deepSleep: 2.3, remSleep: 2.1 },
    { date: '06/12', score: 74, duration: 7.8, quality: 7.6, efficiency: 87, deepSleep: 1.9, remSleep: 1.9 },
    { date: '07/12', score: 69, duration: 6.9, quality: 6.9, efficiency: 83, deepSleep: 1.6, remSleep: 1.7 },
    { date: '08/12', score: 76, duration: 8.0, quality: 7.8, efficiency: 89, deepSleep: 2.0, remSleep: 2.0 },
    { date: '09/12', score: 73, duration: 7.6, quality: 7.3, efficiency: 86, deepSleep: 1.8, remSleep: 1.9 },
    { date: '10/12', score: 77, duration: 8.2, quality: 8.0, efficiency: 90, deepSleep: 2.2, remSleep: 2.0 },
  ];

  // Filtrar dados baseado no período selecionado
  const filteredData = mockAnalyticsData.slice(-parseInt(timeRange));

  // Calcular estatísticas avançadas
  const stats = {
    avgScore: filteredData.reduce((sum, d) => sum + d.score, 0) / filteredData.length,
    avgDuration: filteredData.reduce((sum, d) => sum + d.duration, 0) / filteredData.length,
    avgQuality: filteredData.reduce((sum, d) => sum + d.quality, 0) / filteredData.length,
    avgEfficiency: filteredData.reduce((sum, d) => sum + d.efficiency, 0) / filteredData.length,
    avgDeepSleep: filteredData.reduce((sum, d) => sum + d.deepSleep, 0) / filteredData.length,
    avgRemSleep: filteredData.reduce((sum, d) => sum + d.remSleep, 0) / filteredData.length,
    trendScore: ((filteredData[filteredData.length - 1]?.score || 0) - (filteredData[0]?.score || 0)) / (filteredData[0]?.score || 1) * 100,
    consistency: 87 // Mock consistency score
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-navy-700/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Premium com Score Holográfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card-ultra border-purple-400/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-blue-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-400/20 to-transparent rounded-full blur-3xl" />
          
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <motion.div
                  className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-left">
                  <h2 className="text-4xl font-bold text-white">Analytics Avançados</h2>
                  <p className="text-xl text-purple-300">Análise profunda dos seus padrões de sono</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48 bg-navy-800/50 border-navy-600/30 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="border-navy-600/30">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 flex justify-center pb-8">
            <HolographicScoreRing
              score={Math.round(stats.avgScore)}
              trend={stats.trendScore}
              level={stats.avgScore >= 75 ? 'good' : stats.avgScore >= 60 ? 'fair' : 'poor'}
              breakdown={{
                physical: Math.round(stats.avgEfficiency),
                mental: Math.round(stats.avgQuality * 10),
                sleep: Math.round(stats.avgScore),
                energy: Math.round(stats.avgDeepSleep * 40)
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SleepMetricsCard
          title="Score Médio"
          value={stats.avgScore.toFixed(0)}
          subtitle="Tendência geral"
          icon={Brain}
          color="purple"
          progress={stats.avgScore}
          trend={stats.trendScore > 0 ? 'up' : stats.trendScore < 0 ? 'down' : 'stable'}
          trendValue={`${stats.trendScore > 0 ? '+' : ''}${stats.trendScore.toFixed(1)}%`}
          status={stats.avgScore >= 75 ? 'excellent' : stats.avgScore >= 60 ? 'good' : 'fair'}
          delay={0.1}
          insights={[
            stats.trendScore > 0 ? 'Tendência positiva detectada' : 'Estabilidade mantida',
            `Score ${stats.avgScore >= 70 ? 'acima' : 'abaixo'} da média ideal`
          ]}
        />

        <SleepMetricsCard
          title="Duração Média"
          value={`${stats.avgDuration.toFixed(1)}h`}
          subtitle="Por noite"
          icon={Clock}
          color="blue"
          progress={(stats.avgDuration / 8) * 100}
          trend={stats.avgDuration >= 7.5 ? 'up' : 'down'}
          trendValue={stats.avgDuration >= 7.5 ? 'Dentro do ideal' : 'Abaixo do ideal'}
          status={stats.avgDuration >= 7.5 ? 'excellent' : stats.avgDuration >= 6.5 ? 'good' : 'fair'}
          delay={0.2}
          insights={[
            `${stats.avgDuration >= 7 ? 'Duração adequada' : 'Necessita mais tempo'}`,
            'Consistência é fundamental'
          ]}
        />

        <SleepMetricsCard
          title="Eficiência"
          value={`${stats.avgEfficiency.toFixed(0)}%`}
          subtitle="Tempo dormindo vs tempo na cama"
          icon={TrendingUp}
          color="green"
          progress={stats.avgEfficiency}
          trend={stats.avgEfficiency >= 85 ? 'up' : 'stable'}
          trendValue={stats.avgEfficiency >= 85 ? 'Excelente' : 'Boa'}
          status={stats.avgEfficiency >= 85 ? 'excellent' : 'good'}
          delay={0.3}
          insights={[
            `Eficiência ${stats.avgEfficiency >= 85 ? 'excelente' : 'boa'}`,
            'Poucas interrupções detectadas'
          ]}
        />

        <SleepMetricsCard
          title="Sono Profundo"
          value={`${stats.avgDeepSleep.toFixed(1)}h`}
          subtitle="Recuperação física"
          icon={Zap}
          color="orange"
          progress={(stats.avgDeepSleep / 2.5) * 100}
          trend={stats.avgDeepSleep >= 1.5 ? 'up' : 'down'}
          trendValue={stats.avgDeepSleep >= 1.5 ? 'Adequado' : 'Baixo'}
          status={stats.avgDeepSleep >= 1.8 ? 'excellent' : stats.avgDeepSleep >= 1.2 ? 'good' : 'fair'}
          delay={0.4}
          insights={[
            `${stats.avgDeepSleep >= 1.5 ? 'Recuperação física boa' : 'Precisa melhorar'}`,
            'Essencial para energia diária'
          ]}
        />
      </div>

      {/* Gráfico de Tendências Avançado */}
      <SleepTrendChart
        data={filteredData}
        title="Análise de Tendências Detalhada"
        subtitle={`Evolução dos últimos ${timeRange} dias com múltiplas métricas`}
      />

      {/* Análises Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Padrões de Sono */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Padrões Identificados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Consistency Score */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-400/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-400">Score de Consistência</h4>
                    <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                      {stats.consistency}%
                    </Badge>
                  </div>
                  <div className="w-full bg-navy-800/50 rounded-full h-2 mb-3">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.consistency}%` }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Sua rotina de sono mantém alta consistência de horários
                  </p>
                </div>

                {/* Sleep Architecture */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                  <h4 className="font-medium text-purple-400 mb-3">Arquitetura do Sono</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Sono Profundo</span>
                      <span className="text-sm font-medium text-purple-400">
                        {((stats.avgDeepSleep / stats.avgDuration) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Sono REM</span>
                      <span className="text-sm font-medium text-purple-400">
                        {((stats.avgRemSleep / stats.avgDuration) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Sono Leve</span>
                      <span className="text-sm font-medium text-purple-400">
                        {(100 - ((stats.avgDeepSleep + stats.avgRemSleep) / stats.avgDuration) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weekly Insights */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20">
                  <h4 className="font-medium text-green-400 mb-3">Insights da Semana</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5" />
                      Melhor dia: Sexta (Score: 78)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5" />
                      Dia mais desafiador: Terça (Score: 68)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                      Tendência geral: Estável com leve melhora
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendações Personalizadas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                Recomendações IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* High Priority */}
                <motion.div
                  className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-xl border border-red-400/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-400 mb-1">Alta Prioridade</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Aumente o tempo de sono profundo evitando álcool 3h antes de dormir
                      </p>
                      <Badge variant="outline" className="border-red-400/50 text-red-400 text-xs">
                        Impacto: +15% sono profundo
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Medium Priority */}
                <motion.div
                  className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-400/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-400 mb-1">Média Prioridade</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Estabeleça uma rotina de relaxamento 30min antes de dormir
                      </p>
                      <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 text-xs">
                        Impacto: +8% qualidade
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Low Priority */}
                <motion.div
                  className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Moon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-400 mb-1">Otimização</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Mantenha a temperatura do quarto entre 18-20°C para sono ideal
                      </p>
                      <Badge variant="outline" className="border-green-400/50 text-green-400 text-xs">
                        Impacto: +5% eficiência
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                    <Brain className="w-4 h-4 mr-2" />
                    Gerar Plano Personalizado
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
