
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Clock, 
  Coffee, 
  Dumbbell, 
  Brain,
  Thermometer,
  Volume2,
  Eye,
  Save,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateSleepRecord, useUpdateSleepRecord } from '@/hooks/useSleep';

export function SleepTracker() {
  const [formData, setFormData] = useState({
    sleep_date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wake_time: '',
    sleep_latency: 15,
    subjective_quality: 7,
    wake_count: 0,
    environmental_factors: {
      temperature: 22,
      noise_level: 3,
      light_exposure: 2,
    },
    lifestyle_factors: {
      caffeine_intake: false,
      exercise_hours_before: 4,
      stress_level: 5,
      screen_time_before: 30,
    },
    notes: '',
  });

  const createMutation = useCreateSleepRecord();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calcular duração do sono
    let sleep_duration = null;
    if (formData.bedtime && formData.wake_time) {
      const bedtime = new Date(`${formData.sleep_date}T${formData.bedtime}`);
      let wakeTime = new Date(`${formData.sleep_date}T${formData.wake_time}`);
      
      // Se o horário de acordar é menor que o de dormir, é no dia seguinte
      if (wakeTime <= bedtime) {
        wakeTime.setDate(wakeTime.getDate() + 1);
      }
      
      sleep_duration = Math.round((wakeTime.getTime() - bedtime.getTime()) / (1000 * 60));
    }

    const sleepRecord = {
      sleep_date: formData.sleep_date,
      bedtime: formData.bedtime ? `${formData.sleep_date}T${formData.bedtime}:00Z` : null,
      wake_time: formData.wake_time ? `${formData.sleep_date}T${formData.wake_time}:00Z` : null,
      sleep_latency: formData.sleep_latency,
      sleep_duration,
      wake_count: formData.wake_count,
      subjective_quality: formData.subjective_quality,
      environmental_factors: formData.environmental_factors,
      lifestyle_factors: formData.lifestyle_factors,
      notes: formData.notes || null,
    };

    createMutation.mutate(sleepRecord);
  };

  const getQualityLabel = (value: number) => {
    if (value >= 9) return 'Excelente';
    if (value >= 7) return 'Bom';
    if (value >= 5) return 'Regular';
    if (value >= 3) return 'Ruim';
    return 'Péssimo';
  };

  const getQualityColor = (value: number) => {
    if (value >= 8) return 'text-green-400';
    if (value >= 6) return 'text-yellow-400';
    if (value >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="glass-card border-navy-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            Registrar Sono
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data e Horários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleep_date" className="text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data do Sono
                </Label>
                <Input
                  id="sleep_date"
                  type="date"
                  value={formData.sleep_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleep_date: e.target.value }))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedtime" className="text-gray-300 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Hora de Dormir
                </Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wake_time" className="text-gray-300 flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Hora de Acordar
                </Label>
                <Input
                  id="wake_time"
                  type="time"
                  value={formData.wake_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, wake_time: e.target.value }))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>
            </div>

            {/* Qualidade e Latência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Qualidade Subjetiva: {formData.subjective_quality}/10
                  <Badge className={getQualityColor(formData.subjective_quality)}>
                    {getQualityLabel(formData.subjective_quality)}
                  </Badge>
                </Label>
                <Slider
                  value={[formData.subjective_quality]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subjective_quality: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tempo para Adormecer: {formData.sleep_latency} minutos
                </Label>
                <Slider
                  value={[formData.sleep_latency]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_latency: value[0] }))}
                  max={120}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Despertares */}
            <div className="space-y-4">
              <Label className="text-gray-300 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Número de Despertares: {formData.wake_count}
              </Label>
              <Slider
                value={[formData.wake_count]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, wake_count: value[0] }))}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Fatores Ambientais */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Fatores Ambientais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    Temperatura: {formData.environmental_factors.temperature}°C
                  </Label>
                  <Slider
                    value={[formData.environmental_factors.temperature]}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      environmental_factors: { ...prev.environmental_factors, temperature: value[0] }
                    }))}
                    max={30}
                    min={15}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Nível de Ruído: {formData.environmental_factors.noise_level}/10
                  </Label>
                  <Slider
                    value={[formData.environmental_factors.noise_level]}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      environmental_factors: { ...prev.environmental_factors, noise_level: value[0] }
                    }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Exposição à Luz: {formData.environmental_factors.light_exposure}/10
                  </Label>
                  <Slider
                    value={[formData.environmental_factors.light_exposure]}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      environmental_factors: { ...prev.environmental_factors, light_exposure: value[0] }
                    }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Fatores de Estilo de Vida */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Fatores de Estilo de Vida</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Coffee className="w-4 h-4" />
                      Cafeína nas últimas 6h
                    </Label>
                    <Switch
                      checked={formData.lifestyle_factors.caffeine_intake}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        lifestyle_factors: { ...prev.lifestyle_factors, caffeine_intake: checked }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      Exercício {formData.lifestyle_factors.exercise_hours_before}h antes
                    </Label>
                    <Slider
                      value={[formData.lifestyle_factors.exercise_hours_before]}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        lifestyle_factors: { ...prev.lifestyle_factors, exercise_hours_before: value[0] }
                      }))}
                      max={12}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Nível de Stress: {formData.lifestyle_factors.stress_level}/10
                    </Label>
                    <Slider
                      value={[formData.lifestyle_factors.stress_level]}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        lifestyle_factors: { ...prev.lifestyle_factors, stress_level: value[0] }
                      }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Tela antes de dormir: {formData.lifestyle_factors.screen_time_before} min
                    </Label>
                    <Slider
                      value={[formData.lifestyle_factors.screen_time_before]}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        lifestyle_factors: { ...prev.lifestyle_factors, screen_time_before: value[0] }
                      }))}
                      max={180}
                      min={0}
                      step={15}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gray-300">
                Notas Adicionais
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Como você se sentiu? Algum fator especial influenciou seu sono?"
                className="bg-navy-800/50 border-navy-600/30 text-white min-h-[100px]"
              />
            </div>

            {/* Botão de Salvar */}
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending ? 'Salvando...' : 'Registrar Sono'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
