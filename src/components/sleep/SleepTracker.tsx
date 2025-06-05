
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Clock, 
  Calendar,
  Brain,
  Heart,
  Zap,
  Target,
  Plus,
  Save,
  AlertCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useCreateSleepRecord } from '@/hooks/useSleep';
import { SleepMetricsCard } from '@/components/ui/sleep-metrics-card';
import { toast } from 'sonner';
import { SmartAlarmManager } from '@/components/sleep/advanced/SmartAlarmManager';

export function SleepTracker() {
  const createSleepRecord = useCreateSleepRecord();
  
  const [sleepData, setSleepData] = useState({
    sleep_date: new Date().toISOString().split('T')[0],
    bedtime: '22:30',
    wake_time: '06:30',
    sleep_latency: 15,
    subjective_quality: 7,
    wake_count: 1,
    environmental_factors: {
      room_temperature: 20,
      noise_level: 2,
      light_level: 1,
      comfort_level: 8
    },
    lifestyle_factors: {
      caffeine_hours_before: 6,
      alcohol_consumed: false,
      exercise_hours_before: 4,
      screen_time_before: 1,
      stress_level: 4
    },
    notes: '',
    // Novos campos para o registro avançado
    rem_sleep_duration: 75,
    deep_sleep_duration: 90,
    light_sleep_duration: 120,
    awake_duration: 15
  });

  const handleSave = async () => {
    try {
      const bedHour = parseInt(sleepData.bedtime.split(':')[0]);
      const bedMin = parseInt(sleepData.bedtime.split(':')[1]);
      const wakeHour = parseInt(sleepData.wake_time.split(':')[0]);
      const wakeMin = parseInt(sleepData.wake_time.split(':')[1]);
      
      let sleepDuration = (wakeHour + (wakeMin / 60)) - (bedHour + (bedMin / 60));
      if (sleepDuration < 0) sleepDuration += 24;
      
      await createSleepRecord.mutateAsync({
        ...sleepData,
        sleep_duration: Math.round(sleepDuration * 60),
        // Novos campos avançados
        room_temperature: sleepData.environmental_factors.room_temperature,
        noise_level: sleepData.environmental_factors.noise_level,
        light_level: sleepData.environmental_factors.light_level,
        comfort_level: sleepData.environmental_factors.comfort_level
      });
      
      toast.success('Registro de sono salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar registro de sono');
    }
  };

  const calculateSleepDuration = () => {
    const bedHour = parseInt(sleepData.bedtime.split(':')[0]);
    const bedMin = parseInt(sleepData.bedtime.split(':')[1]);
    const wakeHour = parseInt(sleepData.wake_time.split(':')[0]);
    const wakeMin = parseInt(sleepData.wake_time.split(':')[1]);
    
    let duration = (wakeHour + (wakeMin / 60)) - (bedHour + (bedMin / 60));
    if (duration < 0) duration += 24;
    
    return duration;
  };

  const sleepDuration = calculateSleepDuration();

  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">Registrar Sono</h2>
        </div>
        <p className="text-xl text-gray-300">
          Capture todos os detalhes da sua noite de sono
        </p>
      </motion.div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SleepMetricsCard
          title="Duração Prevista"
          value={`${Math.floor(sleepDuration)}h ${Math.round((sleepDuration % 1) * 60)}m`}
          icon={Clock}
          color="blue"
          progress={(sleepDuration / 8) * 100}
          delay={0.1}
        />
        
        <SleepMetricsCard
          title="Qualidade Subjetiva"
          value={`${sleepData.subjective_quality}/10`}
          icon={Star}
          color="purple"
          progress={sleepData.subjective_quality * 10}
          delay={0.2}
        />
        
        <SleepMetricsCard
          title="Latência"
          value={`${sleepData.sleep_latency}min`}
          icon={Brain}
          color="green"
          delay={0.3}
        />
        
        <SleepMetricsCard
          title="Interrupções"
          value={sleepData.wake_count}
          icon={AlertCircle}
          color="orange"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dados Básicos do Sono */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                Dados Básicos do Sono
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data */}
              <div>
                <Label htmlFor="sleep_date" className="text-white/80">Data do Sono</Label>
                <Input
                  id="sleep_date"
                  type="date"
                  value={sleepData.sleep_date}
                  onChange={(e) => setSleepData(prev => ({ ...prev, sleep_date: e.target.value }))}
                  className="bg-navy-800/50 border-navy-600/30 text-white"
                />
              </div>

              {/* Horários */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedtime" className="text-white/80">Hora de Dormir</Label>
                  <Input
                    id="bedtime"
                    type="time"
                    value={sleepData.bedtime}
                    onChange={(e) => setSleepData(prev => ({ ...prev, bedtime: e.target.value }))}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="wake_time" className="text-white/80">Hora de Acordar</Label>
                  <Input
                    id="wake_time"
                    type="time"
                    value={sleepData.wake_time}
                    onChange={(e) => setSleepData(prev => ({ ...prev, wake_time: e.target.value }))}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
              </div>

              {/* Qualidade Subjetiva */}
              <div>
                <Label className="text-white/80 mb-3 block">
                  Qualidade do Sono: {sleepData.subjective_quality}/10
                </Label>
                <Slider
                  value={[sleepData.subjective_quality]}
                  onValueChange={(value) => setSleepData(prev => ({ ...prev, subjective_quality: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Muito ruim</span>
                  <span>Excelente</span>
                </div>
              </div>

              {/* Latência e Interrupções */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sleep_latency" className="text-white/80">
                    Tempo para Adormecer (min)
                  </Label>
                  <Input
                    id="sleep_latency"
                    type="number"
                    min="0"
                    max="120"
                    value={sleepData.sleep_latency}
                    onChange={(e) => setSleepData(prev => ({ 
                      ...prev, 
                      sleep_latency: parseInt(e.target.value) || 0 
                    }))}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="wake_count" className="text-white/80">
                    Vezes que Acordou
                  </Label>
                  <Input
                    id="wake_count"
                    type="number"
                    min="0"
                    max="20"
                    value={sleepData.wake_count}
                    onChange={(e) => setSleepData(prev => ({ 
                      ...prev, 
                      wake_count: parseInt(e.target.value) || 0 
                    }))}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                </div>
              </div>

              {/* Fases do Sono */}
              <div className="space-y-3">
                <Label className="text-white/80 block">
                  Fases do Sono (minutos)
                </Label>
                
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Sono Leve (Light)</span>
                    <span>{sleepData.light_sleep_duration}min</span>
                  </div>
                  <Slider
                    value={[sleepData.light_sleep_duration]}
                    onValueChange={(value) => setSleepData(prev => ({ 
                      ...prev, 
                      light_sleep_duration: value[0] 
                    }))}
                    max={300}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Sono Profundo (Deep)</span>
                    <span>{sleepData.deep_sleep_duration}min</span>
                  </div>
                  <Slider
                    value={[sleepData.deep_sleep_duration]}
                    onValueChange={(value) => setSleepData(prev => ({ 
                      ...prev, 
                      deep_sleep_duration: value[0] 
                    }))}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Sono REM</span>
                    <span>{sleepData.rem_sleep_duration}min</span>
                  </div>
                  <Slider
                    value={[sleepData.rem_sleep_duration]}
                    onValueChange={(value) => setSleepData(prev => ({ 
                      ...prev, 
                      rem_sleep_duration: value[0] 
                    }))}
                    max={200}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Acordado durante o sono</span>
                    <span>{sleepData.awake_duration}min</span>
                  </div>
                  <Slider
                    value={[sleepData.awake_duration]}
                    onValueChange={(value) => setSleepData(prev => ({ 
                      ...prev, 
                      awake_duration: value[0] 
                    }))}
                    max={120}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="text-right text-xs text-gray-400 mt-2">
                  Total: {sleepData.light_sleep_duration + sleepData.deep_sleep_duration + sleepData.rem_sleep_duration + sleepData.awake_duration} minutos
                </div>
              </div>

              {/* Notas */}
              <div>
                <Label htmlFor="notes" className="text-white/80">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  placeholder="Descreva como foi sua noite de sono..."
                  value={sleepData.notes}
                  onChange={(e) => setSleepData(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-navy-800/50 border-navy-600/30 text-white resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fatores Ambientais e de Estilo de Vida */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Fatores Ambientais */}
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                Ambiente do Sono
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Temperatura */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Temperatura do Quarto: {sleepData.environmental_factors.room_temperature}°C
                </Label>
                <Slider
                  value={[sleepData.environmental_factors.room_temperature]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    environmental_factors: { ...prev.environmental_factors, room_temperature: value[0] }
                  }))}
                  max={30}
                  min={15}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Nível de Ruído */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Nível de Ruído: {sleepData.environmental_factors.noise_level}/5
                </Label>
                <Slider
                  value={[sleepData.environmental_factors.noise_level]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    environmental_factors: { ...prev.environmental_factors, noise_level: value[0] }
                  }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Conforto */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Conforto da Cama: {sleepData.environmental_factors.comfort_level}/10
                </Label>
                <Slider
                  value={[sleepData.environmental_factors.comfort_level]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    environmental_factors: { ...prev.environmental_factors, comfort_level: value[0] }
                  }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Fatores de Estilo de Vida */}
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Estilo de Vida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cafeína */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Horas desde a última cafeína: {sleepData.lifestyle_factors.caffeine_hours_before}h
                </Label>
                <Slider
                  value={[sleepData.lifestyle_factors.caffeine_hours_before]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    lifestyle_factors: { ...prev.lifestyle_factors, caffeine_hours_before: value[0] }
                  }))}
                  max={12}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Exercício */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Horas desde o exercício: {sleepData.lifestyle_factors.exercise_hours_before}h
                </Label>
                <Slider
                  value={[sleepData.lifestyle_factors.exercise_hours_before]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    lifestyle_factors: { ...prev.lifestyle_factors, exercise_hours_before: value[0] }
                  }))}
                  max={12}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Nível de Stress */}
              <div>
                <Label className="text-white/80 mb-2 block">
                  Nível de Stress: {sleepData.lifestyle_factors.stress_level}/10
                </Label>
                <Slider
                  value={[sleepData.lifestyle_factors.stress_level]}
                  onValueChange={(value) => setSleepData(prev => ({
                    ...prev,
                    lifestyle_factors: { ...prev.lifestyle_factors, stress_level: value[0] }
                  }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Botão de Salvar Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleSave}
          disabled={createSleepRecord.isPending}
          className="px-12 py-4 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-2xl"
        >
          <Save className="w-5 h-5 mr-3" />
          {createSleepRecord.isPending ? 'Salvando...' : 'Salvar Registro de Sono'}
        </Button>
      </motion.div>

      {/* Smart Alarm Manager */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="glass-card-holographic border-navy-600/30 mt-12">
          <CardHeader>
            <CardTitle className="text-white">
              Alarmes Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SmartAlarmManager />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
