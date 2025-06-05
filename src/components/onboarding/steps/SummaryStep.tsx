
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, Target, Clock, Users } from 'lucide-react';

interface SummaryStepProps {
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  responses: Record<string, any>;
}

export function SummaryStep({ onNext, onPrevious, canGoBack, responses }: SummaryStepProps) {
  const handleComplete = () => {
    console.log('Completing onboarding with responses:', responses);
    onNext({});
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'Perder peso': return '⚖️';
      case 'Ganhar massa muscular': return '💪';
      case 'Melhorar condicionamento': return '🏃';
      case 'Reduzir estresse': return '🧘';
      default: return '🎯';
    }
  };

  // Função para obter valor de resposta com fallback
  const getResponseValue = (key: string, fallback = 'Não informado') => {
    return responses[key] || fallback;
  };

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/20">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Perfil Completo!</h2>
        <p className="text-navy-300">
          Obrigado por compartilhar essas informações. Agora podemos criar uma experiência personalizada para você.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-navy-800/20 rounded-xl p-6 border border-navy-700/20">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-orange" />
            Seu Perfil
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-navy-300">
              <span className="text-white font-medium">Objetivo:</span><br />
              {getGoalIcon(getResponseValue('primary_goal'))} {getResponseValue('primary_goal')}
            </div>
            <div className="text-navy-300">
              <span className="text-white font-medium">Tempo disponível:</span><br />
              <Clock className="w-4 h-4 inline mr-1" />
              {getResponseValue('available_time')}
            </div>
            <div className="text-navy-300">
              <span className="text-white font-medium">Nível atual:</span><br />
              <Heart className="w-4 h-4 inline mr-1" />
              {getResponseValue('fitness_level') !== 'Não informado' 
                ? `Nível ${getResponseValue('fitness_level')}/5` 
                : 'Não informado'}
            </div>
            <div className="text-navy-300">
              <span className="text-white font-medium">Preferência social:</span><br />
              <Users className="w-4 h-4 inline mr-1" />
              {getResponseValue('exercise_preference')}
            </div>
          </div>

          {/* Informações adicionais se disponíveis */}
          {(getResponseValue('age') !== 'Não informado' || 
            getResponseValue('current_weight') !== 'Não informado') && (
            <div className="mt-4 pt-4 border-t border-navy-700/30 grid grid-cols-2 gap-4 text-sm text-navy-300">
              {getResponseValue('age') !== 'Não informado' && (
                <div>
                  <span className="text-white font-medium">Idade:</span> {getResponseValue('age')} anos
                </div>
              )}
              {getResponseValue('gender') !== 'Não informado' && (
                <div>
                  <span className="text-white font-medium">Gênero:</span> {getResponseValue('gender')}
                </div>
              )}
              {getResponseValue('current_weight') !== 'Não informado' && (
                <div>
                  <span className="text-white font-medium">Peso:</span> {getResponseValue('current_weight')} kg
                </div>
              )}
              {getResponseValue('current_height') !== 'Não informado' && (
                <div>
                  <span className="text-white font-medium">Altura:</span> {getResponseValue('current_height')} cm
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-accent-orange/10 rounded-xl p-6 border border-accent-orange/20">
          <h3 className="font-semibold text-white mb-3">🎉 O que vem a seguir:</h3>
          <ul className="space-y-2 text-sm text-navy-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
              Recomendações personalizadas de atividades
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
              Planos de treino adequados ao seu nível
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
              Acompanhamento inteligente do seu progresso
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
              Insights sobre sua saúde e bem-estar
            </li>
          </ul>
        </div>

        <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/20">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            🔒 Privacidade e Segurança
          </h3>
          <p className="text-sm text-navy-300">
            Seus dados estão seguros e criptografados. Você pode visualizar, editar ou 
            excluir suas informações a qualquer momento nas configurações da conta.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
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
          onClick={handleComplete}
          className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/90 hover:to-accent-orange/70 text-white px-8 ml-auto"
        >
          Começar Jornada! 🚀
        </Button>
      </div>
    </div>
  );
}
