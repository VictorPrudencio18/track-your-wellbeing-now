
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { X, Target, Calendar, Zap, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

interface GoalCreationWizardProps {
  onClose: () => void;
}

type GoalType = Tables<'weekly_goals'>['goal_type'];

export function GoalCreationWizard({ onClose }: GoalCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal_type: '' as GoalType,
    title: '',
    description: '',
    target_value: 0,
    unit: '',
    priority: 3,
    difficulty_level: 3,
    week_start_date: '',
    week_end_date: ''
  });

  const { createGoal } = useWeeklyGoals();

  const goalTypes = [
    { 
      value: 'distance' as GoalType, 
      label: 'Distância', 
      unit: 'km',
      description: 'Meta baseada na distância percorrida',
      icon: '🏃‍♂️'
    },
    { 
      value: 'duration' as GoalType, 
      label: 'Duração', 
      unit: 'minutos',
      description: 'Meta baseada no tempo de exercício',
      icon: '⏱️'
    },
    { 
      value: 'frequency' as GoalType, 
      label: 'Frequência', 
      unit: 'exercícios',
      description: 'Meta baseada no número de exercícios',
      icon: '🎯'
    },
    { 
      value: 'calories' as GoalType, 
      label: 'Calorias', 
      unit: 'cal',
      description: 'Meta baseada nas calorias queimadas',
      icon: '🔥'
    }
  ];

  const handleTypeSelect = (type: GoalType) => {
    const goalType = goalTypes.find(t => t.value === type);
    if (goalType) {
      setFormData(prev => ({
        ...prev,
        goal_type: type,
        unit: goalType.unit,
        title: `Meta Semanal de ${goalType.label}`
      }));
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    try {
      await createGoal.mutateAsync({
        goal_type: formData.goal_type,
        title: formData.title,
        description: formData.description,
        target_value: formData.target_value,
        unit: formData.unit,
        priority: formData.priority,
        difficulty_level: formData.difficulty_level,
        week_start_date: formData.week_start_date,
        week_end_date: formData.week_end_date
      });
      toast.success('Meta criada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao criar meta');
      console.error(error);
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const weekDates = getWeekDates();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-card bg-navy-800 border-navy-600 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-orange" />
            Criar Nova Meta Semanal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map(stepNum => (
              <div
                key={stepNum}
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                  ${step >= stepNum 
                    ? 'bg-accent-orange border-accent-orange text-white' 
                    : 'border-navy-600 text-navy-400'
                  }
                `}
              >
                {stepNum}
              </div>
            ))}
          </div>

          {/* Step 1: Choose Goal Type */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">Escolha o Tipo de Meta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalTypes.map(type => (
                  <Card
                    key={type.value}
                    className="glass-card border-navy-600/30 bg-navy-800/30 hover:bg-navy-800/50 cursor-pointer transition-all duration-300 hover:border-accent-orange/50"
                    onClick={() => handleTypeSelect(type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{type.icon}</div>
                      <h4 className="text-white font-medium mb-1">{type.label}</h4>
                      <p className="text-navy-400 text-sm">{type.description}</p>
                      <p className="text-accent-orange text-xs mt-2">Unidade: {type.unit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Goal Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white">Detalhes da Meta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="glass-card bg-navy-700/50 border-navy-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target_value" className="text-white">
                    Meta ({formData.unit})
                  </Label>
                  <Input
                    id="target_value"
                    type="number"
                    value={formData.target_value}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      target_value: parseFloat(e.target.value) || 0 
                    }))}
                    className="glass-card bg-navy-700/50 border-navy-600 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="glass-card bg-navy-700/50 border-navy-600 text-white"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="week_start" className="text-white">Data de Início</Label>
                  <Input
                    id="week_start"
                    type="date"
                    value={formData.week_start_date || weekDates.start}
                    onChange={(e) => setFormData(prev => ({ ...prev, week_start_date: e.target.value }))}
                    className="glass-card bg-navy-700/50 border-navy-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="week_end" className="text-white">Data de Fim</Label>
                  <Input
                    id="week_end"
                    type="date"
                    value={formData.week_end_date || weekDates.end}
                    onChange={(e) => setFormData(prev => ({ ...prev, week_end_date: e.target.value }))}
                    className="glass-card bg-navy-700/50 border-navy-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="glass-card border-navy-600"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-accent-orange hover:bg-accent-orange/90"
                  disabled={!formData.title || !formData.target_value}
                >
                  Próximo
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Priority and Difficulty */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-white">Configurações Avançadas</h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-white">
                    Prioridade: {formData.priority}/5
                  </Label>
                  <Slider
                    value={[formData.priority]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-navy-400">
                    <span>Baixa</span>
                    <span>Normal</span>
                    <span>Alta</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white">
                    Dificuldade: {'★'.repeat(formData.difficulty_level)}{'☆'.repeat(5 - formData.difficulty_level)}
                  </Label>
                  <Slider
                    value={[formData.difficulty_level]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value[0] }))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-navy-400">
                    <span>Fácil</span>
                    <span>Moderado</span>
                    <span>Difícil</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="glass-card border-navy-600"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createGoal.isPending}
                  className="bg-accent-orange hover:bg-accent-orange/90 flex-1"
                >
                  {createGoal.isPending ? 'Criando...' : 'Criar Meta'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
