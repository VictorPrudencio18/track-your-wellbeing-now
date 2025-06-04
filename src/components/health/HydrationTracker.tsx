
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Plus, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";

export function HydrationTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [dailyIntake, setDailyIntake] = useState(2.1);
  
  const dailyGoal = 2.5; // 2.5 liters
  const progress = (dailyIntake / dailyGoal) * 100;

  const glassAmounts = [0.25, 0.33, 0.5]; // Different glass sizes in liters

  const addWater = (amount: number) => {
    const newIntake = dailyIntake + amount;
    setDailyIntake(newIntake);
    
    addHealthMetric({
      type: 'hydration',
      value: newIntake,
      date: new Date(),
      notes: `Adicionou ${amount}L`,
    });
  };

  const weeklyHydration = healthMetrics
    .filter(metric => metric.type === 'hydration')
    .slice(0, 7)
    .map((metric, index) => ({
      day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index % 7],
      liters: typeof metric.value === 'number' ? metric.value : 2,
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-blue-700">{dailyIntake.toFixed(1)}L</p>
                <p className="text-xs text-blue-600">{Math.round(progress)}% da meta</p>
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
                <p className="text-sm text-gray-600">Meta Diária</p>
                <p className="text-2xl font-bold text-green-700">{dailyGoal}L</p>
                <p className="text-xs text-gray-600">Recomendado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média Semanal</p>
                <p className="text-2xl font-bold text-purple-700">2.3L</p>
                <p className="text-xs text-green-600">+0.2L vs semana passada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progresso do Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hidratação</span>
                <span>{dailyIntake.toFixed(1)}L / {dailyGoal}L</span>
              </div>
              <Progress value={progress} className="h-4" />
              <p className="text-xs text-gray-600 text-center">
                {progress >= 100 ? '🎉 Meta atingida!' : `Faltam ${(dailyGoal - dailyIntake).toFixed(1)}L para atingir sua meta`}
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-medium">Adicionar água:</p>
              <div className="grid grid-cols-3 gap-3">
                {glassAmounts.map((amount, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => addWater(amount)}
                    className="flex flex-col gap-1 h-auto py-3 hover:bg-blue-50"
                  >
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-xs">{(amount * 1000)}ml</span>
                  </Button>
                ))}
              </div>
              <Button 
                onClick={() => addWater(0.1)} 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Personalizado (100ml)
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Dicas de Hidratação</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Beba um copo ao acordar</li>
                <li>• Mantenha uma garrafa por perto</li>
                <li>• Configure lembretes a cada 2h</li>
                <li>• Aumente durante exercícios</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyHydration.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={(day.liters / dailyGoal) * 100} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{day.liters.toFixed(1)}L</span>
                    {day.liters >= dailyGoal && <span className="text-green-500">✓</span>}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Análise:</strong> Você está mantendo uma boa consistência na hidratação. 
                Continue assim para manter seus níveis de energia e performance!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
