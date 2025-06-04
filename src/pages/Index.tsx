
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ActivitySelection } from "@/components/ActivitySelection";
import { ActivityTimer } from "@/components/ActivityTimer";
import { useToast } from "@/hooks/use-toast";
import { HealthProvider } from "@/contexts/HealthContext";
import Dashboard from "./Dashboard";
import HealthPage from "./HealthPage";

const Index = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
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

    if (currentView === "health") {
      return <HealthPage />;
    }

    if (currentView === "activities") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Minhas Atividades</h1>
          <p className="text-gray-600">Histórico detalhado de atividades em desenvolvimento...</p>
        </div>
      );
    }

    if (currentView === "analytics") {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Analytics Avançados</h1>
          <p className="text-gray-600">Análises detalhadas e insights em desenvolvimento...</p>
        </div>
      );
    }

    // Dashboard padrão
    return <Dashboard />;
  };

  return (
    <HealthProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
          <AppSidebar onNavigate={handleNavigation} />
          <main className="flex-1 p-6">
            <div className="mb-4">
              <SidebarTrigger className="mb-4" />
            </div>
            
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </HealthProvider>
  );
};

export default Index;
