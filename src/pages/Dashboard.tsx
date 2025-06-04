
import { AdvancedStatsGrid } from "@/components/dashboard/AdvancedStatsGrid";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { RecentActivity } from "@/components/RecentActivity";
import { ActivitySelection } from "@/components/ActivitySelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Zap, TrendingUp } from "lucide-react";
import { useHealth } from "@/contexts/HealthContext";

export default function Dashboard() {
  const { activities } = useHealth();

  // Transform Activity[] to ActivityData[] format expected by RecentActivity
  const transformedActivities = activities.slice(0, 5).map(activity => ({
    id: activity.id,
    type: activity.type,
    duration: `${Math.floor(activity.duration / 60)}:${(activity.duration % 60).toString().padStart(2, '0')}`,
    distance: activity.distance ? `${activity.distance.toFixed(1)} km` : undefined,
    date: activity.date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    }),
    calories: activity.calories,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Olá, Atleta! 👋
          </h1>
          <p className="text-gray-600 mt-1">Que tal uma nova atividade hoje?</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <AdvancedStatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Resumo da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Streak de atividades</span>
              </div>
              <span className="text-lg font-bold text-green-600">7 dias</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Melhoria vs semana passada</span>
              </div>
              <span className="text-lg font-bold text-blue-600">+15%</span>
            </div>

            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🏆 Conquista Desbloqueada</h4>
              <p className="text-sm text-purple-800">Primeira semana completa de exercícios!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={transformedActivities} />
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Início Rápido</h2>
          <ActivitySelection onSelectActivity={(type) => {
            console.log(`Starting activity: ${type}`);
          }} />
        </div>
      </div>
    </div>
  );
}
