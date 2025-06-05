
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Star,
  ZapOff,
  Zap,
  Brain,
  Heart,
  Sun,
  Activity,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSleepRecords, useSleepGoals } from '@/hooks/useSleep';
import { SleepCycleVisualization } from '@/components/ui/sleep-cycle-visualization';
import { SleepMetricsCard } from '@/components/ui/sleep-metrics-card';
import { SleepTrendChart } from '@/components/ui/sleep-trend-chart';
import { HolographicScoreRing } from '@/components/ui/holographic-score-ring';
import { SleepQualityRing } from '@/components/sleep/advanced/SleepQualityRing';
import { SleepTimer } from '@/components/sleep/advanced/SleepTimer';

export function SleepDashboard() {
  const { data: sleepRecords, isLoading: recordsLoading } = useSleepRecords();
  const { data: sleepGoals } = useSleepGoals();

  // Mock data for demo with real database integration structure
  const mockSleepPhases = [
    { phase: 'Light', duration: 120, quality: 8, color: '#60a5fa' },
    { phase: 'Deep', duration: 90, quality: 9, color: '#1e40af' },
    { phase: 'REM', duration: 75, quality: 7, color: '#8b5cf6' },
    { phase: 'Awake', duration: 15, quality: 5, color: '#fbbf24' },
  ];

  const totalDuration = mockSleepPhases.reduce((sum, phase) => sum + phase.duration, 0);

  const mockTrendData = [
    { date: '01/12', score: 72, duration: 7.5, quality: 7.2, efficiency: 85 },
    { date: '02/12', score: 68, duration: 6.8, quality: 6.8, efficiency: 82 },
    { date: '03/12', score: 75, duration: 8.1, quality: 7.8, efficiency: 88 },
    { date: '04/12', score: 71, duration: 7.2, quality: 7.1, efficiency: 86 },
    { date: '05/12', score: 78, duration: 8.3, quality: 8.2, efficiency: 91 },
    { date: '06/12', score: 74, duration: 7.8, quality: 7.6, efficiency: 87 },
    { date: '07/12', score: 69, duration: 6.9, quality: 6.9, efficiency: 83 },
  ];

  // Calcular métricas baseadas em dados reais quando disponíveis
  const recentRecord = sleepRecords?.[0];
  const activeGoal = sleepGoals?.find(goal => goal.is_active);
  const last7Records = sleepRecords?.slice(0, 7) || [];
  
  const averageScore = last7Records.length > 0 
    ? last7Records.reduce((sum, record) => sum + (record.calculated_scores?.overall_score || 73), 0) / last7Records.length
    : 73;

  const averageDuration = last7Records.length > 0
    ? last7Records.reduce((sum, record) => sum + (record.sleep_duration || 450), 0) / last7Records.length
    : 450;

  const consistencyStreak = 5; // Mock data

  if (recordsLoading) {
    return (
      <div className="space-y-8">
        {/* Loading skeleton */}
        {[...Array(3)].map((_, i) => (
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
      {/* Hero Section com Score Holográfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <Card className="glass-card-ultra border-indigo-400/20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-purple-500/15 to-transparent rounded-full blur-2xl" />
          
          <CardHeader className="relative z-10 text-center pb-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <CardTitle className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                  <Moon className="w-8 h-8 text-white" />
                </div>
                VIVA Sleep Dashboard
              </CardTitle>
              <p className="text-xl text-indigo-300">
                Análise Avançada e Controle Inteligente do Seu Sono
              </p>
            </motion.div>
          </CardHeader>
          
          <CardContent className="relative z-10 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Ring */}
              <div className="flex justify-center">
                <SleepQualityRing
                  quality={averageScore}
                  efficiency={87}
                  debt={45}
                  size="lg"
                />
              </div>
              
              {/* Sleep Timer */}
              <div className="flex items-center">
                <SleepTimer sessionType="night_sleep" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Principais Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SleepMetricsCard
          title="Duração do Sono"
          value={`${Math.floor(averageDuration / 60)}h ${averageDuration % 60}m`}
          subtitle="Última noite"
          icon={Clock}
          color="blue"
          progress={(averageDuration / 480) * 100}
          trend="up"
          trendValue="+12min vs semana passada"
          status="good"
          delay={0.1}
          insights={[
            "Duração próxima ao ideal de 8h",
            "Consistência melhorou 15% esta semana"
          ]}
        />

        <SleepMetricsCard
          title="Qualidade do Sono"
          value={`${(averageScore / 10).toFixed(1)}/10`}
          subtitle="Score médio semanal"
          icon={Star}
          color="purple"
          progress={averageScore}
          trend="up"
          trendValue="+0.3 vs semana passada"
          status="good"
          delay={0.2}
          insights={[
            "Qualidade acima da média",
            "Sono profundo melhorou 8%"
          ]}
        />

        <SleepMetricsCard
          title="Eficiência"
          value="87%"
          subtitle="Tempo dormindo vs tempo na cama"
          icon={TrendingUp}
          color="green"
          progress={87}
          trend="stable"
          trendValue="Estável esta semana"
          status="excellent"
          delay={0.3}
          insights={[
            "Eficiência excelente (>85%)",
            "Poucas interrupções noturnas"
          ]}
        />

        <SleepMetricsCard
          title="Sequência"
          value={`${consistencyStreak} dias`}
          subtitle="Sono de qualidade consecutivo"
          icon={Zap}
          color="orange"
          progress={(consistencyStreak / 7) * 100}
          trend="up"
          trendValue="Melhor sequência do mês"
          status="good"
          delay={0.4}
          insights={[
            "Ótima consistência",
            "Continue mantendo a rotina"
          ]}
        />
      </div>

      {/* Visualização de Ciclos do Sono */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Análise de Ciclos do Sono
              <Badge variant="outline" className="ml-auto border-purple-400/50 text-purple-400">
                Última Noite
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="relative z-10 py-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <SleepCycleVisualization
                  sleepPhases={mockSleepPhases}
                  totalDuration={totalDuration}
                />
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {mockSleepPhases.map((phase, index) => (
                    <motion.div
                      key={phase.phase}
                      className="p-4 bg-navy-800/30 rounded-xl border border-navy-600/20"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: phase.color }}
                        />
                        <span className="font-medium text-white">{phase.phase} Sleep</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Duração:</span>
                          <span className="text-white">{Math.round(phase.duration / 60)}h {phase.duration % 60}m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Qualidade:</span>
                          <span className="text-white">{phase.quality}/10</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">% Total:</span>
                          <span className="text-white">{((phase.duration / totalDuration) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-400/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    Análise dos Ciclos
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5" />
                      Sono profundo representou 30% da noite (ideal: 20-25%)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                      REM sleep em 25% (ideal: 20-25%)
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5" />
                      Apenas 5% acordado durante a noite (excelente)
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Tendências Premium */}
      <SleepTrendChart
        data={mockTrendData}
        title="Tendências de Sono - 7 Dias"
        subtitle="Análise detalhada da evolução do seu sono"
      />

      {/* Seção de Insights e Recomendações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Insights IA */}
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Insights da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                className="p-4 bg-green-500/10 border border-green-400/20 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-400 mb-1">Melhoria Detectada</h4>
                    <p className="text-sm text-gray-300">
                      Sua consistência de horários melhorou 23% esta semana. 
                      Continue indo para a cama entre 22h-23h.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Moon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">Padrão Identificado</h4>
                    <p className="text-sm text-gray-300">
                      Exercícios pela manhã correlacionam com +15% de sono profundo. 
                      Mantenha esta rotina!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="p-4 bg-orange-500/10 border border-orange-400/20 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-400 mb-1">Recomendação</h4>
                    <p className="text-sm text-gray-300">
                      Evite cafeína após 14h para melhorar a latência do sono 
                      (tempo para adormecer).
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Metas e Progressão */}
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              Metas e Progressão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Meta de duração */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Duração Ideal: 8h</span>
                  <span className="text-sm text-green-400">92%</span>
                </div>
                <Progress value={92} className="h-3 bg-navy-800/50" />
                <p className="text-xs text-gray-400 mt-1">Faltam apenas 30min para atingir o ideal</p>
              </div>

              {/* Meta de consistência */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Consistência Semanal</span>
                  <span className="text-sm text-blue-400">78%</span>
                </div>
                <Progress value={78} className="h-3 bg-navy-800/50" />
                <p className="text-xs text-gray-400 mt-1">5 de 7 noites com sono de qualidade</p>
              </div>

              {/* Meta de eficiência */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Eficiência do Sono</span>
                  <span className="text-sm text-green-400">87%</span>
                </div>
                <Progress value={87} className="h-3 bg-navy-800/50" />
                <p className="text-xs text-gray-400 mt-1">Excelente! Meta de 85% superada</p>
              </div>

              <div className="pt-4 border-t border-navy-600/30">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Target className="w-4 h-4 mr-2" />
                  Ajustar Metas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
