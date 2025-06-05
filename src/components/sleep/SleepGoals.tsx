
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Clock, 
  Moon, 
  Sun, 
  Save,
  Edit,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useSleepGoals, useCreateSleepGoal } from '@/hooks/useSleep';

export function SleepGoals() {
  const { data: goals, isLoading } = useSleepGoals();
  const createGoalMutation = useCreateSleepGoal();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    target_duration: 480, // 8 horas em minutos
    target_bedtime: '22:00',
    target_wake_time: '06:00',
    consistency_goal: 7,
    quality_goal: 7,
  });

  const activeGoal = goals?.find(goal => goal.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createGoalMutation.mutate(formData);
    setShowForm(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card animate-pulse">
          <CardContent className="p-6">
            <div className="h-32 bg-navy-700/50 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Metas de Sono</h2>
        {!activeGoal && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        )}
      </div>

      {/* Meta Ativa */}
      {activeGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Meta Atual
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Ativa
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Duração Alvo</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {formatDuration(activeGoal.target_duration)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Hora de Dormir</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-400">
                    {activeGoal.target_bedtime}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Hora de Acordar</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {activeGoal.target_wake_time}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Qualidade Alvo</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    {activeGoal.quality_goal}/10
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" size="sm" className="border-navy-600/30">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Meta
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Formulário de Nova Meta */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent-orange" />
                Criar Nova Meta de Sono
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="target_bedtime" className="text-gray-300 flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Hora Ideal para Dormir
                    </Label>
                    <Input
                      id="target_bedtime"
                      type="time"
                      value={formData.target_bedtime}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_bedtime: e.target.value }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_wake_time" className="text-gray-300 flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Hora Ideal para Acordar
                    </Label>
                    <Input
                      id="target_wake_time"
                      type="time"
                      value={formData.target_wake_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, target_wake_time: e.target.value }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duração Alvo: {formatDuration(formData.target_duration)}
                  </Label>
                  <Slider
                    value={[formData.target_duration]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, target_duration: value[0] }))}
                    max={600} // 10 horas
                    min={300} // 5 horas
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>5h</span>
                    <span>7.5h</span>
                    <span>10h</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Meta de Consistência: {formData.consistency_goal} dias
                    </Label>
                    <Slider
                      value={[formData.consistency_goal]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, consistency_goal: value[0] }))}
                      max={30}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Meta de Qualidade: {formData.quality_goal}/10
                    </Label>
                    <Slider
                      value={[formData.quality_goal]}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, quality_goal: value[0] }))}
                      max={10}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createGoalMutation.isPending}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createGoalMutation.isPending ? 'Salvando...' : 'Salvar Meta'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-navy-600/30"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dicas e Recomendações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="text-white">Dicas para Metas Efetivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Duração Ideal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Adultos: 7-9 horas por noite
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Seja consistente nos fins de semana
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Ajuste gradualmente (±15 min/dia)
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-300">Horários</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Mantenha horários regulares
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Evite telas 1h antes de dormir
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-400" />
                    Crie uma rotina relaxante
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
