
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  AlarmClock, 
  Plus, 
  Trash2, 
  Settings,
  Volume2,
  Smartphone,
  Moon,
  Edit
} from 'lucide-react';
import { useSmartAlarms, useCreateSmartAlarm } from '@/hooks/useSleepAdvanced';

export function SmartAlarmManager() {
  const { data: alarms, isLoading } = useSmartAlarms();
  const createAlarm = useCreateSmartAlarm();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    alarm_time: '07:00',
    smart_window_minutes: 30,
    is_active: true,
    days_of_week: [1, 2, 3, 4, 5], // Mon-Fri
    alarm_sound: 'gentle_waves',
    vibration_enabled: true
  });

  const weekDays = [
    { id: 1, label: 'Seg', name: 'Segunda' },
    { id: 2, label: 'Ter', name: 'Terça' },
    { id: 3, label: 'Qua', name: 'Quarta' },
    { id: 4, label: 'Qui', name: 'Quinta' },
    { id: 5, label: 'Sex', name: 'Sexta' },
    { id: 6, label: 'Sáb', name: 'Sábado' },
    { id: 7, label: 'Dom', name: 'Domingo' }
  ];

  const alarmSounds = [
    { id: 'gentle_waves', name: 'Ondas Suaves' },
    { id: 'forest_birds', name: 'Pássaros da Floresta' },
    { id: 'soft_piano', name: 'Piano Suave' },
    { id: 'ocean_breeze', name: 'Brisa do Oceano' },
    { id: 'morning_rain', name: 'Chuva Matinal' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAlarm.mutateAsync(formData);
      setShowForm(false);
      setFormData({
        alarm_time: '07:00',
        smart_window_minutes: 30,
        is_active: true,
        days_of_week: [1, 2, 3, 4, 5],
        alarm_sound: 'gentle_waves',
        vibration_enabled: true
      });
    } catch (error) {
      console.error('Erro ao criar alarme:', error);
    }
  };

  const toggleDay = (dayId: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dayId)
        ? prev.days_of_week.filter(id => id !== dayId)
        : [...prev.days_of_week, dayId].sort()
    }));
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDays = (days: number[]) => {
    return days.map(day => weekDays.find(d => d.id === day)?.label).join(', ');
  };

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-navy-700/50 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
            <AlarmClock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Alarmes Inteligentes</h2>
            <p className="text-gray-300">Desperte no momento ideal do seu ciclo</p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Alarme
        </Button>
      </div>

      {/* Add Alarm Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card-holographic border-navy-600/30">
              <CardHeader>
                <CardTitle className="text-white">Criar Novo Alarme</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Time */}
                    <div>
                      <Label htmlFor="alarm_time" className="text-white/80">
                        Horário do Alarme
                      </Label>
                      <Input
                        id="alarm_time"
                        type="time"
                        value={formData.alarm_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, alarm_time: e.target.value }))}
                        className="bg-navy-800/50 border-navy-600/30 text-white"
                      />
                    </div>

                    {/* Smart Window */}
                    <div>
                      <Label htmlFor="smart_window" className="text-white/80">
                        Janela Inteligente (minutos)
                      </Label>
                      <Input
                        id="smart_window"
                        type="number"
                        min="5"
                        max="60"
                        value={formData.smart_window_minutes}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          smart_window_minutes: parseInt(e.target.value) || 30 
                        }))}
                        className="bg-navy-800/50 border-navy-600/30 text-white"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        O alarme pode tocar até {formData.smart_window_minutes} minutos antes para acordar no sono leve
                      </p>
                    </div>
                  </div>

                  {/* Days of Week */}
                  <div>
                    <Label className="text-white/80 mb-3 block">Dias da Semana</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => (
                        <Button
                          key={day.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => toggleDay(day.id)}
                          className={`
                            border-navy-600/50 text-white hover:bg-navy-700/50
                            ${formData.days_of_week.includes(day.id) 
                              ? 'bg-orange-500/20 border-orange-400/50 text-orange-400' 
                              : ''
                            }
                          `}
                        >
                          {day.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Alarm Sound */}
                  <div>
                    <Label htmlFor="alarm_sound" className="text-white/80">
                      Som do Alarme
                    </Label>
                    <select
                      id="alarm_sound"
                      value={formData.alarm_sound}
                      onChange={(e) => setFormData(prev => ({ ...prev, alarm_sound: e.target.value }))}
                      className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                    >
                      {alarmSounds.map((sound) => (
                        <option key={sound.id} value={sound.id}>
                          {sound.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-orange-400" />
                        <span className="text-white">Vibração</span>
                      </div>
                      <Switch
                        checked={formData.vibration_enabled}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          vibration_enabled: checked 
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-navy-800/30 rounded-xl border border-navy-600/20">
                      <div className="flex items-center gap-2">
                        <AlarmClock className="w-4 h-4 text-orange-400" />
                        <span className="text-white">Ativo</span>
                      </div>
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          is_active: checked 
                        }))}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={createAlarm.isPending}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                    >
                      {createAlarm.isPending ? 'Criando...' : 'Criar Alarme'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-navy-600/50 text-white hover:bg-navy-700/50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alarms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alarms?.map((alarm, index) => (
          <motion.div
            key={alarm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card-holographic border-navy-600/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {formatTime(alarm.alarm_time)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDays(alarm.days_of_week)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          alarm.is_active
                            ? 'border-green-400/50 text-green-400'
                            : 'border-gray-400/50 text-gray-400'
                        }
                      >
                        {alarm.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Moon className="w-3 h-3" />
                      <span>Janela: {alarm.smart_window_minutes}min</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Volume2 className="w-3 h-3" />
                      <span>{alarmSounds.find(s => s.id === alarm.alarm_sound)?.name}</span>
                    </div>

                    {alarm.vibration_enabled && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Smartphone className="w-3 h-3" />
                        <span>Vibração ativada</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-navy-600/30">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-navy-600/50 text-white hover:bg-navy-700/50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-400/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {alarms?.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlarmClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum alarme configurado
          </h3>
          <p className="text-gray-400 mb-6">
            Crie seu primeiro alarme inteligente para melhorar seu despertar
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Alarme
          </Button>
        </motion.div>
      )}
    </div>
  );
}
