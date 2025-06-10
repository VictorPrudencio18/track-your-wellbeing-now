
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Heart, Zap, Loader2 } from 'lucide-react';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { toast } from '@/hooks/use-toast';

const moodLabels = [
  'Péssimo', 'Muito ruim', 'Ruim', 'Baixo', 'Neutro', 
  'OK', 'Bom', 'Bem', 'Muito bem', 'Excelente'
];

const getMoodColor = (value: number): string => {
  if (value <= 3) return 'from-red-400 to-red-600';
  if (value <= 5) return 'from-orange-400 to-orange-600';
  if (value <= 7) return 'from-yellow-400 to-yellow-600';
  return 'from-green-400 to-green-600';
};

const getMoodIcon = (value: number) => {
  if (value <= 3) return Heart;
  if (value <= 7) return Smile;
  return Zap;
};

export function DailyMoodThermometer() {
  const { todayCheckin, upsertCheckin, isLoading } = useDailyCheckins();
  const [selectedMood, setSelectedMood] = useState<number | null>(
    todayCheckin?.mood_rating || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Se já foi registrado hoje e não há seleção pendente, não mostrar
  if (todayCheckin?.mood_rating && !selectedMood) {
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Selecione seu humor",
        description: "Por favor, selecione um valor de 1 a 10 antes de registrar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting mood rating:', selectedMood);
      
      const result = await upsertCheckin.mutateAsync({
        mood_rating: selectedMood
      });
      
      console.log('Mood saved successfully:', result);
      
      toast({
        title: "Humor registrado! 😊",
        description: `Seu humor hoje foi registrado como ${moodLabels[selectedMood - 1]}.`,
      });
      
      // Reset the selection after successful save
      setSelectedMood(null);
    } catch (error) {
      console.error('Error saving mood:', error);
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível registrar seu humor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const MoodIcon = selectedMood ? getMoodIcon(selectedMood) : Smile;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="glass-card bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="ml-2 text-white">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="glass-card bg-gradient-to-br from-blue-500/15 to-purple-500/15 border border-blue-500/20 backdrop-blur-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <MoodIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Como está seu humor hoje?</h3>
            </div>
            <p className="text-blue-300 text-sm">
              Registre como você está se sentindo para acompanhar seu bem-estar diário
            </p>
          </div>

          {/* Termômetro Visual */}
          <div className="flex items-end justify-center gap-2 mb-6 h-20">
            {Array.from({ length: 10 }, (_, i) => {
              const level = i + 1; // 1 a 10
              const isActive = selectedMood ? level <= selectedMood : false;
              const intensity = level / 10;
              const barHeight = 24 + (intensity * 56); // 24px to 80px height
              
              return (
                <motion.button
                  key={level}
                  onClick={() => {
                    console.log('Selecionando humor nível:', level);
                    setSelectedMood(level);
                  }}
                  className={`w-6 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-t ${getMoodColor(selectedMood || 5)} shadow-lg` 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  style={{ height: `${barHeight}px` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Humor nível ${level}: ${moodLabels[level - 1]}`}
                  disabled={isSubmitting}
                />
              );
            })}
          </div>

          {/* Labels dos números */}
          <div className="flex justify-between text-xs text-white/60 mb-4 px-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>

          {/* Display do valor selecionado */}
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold mb-2 ${
              selectedMood 
                ? `bg-gradient-to-r ${getMoodColor(selectedMood)} bg-clip-text text-transparent`
                : 'text-white/50'
            }`}>
              {selectedMood || '?'}
            </div>
            <div className="text-lg text-white/80 font-medium">
              {selectedMood ? moodLabels[selectedMood - 1] : 'Selecione seu humor'}
            </div>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-blue-300 mt-2"
              >
                Nível {selectedMood} de 10 - Toque em "Registrar" para salvar
              </motion.div>
            )}
          </div>

          {/* Botão de ação */}
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSubmit}
                disabled={selectedMood === null || isSubmitting || upsertCheckin.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting || upsertCheckin.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  'Registrar Humor'
                )}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
