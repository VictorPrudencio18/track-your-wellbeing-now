
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, TrendingUp, Calendar } from 'lucide-react';

interface CheckinSummaryProps {
  onRestart: () => void;
}

export function CheckinSummary({ onRestart }: CheckinSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success Card */}
      <Card className="glass-card border-green-500/30 bg-gradient-to-br from-green-900/20 to-green-800/10">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <CardTitle className="text-white text-2xl">
            Check-in Concluído! 🎉
          </CardTitle>
          <p className="text-green-400">
            Obrigado por compartilhar como você está se sentindo hoje
          </p>
        </CardHeader>
      </Card>

      {/* Today's Summary */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-orange" />
            Resumo de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Bem-estar Geral', value: '8.5/10', color: 'text-green-400' },
              { label: 'Nível de Energia', value: '7/10', color: 'text-yellow-400' },
              { label: 'Qualidade do Sono', value: '9/10', color: 'text-purple-400' },
              { label: 'Stress', value: '3/10', color: 'text-blue-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs text-navy-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass-card border-navy-600/30 bg-navy-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Conquistas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: 'Check-in Completo', description: 'Concluiu todas as perguntas do dia', earned: true },
              { title: 'Sequência de 7 dias', description: 'Manteve check-ins por uma semana', earned: true },
              { title: 'Bem-estar Alto', description: 'Score acima de 8 pontos', earned: true },
              { title: 'Consistência Mensal', description: 'Check-ins todos os dias do mês', earned: false }
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.earned ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-navy-700/30'
                }`}
              >
                <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                  🏆
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">
                      {achievement.title}
                    </span>
                    {achievement.earned && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                        Conquistado!
                      </Badge>
                    )}
                  </div>
                  <p className="text-navy-400 text-xs">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 border-navy-600 text-navy-300 hover:bg-navy-700"
        >
          Fazer Novo Check-in
        </Button>
        <Button className="flex-1 bg-accent-orange hover:bg-accent-orange/90">
          <TrendingUp className="w-4 h-4 mr-2" />
          Ver Analytics
        </Button>
      </div>
    </motion.div>
  );
}
