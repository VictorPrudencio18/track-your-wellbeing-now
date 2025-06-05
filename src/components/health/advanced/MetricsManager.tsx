
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { 
  TrendingUp, 
  Plus, 
  Calendar,
  Target,
  Activity,
  Heart,
  Scale,
  Thermometer,
  Save,
  X
} from 'lucide-react';

const metricCategories = [
  {
    id: 'vitals',
    name: 'Sinais Vitais',
    icon: Heart,
    color: 'from-red-500/20 to-red-600/10',
    iconColor: 'text-red-400',
    metrics: [
      { key: 'heart_rate', name: 'Frequência Cardíaca', unit: 'bpm', icon: Heart },
      { key: 'blood_pressure_systolic', name: 'Pressão Sistólica', unit: 'mmHg', icon: Activity },
      { key: 'blood_pressure_diastolic', name: 'Pressão Diastólica', unit: 'mmHg', icon: Activity },
      { key: 'body_temperature', name: 'Temperatura Corporal', unit: '°C', icon: Thermometer }
    ]
  },
  {
    id: 'body',
    name: 'Composição Corporal',
    icon: Scale,
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
    metrics: [
      { key: 'weight', name: 'Peso', unit: 'kg', icon: Scale },
      { key: 'body_fat', name: 'Gordura Corporal', unit: '%', icon: Scale },
      { key: 'muscle_mass', name: 'Massa Muscular', unit: 'kg', icon: Activity },
      { key: 'bmi', name: 'IMC', unit: '', icon: Target }
    ]
  }
];

export function MetricsManager() {
  const { addHealthMetric, healthMetrics } = useAdvancedHealth();
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('vitals');
  const [newMetric, setNewMetric] = useState({
    metric_category: 'vitals',
    metric_name: '',
    value: '',
    unit: '',
    measurement_date: new Date().toISOString().split('T')[0],
    time_of_day: new Date().toTimeString().slice(0, 5)
  });

  const handleAddMetric = () => {
    if (!newMetric.metric_name || !newMetric.value) return;
    
    addHealthMetric.mutate({
      metric_category: newMetric.metric_category,
      metric_name: newMetric.metric_name,
      value: parseFloat(newMetric.value),
      unit: newMetric.unit,
      measurement_date: newMetric.measurement_date,
      time_of_day: newMetric.time_of_day,
      context: { source: 'manual_entry' }
    });
    
    setNewMetric({
      metric_category: 'vitals',
      metric_name: '',
      value: '',
      unit: '',
      measurement_date: new Date().toISOString().split('T')[0],
      time_of_day: new Date().toTimeString().slice(0, 5)
    });
    setIsAddingMetric(false);
  };

  const getRecentMetrics = (category: string) => {
    return healthMetrics
      .filter(m => m.metric_category === category)
      .slice(0, 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gerenciar Métricas</h2>
        <Button 
          onClick={() => setIsAddingMetric(true)}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Métrica
        </Button>
      </div>

      {isAddingMetric && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-6 border border-navy-600/30 bg-navy-800/60 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Adicionar Nova Métrica</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAddingMetric(false)}
              className="text-navy-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-navy-300">Categoria</Label>
              <select
                value={newMetric.metric_category}
                onChange={(e) => setNewMetric({ ...newMetric, metric_category: e.target.value })}
                className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
              >
                {metricCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label className="text-navy-300">Métrica</Label>
              <select
                value={newMetric.metric_name}
                onChange={(e) => {
                  const selectedMetric = metricCategories
                    .find(c => c.id === newMetric.metric_category)
                    ?.metrics.find(m => m.key === e.target.value);
                  setNewMetric({ 
                    ...newMetric, 
                    metric_name: e.target.value,
                    unit: selectedMetric?.unit || ''
                  });
                }}
                className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
              >
                <option value="">Selecione uma métrica</option>
                {metricCategories
                  .find(c => c.id === newMetric.metric_category)
                  ?.metrics.map(metric => (
                    <option key={metric.key} value={metric.key}>{metric.name}</option>
                  ))}
              </select>
            </div>
            
            <div>
              <Label className="text-navy-300">Valor</Label>
              <Input
                type="number"
                step="0.01"
                value={newMetric.value}
                onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="Digite o valor"
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Unidade</Label>
              <Input
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
                placeholder="Unidade"
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Data</Label>
              <Input
                type="date"
                value={newMetric.measurement_date}
                onChange={(e) => setNewMetric({ ...newMetric, measurement_date: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
              />
            </div>
            
            <div>
              <Label className="text-navy-300">Horário</Label>
              <Input
                type="time"
                value={newMetric.time_of_day}
                onChange={(e) => setNewMetric({ ...newMetric, time_of_day: e.target.value })}
                className="bg-navy-800/50 border-navy-600/30 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleAddMetric}
              disabled={!newMetric.metric_name || !newMetric.value}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Métrica
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAddingMetric(false)}
              className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metricCategories.map((category, index) => {
          const IconComponent = category.icon;
          const recentMetrics = getRecentMetrics(category.id);
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                      <IconComponent className={`w-5 h-5 ${category.iconColor}`} />
                    </div>
                    {category.name}
                    <Badge className="bg-navy-700/50 text-navy-300 ml-auto">
                      {recentMetrics.length} registros
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMetrics.length > 0 ? (
                    recentMetrics.map((metric, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3 bg-navy-700/30 rounded-lg"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {metricCategories
                              .find(c => c.id === metric.metric_category)
                              ?.metrics.find(m => m.key === metric.metric_name)?.name || 
                              metric.metric_name}
                          </div>
                          <div className="text-navy-400 text-sm">
                            {new Date(metric.measurement_date).toLocaleDateString('pt-BR')}
                            {metric.time_of_day && ` às ${metric.time_of_day}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-accent-orange font-bold">
                            {metric.value} {metric.unit}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-navy-400">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma métrica registrada</p>
                      <p className="text-sm">Adicione sua primeira métrica desta categoria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
