
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Heart,
  Activity,
  BarChart3,
  MessageCircle,
  Moon,
  Stethoscope,
  Dumbbell,
  Brain
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AuthButton } from "./auth/AuthButton"

// Menu items.
const mainItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Saúde",
    url: "/health",
    icon: Heart,
  },
  {
    title: "Saúde Avançada",
    url: "/health-advanced",
    icon: Stethoscope,
  },
  {
    title: "Sono",
    url: "/sleep",
    icon: Moon,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: Activity,
  },
  {
    title: "Viva Chat",
    url: "/chat",
    icon: MessageCircle,
  },
]

const healthItems = [
  {
    title: "Treinos",
    url: "/health-advanced?tab=workouts",
    icon: Dumbbell,
  },
  {
    title: "Nutrição",
    url: "/health-advanced?tab=nutrition",
    icon: Calendar,
  },
  {
    title: "Insights",
    url: "/health-advanced?tab=insights",
    icon: Brain,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="glass-card border-r border-navy-600/30">
      <SidebarContent className="bg-transparent">
        
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-navy-300 font-semibold">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors">
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Health Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-navy-300 font-semibold">Sistema de Saúde</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {healthItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors">
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-navy-300 hover:text-white hover:bg-navy-800/50 transition-colors">
                  <a href="/settings">
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Auth Section */}
        <div className="mt-auto p-4">
          <AuthButton />
        </div>

      </SidebarContent>
    </Sidebar>
  )
}
