
import { useState } from "react";
import { Droplets, Plus, Target, TrendingUp } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';
import { HealthCard } from './shared/HealthCard';

export function HydrationTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [dailyIntake, setDailyIntake] = useState(2.1);
  
  const dailyGoal = 2.5;
  const progress = (dailyIntake / dailyGoal) * 100;
  const glassAmounts = [0.25, 0.33, 0.5];

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

  const weeklyHydration = Array.from({ length: 7 }, (_, i) => ({
    day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
    liters: 2 + Math.random() * 1,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Controle de Hidratação</h2>
        <p className="text-navy-400">Mantenha-se hidratado para um melhor desempenho</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Hoje"
          value={dailyIntake.toFixed(1)}
          unit="L"
          subtitle={`${Math.round(progress)}% da meta`}
          icon={Droplets}
          color="text-blue-400"
          progress={progress}
          delay={0}
        />
        
        <MetricCard
          title="Meta Diária"
          value={dailyGoal}
          unit="L"
          subtitle="Recomendado"
          icon={Target}
          color="text-green-400"
          delay={0.1}
        />
        
        <MetricCard
          title="Média Semanal"
          value="2.3"
          unit="L"
          subtitle="+0.2L vs semana passada"
          icon={TrendingUp}
          color="text-purple-400"
          delay={0.2}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hydration Control */}
        <HealthCard title="Adicionar Água" icon={Droplets} delay={0.3}>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white">Hidratação</span>
                <span className="text-white">{dailyIntake.toFixed(1)}L / {dailyGoal}L</span>
              </div>
              <div className="w-full bg-navy-700/50 rounded-full h-4">
                <div 
                  className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-navy-400 text-center">
                {progress >= 100 ? '🎉 Meta atingida!' : `Faltam ${(dailyGoal - dailyIntake).toFixed(1)}L para atingir sua meta`}
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-medium text-white">Adicionar água:</p>
              <div className="grid grid-cols-3 gap-3">
                {glassAmounts.map((amount, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => addWater(amount)}
                    className="flex flex-col gap-1 h-auto py-3 bg-navy-800/50 border-navy-600/30 text-white hover:bg-navy-700/50"
                  >
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <span className="text-xs">{(amount * 1000)}ml</span>
                  </Button>
                ))}
              </div>
              <Button 
                onClick={() => addWater(0.1)} 
                variant="outline" 
                className="w-full flex items-center gap-2 bg-navy-800/50 border-navy-600/30 text-white hover:bg-navy-700/50"
              >
                <Plus className="w-4 h-4" />
                Personalizado (100ml)
              </Button>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-medium text-blue-300 mb-2">💡 Dicas de Hidratação</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Beba um copo ao acordar</li>
                <li>• Mantenha uma garrafa por perto</li>
                <li>• Configure lembretes a cada 2h</li>
                <li>• Aumente durante exercícios</li>
              </ul>
            </div>
          </div>
        </HealthCard>

        {/* Weekly History */}
        <ChartContainer 
          title="Histórico Semanal" 
          subtitle="Progresso dos últimos 7 dias"
          delay={0.4}
        >
          <div className="space-y-4">
            {weeklyHydration.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium w-12 text-white">{day.day}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-navy-700/50 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                      style={{ width: `${(day.liters / dailyGoal) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-navy-300">{day.liters.toFixed(1)}L</span>
                  {day.liters >= dailyGoal && <span className="text-green-400">✓</span>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
            <p className="text-sm text-navy-300">
              <strong className="text-white">Análise:</strong> Você está mantendo uma boa consistência na hidratação. 
              Continue assim para manter seus níveis de energia e performance!
            </p>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
