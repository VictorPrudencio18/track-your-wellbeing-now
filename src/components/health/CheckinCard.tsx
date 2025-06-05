
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckinPrompt } from '@/hooks/useDailyCheckins';
import { 
  Heart, 
  Droplets, 
  Moon, 
  Dumbbell, 
  Brain, 
  Briefcase, 
  Sun,
  X,
  Check
} from 'lucide-react';

interface CheckinCardProps {
  prompt: CheckinPrompt;
  onAnswer: (promptKey: string, value: any) => void;
  onDismiss: () => void;
  isLoading: boolean;
}

const getPromptIcon = (promptKey: string) => {
  if (promptKey.includes('sleep')) return Moon;
  if (promptKey.includes('water')) return Droplets;
  if (promptKey.includes('exercise')) return Dumbbell;
  if (promptKey.includes('stress')) return Brain;
  if (promptKey.includes('work')) return Briefcase;
  if (promptKey.includes('energy')) return Sun;
  return Heart;
};

export function CheckinCard({ prompt, onAnswer, onDismiss, isLoading }: CheckinCardProps) {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const IconComponent = getPromptIcon(prompt.prompt_key);

  const handleSubmit = () => {
    if (selectedValue !== null) {
      onAnswer(prompt.prompt_key, selectedValue);
    }
  };

  const renderInput = () => {
    const options = prompt.options || {};

    switch (prompt.response_type) {
      case 'boolean':
        return (
          <div className="flex gap-2">
            <Button
              variant={selectedValue === true ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedValue(true)}
              className="flex-1"
            >
              Sim
            </Button>
            <Button
              variant={selectedValue === false ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedValue(false)}
              className="flex-1"
            >
              Não
            </Button>
          </div>
        );

      case 'scale':
        const labels = options.labels || [];
        const min = options.min || 1;
        const max = options.max || 5;
        
        return (
          <div className="space-y-3">
            {labels.length > 0 && (
              <div className="grid grid-cols-5 gap-1 text-xs">
                {labels.map((label: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedValue === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedValue(index + 1)}
                    className="h-8 text-[10px] px-1"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            )}
            {labels.length === 0 && (
              <div className="flex gap-1">
                {Array.from({ length: max - min + 1 }, (_, i) => (
                  <Button
                    key={i}
                    variant={selectedValue === min + i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedValue(min + i)}
                    className="w-8 h-8 p-0"
                  >
                    {min + i}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );

      case 'number':
        const unit = options.unit || '';
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedValue(Math.max(0, (selectedValue || 0) - 1))}
              disabled={selectedValue <= 0}
            >
              -
            </Button>
            <span className="min-w-[60px] text-center">
              {selectedValue || 0} {unit}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedValue((selectedValue || 0) + 1)}
            >
              +
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-80 glass-card border-navy-600/30 bg-navy-800/95 backdrop-blur-xl shadow-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
              <IconComponent className="w-4 h-4 text-accent-orange" />
            </div>
            <div className="text-sm font-medium text-white">Check-in de Saúde</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-navy-400 hover:text-white h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-white text-sm leading-relaxed">
            {prompt.question}
          </p>
          
          {renderInput()}
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="flex-1 glass-card border-navy-600/30 text-navy-300 hover:text-white"
            >
              Depois
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedValue === null || isLoading}
              size="sm"
              className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/90 hover:to-accent-orange/70 text-white"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
