
import { useState } from "react";
import { Smile, Sun, Zap } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';
import { HealthCard } from './shared/HealthCard';

export function MoodTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [selectedMood, setSelectedMood] = useState(7);
  const [selectedEnergy, setSelectedEnergy] = useState(6);
  const [notes, setNotes] = useState("");

  const moodLevels = [
    { value: 1, label: "Muito triste", icon: "😢", color: "bg-red-500" },
    { value: 3, label: "Desanimado", icon: "😕", color: "bg-orange-400" },
    { value: 5, label: "Ok", icon: "🙂", color: "bg-yellow-400" },
    { value: 7, label: "Muito bem", icon: "😁", color: "bg-green-500" },
    { value: 10, label: "Eufórico", icon: "🥳", color: "bg-purple-500" },
  ];

  const energyLevels = [
    { value: 1, label: "Exausto", icon: "🔋", color: "bg-red-500" },
    { value: 3, label: "Cansado", icon: "😴", color: "bg-orange-400" },
    { value: 5, label: "Normal", icon: "😌", color: "bg-yellow-400" },
    { value: 7, label: "Energizado", icon: "⚡", color: "bg-green-400" },
    { value: 10, label: "Muito energia", icon: "🚀", color: "bg-blue-500" },
  ];

  const weeklyMoodData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
    mood: Math.floor(Math.random() * 5) + 5,
    energy: Math.floor(Math.random() * 4) + 5,
  }));

  const avgMood = weeklyMoodData.reduce((sum, data) => sum + data.mood, 0) / weeklyMoodData.length;
  const avgEnergy = weeklyMoodData.reduce((sum, data) => sum + data.energy, 0) / weeklyMoodData.length;

  const handleLogMood = () => {
    addHealthMetric({
      type: 'mood',
      value: selectedMood,
      date: new Date(),
      notes: `Humor: ${selectedMood}/10, Energia: ${selectedEnergy}/10. ${notes}`,
    });
    setNotes("");
  };

  const getMoodIcon = (value: number) => {
    const mood = moodLevels.find(m => m.value <= value) || moodLevels[2];
    return mood.icon;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Monitor de Humor</h2>
        <p className="text-navy-400">Acompanhe seu bem-estar emocional e energia</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Humor Médio"
          value={avgMood.toFixed(1)}
          unit="/10"
          subtitle="Última semana"
          icon={Smile}
          color="text-yellow-400"
          progress={avgMood * 10}
          delay={0}
        />
        
        <MetricCard
          title="Energia Média"
          value={avgEnergy.toFixed(1)}
          unit="/10"
          subtitle="Última semana"
          icon={Zap}
          color="text-blue-400"
          progress={avgEnergy * 10}
          delay={0.1}
        />
        
        <MetricCard
          title="Bem-estar"
          value={((avgMood + avgEnergy) / 2).toFixed(1)}
          unit="/10"
          subtitle="Ótimo equilíbrio"
          icon={Sun}
          color="text-green-400"
          progress={((avgMood + avgEnergy) / 2) * 10}
          delay={0.2}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Entry Form */}
        <HealthCard title="Registrar Humor e Energia" icon={Smile} delay={0.3}>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block text-white">
                Como você se sente hoje? {getMoodIcon(selectedMood)} ({selectedMood}/10)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodLevels.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={`h-16 flex flex-col gap-1 text-xs ${
                      selectedMood === mood.value 
                        ? mood.color + ' text-white border-transparent' 
                        : 'bg-navy-800/50 border-navy-600/30 text-white hover:bg-navy-700/50'
                    }`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-lg">{mood.icon}</span>
                    <span>{mood.value}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block text-white">
                Nível de energia? ⚡ ({selectedEnergy}/10)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {energyLevels.map((energy) => (
                  <Button
                    key={energy.value}
                    variant={selectedEnergy === energy.value ? "default" : "outline"}
                    className={`h-16 flex flex-col gap-1 text-xs ${
                      selectedEnergy === energy.value 
                        ? energy.color + ' text-white border-transparent' 
                        : 'bg-navy-800/50 border-navy-600/30 text-white hover:bg-navy-700/50'
                    }`}
                    onClick={() => setSelectedEnergy(energy.value)}
                  >
                    <span className="text-lg">{energy.icon}</span>
                    <span>{energy.value}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-white">Notas (opcional)</label>
              <Textarea
                placeholder="Como foi seu dia? O que influenciou seu humor?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] bg-navy-800/50 border-navy-600/30 text-white placeholder:text-navy-400"
              />
            </div>

            <Button 
              onClick={handleLogMood} 
              className="w-full bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium"
            >
              Registrar Estado de Humor
            </Button>
          </div>
        </HealthCard>

        {/* Weekly Trends Chart */}
        <ChartContainer 
          title="Tendências Semanais" 
          subtitle="Humor e energia dos últimos 7 dias"
          delay={0.4}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyMoodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                    border: '1px solid rgba(245, 158, 11, 0.2)', 
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }} 
                />
                <Bar dataKey="mood" fill="#f59e0b" name="Humor" radius={[2, 2, 0, 0]} />
                <Bar dataKey="energy" fill="#3b82f6" name="Energia" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <h4 className="font-medium text-blue-300 mb-2">💡 Correlações Identificadas</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Exercícios matutinos → +2 pontos no humor</li>
              <li>• Sono &gt; 7h → +1.5 pontos na energia</li>
              <li>• Meditação → +1 ponto no bem-estar geral</li>
            </ul>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
