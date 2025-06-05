
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Calendar } from 'lucide-react';

const weeklyPatternData = [
  { day: 'Dom', wellness: 88, activities: 2 },
  { day: 'Seg', wellness: 72, activities: 4 },
  { day: 'Ter', wellness: 78, activities: 5 },
  { day: 'Qua', wellness: 85, activities: 6 },
  { day: 'Qui', wellness: 82, activities: 5 },
  { day: 'Sex', wellness: 79, activities: 4 },
  { day: 'Sáb', wellness: 90, activities: 3 }
];

const activityTypeData = [
  { name: 'Exercício', value: 35, color: '#3B82F6' },
  { name: 'Meditação', value: 20, color: '#10B981' },
  { name: 'Caminhada', value: 25, color: '#F59E0B' },
  { name: 'Yoga', value: 15, color: '#8B5CF6' },
  { name: 'Outros', value: 5, color: '#6B7280' }
];

interface PatternAnalysisProps {
  timeRange: string;
}

export function PatternAnalysis({ timeRange }: PatternAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Weekly Pattern */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-orange" />
            Padrão Semanal de Bem-estar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar 
                  dataKey="wellness" 
                  fill="url(#wellnessGradient)"
                  name="Bem-estar"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="wellnessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Distribution */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-orange" />
              Distribuição de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Insights */}
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardHeader>
            <CardTitle className="text-white">Insights de Padrões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: 'Fins de Semana Melhores',
                description: 'Bem-estar 15% maior nos fins de semana',
                trend: 'positive'
              },
              {
                title: 'Segunda-feira Desafiadora',
                description: 'Menor score da semana às segundas',
                trend: 'negative'
              },
              {
                title: 'Meio da Semana Estável',
                description: 'Quarta-feira é o dia mais consistente',
                trend: 'neutral'
              },
              {
                title: 'Exercício = Bem-estar',
                description: 'Dias com exercício têm 20% mais bem-estar',
                trend: 'positive'
              }
            ].map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-navy-700/30 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.trend === 'positive' ? 'bg-green-400' :
                  insight.trend === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                  <p className="text-navy-400 text-xs">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
