import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, TrendingUp, Target, Calendar } from "lucide-react";
import { useState } from "react";
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WeightTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [currentWeight, setCurrentWeight] = useState(72.5);
  const [targetWeight, setTargetWeight] = useState(70);
  const [height, setHeight] = useState(175); // cm

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

  const weightData = healthMetrics
    .filter(metric => metric.type === 'weight')
    .slice(0, 30)
    .map((metric, index) => ({
      date: `${30 - index}d`,
      weight: typeof metric.value === 'number' ? metric.value : 72,
      target: targetWeight,
    })).reverse();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Abaixo do peso", color: "text-blue-600" };
    if (bmi < 25) return { category: "Peso normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Sobrepeso", color: "text-yellow-600" };
    return { category: "Obesidade", color: "text-red-600" };
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Peso Atual</p>
                <p className="text-2xl font-bold text-blue-700">{currentWeight} kg</p>
                <p className="text-xs text-gray-600">Última medição</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meta</p>
                <p className="text-2xl font-bold text-green-700">{targetWeight} kg</p>
                <p className="text-xs text-gray-600">{targetData.direction} {targetData.difference.toFixed(1)}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">IMC</p>
                <p className="text-2xl font-bold text-purple-700">{bmi.toFixed(1)}</p>
                <p className={`text-xs ${bmiInfo.color}`}>{bmiInfo.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-full">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-orange-700">{Math.round(progressToTarget)}%</p>
                <p className="text-xs text-gray-600">Da meta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Registrar Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="target">Meta de Peso (kg)</Label>
              <Input
                id="target"
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso para meta</span>
                <span>{Math.round(progressToTarget)}%</span>
              </div>
              <Progress value={progressToTarget} className="h-3" />
            </div>
            <Button onClick={handleLogWeight} className="w-full">
              Registrar Peso
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Peso Atual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Meta"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Análise:</strong> {
                  targetData.direction === "perder" 
                    ? `Você precisa perder ${targetData.difference.toFixed(1)}kg para atingir sua meta.`
                    : `Você precisa ganhar ${targetData.difference.toFixed(1)}kg para atingir sua meta.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
