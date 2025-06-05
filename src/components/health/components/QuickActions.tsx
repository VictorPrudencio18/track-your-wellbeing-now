
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Heart, Droplets, Moon, Activity, Brain } from 'lucide-react';

const quickActions = [
  {
    title: 'Check-in Rápido',
    description: 'Como você está se sentindo agora?',
    icon: Heart,
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    action: 'checkin'
  },
  {
    title: 'Registrar Água',
    description: 'Adicionar copo de água',
    icon: Droplets,
    color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    action: 'water'
  },
  {
    title: 'Exercício Rápido',
    description: '5 min de atividade',
    icon: Activity,
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    action: 'exercise'
  },
  {
    title: 'Respiração',
    description: 'Exercício de respiração',
    icon: Brain,
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    action: 'breathing'
  },
  {
    title: 'Mood Boost',
    description: 'Técnica para melhorar humor',
    icon: Zap,
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    action: 'mood'
  },
  {
    title: 'Qualidade do Sono',
    description: 'Como dormiu ontem?',
    icon: Moon,
    color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    action: 'sleep'
  }
];

export function QuickActions() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-orange" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <motion.div
                key={action.action}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 flex flex-col items-center gap-2 border ${action.color} hover:bg-opacity-80 transition-all duration-300`}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm text-white">
                      {action.title}
                    </div>
                    <div className="text-xs text-navy-400 mt-1">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
