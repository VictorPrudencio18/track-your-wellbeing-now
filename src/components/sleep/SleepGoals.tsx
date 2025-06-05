
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Moon, 
  Sun, 
  Star,
  TrendingUp,
  CheckCircle,
  Plus,
  Calendar,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSleepGoals, useCreateSleepGoal } from '@/hooks/useSleep';
import { SleepMetricsCard } from '@/components/ui/sleep-metrics-card';

export function SleepGoals() {
  const { data: sleepGoals, isLoading } = useSleepGoals();
  const createSleepGoal = useCreateSleepGoal();
  
  const [showForm, setShowForm] = useState(false);
  const [goalData, setGoalData] = useState({
    target_duration: 480, // 8 hours in minutes
    target_bedtime: '22:30',
    target_wake_time: '06:30',
    consistency_goal: 7,
    quality_goal: 8
  });

  const activeGoal = sleepGoals?.find(goal => goal.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSleepGoal.mutateAsync(goalData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
  };

  const getCurrentProgress = () => {
    // Mock progress data - in real app, calculate from sleep records
    return {
      duration: 85,
      consistency: 75,
      quality: 80,
      bedtime: 90
    };
  };

  const progress = getCurrentProgress();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-navy-700/50 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">Metas de Sono</h2>
        </div>
        <p className="text-xl text-gray-300">
          Defina e acompanhe seus objetivos para um sono melhor
        </p>
      </motion.div>

      {/* Current Goal Progress */}
      {activeGoal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5" />
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                Meta Atual
                <Badge variant="outline" className="ml-auto border-green-400/50 text-green-400">
                  Ativa
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SleepMetricsCard
                  title="Duração"
                  value={`${progress.duration}%`}
                  subtitle={`Meta: ${formatDuration(activeGoal.target_duration)}`}
                  icon={Clock}
                  color="blue"
                  progress={progress.duration}
                  delay={0.2}
                />
                
                <SleepMetricsCard
                  title="Consistência"
                  value={`${progress.consistency}%`}
                  subtitle={`Meta: ${activeGoal.consistency_goal} dias/semana`}
                  icon={Calendar}
                  color="purple"
                  progress={progress.consistency}
                  delay={0.3}
                />
                
                <SleepMetricsCard
                  title="Qualidade"
                  value={`${progress.quality}%`}
                  subtitle={`Meta: ${activeGoal.quality_goal}/10`}
                  icon={Star}
                  color="green"
                  progress={progress.quality}
                  delay={0.4}
                />
                
                <SleepMetricsCard
                  title="Horário"
                  value={`${progress.bedtime}%`}
                  subtitle={`Meta: ${activeGoal.target_bedtime}`}
                  icon={Moon}
                  color="orange"
                  progress={progress.bedtime}
                  delay={0.5}
                />
              </div>

              {/* Detailed Progress */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Progresso Detalhado</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Duração do Sono</span>
                    <span className="text-white">{progress.duration}%</span>
                  </div>
                  <Progress value={progress.duration} className="h-2" />
                  <p className="text-xs text-gray-400">
                    Você está dormindo em média 6.8h das 8h desejadas
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Consistência Semanal</span>
                    <span className="text-white">{progress.consistency}%</span>
                  </div>
                  <Progress value={progress.consistency} className="h-2" />
                  <p className="text-xs text-gray-400">
                    5 de 7 noites seguindo a rotina de sono esta semana
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Qualidade do Sono</span>
                    <span className="text-white">{progress.quality}%</span>
                  </div>
                  <Progress value={progress.quality} className="h-2" />
                  <p className="text-xs text-gray-400">
                    Score médio de 8.0/10 na qualidade subjetiva
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create New Goal Form */}
      {!activeGoal || showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: activeGoal ? 0.6 : 0.2 }}
        >
          <Card className="glass-card-holographic border-navy-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {activeGoal ? 'Atualizar Meta' : 'Criar Nova Meta'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Duration */}
                  <div>
                    <Label htmlFor="target_duration" className="text-white/80">
                      Duração Ideal (horas)
                    </Label>
                    <Input
                      id="target_duration"
                      type="number"
                      min="4"
                      max="12"
                      step="0.5"
                      value={goalData.target_duration / 60}
                      onChange={(e) => setGoalData(prev => ({ 
                        ...prev, 
                        target_duration: Math.round(parseFloat(e.target.value) * 60) || 480 
                      }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>

                  {/* Quality Goal */}
                  <div>
                    <Label htmlFor="quality_goal" className="text-white/80">
                      Meta de Qualidade (1-10)
                    </Label>
                    <Input
                      id="quality_goal"
                      type="number"
                      min="1"
                      max="10"
                      value={goalData.quality_goal}
                      onChange={(e) => setGoalData(prev => ({ 
                        ...prev, 
                        quality_goal: parseInt(e.target.value) || 8 
                      }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bedtime */}
                  <div>
                    <Label htmlFor="target_bedtime" className="text-white/80">
                      Horário de Dormir
                    </Label>
                    <Input
                      id="target_bedtime"
                      type="time"
                      value={goalData.target_bedtime}
                      onChange={(e) => setGoalData(prev => ({ 
                        ...prev, 
                        target_bedtime: e.target.value 
                      }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>

                  {/* Wake Time */}
                  <div>
                    <Label htmlFor="target_wake_time" className="text-white/80">
                      Horário de Acordar
                    </Label>
                    <Input
                      id="target_wake_time"
                      type="time"
                      value={goalData.target_wake_time}
                      onChange={(e) => setGoalData(prev => ({ 
                        ...prev, 
                        target_wake_time: e.target.value 
                      }))}
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                </div>

                {/* Consistency Goal */}
                <div>
                  <Label htmlFor="consistency_goal" className="text-white/80">
                    Meta de Consistência (dias por semana)
                  </Label>
                  <Input
                    id="consistency_goal"
                    type="number"
                    min="1"
                    max="7"
                    value={goalData.consistency_goal}
                    onChange={(e) => setGoalData(prev => ({ 
                      ...prev, 
                      consistency_goal: parseInt(e.target.value) || 7 
                    }))}
                    className="bg-navy-800/50 border-navy-600/30 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Quantos dias por semana você quer seguir sua rotina de sono
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createSleepGoal.isPending}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {createSleepGoal.isPending ? 'Salvando...' : 'Salvar Meta'}
                  </Button>
                  
                  {activeGoal && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="border-navy-600/50 text-white hover:bg-navy-700/50"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Nova Meta
          </Button>
        </motion.div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="glass-card-holographic border-navy-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Dicas para Atingir suas Metas
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Consistência</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Mantenha o mesmo horário todos os dias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Use alarmes para lembrar de ir dormir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Evite "compensar" sono no fim de semana</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-white">Qualidade</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Mantenha o quarto escuro e silencioso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Evite cafeína 6h antes de dormir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>Crie uma rotina relaxante antes da cama</span>
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
