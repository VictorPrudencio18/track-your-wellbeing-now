
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface SleepTrendData {
  date: string;
  score: number;
  duration: number;
  quality: number;
  efficiency: number;
}

interface SleepTrendChartProps {
  data: SleepTrendData[];
  title?: string;
  subtitle?: string;
}

export function SleepTrendChart({
  data,
  title = "Tendências de Sono",
  subtitle = "Análise dos últimos 7 dias"
}: SleepTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5" />
        <CardHeader className="relative z-10 pb-2">
          <div>
            <CardTitle className="text-white">{title}</CardTitle>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#cccccc', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#666666', strokeWidth: 1, opacity: 0.3 }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#cccccc', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  orientation="left"
                />
                <YAxis
                  yAxisId="right"
                  tick={{ fill: '#cccccc', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 12]}
                  orientation="right"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 24, 38, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    color: 'white',
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 20,
                    color: '#cccccc',
                  }}
                />
                <ReferenceLine
                  y={80}
                  yAxisId="left"
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Meta',
                    fill: '#10b981',
                    fontSize: 12,
                    position: 'right',
                  }}
                />
                <ReferenceLine
                  y={8}
                  yAxisId="right"
                  stroke="#6366f1"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Ideal',
                    fill: '#6366f1',
                    fontSize: 12,
                    position: 'left',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  yAxisId="left"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="duration"
                  name="Duração (h)"
                  yAxisId="right"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={300}
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  name="Qualidade"
                  yAxisId="right"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#ec4899' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={600}
                />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="Eficiência (%)"
                  yAxisId="left"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                  animationBegin={900}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
