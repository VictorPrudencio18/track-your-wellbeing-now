
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LifestyleStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function LifestyleStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: LifestyleStepProps) {
  const [formData, setFormData] = useState({
    sleep_hours: responses.sleep_hours || '',
    sleep_quality: responses.sleep_quality || '',
    available_time: responses.available_time || '',
    preferred_time: responses.preferred_time || '',
    ...responses
  });

  const handleNext = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        saveResponse(key, value, 'lifestyle');
      }
    });
    
    onNext(formData);
  };

  const isValid = formData.sleep_hours && formData.sleep_quality && formData.available_time;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Estilo de Vida</h2>
        <p className="text-navy-300">
          Entenda como encaixar os exercícios na sua rotina diária.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="sleep_hours" className="text-white mb-2 block">
            Quantas horas você dorme por noite em média?
          </Label>
          <Input
            id="sleep_hours"
            type="number"
            placeholder="Ex: 7"
            min="3"
            max="12"
            value={formData.sleep_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, sleep_hours: e.target.value }))}
            className="bg-navy-800/50 border-navy-600 text-white"
          />
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Como você avalia a qualidade do seu sono?
          </Label>
          <Select value={formData.sleep_quality} onValueChange={(value) => setFormData(prev => ({ ...prev, sleep_quality: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Muito ruim</SelectItem>
              <SelectItem value="2">Ruim</SelectItem>
              <SelectItem value="3">Regular</SelectItem>
              <SelectItem value="4">Boa</SelectItem>
              <SelectItem value="5">Excelente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Quanto tempo você pode dedicar aos exercícios por dia?
          </Label>
          <Select value={formData.available_time} onValueChange={(value) => setFormData(prev => ({ ...prev, available_time: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Menos de 15 min">Menos de 15 minutos</SelectItem>
              <SelectItem value="15-30 min">15-30 minutos</SelectItem>
              <SelectItem value="30-45 min">30-45 minutos</SelectItem>
              <SelectItem value="45-60 min">45-60 minutos</SelectItem>
              <SelectItem value="Mais de 1 hora">Mais de 1 hora</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Qual é o melhor horário para você se exercitar?
          </Label>
          <Select value={formData.preferred_time} onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_time: value }))}>
            <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manhã (6h-9h)">Manhã (6h-9h)</SelectItem>
              <SelectItem value="Manhã tardia (9h-12h)">Manhã tardia (9h-12h)</SelectItem>
              <SelectItem value="Tarde (12h-18h)">Tarde (12h-18h)</SelectItem>
              <SelectItem value="Noite (18h-22h)">Noite (18h-22h)</SelectItem>
              <SelectItem value="Madrugada (22h-6h)">Madrugada (22h-6h)</SelectItem>
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
