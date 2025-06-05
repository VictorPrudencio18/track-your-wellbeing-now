
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useSleepRecords } from '@/hooks/useSleep';

export function SleepAnalytics() {
  const { data: sleepRecords, isLoading } = useSleepRecords();
  const [timeRange, setTimeRange] = useState('30');

  // Filtrar dados baseado no período selecionado
  const filteredRecords = sleepRecords?.slice(0, parseInt(timeRange)) || [];

  // Preparar dados para gráficos
  const chartData = filteredRecords
    .reverse()
    .map(record => ({
      date: new Date(record.sleep_date).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      score: record.calculated_scores?.overall_score || 0,
      duration: record.sleep_duration ? record.sleep_duration / 60 : 0,
      quality: record.subjective_quality || 0,
      latency: record.sleep_latency || 0,
      wakeCount: record.wake_count || 0,
    }));

  // Calcular estatísticas
  const stats = {
    avgScore: filteredRecords.length > 0 
      ? filteredRecords.reduce((sum, r) => sum + (r.calculated_scores?.overall_score || 0), 0) / filteredRecords.length
      : 0,
    avgDuration: filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + (r.sleep_duration || 0), 0) / filteredRecords.length / 60
      : 0,
    avgQuality: filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + (r.subjective_quality || 0), 0) / filteredRecords.length
      : 0,
    avgLatency: filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + (r.sleep_latency || 0), 0) / filteredRecords.length
      : 0,
  };

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
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Análises de Sono</h2>
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

      {/* Estatísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-navy-700/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {stats.avgScore.toFixed(0)}
              </div>
              <div className="text-xs text-gray-400">Score Médio</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-700/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.avgDuration.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-400">Duração Média</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-700/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.avgQuality.toFixed(1)}/10
              </div>
              <div className="text-xs text-gray-400">Qualidade Média</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-700/30">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.avgLatency.toFixed(0)}min
              </div>
              <div className="text-xs text-gray-400">Latência Média</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Score e Duração */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-orange" />
              Tendência de Score e Duração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Score"
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Duração (h)"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gráfico de Qualidade Subjetiva */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-orange" />
              Qualidade Subjetiva e Tempo para Adormecer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="quality" 
                    fill="#10B981" 
                    name="Qualidade (/10)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Latência (min)"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Análise de Padrões */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-orange" />
              Padrões Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-300">Tendências Positivas</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {stats.avgScore >= 70 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Score médio acima de 70 pontos
                    </li>
                  )}
                  {stats.avgDuration >= 7 && stats.avgDuration <= 9 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Duração dentro da faixa ideal (7-9h)
                    </li>
                  )}
                  {stats.avgLatency <= 20 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Tempo para adormecer saudável
                    </li>
                  )}
                  {filteredRecords.length === 0 && (
                    <li className="text-gray-500">
                      Registre mais dados para análise de padrões
                    </li>
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-300">Áreas de Melhoria</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  {stats.avgScore < 60 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Score médio abaixo do ideal
                    </li>
                  )}
                  {stats.avgDuration < 7 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Duração abaixo do recomendado
                    </li>
                  )}
                  {stats.avgLatency > 30 && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      Demora para adormecer pode indicar insônia
                    </li>
                  )}
                  {filteredRecords.length === 0 && (
                    <li className="text-gray-500">
                      Registre mais dados para análise de problemas
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
