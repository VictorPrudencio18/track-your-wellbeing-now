
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { useHealth } from "@/contexts/HealthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function BloodPressureTracker() {
  const { healthMetrics, addHealthMetric } = useHealth();
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [notes, setNotes] = useState("");

  const pressureData = [
    { date: '1/12', systolic: 118, diastolic: 78 },
    { date: '3/12', systolic: 122, diastolic: 82 },
    { date: '5/12', systolic: 115, diastolic: 75 },
    { date: '7/12', systolic: 125, diastolic: 85 },
    { date: '9/12', systolic: 120, diastolic: 80 },
    { date: '11/12', systolic: 117, diastolic: 77 },
    { date: 'Hoje', systolic: systolic, diastolic: diastolic },
  ];

  const getBloodPressureCategory = (sys: number, dia: number) => {
    if (sys < 90 || dia < 60) return { category: "Hipotensão", color: "text-blue-600", alert: true };
    if (sys < 120 && dia < 80) return { category: "Normal", color: "text-green-600", alert: false };
    if (sys < 130 && dia < 80) return { category: "Elevada", color: "text-yellow-600", alert: false };
    if (sys < 140 || dia < 90) return { category: "Hipertensão Estágio 1", color: "text-orange-600", alert: true };
    if (sys < 180 || dia < 120) return { category: "Hipertensão Estágio 2", color: "text-red-600", alert: true };
    return { category: "Crise Hipertensiva", color: "text-red-800", alert: true };
  };

  const currentCategory = getBloodPressureCategory(systolic, diastolic);
  const avgSystolic = pressureData.reduce((sum, data) => sum + data.systolic, 0) / pressureData.length;
  const avgDiastolic = pressureData.reduce((sum, data) => sum + data.diastolic, 0) / pressureData.length;

  const handleLogPressure = () => {
    addHealthMetric({
      type: 'bloodPressure',
      value: { systolic, diastolic },
      date: new Date(),
      notes: notes || `PA: ${systolic}/${diastolic} mmHg`,
    });
    setNotes("");
  };

  const getRecommendation = () => {
    if (currentCategory.category === "Normal") {
      return "Pressão arterial normal. Continue mantendo hábitos saudáveis.";
    }
    if (currentCategory.category === "Elevada") {
      return "Pressão elevada. Considere reduzir sal e aumentar exercícios.";
    }
    if (currentCategory.alert) {
      return "Consulte um médico para avaliação e possível tratamento.";
    }
    return "Monitore regularmente e mantenha hábitos saudáveis.";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pressão Atual</p>
                <p className="text-xl font-bold text-red-700">{systolic}/{diastolic}</p>
                <p className="text-xs text-gray-600">mmHg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-full">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média Semanal</p>
                <p className="text-xl font-bold text-blue-700">{Math.round(avgSystolic)}/{Math.round(avgDiastolic)}</p>
                <p className="text-xs text-gray-600">mmHg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${currentCategory.alert ? 'from-yellow-50 to-orange-50 border-yellow-200' : 'from-green-50 to-emerald-50 border-green-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${currentCategory.alert ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {currentCategory.alert ? <AlertTriangle className="w-6 h-6 text-white" /> : <Heart className="w-6 h-6 text-white" />}
              </div>
              <div>
                <p className="text-sm text-gray-600">Categoria</p>
                <p className={`text-sm font-bold ${currentCategory.color}`}>{currentCategory.category}</p>
                <p className="text-xs text-gray-600">Classificação</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-full">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Medição</p>
                <p className="text-xl font-bold text-purple-700">Agora</p>
                <p className="text-xs text-gray-600">Há 0 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Registrar Pressão Arterial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(parseInt(e.target.value))}
                  min="60"
                  max="250"
                />
              </div>
              <div>
                <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(parseInt(e.target.value))}
                  min="40"
                  max="150"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                placeholder="Ex: manhã, após exercício, estresse..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className={`p-4 rounded-lg ${currentCategory.alert ? 'bg-yellow-50' : 'bg-green-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${currentCategory.color}`}>
                  {currentCategory.alert ? '⚠️' : '✅'}
                </span>
                <h4 className={`font-medium ${currentCategory.color}`}>
                  {currentCategory.category}
                </h4>
              </div>
              <p className="text-sm text-gray-700">{getRecommendation()}</p>
            </div>

            <Button onClick={handleLogPressure} className="w-full">
              Registrar Pressão
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pressão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pressureData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[60, 160]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                    }} 
                  />
                  <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" label="Normal (120)" />
                  <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" label="Normal (80)" />
                  <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" label="Hipertensão" />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    name="Sistólica"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Diastólica"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Faixas de Referência:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Normal: &lt;120/80</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Elevada: 120-129/&lt;80</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Estágio 1: 130-139/80-89</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Estágio 2: ≥140/90</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
