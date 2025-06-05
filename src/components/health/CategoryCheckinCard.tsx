
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckinPrompt } from '@/hooks/useCategorizedCheckins';
import { Check, Clock } from 'lucide-react';

interface CategoryCheckinCardProps {
  prompt: CheckinPrompt;
  onResponse: (value: any) => void;
  isLoading: boolean;
}

export function CategoryCheckinCard({ prompt, onResponse, isLoading }: CategoryCheckinCardProps) {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [textValue, setTextValue] = useState('');

  const handleSubmit = () => {
    const value = prompt.response_type === 'text' ? textValue : selectedValue;
    if (value !== null && value !== '') {
      onResponse(value);
    }
  };

  const canSubmit = () => {
    if (prompt.response_type === 'text') {
      return textValue.trim() !== '';
    }
    return selectedValue !== null;
  };

  const renderInput = () => {
    const options = prompt.options || {};

    switch (prompt.response_type) {
      case 'boolean':
        return (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedValue === true ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedValue(true)}
              className={`h-16 ${selectedValue === true 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'glass-card border-navy-600/30 text-navy-300 hover:text-white'
              }`}
            >
              {options.true_label || 'Sim'}
            </Button>
            <Button
              variant={selectedValue === false ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedValue(false)}
              className={`h-16 ${selectedValue === false 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                : 'glass-card border-navy-600/30 text-navy-300 hover:text-white'
              }`}
            >
              {options.false_label || 'Não'}
            </Button>
          </div>
        );

      case 'scale':
        const labels = options.labels || [];
        const min = options.min || 1;
        const max = options.max || 5;
        
        return (
          <div className="space-y-4">
            {labels.length > 0 && (
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
                {labels.map((label: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedValue === index + min ? "default" : "outline"}
                    onClick={() => setSelectedValue(index + min)}
                    className={`h-20 text-xs flex flex-col gap-2 ${
                      selectedValue === index + min 
                        ? 'bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white' 
                        : 'glass-card border-navy-600/30 text-navy-300 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{label}</span>
                    <span>{index + min}</span>
                  </Button>
                ))}
              </div>
            )}
            {labels.length === 0 && (
              <div className="flex gap-2 justify-center">
                {Array.from({ length: max - min + 1 }, (_, i) => (
                  <Button
                    key={i}
                    variant={selectedValue === min + i ? "default" : "outline"}
                    onClick={() => setSelectedValue(min + i)}
                    className={`w-12 h-12 ${
                      selectedValue === min + i 
                        ? 'bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white' 
                        : 'glass-card border-navy-600/30 text-navy-300 hover:text-white'
                    }`}
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
        const numberMin = options.min || 0;
        const numberMax = options.max || 100;
        const step = options.step || 1;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSelectedValue(Math.max(numberMin, (selectedValue || numberMin) - step))}
                disabled={selectedValue <= numberMin}
                className="glass-card border-navy-600/30 text-navy-300 hover:text-white"
              >
                -
              </Button>
              <div className="text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white">
                  {selectedValue || numberMin}
                </div>
                <div className="text-sm text-navy-400">{unit}</div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSelectedValue(Math.min(numberMax, (selectedValue || numberMin) + step))}
                disabled={selectedValue >= numberMax}
                className="glass-card border-navy-600/30 text-navy-300 hover:text-white"
              >
                +
              </Button>
            </div>
            <div className="text-center">
              <Input
                type="number"
                min={numberMin}
                max={numberMax}
                step={step}
                value={selectedValue || ''}
                onChange={(e) => setSelectedValue(Number(e.target.value))}
                className="w-32 mx-auto text-center glass-card border-navy-600/30 bg-navy-800/50 text-white"
                placeholder={`${numberMin}-${numberMax}`}
              />
            </div>
          </div>
        );

      case 'select':
        const selectOptions = options.options || [];
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectOptions.map((option: string, index: number) => (
              <Button
                key={index}
                variant={selectedValue === option ? "default" : "outline"}
                onClick={() => setSelectedValue(option)}
                className={`h-16 ${
                  selectedValue === option 
                    ? 'bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white' 
                    : 'glass-card border-navy-600/30 text-navy-300 hover:text-white'
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            <Input
              type="time"
              value={selectedValue || options.default || ''}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-48 mx-auto text-center glass-card border-navy-600/30 bg-navy-800/50 text-white text-lg"
            />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={options.placeholder || 'Digite sua resposta...'}
              className="glass-card border-navy-600/30 bg-navy-800/50 text-white min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-navy-400 text-right">
              {textValue.length}/500 caracteres
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pergunta */}
      <div className="text-center space-y-3">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-white leading-relaxed"
        >
          {prompt.question}
        </motion.h3>
        
        {prompt.subcategory && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-700/30 rounded-full">
            <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
            <span className="text-sm text-navy-300 capitalize">
              {prompt.subcategory.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Input da resposta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {renderInput()}
      </motion.div>

      {/* Botão de confirmação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center pt-4"
      >
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || isLoading}
          size="lg"
          className="px-8 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/90 hover:to-accent-orange/70 text-white font-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Confirmar
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
