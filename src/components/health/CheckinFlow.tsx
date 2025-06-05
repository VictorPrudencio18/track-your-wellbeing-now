
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartCheckinCard } from './components/SmartCheckinCard';
import { CheckinProgress } from './components/CheckinProgress';
import { CheckinSummary } from './components/CheckinSummary';
import { useSmartCheckins } from '@/hooks/useSmartCheckins';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';

export function CheckinFlow() {
  const { 
    currentPrompts, 
    completedToday, 
    totalToday, 
    currentPromptIndex, 
    nextPrompt, 
    submitResponse,
    isLoading 
  } = useSmartCheckins();
  
  const [flowState, setFlowState] = useState<'checkin' | 'summary'>('checkin');
  const currentPrompt = currentPrompts[currentPromptIndex];
  const isCompleted = completedToday >= totalToday;

  if (isCompleted || flowState === 'summary') {
    return <CheckinSummary onRestart={() => setFlowState('checkin')} />;
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-navy-800/50 to-navy-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                <Clock className="w-5 h-5 text-accent-orange" />
              </div>
              <div>
                <CardTitle className="text-white">Check-in Inteligente</CardTitle>
                <p className="text-navy-400 text-sm">
                  Perguntas personalizadas baseadas no seu dia
                </p>
              </div>
            </div>
            
            {!isCompleted && (
              <Button
                onClick={() => setFlowState('summary')}
                variant="outline"
                size="sm"
                className="border-navy-600 text-navy-300 hover:bg-navy-700"
              >
                Finalizar Depois
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CheckinProgress 
            current={completedToday} 
            total={totalToday} 
            currentStep={currentPromptIndex + 1}
          />
        </CardContent>
      </Card>

      {/* Main Checkin Area */}
      <AnimatePresence mode="wait">
        {currentPrompt && (
          <motion.div
            key={currentPromptIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SmartCheckinCard
              prompt={currentPrompt}
              onSubmit={async (value) => {
                await submitResponse(currentPrompt.prompt_key, value);
                
                if (currentPromptIndex < currentPrompts.length - 1) {
                  nextPrompt();
                } else {
                  setFlowState('summary');
                }
              }}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Concluídos Hoje', value: completedToday, color: 'text-green-400' },
          { label: 'Restantes', value: totalToday - completedToday, color: 'text-yellow-400' },
          { label: 'Sequência', value: '7 dias', color: 'text-blue-400' },
          { label: 'Score Médio', value: '85%', color: 'text-purple-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/30 text-center">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-navy-400">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
