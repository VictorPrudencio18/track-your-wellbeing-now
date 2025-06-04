
import { Home, Activity, Plus, BarChart3, User, Play, Heart, TrendingUp } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onNavigate?: (view: string) => void;
}

const mainItems = [
  {
    title: "Dashboard",
    view: "dashboard",
    icon: Home,
  },
  {
    title: "Atividades",
    view: "activities",
    icon: Activity,
  },
  {
    title: "Nova Atividade",
    view: "new-activity",
    icon: Plus,
  },
  {
    title: "Saúde",
    view: "health",
    icon: Heart,
  },
  {
    title: "Analytics",
    view: "analytics",
    icon: TrendingUp,
  },
];

const accountItems = [
  {
    title: "Estatísticas",
    view: "stats",
    icon: BarChart3,
  },
  {
    title: "Perfil",
    view: "profile",
    icon: User,
  },
];

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <Sidebar className="border-r bg-gradient-to-b from-slate-50 to-slate-100">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">HealthTrack Pro</h2>
            <p className="text-sm text-muted-foreground">Seu parceiro fitness</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    onClick={() => handleNavigation(item.view)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    onClick={() => handleNavigation(item.view)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          HealthTrack Pro v2.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
