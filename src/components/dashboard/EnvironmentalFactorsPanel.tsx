
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Users, 
  Briefcase, 
  Leaf,
  Sun,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Heart
} from 'lucide-react';
import { useEnvironmentalFactors } from '@/hooks/useEnvironmentalFactors';

export function EnvironmentalFactorsPanel() {
  const { data: environmentalData, isLoading } = useEnvironmentalFactors();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-navy-700/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-navy-700 rounded w-1/2"></div>
                <div className="h-20 bg-navy-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!environmentalData) {
    return (
      <Card className="glass-card border-navy-700/30">
        <CardContent className="p-6 text-center">
          <Leaf className="w-12 h-12 text-navy-500 mx-auto mb-4" />
          <p className="text-navy-400">
            Continue registrando dados para análise de fatores ambientais
          </p>
        </CardContent>
      </Card>
    );
  }

  const { weatherImpact, socialCorrelation, workLifeBalance, environmentalScore } = environmentalData;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBalanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  return (
    <div className="space-y-6">
      {/* Environmental Wellness Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Leaf className="w-5 h-5 text-green-400" />
              Score de Bem-estar Ambiental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Overall Score */}
              <div className="md:col-span-1 text-center">
                <div className="text-sm text-gray-400 mb-2">Score Geral</div>
                <div className={`text-4xl font-bold ${getScoreColor(environmentalScore.overall)}`}>
                  {environmentalScore.overall}
                </div>
                <Progress value={environmentalScore.overall} className="h-2 mt-2" />
              </div>

              {/* Factor Scores */}
              <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                  <Cloud className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Clima</div>
                  <div className={`font-bold ${getScoreColor(environmentalScore.factors.weather)}`}>
                    {environmentalScore.factors.weather}
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Social</div>
                  <div className={`font-bold ${getScoreColor(environmentalScore.factors.social)}`}>
                    {environmentalScore.factors.social}
                  </div>
                </div>

                <div className="text-center p-3 bg-orange-400/10 rounded-lg border border-orange-400/20">
                  <Briefcase className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Trabalho</div>
                  <div className={`font-bold ${getScoreColor(environmentalScore.factors.work)}`}>
                    {environmentalScore.factors.work}
                  </div>
                </div>

                <div className="text-center p-3 bg-green-400/10 rounded-lg border border-green-400/20">
                  <Heart className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400">Atividade</div>
                  <div className={`font-bold ${getScoreColor(environmentalScore.factors.activity)}`}>
                    {environmentalScore.factors.activity}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-white text-sm">💡 Insights Ambientais:</h4>
              {environmentalScore.insights.map((insight, index) => (
                <div key={index} className="text-sm text-gray-400 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {insight}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Impact Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sun className="w-5 h-5 text-yellow-400" />
                Análise de Impacto Climático
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                  <div className="text-sm text-gray-400">Humor</div>
                  <div className={`text-lg font-bold ${getScoreColor((weatherImpact.moodCorrelation + 1) * 50)}`}>
                    {weatherImpact.moodCorrelation > 0 ? '+' : ''}{(weatherImpact.moodCorrelation * 100).toFixed(0)}%
                  </div>
                </div>
                
                <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                  <div className="text-sm text-gray-400">Energia</div>
                  <div className={`text-lg font-bold ${getScoreColor((weatherImpact.energyCorrelation + 1) * 50)}`}>
                    {weatherImpact.energyCorrelation > 0 ? '+' : ''}{(weatherImpact.energyCorrelation * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Impacto em Atividades</span>
                  <span className={`font-medium ${getScoreColor(weatherImpact.activityImpact + 50)}`}>
                    {weatherImpact.activityImpact > 0 ? '+' : ''}{weatherImpact.activityImpact}%
                  </span>
                </div>
                
                <Progress 
                  value={Math.max(0, Math.min(100, weatherImpact.activityImpact + 50))} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium text-white text-sm">🌤️ Recomendações:</h4>
                {weatherImpact.recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Social Activity Correlation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-purple-400" />
                Correlação de Atividades Sociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-400/10 rounded-lg border border-purple-400/20">
                  <div className="text-sm text-gray-400">Dias Sociais</div>
                  <div className="text-lg font-bold text-purple-400">
                    {socialCorrelation.socialDays}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-navy-800/30 rounded-lg">
                  <div className="text-sm text-gray-400">Impacto Social</div>
                  <div className={`text-lg font-bold ${socialCorrelation.socialImpact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {socialCorrelation.socialImpact > 0 ? '+' : ''}{socialCorrelation.socialImpact.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Humor - Dias Sociais</span>
                  <span className="font-medium text-white">
                    {socialCorrelation.avgMoodOnSocialDays.toFixed(1)}/10
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Humor - Dias Solo</span>
                  <span className="font-medium text-white">
                    {socialCorrelation.avgMoodOnSoloDays.toFixed(1)}/10
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-medium text-white text-sm">👥 Insights Sociais:</h4>
                {socialCorrelation.insights.map((insight, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-start gap-2">
                    <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {insight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Work-Life Balance Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-navy-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Briefcase className="w-5 h-5 text-orange-400" />
              Medidor de Equilíbrio Trabalho-Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Balance Score */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-2">Score de Equilíbrio</div>
                  <div className={`text-4xl font-bold ${getScoreColor(workLifeBalance.balanceScore)}`}>
                    {workLifeBalance.balanceScore}
                  </div>
                  <Progress value={workLifeBalance.balanceScore} className="h-3 mt-3" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tendência de Satisfação</span>
                    <div className="flex items-center gap-1">
                      {workLifeBalance.workSatisfactionTrend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : workLifeBalance.workSatisfactionTrend < 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={`font-medium ${
                        workLifeBalance.workSatisfactionTrend > 0 ? 'text-green-400' :
                        workLifeBalance.workSatisfactionTrend < 0 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {workLifeBalance.workSatisfactionTrend > 0 ? '+' : ''}
                        {workLifeBalance.workSatisfactionTrend.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stress Levels */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Níveis de Stress</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Trabalho</span>
                      <span className={`text-sm font-medium ${getScoreColor(100 - workLifeBalance.stressLevels.work * 10)}`}>
                        {workLifeBalance.stressLevels.work.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={workLifeBalance.stressLevels.work * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Pessoal</span>
                      <span className={`text-sm font-medium ${getScoreColor(100 - workLifeBalance.stressLevels.personal * 10)}`}>
                        {workLifeBalance.stressLevels.personal.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={workLifeBalance.stressLevels.personal * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Geral</span>
                      <span className={`text-sm font-medium ${getScoreColor(100 - workLifeBalance.stressLevels.overall * 10)}`}>
                        {workLifeBalance.stressLevels.overall.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={workLifeBalance.stressLevels.overall * 10} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-white text-sm">⚖️ Recomendações de Equilíbrio:</h4>
              {workLifeBalance.recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-gray-400 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {rec}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
