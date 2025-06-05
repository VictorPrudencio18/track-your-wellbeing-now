
import { useState } from "react";
import { Heart, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MetricCard } from './shared/MetricCard';
import { ChartContainer } from './shared/ChartContainer';
import { HealthCard } from './shared/HealthCard';

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
    if (sys < 90 || dia < 60) return { category: "Hipotensão", color: "text-blue-400", alert: true };
    if (sys < 120 && dia < 80) return { category: "Normal", color: "text-green-400", alert: false };
    if (sys < 130 && dia < 80) return { category: "Elevada", color: "text-yellow-400", alert: false };
    if (sys < 140 || dia < 90) return { category: "Hipertensão Estágio 1", color: "text-orange-400", alert: true };
    if (sys < 180 || dia < 120) return { category: "Hipertensão Estágio 2", color: "text-red-400", alert: true };
    return { category: "Crise Hipertensiva", color: "text-red-500", alert: true };
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Pressão Arterial</h2>
        <p className="text-navy-400">Monitore sua pressão arterial e mantenha-se saudável</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pressão Atual"
          value={`${systolic}/${diastolic}`}
          unit="mmHg"
          subtitle="Última medição"
          icon={Heart}
          color={currentCategory.color}
          delay={0}
        />
        
        <MetricCard
          title="Média Semanal"
          value={`${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`}
          unit="mmHg"
          subtitle="Últimos 7 dias"
          icon={TrendingUp}
          color="text-blue-400"
          delay={0.1}
        />
        
        <MetricCard
          title="Categoria"
          value={currentCategory.category}
          subtitle="Classificação"
          icon={currentCategory.alert ? AlertTriangle : Heart}
          color={currentCategory.color}
          delay={0.2}
        />
        
        <MetricCard
          title="Última Medição"
          value="Agora"
          subtitle="Há 0 min"
          icon={Clock}
          color="text-accent-orange"
          delay={0.3}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pressure Entry Form */}
        <HealthCard title="Registrar Pressão Arterial" icon={Heart} delay={0.4}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic" className="text-white/80">Sistólica (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(parseInt(e.target.value))}
                  min="60"
                  max="250"
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="diastolic" className="text-white/80">Diastólica (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(parseInt(e.target.value))}
                  min="40"
                  max="150"
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-white/80">Observações</Label>
              <Input
                id="notes"
                placeholder="Ex: manhã, após exercício, estresse..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-navy-800/50 border-navy-600/30 text-white placeholder:text-navy-400"
              />
            </div>

            <div className={`p-4 rounded-xl glass-card-subtle`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">
                  {currentCategory.alert ? '⚠️' : '✅'}
                </span>
                <h4 className={`font-medium ${currentCategory.color}`}>
                  {currentCategory.category}
                </h4>
              </div>
              <p className="text-sm text-white/70">{getRecommendation()}</p>
            </div>

            <Button 
              onClick={handleLogPressure} 
              className="w-full bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium"
            >
              Registrar Pressão
            </Button>
          </div>
        </HealthCard>

        {/* Pressure History Chart */}
        <ChartContainer 
          title="Histórico de Pressão" 
          subtitle="Evolução dos últimos registros"
          delay={0.5}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[60, 160]} 
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
                <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="5 5" />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  name="Sistólica"
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#fbbf24" 
                  strokeWidth={3}
                  dot={{ fill: '#fbbf24', strokeWidth: 2, r: 5 }}
                  name="Diastólica"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-white/80">Faixas de Referência:</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span className="text-white/70">Normal: &lt;120/80</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span className="text-white/70">Elevada: 120-129/&lt;80</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span className="text-white/70">Estágio 1: 130-139/80-89</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-white/70">Estágio 2: ≥140/90</span>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
