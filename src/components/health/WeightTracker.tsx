
import { useState } from "react";
import { Scale, TrendingUp, Target, Calendar } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';
import { HealthCard } from './shared/HealthCard';

export function WeightTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [currentWeight, setCurrentWeight] = useState(72.5);
  const [targetWeight, setTargetWeight] = useState(70);
  const [height, setHeight] = useState(175);

  const bmi = currentWeight / ((height / 100) ** 2);
  const targetData = {
    current: currentWeight,
    target: targetWeight,
    difference: Math.abs(currentWeight - targetWeight),
    direction: currentWeight > targetWeight ? "perder" : "ganhar"
  };

  const progressToTarget = targetWeight < currentWeight 
    ? ((currentWeight - targetData.current) / (currentWeight - targetWeight)) * 100
    : ((targetData.current - currentWeight) / (targetWeight - currentWeight)) * 100;

  const weightData = Array.from({ length: 30 }, (_, i) => ({
    date: `${30 - i}d`,
    weight: 72.5 + (Math.random() - 0.5) * 2,
    target: targetWeight,
  })).reverse();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Abaixo do peso", color: "text-blue-400" };
    if (bmi < 25) return { category: "Peso normal", color: "text-green-400" };
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-400" };
    return { category: "Obesidade", color: "text-red-400" };
  };

  const bmiInfo = getBMICategory(bmi);

  const handleLogWeight = () => {
    addHealthMetric({
      type: 'weight',
      value: currentWeight,
      date: new Date(),
      notes: `Peso registrado: ${currentWeight}kg`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Controle de Peso</h2>
        <p className="text-navy-400">Acompanhe sua evolução e metas de peso</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Peso Atual"
          value={currentWeight}
          unit="kg"
          subtitle="Última medição"
          icon={Scale}
          color="text-blue-400"
          delay={0}
        />
        
        <MetricCard
          title="Meta"
          value={targetWeight}
          unit="kg"
          subtitle={`${targetData.direction} ${targetData.difference.toFixed(1)}kg`}
          icon={Target}
          color="text-green-400"
          delay={0.1}
        />
        
        <MetricCard
          title="IMC"
          value={bmi.toFixed(1)}
          subtitle={bmiInfo.category}
          icon={TrendingUp}
          color={bmiInfo.color}
          delay={0.2}
        />
        
        <MetricCard
          title="Progresso"
          value={Math.round(progressToTarget)}
          unit="%"
          subtitle="Da meta"
          icon={Calendar}
          color="text-accent-orange"
          progress={progressToTarget}
          delay={0.3}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Entry Form */}
        <HealthCard title="Registrar Peso" icon={Scale} delay={0.4}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight" className="text-white/80">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-white/80">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="target" className="text-white/80">Meta de Peso (kg)</Label>
              <Input
                id="target"
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                className="bg-navy-800/50 border-navy-600/30 text-white"
              />
            </div>

            <Button 
              onClick={handleLogWeight} 
              className="w-full bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium"
            >
              Registrar Peso
            </Button>

            <div className="p-4 bg-navy-800/30 rounded-xl border border-navy-600/20">
              <p className="text-sm text-navy-300">
                <strong>Análise:</strong> {
                  targetData.direction === "perder" 
                    ? `Você precisa perder ${targetData.difference.toFixed(1)}kg para atingir sua meta.`
                    : `Você precisa ganhar ${targetData.difference.toFixed(1)}kg para atingir sua meta.`
                }
              </p>
            </div>
          </div>
        </HealthCard>

        {/* Weight Evolution Chart */}
        <ChartContainer 
          title="Evolução do Peso" 
          subtitle="Últimos 30 dias"
          delay={0.5}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '12px',
                    color: '#f8fafc',
                    backdropFilter: 'blur(10px)'
                  }} 
                  labelStyle={{ color: '#f59e0b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2, fill: '#fff' }}
                  name="Peso Atual"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#fbbf24" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
