
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface HealthStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function HealthStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: HealthStepProps) {
  const [formData, setFormData] = useState({
    fitness_level: responses.fitness_level || '',
    exercise_frequency: responses.exercise_frequency || '',
    health_conditions: responses.health_conditions || [],
    ...responses
  });

  const healthConditions = [
    'Nenhuma',
    'Problemas cardíacos',
    'Problemas articulares',
    'Diabetes',
    'Pressão alta',
    'Lesões recentes',
    'Problemas respiratórios',
    'Outros'
  ];

  const handleConditionChange = (condition: string, checked: boolean) => {
    const newConditions = checked 
      ? [...formData.health_conditions, condition]
      : formData.health_conditions.filter((c: string) => c !== condition);
    
    setFormData(prev => ({ ...prev, health_conditions: newConditions }));
  };

  const handleNext = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        saveResponse(key, value, 'physical_health');
      }
    });
    
    onNext(formData);
  };

  const isValid = formData.fitness_level && formData.exercise_frequency;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Saúde e Condicionamento</h2>
        <p className="text-navy-300">
          Queremos entender seu nível atual de condicionamento e histórico de saúde.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-3 block">
            Como você avalia seu nível atual de condicionamento físico?
          </Label>
          <Select value={formData.fitness_level} onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_level: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione seu nível..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Muito baixo - Sedentário</SelectItem>
              <SelectItem value="2">Baixo - Atividade ocasional</SelectItem>
              <SelectItem value="3">Moderado - Exercício regular</SelectItem>
              <SelectItem value="4">Bom - Muito ativo</SelectItem>
              <SelectItem value="5">Excelente - Atlético</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Com que frequência você pratica exercícios atualmente?
          </Label>
          <Select value={formData.exercise_frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, exercise_frequency: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione a frequência..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedentário">Sedentário</SelectItem>
              <SelectItem value="1-2x por semana">1-2x por semana</SelectItem>
              <SelectItem value="3-4x por semana">3-4x por semana</SelectItem>
              <SelectItem value="5-6x por semana">5-6x por semana</SelectItem>
              <SelectItem value="Diariamente">Diariamente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Você tem alguma condição de saúde que possa afetar seus exercícios?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {healthConditions.map((condition) => (
              <label key={condition} className="flex items-center space-x-2 text-navy-300 cursor-pointer">
                <Checkbox
                  checked={formData.health_conditions.includes(condition)}
                  onCheckedChange={(checked) => handleConditionChange(condition, !!checked)}
                  className="border-navy-600"
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        {canGoBack && (
          <Button 
            onClick={onPrevious}
            variant="outline"
            className="border-navy-600 text-navy-300 hover:bg-navy-700"
          >
            Voltar
          </Button>
        )}
        
        <Button 
          onClick={handleNext}
          disabled={!isValid}
          className="bg-accent-orange hover:bg-accent-orange/90 text-white ml-auto"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
