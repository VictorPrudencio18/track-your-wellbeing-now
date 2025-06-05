
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicProfileStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function BasicProfileStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: BasicProfileStepProps) {
  const [formData, setFormData] = useState({
    age: responses.age || '',
    gender: responses.gender || '',
    current_weight: responses.current_weight || '',
    current_height: responses.current_height || '',
    ...responses
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    // Salvar respostas individuais
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        saveResponse(key, value, 'physical_health');
      }
    });
    
    onNext(formData);
  };

  const isValid = formData.age && formData.gender && formData.current_weight && formData.current_height;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Perfil Básico</h2>
        <p className="text-navy-300">
          Vamos começar com algumas informações básicas sobre você.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="age" className="text-white mb-2 block">Idade</Label>
            <Input
              id="age"
              type="number"
              placeholder="Ex: 25"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="bg-navy-800/50 border-navy-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="gender" className="text-white mb-2 block">Gênero</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="bg-navy-800/50 border-navy-600 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
                <SelectItem value="nao_informar">Prefiro não informar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="weight" className="text-white mb-2 block">Peso Atual (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Ex: 70"
              value={formData.current_weight}
              onChange={(e) => handleInputChange('current_weight', e.target.value)}
              className="bg-navy-800/50 border-navy-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="height" className="text-white mb-2 block">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Ex: 175"
              value={formData.current_height}
              onChange={(e) => handleInputChange('current_height', e.target.value)}
              className="bg-navy-800/50 border-navy-600 text-white"
            />
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
