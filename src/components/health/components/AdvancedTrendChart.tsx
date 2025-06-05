
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const advancedTrendData = [
  { date: '01/12', wellness: 75, sleep: 7.5, exercise: 30, stress: 4 },
  { date: '02/12', wellness: 78, sleep: 8.0, exercise: 45, stress: 3 },
  { date: '03/12', wellness: 82, sleep: 7.8, exercise: 60, stress: 2 },
  { date: '04/12', wellness: 80, sleep: 7.2, exercise: 0, stress: 5 },
  { date: '05/12', wellness: 85, sleep: 8.5, exercise: 75, stress: 2 },
  { date: '06/12', wellness: 88, sleep: 8.2, exercise: 90, stress: 1 },
  { date: '07/12', wellness: 84, sleep: 7.9, exercise: 30, stress: 3 }
];

interface AdvancedTrendChartProps {
  timeRange: string;
}

export function AdvancedTrendChart({ timeRange }: AdvancedTrendChartProps) {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-orange" />
          Análise de Tendências Avançada
        </CardTitle>
        <p className="text-navy-400 text-sm">
          Correlação entre atividades e bem-estar ao longo do tempo
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={advancedTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
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
              <Legend />
              
              {/* Bars for exercise */}
              <Bar 
                dataKey="exercise" 
                fill="#3B82F6" 
                name="Exercício (min)"
                opacity={0.7}
              />
              
              {/* Lines for wellness and sleep */}
              <Line 
                type="monotone" 
                dataKey="wellness" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Bem-estar"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Sono (h)"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                yAxisId="right"
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Stress"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-accent-orange font-medium">Bem-estar Médio</div>
            <div className="text-white text-lg">82.3</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-medium">Sono Médio</div>
            <div className="text-white text-lg">7.9h</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-medium">Exercício Total</div>
            <div className="text-white text-lg">330min</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-medium">Stress Médio</div>
            <div className="text-white text-lg">2.9</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
