
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SocialStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function SocialStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: SocialStepProps) {
  const [formData, setFormData] = useState({
    stress_level: responses.stress_level || '',
    social_support: responses.social_support || '',
    exercise_preference: responses.exercise_preference || '',
    ...responses
  });

  const handleNext = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        saveResponse(key, value, 'mental_social');
      }
    });
    
    onNext(formData);
  };

  const isValid = formData.stress_level && formData.exercise_preference;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Bem-estar Social</h2>
        <p className="text-navy-300">
          Como você se relaciona com exercícios e seu ambiente social?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-3 block">
            Como você avalia seu nível de estresse no dia a dia?
          </Label>
          <Select value={formData.stress_level} onValueChange={(value) => setFormData(prev => ({ ...prev, stress_level: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Muito baixo</SelectItem>
              <SelectItem value="2">Baixo</SelectItem>
              <SelectItem value="3">Moderado</SelectItem>
              <SelectItem value="4">Alto</SelectItem>
              <SelectItem value="5">Muito alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Você tem apoio de família/amigos para praticar exercícios?
          </Label>
          <Select value={formData.social_support} onValueChange={(value) => setFormData(prev => ({ ...prev, social_support: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Nenhum apoio</SelectItem>
              <SelectItem value="2">Pouco apoio</SelectItem>
              <SelectItem value="3">Apoio moderado</SelectItem>
              <SelectItem value="4">Bom apoio</SelectItem>
              <SelectItem value="5">Muito apoio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Você prefere se exercitar:
          </Label>
          <Select value={formData.exercise_preference} onValueChange={(value) => setFormData(prev => ({ ...prev, exercise_preference: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sozinho(a)">Sozinho(a)</SelectItem>
              <SelectItem value="Com 1 pessoa">Com 1 pessoa</SelectItem>
              <SelectItem value="Em pequenos grupos (3-5)">Em pequenos grupos (3-5)</SelectItem>
              <SelectItem value="Em grupos grandes (6+)">Em grupos grandes (6+)</SelectItem>
              <SelectItem value="Não tenho preferência">Não tenho preferência</SelectItem>
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
