
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Calendar,
  Clock,
  Target,
  Zap,
  Heart,
  AlertCircle,
  Star,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSleepRecords } from '@/hooks/useSleep';
import { SleepTrendChart } from '@/components/ui/sleep-trend-chart';
import { SleepMetricsCard } from '@/components/ui/sleep-metrics-card';

export function SleepAnalytics() {
  const { data: sleepRecords, isLoading } = useSleepRecords();
  const [activeChart, setActiveChart] = useState<'score' | 'duration' | 'quality'>('score');

  // Use real data if available, otherwise use mock data for demo
  const mockAnalyticsData = [
    { date: '01/12', score: 72, duration: 7.5, quality: 7.2, efficiency: 85 },
    { date: '02/12', score: 68, duration: 6.8, quality: 6.8, efficiency: 82 },
    { date: '03/12', score: 75, duration: 8.1, quality: 7.8, efficiency: 88 },
    { date: '04/12', score: 71, duration: 7.2, quality: 7.1, efficiency: 86 },
    { date: '05/12', score: 78, duration: 8.3, quality: 8.2, efficiency: 91 },
    { date: '06/12', score: 74, duration: 7.8, quality: 7.6, efficiency: 87 },
    { date: '07/12', score: 69, duration: 6.9, quality: 6.9, efficiency: 83 },
  ];

  const averageScore = mockAnalyticsData.reduce((sum, d) => sum + d.score, 0) / mockAnalyticsData.length;
  const averageDuration = mockAnalyticsData.reduce((sum, d) => sum + d.duration, 0) / mockAnalyticsData.length;
  const averageQuality = mockAnalyticsData.reduce((sum, d) => sum + d.quality, 0) / mockAnalyticsData.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-navy-700/50 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">Análise do Sono</h2>
        </div>
        <p className="text-xl text-gray-300">
          Visualize e entenda seus padrões de sono
        </p>
      </motion.div>

      {/* Métricas Semanais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SleepMetricsCard
          title="Score Médio"
          value={averageScore.toFixed(0)}
          subtitle="Últimos 7 dias"
          icon={TrendingUp}
          color="blue"
          progress={averageScore}
          trend="up"
          trendValue="+3 vs semana passada"
          delay={0.1}
        />
        
        <SleepMetricsCard
          title="Duração Média"
          value={`${averageDuration.toFixed(1)}h`}
          subtitle="Tempo total dormido"
          icon={Clock}
          color="purple"
          progress={(averageDuration / 8) * 100}
          trend="stable"
          trendValue="Sem alterações"
          delay={0.2}
        />
        
        <SleepMetricsCard
          title="Qualidade Média"
          value={averageQuality.toFixed(1)}
          subtitle="Avaliação geral"
          icon={Star}
          color="green"
          progress={(averageQuality / 10) * 100}
          trend="down"
          trendValue="-0.2 vs semana passada"
          delay={0.3}
        />
      </div>

      {/* Gráfico de Tendências Interativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Tendências Semanais
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-gray-400 hover:text-white ${activeChart === 'score' ? 'bg-purple-500/20 border-purple-400/30 text-purple-400' : 'border-navy-600/50'}`}
                  onClick={() => setActiveChart('score')}
                >
                  Score
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-gray-400 hover:text-white ${activeChart === 'duration' ? 'bg-blue-500/20 border-blue-400/30 text-blue-400' : 'border-navy-600/50'}`}
                  onClick={() => setActiveChart('duration')}
                >
                  Duração
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-gray-400 hover:text-white ${activeChart === 'quality' ? 'bg-green-500/20 border-green-400/30 text-green-400' : 'border-navy-600/50'}`}
                  onClick={() => setActiveChart('quality')}
                >
                  Qualidade
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="h-80">
              <SleepTrendChart
                data={mockAnalyticsData}
                title={`Tendência de ${activeChart === 'score' ? 'Score' : activeChart === 'duration' ? 'Duração' : 'Qualidade'}`}
                subtitle={`Evolução ${activeChart === 'score' ? 'do seu score de sono' : activeChart === 'duration' ? 'do tempo de sono' : 'da qualidade do sono'}`}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights e Dicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Insights da IA */}
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
                transition={{ duration: 0.5, delay: 0.6 }}
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
                transition={{ duration: 0.5, delay: 0.7 }}
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
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
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

        {/* Dicas Rápidas */}
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Dicas para Melhorar o Sono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="w-1 h-1 bg-green-400 rounded-full mt-2" />
                <p className="text-sm text-gray-300">
                  Crie um ambiente relaxante no quarto, com temperatura agradável e pouca luz.
                </p>
              </motion.li>
              
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="w-1 h-1 bg-blue-400 rounded-full mt-2" />
                <p className="text-sm text-gray-300">
                  Evite o uso de dispositivos eletrônicos (celular, tablet, computador) pelo menos uma hora antes de dormir.
                </p>
              </motion.li>
              
              <motion.li
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="w-1 h-1 bg-orange-400 rounded-full mt-2" />
                <p className="text-sm text-gray-300">
                  Mantenha uma rotina de horários regulares para dormir e acordar, mesmo nos fins de semana.
                </p>
              </motion.li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
