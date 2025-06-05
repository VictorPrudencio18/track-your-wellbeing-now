
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
  Plus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function AdvancedHealthDashboard() {
  const { overallScore, healthGoals, healthInsights, isLoading } = useAdvancedHealth();
  const { dailyTotals, activePlan } = useNutrition();
  const { todayCheckin } = useDailyCheckins();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-48 bg-gradient-to-br from-navy-800/50 to-navy-700/30 rounded-2xl border border-navy-600/20"
          />
        ))}
      </div>
    );
  }

  const dailyMetrics = [
    {
      icon: Heart,
      label: 'Score Geral',
      value: `${Math.round(overallScore)}%`,
      target: '85%',
      progress: overallScore,
      color: 'text-rose-400',
      bgColor: 'bg-gradient-to-br from-rose-500/20 to-pink-500/10',
      trend: overallScore > 75 ? 'up' : 'down',
      change: '+2.3%'
    },
    {
      icon: Droplets,
      label: 'Hidratação',
      value: `${todayCheckin?.hydration_glasses || 0}/8`,
      target: '8 copos',
      progress: ((todayCheckin?.hydration_glasses || 0) / 8) * 100,
      color: 'text-cyan-400',
      bgColor: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10',
      trend: 'up',
      change: '+1 copo'
    },
    {
      icon: Apple,
      label: 'Calorias',
      value: `${dailyTotals.calories}`,
      target: `${activePlan?.calorie_target || 2000}`,
      progress: activePlan?.calorie_target ? (dailyTotals.calories / activePlan.calorie_target) * 100 : 0,
      color: 'text-emerald-400',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-green-500/10',
      trend: 'up',
      change: '+150 cal'
    },
    {
      icon: Moon,
      label: 'Sono',
      value: todayCheckin?.sleep_quality ? `${todayCheckin.sleep_quality}/5` : 'N/A',
      target: '4-5',
      progress: todayCheckin?.sleep_quality ? (todayCheckin.sleep_quality / 5) * 100 : 0,
      color: 'text-violet-400',
      bgColor: 'bg-gradient-to-br from-violet-500/20 to-purple-500/10',
      trend: 'up',
      change: '+0.5h'
    },
    {
      icon: Zap,
      label: 'Energia',
      value: todayCheckin?.energy_level ? `${todayCheckin.energy_level}/10` : 'N/A',
      target: '7-10',
      progress: todayCheckin?.energy_level ? (todayCheckin.energy_level / 10) * 100 : 0,
      color: 'text-amber-400',
      bgColor: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
      trend: 'up',
      change: '+1.2'
    },
    {
      icon: Brain,
      label: 'Bem-estar Mental',
      value: todayCheckin?.stress_level ? `${10 - todayCheckin.stress_level}/10` : 'N/A',
      target: '7-10',
      progress: todayCheckin?.stress_level ? ((10 - todayCheckin.stress_level) / 10) * 100 : 0,
      color: 'text-indigo-400',
      bgColor: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/10',
      trend: 'up',
      change: '+0.8'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section com Score Geral */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/10 via-transparent to-accent-orange/5 rounded-3xl" />
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-navy-800/80 via-navy-700/60 to-navy-800/80 border border-navy-600/30 backdrop-blur-xl relative">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="p-6 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-3xl backdrop-blur-sm border border-accent-orange/20">
                <Heart className="w-10 h-10 text-accent-orange" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-accent-orange to-white bg-clip-text text-transparent">
                  Score de Saúde
                </h2>
                <p className="text-navy-400 text-lg">
                  Baseado em todas as suas métricas
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center justify-center gap-8">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-navy-700/50"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#healthGradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - overallScore / 100)}`}
                    initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 70 * (1 - overallScore / 100)}` }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-5xl font-bold text-white"
                  >
                    {Math.round(overallScore)}
                  </motion.span>
                </div>
              </div>
              
              <div className="space-y-4 text-left">
                <Badge className="bg-gradient-to-r from-accent-orange/20 to-accent-orange/10 text-accent-orange border-accent-orange/30 px-6 py-3 text-lg">
                  {overallScore >= 80 ? '🏆 Excelente' : overallScore >= 60 ? '👍 Bom' : '📈 Melhorando'}
                </Badge>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">+5.2% esta semana</span>
                  </div>
                  <p className="text-navy-400 text-sm max-w-xs">
                    Seu score melhorou consistentemente nos últimos 7 dias
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Métricas Diárias em Grid Responsivo */}
      <div className="space-y-6">
        <motion.h3 
          variants={itemVariants}
          className="text-3xl font-bold bg-gradient-to-r from-white to-navy-300 bg-clip-text text-transparent"
        >
          Métricas de Hoje
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {dailyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group overflow-hidden relative">
                <div className={`absolute inset-0 ${metric.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${metric.bgColor} border border-white/10`}>
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
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-300 font-medium">{metric.label}</span>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' ? (
                          <ArrowUp className="w-3 h-3 text-green-400" />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={Math.min(metric.progress, 100)} 
                        className="h-2 bg-navy-700/50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metas e Insights em Layout Avançado */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Metas Ativas */}
        <motion.div variants={itemVariants} className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Metas Ativas</h3>
            <Button 
              variant="outline" 
              size="sm"
              className="glass-card border-navy-600/30 text-white hover:bg-accent-orange/20 hover:border-accent-orange/50 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthGoals.slice(0, 4).map((goal, index) => (
              <motion.div
                key={goal.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover:bg-navy-700/50 transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg group-hover:text-accent-orange transition-colors">
                        {goal.goal_title}
                      </CardTitle>
                      <Badge variant="outline" className="border-accent-orange/30 text-accent-orange bg-accent-orange/10">
                        {goal.goal_category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-navy-400 text-sm">
                        {goal.goal_description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-navy-300">Progresso</span>
                          <span className="text-white font-medium">
                            {goal.current_value}/{goal.target_value} {goal.unit}
                          </span>
                        </div>
                        
                        <Progress 
                          value={goal.target_value ? (goal.current_value / goal.target_value) * 100 : 0}
                          className="h-2 bg-navy-700/50"
                        />
                      </div>
                      
                      {goal.target_date && (
                        <div className="flex items-center gap-2 text-xs text-navy-400">
                          <Clock className="w-3 h-3" />
                          Meta: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights Lateral */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Insights</h3>
          <div className="space-y-4">
            {healthInsights.slice(0, 3).map((insight, index) => (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover:bg-navy-700/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        insight.severity === 'critical' ? 'bg-red-500/20 border border-red-500/30' :
                        insight.severity === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                        insight.severity === 'positive' ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-blue-500/20 border border-blue-500/30'
                      }`}>
                        {insight.severity === 'critical' || insight.severity === 'warning' ? (
                          <AlertCircle className={`w-4 h-4 ${
                            insight.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                          }`} />
                        ) : (
                          <CheckCircle className={`w-4 h-4 ${
                            insight.severity === 'positive' ? 'text-green-400' : 'text-blue-400'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium text-sm truncate">
                            {insight.title}
                          </h4>
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                            {insight.category}
                          </Badge>
                        </div>
                        
                        <p className="text-navy-300 text-xs mb-2 line-clamp-2">
                          {insight.content}
                        </p>
                        
                        {insight.actionable_steps.length > 0 && (
                          <div className="text-xs text-accent-orange">
                            • {insight.actionable_steps[0].substring(0, 50)}...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions com Design Moderno */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Ações Rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: 'Novo Treino', color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
            { icon: Apple, label: 'Registrar Refeição', color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400' },
            { icon: Heart, label: 'Medir Pressão', color: 'from-red-500/20 to-red-600/10', iconColor: 'text-red-400' },
            { icon: TrendingUp, label: 'Ver Relatórios', color: 'from-purple-500/20 to-purple-600/10', iconColor: 'text-purple-400' },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                className={`glass-card border-navy-600/20 bg-gradient-to-br ${action.color} backdrop-blur-xl w-full h-24 flex-col gap-3 hover:border-accent-orange/50 transition-all duration-300 group`}
              >
                <action.icon className={`w-6 h-6 ${action.iconColor} group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-xs text-navy-300 group-hover:text-white transition-colors">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
