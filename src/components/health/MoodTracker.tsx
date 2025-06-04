
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Frown, Meh, Sun, Zap, Coffee } from "lucide-react";
import { useState } from "react";
import { useHealth } from "@/contexts/HealthContext";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MoodTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [selectedMood, setSelectedMood] = useState(7);
  const [selectedEnergy, setSelectedEnergy] = useState(6);
  const [notes, setNotes] = useState("");

  const moodLevels = [
    { value: 1, label: "Muito triste", icon: "😢", color: "bg-red-500" },
    { value: 2, label: "Triste", icon: "😞", color: "bg-red-400" },
    { value: 3, label: "Desanimado", icon: "😕", color: "bg-orange-400" },
    { value: 4, label: "Neutro", icon: "😐", color: "bg-gray-400" },
    { value: 5, label: "Ok", icon: "🙂", color: "bg-yellow-400" },
    { value: 6, label: "Bem", icon: "😊", color: "bg-green-400" },
    { value: 7, label: "Muito bem", icon: "😁", color: "bg-green-500" },
    { value: 8, label: "Ótimo", icon: "😄", color: "bg-blue-400" },
    { value: 9, label: "Excelente", icon: "🤩", color: "bg-blue-500" },
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
    mood: Math.floor(Math.random() * 5) + 5, // 5-9
    energy: Math.floor(Math.random() * 4) + 5, // 5-8
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
    const mood = moodLevels.find(m => m.value === value) || moodLevels[6];
    return mood.icon;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500 rounded-full">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Humor Médio</p>
                <p className="text-2xl font-bold text-yellow-700">{avgMood.toFixed(1)}/10</p>
                <Progress value={avgMood * 10} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Energia Média</p>
                <p className="text-2xl font-bold text-blue-700">{avgEnergy.toFixed(1)}/10</p>
                <Progress value={avgEnergy * 10} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-full">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bem-estar</p>
                <p className="text-2xl font-bold text-green-700">{((avgMood + avgEnergy) / 2).toFixed(1)}/10</p>
                <p className="text-xs text-green-600">Ótimo equilíbrio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Registrar Humor e Energia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Como você se sente hoje? {getMoodIcon(selectedMood)} ({selectedMood}/10)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodLevels.filter((_, i) => i % 2 === 0 || [4, 6, 8].includes(i)).map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={`h-16 flex flex-col gap-1 text-xs ${
                      selectedMood === mood.value ? mood.color + ' text-white' : ''
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
              <label className="text-sm font-medium mb-3 block">
                Nível de energia? ⚡ ({selectedEnergy}/10)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {energyLevels.map((energy) => (
                  <Button
                    key={energy.value}
                    variant={selectedEnergy === energy.value ? "default" : "outline"}
                    className={`h-16 flex flex-col gap-1 text-xs ${
                      selectedEnergy === energy.value ? energy.color + ' text-white' : ''
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
              <label className="text-sm font-medium mb-2 block">Notas (opcional)</label>
              <Textarea
                placeholder="Como foi seu dia? O que influenciou seu humor?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button onClick={handleLogMood} className="w-full">
              Registrar Estado de Humor
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendências Semanais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMoodData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis domain={[0, 10]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <Bar dataKey="mood" fill="#f59e0b" name="Humor" />
                  <Bar dataKey="energy" fill="#3b82f6" name="Energia" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Correlações Identificadas</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Exercícios matutinos → +2 pontos no humor</li>
                  <li>• Sono >7h → +1.5 pontos na energia</li>
                  <li>• Meditação → +1 ponto no bem-estar geral</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
