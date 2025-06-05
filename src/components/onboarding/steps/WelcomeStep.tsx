import React from 'react';
import { Shield, Lock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-orange/20">
          <Heart className="w-10 h-10 text-accent-orange" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Bem-vindo ao Viva!
        </h1>
        
        <p className="text-navy-300 text-lg mb-8">
          Vamos conhecer você melhor para criar uma experiência personalizada 
          e ajudá-lo a alcançar seus objetivos de saúde e bem-estar.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex items-start gap-4 p-4 bg-navy-800/30 rounded-xl border border-navy-700/30">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Privacidade Garantida</h3>
            <p className="text-navy-300 text-sm">
              Suas informações são criptografadas e mantidas em total segurança. 
              Nunca compartilharemos seus dados pessoais.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-navy-800/30 rounded-xl border border-navy-700/30">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Lock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Dados Protegidos</h3>
            <p className="text-navy-300 text-sm">
              Utilizamos criptografia de nível bancário para proteger suas informações 
              e você pode editar ou excluir seus dados a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-navy-800/20 rounded-xl p-6 mb-8 border border-navy-700/20">
        <h3 className="font-semibold text-white mb-3">O que vamos perguntar:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-navy-300">
          <div>• Informações básicas de saúde</div>
          <div>• Estilo de vida e rotina</div>
          <div>• Objetivos e motivações</div>
          <div>• Preferências de exercício</div>
        </div>
        <p className="text-xs text-navy-400 mt-4">
          ⏱️ Tempo estimado: 5-8 minutos
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => onNext({})}
          className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-3"
        >
          Começar Questionário
        </Button>
      </div>
    </div>
  );
}
