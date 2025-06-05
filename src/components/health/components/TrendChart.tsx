
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

const trendData = [
  { day: 'Seg', wellness: 75, energy: 80, mood: 70 },
  { day: 'Ter', wellness: 78, energy: 75, mood: 85 },
  { day: 'Qua', wellness: 82, energy: 85, mood: 80 },
  { day: 'Qui', wellness: 80, energy: 78, mood: 75 },
  { day: 'Sex', wellness: 85, energy: 90, mood: 88 },
  { day: 'Sáb', wellness: 88, energy: 85, mood: 90 },
  { day: 'Dom', wellness: 84, energy: 82, mood: 85 }
];

export function TrendChart() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent-orange" />
          Tendências da Semana
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
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
                dataKey="energy" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Energia"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Humor"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-orange"></div>
            <span className="text-navy-300">Bem-estar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-navy-300">Energia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-navy-300">Humor</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
