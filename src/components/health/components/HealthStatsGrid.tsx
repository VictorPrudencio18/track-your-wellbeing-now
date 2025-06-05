
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Zap, Target } from 'lucide-react';

const healthStats = [
  {
    label: 'Bem-estar Geral',
    value: '85%',
    icon: Heart,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  },
  {
    label: 'Nível de Energia',
    value: '7.8/10',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10'
  },
  {
    label: 'Atividade Física',
    value: '4/7 dias',
    icon: Activity,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  {
    label: 'Metas Alcançadas',
    value: '12/15',
    icon: Target,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  }
];

export function HealthStatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {healthStats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="glass-card border-navy-600/30 bg-navy-800/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-navy-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
