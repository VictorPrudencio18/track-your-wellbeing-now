
import { useState } from "react";
import { Moon, Sun, Clock, TrendingUp, Zap } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';
import { HealthCard } from './shared/HealthCard';

export function SleepTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [bedTime, setBedTime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [quality, setQuality] = useState(8);

  const sleepData = healthMetrics
    .filter(metric => metric.type === 'sleep')
    .slice(0, 7)
    .map(metric => ({
      hours: typeof metric.value === 'object' ? (metric.value as any).hours : 7,
      quality: typeof metric.value === 'object' ? (metric.value as any).quality : 8,
      date: metric.date.toLocaleDateString('pt-BR', { weekday: 'short' })
    }));

  const avgSleep = sleepData.reduce((sum, data) => sum + data.hours, 0) / (sleepData.length || 1);
  const avgQuality = sleepData.reduce((sum, data) => sum + data.quality, 0) / (sleepData.length || 1);

  const sleepPhases = [
    { name: 'Sono Profundo', value: 32, color: '#1e40af' },
    { name: 'Sono Leve', value: 45, color: '#3b82f6' },
    { name: 'REM', value: 18, color: '#60a5fa' },
    { name: 'Acordado', value: 5, color: '#93c5fd' },
  ];

  const handleLogSleep = () => {
    const bedHour = parseInt(bedTime.split(':')[0]);
    const bedMin = parseInt(bedTime.split(':')[1]);
    const wakeHour = parseInt(wakeTime.split(':')[0]);
    const wakeMin = parseInt(wakeTime.split(':')[1]);
    
    let sleepHours = (wakeHour + (wakeMin / 60)) - (bedHour + (bedMin / 60));
    if (sleepHours < 0) sleepHours += 24;

    addHealthMetric({
      type: 'sleep',
      value: { hours: parseFloat(sleepHours.toFixed(1)), quality },
      date: new Date(),
      notes: `Dormiu às ${bedTime}, acordou às ${wakeTime}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Monitor de Sono</h2>
        <p className="text-navy-400">Acompanhe a qualidade e duração do seu sono</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Média de Sono"
          value={avgSleep.toFixed(1)}
          unit="h"
          subtitle="+0.5h vs semana passada"
          icon={Moon}
          color="text-indigo-400"
          delay={0}
        />
        
        <MetricCard
          title="Qualidade"
          value={avgQuality.toFixed(1)}
          unit="/10"
          subtitle="Muito boa"
          icon={Zap}
          color="text-blue-400"
          progress={avgQuality * 10}
          delay={0.1}
        />
        
        <MetricCard
          title="Eficiência"
          value={92}
          unit="%"
          subtitle="Tempo na cama"
          icon={Sun}
          color="text-amber-400"
          progress={92}
          delay={0.2}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sleep Entry Form */}
        <HealthCard title="Registrar Sono" icon={Clock} delay={0.3}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedTime" className="text-white/80">Hora de Dormir</Label>
                <Input
                  id="bedTime"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="wakeTime" className="text-white/80">Hora de Acordar</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="quality" className="text-white/80">Qualidade do Sono (1-10)</Label>
              <div className="flex items-center gap-3 mt-2">
                <Input
                  id="quality"
                  type="number"
                  min="1"
                  max="10"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-20 bg-navy-800/50 border-navy-600/30 text-white"
                />
                <div className="flex-1 bg-navy-700/50 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange/80 transition-all duration-500"
                    style={{ width: `${quality * 10}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white">{quality}/10</span>
              </div>
            </div>
            
            <Button 
              onClick={handleLogSleep} 
              className="w-full bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium"
            >
              Registrar Sono
            </Button>

            <div className="p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
              <h4 className="font-medium text-white text-sm mb-2">💡 Dicas para Melhor Sono</h4>
              <ul className="text-xs text-navy-300 space-y-1">
                <li>• Evite telas 1h antes de dormir</li>
                <li>• Mantenha o quarto fresco e escuro</li>
                <li>• Pratique relaxamento ou meditação</li>
                <li>• Tenha horários regulares de sono</li>
              </ul>
            </div>
          </div>
        </HealthCard>

        {/* Sleep Phases Chart */}
        <ChartContainer 
          title="Fases do Sono" 
          subtitle="Distribuição da última noite"
          delay={0.4}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sleepPhases}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sleepPhases.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4">
            {sleepPhases.map((phase, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: phase.color }}
                  />
                  <span className="text-sm text-white">{phase.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{phase.value}%</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
            <p className="text-sm text-navy-300">
              <strong className="text-white">Análise:</strong> Seu sono profundo está na faixa ideal (25-35%). 
              Continue mantendo uma rotina consistente para otimizar a recuperação.
            </p>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
