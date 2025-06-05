
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdvancedHealth } from '@/hooks/useAdvancedHealth';
import { useNutrition } from '@/hooks/useNutrition';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { 
  Heart, 
  Activity, 
  Target, 
  TrendingUp, 
  Zap, 
  Droplets,
  Moon,
  Brain,
  Apple,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function AdvancedHealthDashboard() {
  const { overallScore, healthGoals, healthInsights, isLoading } = useAdvancedHealth();
  const { dailyTotals, activePlan } = useNutrition();
  const { todayCheckin } = useDailyCheckins();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-navy-800/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Métricas principais do dia
  const dailyMetrics = [
    {
      icon: Heart,
      label: 'Score Geral',
      value: `${Math.round(overallScore)}%`,
      target: '85%',
      progress: overallScore,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    {
      icon: Droplets,
      label: 'Hidratação',
      value: `${todayCheckin?.hydration_glasses || 0}/8`,
      target: '8 copos',
      progress: ((todayCheckin?.hydration_glasses || 0) / 8) * 100,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Apple,
      label: 'Calorias',
      value: `${dailyTotals.calories}`,
      target: `${activePlan?.calorie_target || 2000}`,
      progress: activePlan?.calorie_target ? (dailyTotals.calories / activePlan.calorie_target) * 100 : 0,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Moon,
      label: 'Sono',
      value: todayCheckin?.sleep_quality ? `${todayCheckin.sleep_quality}/5` : 'N/A',
      target: '4-5',
      progress: todayCheckin?.sleep_quality ? (todayCheckin.sleep_quality / 5) * 100 : 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: Zap,
      label: 'Energia',
      value: todayCheckin?.energy_level ? `${todayCheckin.energy_level}/10` : 'N/A',
      target: '7-10',
      progress: todayCheckin?.energy_level ? (todayCheckin.energy_level / 10) * 100 : 0,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: Brain,
      label: 'Stress',
      value: todayCheckin?.stress_level ? `${todayCheckin.stress_level}/10` : 'N/A',
      target: '1-4',
      progress: todayCheckin?.stress_level ? ((10 - todayCheckin.stress_level) / 10) * 100 : 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header com Score Geral */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-navy-800/70 to-navy-700/50 border border-navy-600/30">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-accent-orange/10 rounded-2xl">
              <Heart className="w-8 h-8 text-accent-orange" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Score de Saúde Geral
              </h2>
              <p className="text-navy-400">
                Baseado em todas as suas métricas de saúde
              </p>
            </div>
          </div>
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-navy-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#healthGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {Math.round(overallScore)}
              </span>
            </div>
          </div>

          <Badge className="bg-accent-orange/20 text-accent-orange border-accent-orange/30 px-4 py-2">
            {overallScore >= 80 ? 'Excelente' : overallScore >= 60 ? 'Bom' : 'Precisa melhorar'}
          </Badge>
        </div>
      </motion.div>

      {/* Métricas Diárias */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Métricas de Hoje</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {metric.value}
                      </div>
                      <div className="text-xs text-navy-400">
                        meta: {metric.target}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-300">{metric.label}</span>
                      <span className="text-navy-400">
                        {Math.round(metric.progress)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(metric.progress, 100)} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metas Ativas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Metas Ativas</h3>
          <Button 
            variant="outline" 
            size="sm"
            className="glass-card border-navy-600 text-white hover:bg-navy-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthGoals.slice(0, 4).map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">
                      {goal.goal_title}
                    </CardTitle>
                    <Badge variant="outline" className="border-accent-orange/30 text-accent-orange">
                      {goal.goal_category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-navy-400 text-sm">
                      {goal.goal_description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-300">Progresso</span>
                      <span className="text-white font-medium">
                        {goal.current_value}/{goal.target_value} {goal.unit}
                      </span>
                    </div>
                    
                    <Progress 
                      value={goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0}
                      className="h-2"
                    />
                    
                    {goal.target_date && (
                      <div className="flex items-center gap-2 text-xs text-navy-400">
                        <Clock className="w-3 h-3" />
                        Meta: {new Date(goal.target_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Insights Personalizados</h3>
        <div className="space-y-4">
          {healthInsights.slice(0, 3).map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      insight.severity === 'critical' ? 'bg-red-500/20' :
                      insight.severity === 'warning' ? 'bg-yellow-500/20' :
                      insight.severity === 'positive' ? 'bg-green-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {insight.severity === 'critical' || insight.severity === 'warning' ? (
                        <AlertCircle className={`w-5 h-5 ${
                          insight.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      ) : (
                        <CheckCircle className={`w-5 h-5 ${
                          insight.severity === 'positive' ? 'text-green-400' : 'text-blue-400'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">
                          {insight.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.category}
                        </Badge>
                      </div>
                      
                      <p className="text-navy-300 text-sm mb-3">
                        {insight.content}
                      </p>
                      
                      {insight.actionable_steps.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs text-navy-400 font-medium">
                            Ações recomendadas:
                          </div>
                          {insight.actionable_steps.slice(0, 2).map((step, stepIndex) => (
                            <div key={stepIndex} className="text-xs text-accent-orange">
                              • {step}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: 'Novo Treino', color: 'bg-blue-500/20 text-blue-400' },
            { icon: Apple, label: 'Registrar Refeição', color: 'bg-green-500/20 text-green-400' },
            { icon: Heart, label: 'Medir Pressão', color: 'bg-red-500/20 text-red-400' },
            { icon: TrendingUp, label: 'Ver Relatórios', color: 'bg-purple-500/20 text-purple-400' },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="glass-card border-navy-600/30 bg-navy-800/50 w-full h-20 flex-col gap-2 hover:bg-navy-700/50"
              >
                <action.icon className={`w-6 h-6 ${action.color.split(' ')[1]}`} />
                <span className="text-xs text-navy-300">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
