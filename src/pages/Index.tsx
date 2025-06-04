
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsCard } from "@/components/StatsCard";
import { RecentActivity } from "@/components/RecentActivity";
import { ActivitySelection } from "@/components/ActivitySelection";
import { ActivityTimer } from "@/components/ActivityTimer";
import { Activity, MapPin, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [activities, setActivities] = useState([
    {
      id: "1",
      type: "run",
      duration: "32:45",
      distance: "5.2 km",
      date: "Hoje",
      calories: 312
    },
    {
      id: "2",
      type: "yoga",
      duration: "45:00",
      date: "Ontem",
      calories: 180
    },
    {
      id: "3",
      type: "cycle",
      duration: "1:15:30",
      distance: "15.8 km",
      date: "2 dias atrás",
      calories: 450
    }
  ]);

  const { toast } = useToast();

  const handleNavigation = (view: string) => {
    setCurrentView(view.replace("#", ""));
    setSelectedActivity(null);
  };

  const handleActivitySelect = (type: string) => {
    setSelectedActivity(type);
  };

  const handleActivityComplete = (data: any) => {
    const newActivity = {
      id: Date.now().toString(),
      type: data.type,
      duration: `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, '0')}`,
      distance: data.distance ? `${data.distance.toFixed(1)} km` : undefined,
      date: "Agora",
      calories: Math.floor(data.duration * 5) // Estimativa simples
    };

    setActivities(prev => [newActivity, ...prev]);
    setSelectedActivity(null);
    setCurrentView("dashboard");
    
    toast({
      title: "Atividade concluída! 🎉",
      description: `${data.type} de ${newActivity.duration} registrada com sucesso.`,
    });
  };

  const renderContent = () => {
    if (currentView === "new-activity") {
      if (selectedActivity) {
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Nova Atividade</h1>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Voltar
              </button>
            </div>
            <ActivityTimer 
              activityType={selectedActivity}
              onActivityComplete={handleActivityComplete}
            />
          </div>
        );
      }
      
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Nova Atividade</h1>
          <ActivitySelection onSelectActivity={handleActivitySelect} />
        </div>
      );
    }

    if (currentView === "activities") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Minhas Atividades</h1>
          <RecentActivity activities={activities} />
        </div>
      );
    }

    // Dashboard padrão
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Olá, Atleta! 👋
            </h1>
            <p className="text-gray-600 mt-1">Que tal uma nova atividade hoje?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Esta Semana"
            value="12.5 km"
            icon={MapPin}
            trend="+2.3 km vs. semana anterior"
            gradientClass="gradient-primary"
          />
          <StatsCard
            title="Tempo Ativo"
            value="3h 45m"
            icon={Clock}
            trend="+45m vs. semana anterior"
            gradientClass="gradient-secondary"
          />
          <StatsCard
            title="Atividades"
            value="8"
            icon={Activity}
            trend="3 esta semana"
            gradientClass="gradient-success"
          />
          <StatsCard
            title="Calorias"
            value="1,250"
            icon={Zap}
            trend="+180 vs. semana anterior"
            gradientClass="gradient-accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities.slice(0, 5)} />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Início Rápido</h2>
            <ActivitySelection onSelectActivity={(type) => {
              setSelectedActivity(type);
              setCurrentView("new-activity");
            }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <SidebarTrigger className="mb-4" />
          </div>
          
          {/* Navegação por hash */}
          <div className="hidden">
            {window.location.hash && handleNavigation(window.location.hash)}
          </div>
          
          {/* Listener para mudanças no hash */}
          <div className="hidden">
            {window.addEventListener('hashchange', () => {
              handleNavigation(window.location.hash || "#dashboard");
            })}
          </div>
          
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
