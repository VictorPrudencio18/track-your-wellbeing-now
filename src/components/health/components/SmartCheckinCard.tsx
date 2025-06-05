
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CheckinPrompt {
  id: string;
  prompt_key: string;
  question: string;
  response_type: 'scale' | 'boolean' | 'number' | 'text' | 'select' | 'time';
  options?: any;
}

interface SmartCheckinCardProps {
  prompt: CheckinPrompt;
  onSubmit: (value: any) => Promise<void>;
  isLoading?: boolean;
}

export function SmartCheckinCard({ prompt, onSubmit, isLoading }: SmartCheckinCardProps) {
  const [value, setValue] = useState<any>(null);

  const handleSubmit = async () => {
    if (value !== null) {
      await onSubmit(value);
    }
  };

  const renderInput = () => {
    switch (prompt.response_type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-accent-orange">{value || 5}</span>
              <span className="text-navy-400 ml-2">/ 10</span>
            </div>
            <Slider
              value={[value || 5]}
              onValueChange={(newValue) => setValue(newValue[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-navy-400">
              <span>Muito baixo</span>
              <span>Muito alto</span>
            </div>
          </div>
        );

      case 'boolean':
        return (
          <RadioGroup value={value?.toString()} onValueChange={(val) => setValue(val === 'true')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="no">Não</Label>
            </div>
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Digite sua resposta..."
            className="w-full"
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 rounded border border-navy-600 bg-navy-800 text-white"
          />
        );

      default:
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full p-2 rounded border border-navy-600 bg-navy-800 text-white"
            placeholder="Digite um número"
          />
        );
    }
  };

  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/50">
      <CardHeader>
        <CardTitle className="text-white text-lg">
          {prompt.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderInput()}
        
        <Button
          onClick={handleSubmit}
          disabled={value === null || isLoading}
          className="w-full bg-accent-orange hover:bg-accent-orange/80"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
