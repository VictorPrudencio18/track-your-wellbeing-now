
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
    name: "VIVA + SAÚDE",
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
      <SidebarContent className="bg-navy-900/95 backdrop-blur-lg border-r border-navy-700/30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 border-b border-navy-700/20"
        >
          <motion.h1 
            className="text-2xl font-bold text-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            VIVA + SAÚDE
          </motion.h1>
        </motion.div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-navy-400 uppercase tracking-wider mb-4">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {data.navMain.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <SidebarMenuButton 
                      asChild
                      className={`
                        relative rounded-xl transition-all duration-300 hover:bg-accent-orange/10 group px-3 py-3
                        ${location.pathname === item.url 
                          ? 'bg-accent-orange/15 text-white border border-accent-orange/20' 
                          : 'text-navy-300 hover:text-white'
                        }
                      `}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            p-2 rounded-lg transition-colors
                            ${location.pathname === item.url 
                              ? 'bg-accent-orange/20 text-accent-orange' 
                              : 'bg-navy-800/50 text-navy-400 group-hover:bg-accent-orange/10 group-hover:text-accent-orange'
                            }
                          `}
                        >
                          <item.icon className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium text-sm">{item.title}</span>
                        {location.pathname === item.url && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute right-3 w-2 h-2 bg-accent-orange rounded-full shadow-lg shadow-accent-orange/30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
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
        
        <SidebarGroup className="mt-auto px-4 pb-6">
          <SidebarGroupContent>
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
                      className="rounded-xl transition-all duration-300 hover:bg-navy-800/50 text-navy-300 hover:text-white px-3 py-3"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-lg bg-navy-800/50 text-navy-400 group-hover:bg-accent-orange/10 group-hover:text-accent-orange transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                        </motion.div>
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
