
import {
  Activity,
  BarChart3,
  Heart,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const data = {
  user: {
    name: "FitTracker",
    email: "seu@email.com",
    avatar: "/placeholder.svg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Atividades",
      url: "/",
      icon: Activity,
    },
    {
      title: "Saúde",
      url: "/health",
      icon: Heart,
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ className, ...props }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent className="glass-card border-r border-border/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <motion.h1 
            className="text-2xl font-bold text-gradient"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            FitTracker
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-1">Premium Edition</p>
        </motion.div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {data.navMain.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SidebarMenuButton 
                      asChild
                      className={`rounded-lg transition-all duration-200 hover:bg-gradient-primary hover:text-white group ${
                        location.pathname === item.url 
                          ? 'bg-gradient-primary text-white shadow-lg' 
                          : ''
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <item.icon className="w-5 h-5" />
                        </motion.div>
                        <span className="font-medium">{item.title}</span>
                        {location.pathname === item.url && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute right-2 w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {data.navSecondary.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (data.navMain.length + index) * 0.1 }}
                  >
                    <SidebarMenuButton 
                      asChild
                      className="rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <item.icon className="w-5 h-5" />
                        </motion.div>
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <motion.div 
          className="p-6 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="glass-card p-4 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                F
              </div>
              <div>
                <p className="font-semibold text-sm">Premium User</p>
                <p className="text-xs text-muted-foreground">Level 5 Athlete</p>
              </div>
            </div>
          </div>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}
