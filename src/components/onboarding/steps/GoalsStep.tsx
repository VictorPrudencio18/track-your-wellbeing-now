
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalsStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function GoalsStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: GoalsStepProps) {
  const [formData, setFormData] = useState({
    primary_goal: responses.primary_goal || '',
    motivation_level: responses.motivation_level || '',
    ...responses
  });

  const handleNext = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        saveResponse(key, value, 'goals_motivation');
      }
    });
    
    onNext(formData);
  };

  const isValid = formData.primary_goal && formData.motivation_level;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Objetivos e Motivação</h2>
        <p className="text-navy-300">
          Vamos entender o que te motiva e quais são seus objetivos principais.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-3 block">
            Qual é seu principal objetivo com os exercícios?
          </Label>
          <Select value={formData.primary_goal} onValueChange={(value) => setFormData(prev => ({ ...prev, primary_goal: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione seu objetivo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Perder peso">Perder peso</SelectItem>
              <SelectItem value="Ganhar massa muscular">Ganhar massa muscular</SelectItem>
              <SelectItem value="Melhorar condicionamento">Melhorar condicionamento</SelectItem>
              <SelectItem value="Reduzir estresse">Reduzir estresse</SelectItem>
              <SelectItem value="Manter saúde">Manter saúde</SelectItem>
              <SelectItem value="Diversão e bem-estar">Diversão e bem-estar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Como você se sente em relação a começar uma rotina de exercícios?
          </Label>
          <Select value={formData.motivation_level} onValueChange={(value) => setFormData(prev => ({ ...prev, motivation_level: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione seu nível de motivação..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Nada motivado</SelectItem>
              <SelectItem value="2">Pouco motivado</SelectItem>
              <SelectItem value="3">Moderadamente motivado</SelectItem>
              <SelectItem value="4">Muito motivado</SelectItem>
              <SelectItem value="5">Extremamente motivado</SelectItem>
            </SelectContent>
          </Select>
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
