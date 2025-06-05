
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Heart, Zap } from 'lucide-react';

const recentActivities = [
  {
    time: '14:30',
    type: 'Check-in',
    description: 'Nível de energia: 8/10',
    icon: Zap,
    color: 'text-yellow-400'
  },
  {
    time: '09:15',
    type: 'Exercício',
    description: 'Caminhada - 30 min',
    icon: Heart,
    color: 'text-red-400'
  },
  {
    time: '08:00',
    type: 'Check-in',
    description: 'Qualidade do sono: 7/10',
    icon: Clock,
    color: 'text-blue-400'
  }
];

export function RecentActivity() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 bg-navy-700/30 rounded-lg">
              <div className={`p-2 rounded-lg bg-navy-600/30`}>
                <IconComponent className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {activity.type}
                </div>
                <div className="text-navy-400 text-xs">
                  {activity.description}
                </div>
              </div>
              <div className="text-navy-400 text-xs">
                {activity.time}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
