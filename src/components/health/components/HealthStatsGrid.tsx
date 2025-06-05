
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Droplets, Moon, Zap, Brain } from 'lucide-react';

const statsData = [
  {
    title: 'Frequência Cardíaca',
    value: '72',
    unit: 'bpm',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    trend: '+2%'
  },
  {
    title: 'Passos Hoje',
    value: '8.2k',
    unit: 'passos',
    icon: Activity,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    trend: '+15%'
  },
  {
    title: 'Hidratação',
    value: '2.1',
    unit: 'L',
    icon: Droplets,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    trend: '+5%'
  },
  {
    title: 'Sono',
    value: '7.5',
    unit: 'horas',
    icon: Moon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    trend: '+12%'
  },
  {
    title: 'Energia',
    value: '85',
    unit: '%',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    trend: '+8%'
  },
  {
    title: 'Bem-estar Mental',
    value: '78',
    unit: '%',
    icon: Brain,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    trend: '+3%'
  }
];

export function HealthStatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/30 hover:bg-navy-800/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    {stat.trend}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs text-navy-400">
                      {stat.unit}
                    </span>
                  </div>
                  <div className="text-xs text-navy-400">
                    {stat.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
