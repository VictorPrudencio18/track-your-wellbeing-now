
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const comparativeData = [
  { period: 'Sem 1', current: 75, previous: 70, goal: 80 },
  { period: 'Sem 2', current: 78, previous: 72, goal: 80 },
  { period: 'Sem 3', current: 82, previous: 75, goal: 80 },
  { period: 'Sem 4', current: 85, previous: 78, goal: 80 }
];

interface ComparativeAnalysisProps {
  timeRange: string;
}

export function ComparativeAnalysis({ timeRange }: ComparativeAnalysisProps) {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-400';
    if (current < previous) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Comparison Chart */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-orange" />
            Análise Comparativa - {timeRange}
          </CardTitle>
          <p className="text-navy-400 text-sm">
            Comparação com períodos anteriores e metas estabelecidas
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="period" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[60, 90]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Legend />
                
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  name="Período Atual"
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  name="Período Anterior"
                  dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Meta"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Comparação Detalhada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comparativeData.map((item, index) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-navy-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{item.period}</span>
                  {getTrendIcon(item.current, item.previous)}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-white font-medium">{item.current}</div>
                    <div className="text-gray-400">vs {item.previous}</div>
                  </div>
                  <div className={`font-medium ${getTrendColor(item.current, item.previous)}`}>
                    {item.current > item.previous ? '+' : ''}
                    {((item.current - item.previous) / item.previous * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Análise de Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                metric: 'Melhoria Geral',
                value: '+13.3%',
                description: 'Comparado ao período anterior',
                type: 'positive'
              },
              {
                metric: 'Meta Atingida',
                value: '3/4 semanas',
                description: 'Superou a meta em 75% do tempo',
                type: 'positive'
              },
              {
                metric: 'Tendência',
                value: 'Crescimento',
                description: 'Evolução consistente e positiva',
                type: 'positive'
              },
              {
                metric: 'Próxima Meta',
                value: '90 pontos',
                description: 'Recomendação baseada no progresso',
                type: 'neutral'
              }
            ].map((analysis, index) => (
              <motion.div
                key={analysis.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-3 bg-navy-700/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{analysis.metric}</span>
                  <Badge className={`text-xs ${
                    analysis.type === 'positive' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    analysis.type === 'negative' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  }`}>
                    {analysis.value}
                  </Badge>
                </div>
                <p className="text-navy-400 text-xs">{analysis.description}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
