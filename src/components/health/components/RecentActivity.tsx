
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity } from 'lucide-react';

const recentActivities = [
  {
    id: '1',
    type: 'checkin',
    title: 'Check-in de Bem-estar',
    description: 'Score: 85/100',
    time: '2 min atrás',
    status: 'completed'
  },
  {
    id: '2',
    type: 'exercise',
    title: 'Caminhada Matinal',
    description: '30 min, 3.2 km',
    time: '1 hora atrás',
    status: 'completed'
  },
  {
    id: '3',
    type: 'hydration',
    title: 'Hidratação',
    description: '250ml de água',
    time: '2 horas atrás',
    status: 'completed'
  },
  {
    id: '4',
    type: 'sleep',
    title: 'Registro de Sono',
    description: '7h 30min, Qualidade: Boa',
    time: '8 horas atrás',
    status: 'completed'
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'checkin':
      return '💚';
    case 'exercise':
      return '🏃‍♂️';
    case 'hydration':
      return '💧';
    case 'sleep':
      return '🌙';
    default:
      return '📝';
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'checkin':
      return 'bg-green-500/20 text-green-400';
    case 'exercise':
      return 'bg-blue-500/20 text-blue-400';
    case 'hydration':
      return 'bg-cyan-500/20 text-cyan-400';
    case 'sleep':
      return 'bg-purple-500/20 text-purple-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

export function RecentActivity() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent-orange" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-navy-700/30 hover:bg-navy-700/50 transition-colors duration-200"
            >
              <div className="text-2xl">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium text-sm">
                    {activity.title}
                  </h4>
                  <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-navy-400 text-xs">
                  {activity.description}
                </p>
              </div>
              
              <div className="flex items-center gap-1 text-navy-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
