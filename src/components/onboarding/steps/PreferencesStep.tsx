
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PreferencesStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  saveResponse: (key: string, value: any, category: string) => void;
  responses: Record<string, any>;
}

export function PreferencesStep({ onNext, onPrevious, canGoBack, saveResponse, responses }: PreferencesStepProps) {
  const [formData, setFormData] = useState({
    preferred_activities: responses.preferred_activities || [],
    equipment_available: responses.equipment_available || [],
    location_preference: responses.location_preference || '',
    ...responses
  });

  const activities = [
    'Corrida', 'Caminhada', 'Ciclismo', 'Natação', 
    'Musculação', 'Yoga', 'Pilates', 'Dança',
    'Artes marciais', 'Crossfit', 'Funcional', 'Alongamento'
  ];

  const equipment = [
    'Nenhum equipamento', 'Halteres', 'Elásticos', 'Colchonete',
    'Bicicleta', 'Esteira', 'Equipamentos de academia completa'
  ];

  const handleActivityChange = (activity: string, checked: boolean) => {
    const newActivities = checked 
      ? [...formData.preferred_activities, activity]
      : formData.preferred_activities.filter((a: string) => a !== activity);
    
    setFormData(prev => ({ ...prev, preferred_activities: newActivities }));
  };

  const handleEquipmentChange = (item: string, checked: boolean) => {
    const newEquipment = checked 
      ? [...formData.equipment_available, item]
      : formData.equipment_available.filter((e: string) => e !== item);
    
    setFormData(prev => ({ ...prev, equipment_available: newEquipment }));
  };

  const handleNext = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== null && (!Array.isArray(value) || value.length > 0)) {
        saveResponse(key, value, 'technology');
      }
    });
    
    onNext(formData);
  };

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Preferências de Exercício</h2>
        <p className="text-navy-300">
          Quais atividades você mais gosta ou gostaria de experimentar?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-3 block">
            Atividades que te interessam (selecione quantas quiser):
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {activities.map((activity) => (
              <label key={activity} className="flex items-center space-x-2 text-navy-300 cursor-pointer">
                <Checkbox
                  checked={formData.preferred_activities.includes(activity)}
                  onCheckedChange={(checked) => handleActivityChange(activity, !!checked)}
                  className="border-navy-600"
                />
                <span className="text-sm">{activity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Equipamentos disponíveis:
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {equipment.map((item) => (
              <label key={item} className="flex items-center space-x-2 text-navy-300 cursor-pointer">
                <Checkbox
                  checked={formData.equipment_available.includes(item)}
                  onCheckedChange={(checked) => handleEquipmentChange(item, !!checked)}
                  className="border-navy-600"
                />
                <span className="text-sm">{item}</span>
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
          className="bg-accent-orange hover:bg-accent-orange/90 text-white ml-auto"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
