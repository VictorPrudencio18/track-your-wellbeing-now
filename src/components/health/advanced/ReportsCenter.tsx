
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import {
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  Download,
  Share2,
  Filter,
  Calendar,
  FileText,
  PlusCircle
} from 'lucide-react';

export function ReportsCenter() {
  const { healthMetrics, healthGoals } = useAdvancedHealth();
  const { last30Days } = useDailyCheckins();
  const [activeTab, setActiveTab] = useState('health');
  const [dateRange, setDateRange] = useState('30d');

  // Mock data para gráficos
  const weightData = [
    { date: '01/05', value: 77.5 },
    { date: '08/05', value: 77.2 },
    { date: '15/05', value: 76.8 },
    { date: '22/05', value: 76.3 },
    { date: '29/05', value: 75.9 },
    { date: '05/06', value: 75.5 },
  ];

  const sleepQualityData = [
    { date: '01/06', quality: 3.5, duration: 6.8 },
    { date: '02/06', quality: 4.0, duration: 7.2 },
    { date: '03/06', quality: 3.0, duration: 6.5 },
    { date: '04/06', quality: 4.5, duration: 7.5 },
    { date: '05/06', quality: 5.0, duration: 8.0 },
    { date: '06/06', quality: 4.0, duration: 7.0 },
    { date: '07/06', quality: 3.5, duration: 6.5 },
  ];

  const activityDistributionData = [
    { name: 'Corrida', value: 35 },
    { name: 'Musculação', value: 30 },
    { name: 'Caminhada', value: 20 },
    { name: 'Natação', value: 10 },
    { name: 'Outro', value: 5 },
  ];

  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];

  // Preparar gráfico de bem-estar diário
  const wellnessData = last30Days?.map(day => ({
    date: new Date(day.checkin_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    score: day.wellness_score,
    hydration: day.hydration_glasses,
    energy: day.energy_level,
    stress: day.stress_level ? 10 - day.stress_level : null, // Inverter para visualização
  })).slice(-7) || [];

  // Formatar datas para exibição no gráfico de barras
  const formatDateRange = (range: string) => {
    switch (range) {
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case '90d': return 'Últimos 90 dias';
      case 'year': return 'Este ano';
      default: return range;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-3xl border border-orange-500/20">
              <BarChart3 className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Centro de Relatórios
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Analise seus dados de saúde e visualize seu progresso
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={dateRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('7d')}
            className={dateRange === '7d' ? 'bg-accent-orange' : 'border-navy-600/30 text-navy-300'}
          >
            7D
          </Button>
          <Button
            variant={dateRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('30d')}
            className={dateRange === '30d' ? 'bg-accent-orange' : 'border-navy-600/30 text-navy-300'}
          >
            30D
          </Button>
          <Button
            variant={dateRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('90d')}
            className={dateRange === '90d' ? 'bg-accent-orange' : 'border-navy-600/30 text-navy-300'}
          >
            90D
          </Button>
          <Button
            variant={dateRange === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('year')}
            className={dateRange === 'year' ? 'bg-accent-orange' : 'border-navy-600/30 text-navy-300'}
          >
            ANO
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Período
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 h-auto">
            {[
              { value: 'health', label: 'Saúde Geral', icon: BarChart3 },
              { value: 'activities', label: 'Atividades', icon: LineChartIcon },
              { value: 'nutrition', label: 'Nutrição', icon: PieChartIcon }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-orange data-[state=active]:to-accent-orange/80 data-[state=active]:text-white transition-all duration-300 hover:text-white"
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Health Overview Tab */}
          <TabsContent value="health" className="space-y-6 mt-8">
            {/* Progress Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Peso e Composição Corporal */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
                      <LineChartIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    Peso e Composição Corporal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-navy-400 mb-4">
                    <span className="text-blue-400 font-semibold">
                      {formatDateRange(dateRange)}
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weightData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          name="Peso (kg)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Qualidade do Sono */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                    </div>
                    Qualidade do Sono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-navy-400 mb-4">
                    <span className="text-purple-400 font-semibold">
                      Últimos 7 dias
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sleepQualityData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis yAxisId="left" stroke="#9CA3AF" />
                        <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="quality" 
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          name="Qualidade (1-5)"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="duration" 
                          stroke="#60A5FA" 
                          strokeWidth={2}
                          dot={{ fill: '#60A5FA', strokeWidth: 2, r: 4 }}
                          name="Duração (horas)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Score de Bem-estar */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                    </div>
                    Score de Bem-estar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-navy-400 mb-4">
                    <span className="text-orange-400 font-semibold">
                      Últimos 7 dias
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={wellnessData}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="score" fill="#F97316" radius={[4, 4, 0, 0]} name="Score Geral" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Distribution Chart */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg">
                      <PieChartIcon className="w-5 h-5 text-green-400" />
                    </div>
                    Distribuição de Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-navy-400 mb-4">
                    <span className="text-green-400 font-semibold">
                      {formatDateRange(dateRange)}
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {activityDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => [`${value}%`, 'Porcentagem']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goals Tracking */}
            {healthGoals.length > 0 && (
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-accent-orange" />
                    </div>
                    Acompanhamento de Metas
                    <Badge className="ml-auto bg-accent-orange/20 text-accent-orange">
                      {healthGoals.length} metas
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {healthGoals.map((goal, index) => {
                    const progress = goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0;
                    
                    return (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{goal.goal_title}</h4>
                            <div className="text-navy-400 text-sm mt-0.5">
                              {goal.goal_category} • Meta: {goal.target_value} {goal.unit}
                            </div>
                          </div>
                          <Badge className={`
                            ${progress >= 100 ? 'bg-green-500/20 text-green-400' : 
                              progress >= 50 ? 'bg-blue-500/20 text-blue-400' : 
                              'bg-yellow-500/20 text-yellow-400'}
                          `}>
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-navy-500">
                          <span>Atual: {goal.current_value} {goal.unit}</span>
                          {goal.target_date && (
                            <span>
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
            
            {/* Report Templates */}
            <div className="flex justify-between items-center mt-8">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-navy-400" />
                Relatórios Disponíveis
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Novo Relatório
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Relatório Completo de Saúde', description: 'Visão geral de todos os indicadores de saúde' },
                { name: 'Progresso de Fitness', description: 'Acompanhamento de treinos e métricas físicas' },
                { name: 'Análise de Sono', description: 'Tendências detalhadas do sono e fatores correlacionados' },
                { name: 'Perfil Nutricional', description: 'Nutrientes, calorias e hábitos alimentares' },
                { name: 'Monitoramento Cardíaco', description: 'Frequência e variabilidade cardíaca' },
                { name: 'Padrões de Stress', description: 'Análise de fatores e níveis de stress' },
              ].map((report, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="glass-card border-navy-600/20 bg-navy-800/30 backdrop-blur-xl hover:bg-navy-800/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <h4 className="text-white font-medium mb-2">{report.name}</h4>
                      <p className="text-navy-400 text-sm mb-4">{report.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge className="bg-navy-700/50 text-navy-300">PDF</Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="p-1 h-auto">
                            <Share2 className="w-4 h-4 text-navy-400" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 h-auto">
                            <Download className="w-4 h-4 text-navy-400" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6 mt-8">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LineChartIcon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Analítica de Atividades</h3>
                <p className="text-navy-400 leading-relaxed">
                  Relatórios detalhados de treinos, progressão e métricas de performance
                </p>
              </motion.div>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6 mt-8">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PieChartIcon className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Análise Nutricional</h3>
                <p className="text-navy-400 leading-relaxed">
                  Distribuição de macros, padrões alimentares e recomendações personalizadas
                </p>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
