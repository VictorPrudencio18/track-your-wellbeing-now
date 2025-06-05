
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, Heart, Users } from 'lucide-react';

export function UserProfileCard() {
  const { user } = useAuth();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user-profile-data', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Buscar dados do onboarding
      const { data: onboardingData } = await supabase
        .from('onboarding_progress')
        .select('data_snapshot')
        .eq('user_id', user.id)
        .maybeSingle();

      // Buscar respostas individuais do assessment
      const { data: assessmentData } = await supabase
        .from('user_profile_assessment')
        .select('question_key, response_value, category_name')
        .eq('user_id', user.id);

      // Combinar dados
      const combined = {
        onboarding: onboardingData?.data_snapshot || {},
        assessment: assessmentData || []
      };

      return combined;
    },
    enabled: !!user
  });

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'Perder peso': return '⚖️';
      case 'Ganhar massa muscular': return '💪';
      case 'Melhorar condicionamento': return '🏃';
      case 'Reduzir estresse': return '🧘';
      default: return '🎯';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-orange" />
            Seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="text-navy-300">
          Carregando informações do perfil...
        </CardContent>
      </Card>
    );
  }

  if (!profileData || (!profileData.onboarding && !profileData.assessment.length)) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-orange" />
            Seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="text-navy-300">
          <p>Complete o questionário inicial para ver suas informações aqui.</p>
        </CardContent>
      </Card>
    );
  }

  const responses = profileData.onboarding;
  
  // Função para buscar valor de uma resposta específica
  const getResponseValue = (key: string) => {
    return responses[key] || 
           profileData.assessment.find(item => item.question_key === key)?.response_value || 
           'Não informado';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-accent-orange" />
          Seu Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
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

        {getResponseValue('age') !== 'Não informado' && (
          <div className="mt-4 pt-4 border-t border-navy-700/30">
            <div className="grid grid-cols-2 gap-4 text-sm text-navy-300">
              <div>
                <span className="text-white font-medium">Idade:</span> {getResponseValue('age')} anos
              </div>
              <div>
                <span className="text-white font-medium">Gênero:</span> {getResponseValue('gender')}
              </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
