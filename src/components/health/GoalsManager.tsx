
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, CheckCircle, TrendingUp } from 'lucide-react';

export function GoalsManager() {
  const [goals] = useState([
    {
      id: '1',
      title: 'Exercitar-se 4x por semana',
      progress: 75,
      current: 3,
      target: 4,
      type: 'exercise',
      deadline: '2024-01-31'
    },
    {
      id: '2',
      title: 'Dormir 8h por noite',
      progress: 60,
      current: 6,
      target: 10,
      type: 'sleep',
      deadline: '2024-01-31'
    },
    {
      id: '3',
      title: 'Meditar 10 min diários',
      progress: 90,
      current: 9,
      target: 10,
      type: 'mindfulness',
      deadline: '2024-01-31'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-navy-800/50 to-navy-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-orange" />
                Metas de Saúde
              </CardTitle>
              <p className="text-navy-400 text-sm">
                Defina e acompanhe seus objetivos de bem-estar
              </p>
            </div>
            <Button className="bg-accent-orange hover:bg-accent-orange/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/30 hover:bg-navy-800/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-2">{goal.title}</h3>
                    <Badge variant="outline" className="text-navy-300 border-navy-600">
                      {goal.type}
                    </Badge>
                  </div>
                  {goal.progress >= 100 && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-navy-400">Progresso</span>
                    <span className="text-white font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-400">Meta</span>
                  <span className="text-white">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-navy-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Metas Ativas', value: '3', color: 'text-blue-400' },
          { label: 'Concluídas', value: '1', color: 'text-green-400' },
          { label: 'Progresso Médio', value: '75%', color: 'text-yellow-400' },
          { label: 'Sequência', value: '12 dias', color: 'text-purple-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/20 text-center">
              <CardContent className="p-4">
                <div className={`text-xl font-bold ${stat.color} mb-1`}>
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
