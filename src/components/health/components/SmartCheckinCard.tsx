
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Heart } from 'lucide-react';

interface SmartCheckinCardProps {
  prompt: {
    prompt_key: string;
    question: string;
    response_type: 'scale' | 'text' | 'boolean';
    category: string;
  };
  onSubmit: (value: any) => void;
  isLoading: boolean;
}

export function SmartCheckinCard({ prompt, onSubmit, isLoading }: SmartCheckinCardProps) {
  const [scaleValue, setScaleValue] = useState([5]);
  const [textValue, setTextValue] = useState('');
  const [booleanValue, setBooleanValue] = useState<boolean | null>(null);

  const handleSubmit = () => {
    let value;
    switch (prompt.response_type) {
      case 'scale':
        value = scaleValue[0];
        break;
      case 'text':
        value = textValue;
        break;
      case 'boolean':
        value = booleanValue;
        break;
      default:
        value = null;
    }
    
    if (value !== null && value !== '') {
      onSubmit(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent-orange" />
            {prompt.category}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg text-white font-medium">
            {prompt.question}
          </div>

          {prompt.response_type === 'scale' && (
            <div className="space-y-4">
              <div className="px-4">
                <Slider
                  value={scaleValue}
                  onValueChange={setScaleValue}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-navy-400">
                <span>1 - Muito baixo</span>
                <span className="text-accent-orange font-medium text-lg">
                  {scaleValue[0]}
                </span>
                <span>10 - Muito alto</span>
              </div>
            </div>
          )}

          {prompt.response_type === 'text' && (
            <Textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Compartilhe seus pensamentos..."
              className="bg-navy-800/50 border-navy-600 text-white placeholder:text-navy-400"
              rows={4}
            />
          )}

          {prompt.response_type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={booleanValue === true ? "default" : "outline"}
                onClick={() => setBooleanValue(true)}
                className={booleanValue === true ? 
                  "bg-green-600 hover:bg-green-700" : 
                  "border-navy-600 text-navy-300"
                }
              >
                Sim
              </Button>
              <Button
                variant={booleanValue === false ? "default" : "outline"}
                onClick={() => setBooleanValue(false)}
                className={booleanValue === false ? 
                  "bg-red-600 hover:bg-red-700" : 
                  "border-navy-600 text-navy-300"
                }
              >
                Não
              </Button>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || 
              (prompt.response_type === 'text' && !textValue.trim()) ||
              (prompt.response_type === 'boolean' && booleanValue === null)
            }
            className="w-full bg-accent-orange hover:bg-accent-orange/90"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar Resposta
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
