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
  Star,
  Thermometer,
  Volume2,
  Bed,
  Coffee,
  Dumbbell,
  TrendingUp
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
import { SleepEnvironmentCard } from '@/components/sleep/SleepEnvironmentCard';
import { SleepLifestyleCard } from '@/components/sleep/SleepLifestyleCard';
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
        environmental_factors: sleepData.environmental_factors,
        lifestyle_factors: sleepData.lifestyle_factors
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

      {/* Métricas Rápidas Melhoradas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full"
      >
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Métricas da Noite</h3>
          <p className="text-gray-300">Capture todos os detalhes da sua noite de sono</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <SleepMetricsCard
            title="Duração Prevista"
            value={`${Math.floor(sleepDuration)}h ${Math.round((sleepDuration % 1) * 60)}m`}
            subtitle="Baseado nos horários"
            icon={Clock}
            color="blue"
            progress={(sleepDuration / 8) * 100}
            trend="up"
            trendValue="+30min vs média"
            status="good"
            delay={0.1}
            insights={[
              "Duração próxima ao ideal de 8h",
              "Horário consistente com rotina"
            ]}
          />
          
          <SleepMetricsCard
            title="Qualidade Subjetiva"
            value={`${sleepData.subjective_quality}/10`}
            subtitle="Como você se sente"
            icon={Star}
            color="purple"
            progress={sleepData.subjective_quality * 10}
            trend={sleepData.subjective_quality >= 7 ? "up" : sleepData.subjective_quality <= 5 ? "down" : "stable"}
            trendValue={sleepData.subjective_quality >= 7 ? "Boa qualidade" : sleepData.subjective_quality <= 5 ? "Pode melhorar" : "Regular"}
            status={sleepData.subjective_quality >= 8 ? "excellent" : sleepData.subjective_quality >= 6 ? "good" : sleepData.subjective_quality >= 4 ? "fair" : "poor"}
            delay={0.2}
            insights={[
              sleepData.subjective_quality >= 7 ? "Qualidade acima da média" : "Considere ajustar rotina",
              "Ambiente influencia 40% da qualidade"
            ]}
          />
          
          <SleepMetricsCard
            title="Latência do Sono"
            value={`${sleepData.sleep_latency}min`}
            subtitle="Tempo para adormecer"
            icon={Brain}
            color="green"
            progress={Math.max(0, 100 - (sleepData.sleep_latency / 30 * 100))}
            trend={sleepData.sleep_latency <= 15 ? "up" : sleepData.sleep_latency >= 30 ? "down" : "stable"}
            trendValue={sleepData.sleep_latency <= 15 ? "Excelente" : sleepData.sleep_latency >= 30 ? "Pode melhorar" : "Normal"}
            status={sleepData.sleep_latency <= 15 ? "excellent" : sleepData.sleep_latency <= 25 ? "good" : sleepData.sleep_latency <= 35 ? "fair" : "poor"}
            delay={0.3}
            insights={[
              sleepData.sleep_latency <= 15 ? "Latência ideal (<15min)" : "Considere técnicas de relaxamento",
              "Evite telas antes de dormir"
            ]}
          />
          
          <SleepMetricsCard
            title="Interrupções"
            value={sleepData.wake_count}
            subtitle="Vezes que acordou"
            icon={AlertCircle}
            color="orange"
            progress={Math.max(0, 100 - (sleepData.wake_count / 5 * 100))}
            trend={sleepData.wake_count <= 1 ? "up" : sleepData.wake_count >= 3 ? "down" : "stable"}
            trendValue={sleepData.wake_count <= 1 ? "Muito bom" : sleepData.wake_count >= 3 ? "Muitas interrupções" : "Normal"}
            status={sleepData.wake_count <= 1 ? "excellent" : sleepData.wake_count <= 2 ? "good" : sleepData.wake_count <= 3 ? "fair" : "poor"}
            delay={0.4}
            insights={[
              sleepData.wake_count <= 1 ? "Sono contínuo excelente" : "Verifique fatores ambientais",
              "Meta: máximo 2 interrupções"
            ]}
          />
        </div>
      </motion.div>

      {/* Dados Básicos do Sono */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-card border-2 border-indigo-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90">
          <CardHeader className="pb-6">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Moon className="w-6 h-6 text-white" />
              </div>
              Dados Básicos do Sono
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Data */}
            <div className="space-y-3">
              <Label htmlFor="sleep_date" className="text-white font-medium text-base">Data do Sono</Label>
              <Input
                id="sleep_date"
                type="date"
                value={sleepData.sleep_date}
                onChange={(e) => setSleepData(prev => ({ ...prev, sleep_date: e.target.value }))}
                className="bg-navy-700/70 border-2 border-navy-500/50 text-white h-14 text-base rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
              />
            </div>

            {/* Horários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="bedtime" className="text-white font-medium text-base">Hora de Dormir</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={sleepData.bedtime}
                  onChange={(e) => setSleepData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="bg-navy-700/70 border-2 border-navy-500/50 text-white h-14 text-base rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="wake_time" className="text-white font-medium text-base">Hora de Acordar</Label>
                <Input
                  id="wake_time"
                  type="time"
                  value={sleepData.wake_time}
                  onChange={(e) => setSleepData(prev => ({ ...prev, wake_time: e.target.value }))}
                  className="bg-navy-700/70 border-2 border-navy-500/50 text-white h-14 text-base rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Qualidade Subjetiva */}
            <div className="space-y-4">
              <Label className="text-white font-medium text-base block">
                Qualidade do Sono: <span className="text-indigo-400 text-xl font-bold">{sleepData.subjective_quality}/10</span>
              </Label>
              <div className="px-6 py-8 bg-navy-700/50 rounded-xl border border-navy-500/30">
                <Slider
                  value={[sleepData.subjective_quality]}
                  onValueChange={(value) => setSleepData(prev => ({ ...prev, subjective_quality: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-4">
                  <span>Muito ruim</span>
                  <span>Excelente</span>
                </div>
              </div>
            </div>

            {/* Latência e Interrupções */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="sleep_latency" className="text-white font-medium text-base">
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
                  className="bg-navy-700/70 border-2 border-navy-500/50 text-white h-14 text-base rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="wake_count" className="text-white font-medium text-base">
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
                  className="bg-navy-700/70 border-2 border-navy-500/50 text-white h-14 text-base rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-white font-medium text-base">Notas Adicionais</Label>
              <Textarea
                id="notes"
                placeholder="Descreva como foi sua noite de sono..."
                value={sleepData.notes}
                onChange={(e) => setSleepData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-navy-700/70 border-2 border-navy-500/50 text-white resize-none rounded-xl min-h-28 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                rows={4}
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
        className="space-y-8"
      >
        {/* Fatores Ambientais */}
        <Card className="glass-card border-2 border-green-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90">
          <CardHeader className="pb-6">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Sun className="w-6 h-6 text-white" />
              </div>
              Ambiente do Sono
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-8">
              <SleepEnvironmentCard
                title="Temperatura do Quarto"
                value={sleepData.environmental_factors.room_temperature}
                unit="°C"
                icon={Thermometer}
                color="text-green-400"
                min={15}
                max={30}
                step={1}
                minLabel="15°C"
                maxLabel="30°C"
                gradient="from-green-500 to-emerald-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  environmental_factors: { ...prev.environmental_factors, room_temperature: value[0] }
                }))}
                delay={0.1}
              />

              <SleepEnvironmentCard
                title="Nível de Ruído"
                value={sleepData.environmental_factors.noise_level}
                unit="/5"
                icon={Volume2}
                color="text-green-400"
                min={1}
                max={5}
                step={1}
                minLabel="Silencioso"
                maxLabel="Muito barulhento"
                gradient="from-green-500 to-emerald-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  environmental_factors: { ...prev.environmental_factors, noise_level: value[0] }
                }))}
                delay={0.2}
              />

              <SleepEnvironmentCard
                title="Conforto da Cama"
                value={sleepData.environmental_factors.comfort_level}
                unit="/10"
                icon={Bed}
                color="text-green-400"
                min={1}
                max={10}
                step={1}
                minLabel="Desconfortável"
                maxLabel="Perfeito"
                gradient="from-green-500 to-emerald-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  environmental_factors: { ...prev.environmental_factors, comfort_level: value[0] }
                }))}
                delay={0.3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Fatores de Estilo de Vida */}
        <Card className="glass-card border-2 border-orange-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90">
          <CardHeader className="pb-6">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              Estilo de Vida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-8">
              <SleepLifestyleCard
                title="Horas desde a última cafeína"
                value={sleepData.lifestyle_factors.caffeine_hours_before}
                unit="h"
                icon={Coffee}
                color="text-orange-400"
                min={0}
                max={12}
                step={1}
                minLabel="Agora"
                maxLabel="12h+"
                gradient="from-orange-500 to-red-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  lifestyle_factors: { ...prev.lifestyle_factors, caffeine_hours_before: value[0] }
                }))}
                delay={0.1}
              />

              <SleepLifestyleCard
                title="Horas desde o exercício"
                value={sleepData.lifestyle_factors.exercise_hours_before}
                unit="h"
                icon={Dumbbell}
                color="text-orange-400"
                min={0}
                max={12}
                step={1}
                minLabel="Agora"
                maxLabel="12h+"
                gradient="from-orange-500 to-red-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  lifestyle_factors: { ...prev.lifestyle_factors, exercise_hours_before: value[0] }
                }))}
                delay={0.2}
              />

              <SleepLifestyleCard
                title="Nível de Stress"
                value={sleepData.lifestyle_factors.stress_level}
                unit="/10"
                icon={TrendingUp}
                color="text-orange-400"
                min={1}
                max={10}
                step={1}
                minLabel="Relaxado"
                maxLabel="Muito estressado"
                gradient="from-orange-500 to-red-600"
                onValueChange={(value) => setSleepData(prev => ({
                  ...prev,
                  lifestyle_factors: { ...prev.lifestyle_factors, stress_level: value[0] }
                }))}
                delay={0.3}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fases do Sono */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="glass-card border-2 border-purple-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              Fases do Sono (minutos)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Sono Leve</span>
                  <span className="text-purple-400 text-lg font-bold">{sleepData.light_sleep_duration}min</span>
                </div>
                <div className="px-4 py-6 bg-navy-700/50 rounded-xl border border-navy-500/30">
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
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Sono Profundo</span>
                  <span className="text-purple-400 text-lg font-bold">{sleepData.deep_sleep_duration}min</span>
                </div>
                <div className="px-4 py-6 bg-navy-700/50 rounded-xl border border-navy-500/30">
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
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Sono REM</span>
                  <span className="text-purple-400 text-lg font-bold">{sleepData.rem_sleep_duration}min</span>
                </div>
                <div className="px-4 py-6 bg-navy-700/50 rounded-xl border border-navy-500/30">
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
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Acordado</span>
                  <span className="text-purple-400 text-lg font-bold">{sleepData.awake_duration}min</span>
                </div>
                <div className="px-4 py-6 bg-navy-700/50 rounded-xl border border-navy-500/30">
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
              </div>
            </div>
            
            <div className="text-center p-4 bg-navy-700/30 rounded-xl border border-navy-500/20">
              <span className="text-gray-300">
                Total: <span className="text-white font-bold">{sleepData.light_sleep_duration + sleepData.deep_sleep_duration + sleepData.rem_sleep_duration + sleepData.awake_duration}</span> minutos
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botão de Salvar Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleSave}
          disabled={createSleepRecord.isPending}
          className="px-16 py-6 text-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-2xl rounded-2xl font-bold transform transition-all duration-200 hover:scale-105"
        >
          <Save className="w-6 h-6 mr-4" />
          {createSleepRecord.isPending ? 'Salvando...' : 'Salvar Registro de Sono'}
        </Button>
      </motion.div>

      {/* Smart Alarm Manager */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Card className="glass-card border-2 border-cyan-500/30 bg-gradient-to-br from-navy-800/80 to-navy-900/90 mt-12">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
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
