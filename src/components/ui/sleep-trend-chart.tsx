
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Moon, Zap } from 'lucide-react';

interface SleepTrendChartProps {
  data: Array<{
    date: string;
    score: number;
    duration: number;
    quality: number;
    efficiency: number;
  }>;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SleepTrendChart({ data, title, subtitle, className }: SleepTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-accent-orange/10 to-transparent rounded-full blur-3xl" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-white">{title}</CardTitle>
                {subtitle && (
                  <p className="text-sm text-gray-400">{subtitle}</p>
                )}
              </div>
            </div>
            
            {/* Floating indicators */}
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Moon className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">Sleep Quality</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
              >
                <Zap className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Efficiency</span>
              </motion.div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  labelStyle={{ color: '#f8fafc' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#sleepGradient)"
                  name="Sleep Score"
                />
                
                <Area
                  type="monotone"
                  dataKey="quality"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#qualityGradient)"
                  name="Quality"
                />
                
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Efficiency"
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart insights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
              <div className="text-sm text-gray-400">Score Médio</div>
              <div className="text-lg font-bold text-purple-400">
                {(data.reduce((sum, d) => sum + d.score, 0) / data.length).toFixed(0)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
              <div className="text-sm text-gray-400">Qualidade Média</div>
              <div className="text-lg font-bold text-blue-400">
                {(data.reduce((sum, d) => sum + d.quality, 0) / data.length).toFixed(1)}
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-400/20">
              <div className="text-sm text-gray-400">Eficiência Média</div>
              <div className="text-lg font-bold text-green-400">
                {(data.reduce((sum, d) => sum + d.efficiency, 0) / data.length).toFixed(0)}%
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
