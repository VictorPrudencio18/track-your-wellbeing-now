
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGoalRecommendations } from '@/hooks/useGoalRecommendations';
import { useWeeklyGoals } from '@/hooks/useWeeklyGoals';
import { Lightbulb, CheckCircle, X, Sparkles, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

export function GoalRecommendations() {
  const { recommendations, generateRecommendations, updateRecommendationStatus } = useGoalRecommendations();
  const { createGoal } = useWeeklyGoals();

  const handleAcceptRecommendation = async (recommendation: any) => {
    try {
      const weekDates = getWeekDates();
      
      await createGoal.mutateAsync({
        goal_type: recommendation.recommended_goal_type,
        title: recommendation.recommended_title,
        description: recommendation.recommended_description,
        target_value: recommendation.recommended_target_value,
        unit: recommendation.recommended_unit,
        week_start_date: weekDates.start,
        week_end_date: weekDates.end,
        auto_generated: true,
        priority: 3,
        difficulty_level: Math.ceil(recommendation.confidence_score * 5)
      });
      
      await updateRecommendationStatus.mutateAsync({
        id: recommendation.id,
        status: 'accepted'
      });
      
      toast.success('Recomendação aceita e meta criada!');
    } catch (error) {
      toast.error('Erro ao aceitar recomendação');
      console.error(error);
    }
  };

  const handleRejectRecommendation = async (recommendationId: string) => {
    try {
      await updateRecommendationStatus.mutateAsync({
        id: recommendationId,
        status: 'rejected'
      });
      toast.success('Recomendação rejeitada');
    } catch (error) {
      toast.error('Erro ao rejeitar recomendação');
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (score >= 0.6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'distance': return '🏃‍♂️';
      case 'duration': return '⏱️';
      case 'frequency': return '🎯';
      case 'calories': return '🔥';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-navy-800/50 to-navy-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent-orange" />
                Recomendações Inteligentes
              </CardTitle>
              <p className="text-navy-400 text-sm mt-1">
                Baseadas no seu histórico de atividades e performance
              </p>
            </div>
            <Button
              onClick={() => generateRecommendations.mutate()}
              disabled={generateRecommendations.isPending}
              className="bg-accent-orange hover:bg-accent-orange/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateRecommendations.isPending ? 'Gerando...' : 'Gerar Novas'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Recommendations List */}
      {recommendations.length === 0 ? (
        <Card className="glass-card border-navy-600/30 bg-navy-800/30">
          <CardContent className="p-8 text-center">
            <Lightbulb className="w-12 h-12 text-navy-500 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Nenhuma recomendação disponível</h3>
            <p className="text-navy-400 mb-4">
              Complete algumas atividades para receber recomendações personalizadas
            </p>
            <Button
              onClick={() => generateRecommendations.mutate()}
              disabled={generateRecommendations.isPending}
              variant="outline"
              className="glass-card border-navy-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Recomendações
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/30 hover:bg-navy-800/50 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getGoalTypeIcon(recommendation.recommended_goal_type)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">
                          {recommendation.recommended_title}
                        </CardTitle>
                        {recommendation.recommended_description && (
                          <p className="text-navy-400 text-sm mt-1">
                            {recommendation.recommended_description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Badge className={getConfidenceColor(recommendation.confidence_score)}>
                      {Math.round(recommendation.confidence_score * 100)}% confiança
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Target Value */}
                  <div className="bg-navy-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-accent-orange">
                          {recommendation.recommended_target_value}
                        </div>
                        <div className="text-sm text-navy-400">
                          {recommendation.recommended_unit}
                        </div>
                      </div>
                      <Target className="w-8 h-8 text-accent-orange/60" />
                    </div>
                  </div>
                  
                  {/* Reasoning */}
                  {recommendation.reasoning && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <h4 className="text-blue-400 text-sm font-medium mb-1 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Justificativa
                      </h4>
                      <p className="text-blue-300 text-sm">
                        {recommendation.reasoning}
                      </p>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAcceptRecommendation(recommendation)}
                      disabled={createGoal.isPending || updateRecommendationStatus.isPending}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aceitar
                    </Button>
                    <Button
                      onClick={() => handleRejectRecommendation(recommendation.id)}
                      disabled={updateRecommendationStatus.isPending}
                      variant="outline"
                      className="glass-card border-red-600 text-red-400 hover:bg-red-600/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
