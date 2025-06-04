import {
  Activity,
  BarChart3,
  Heart,
  LayoutDashboard,
  Settings,
  User2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNavItem } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Link } from "react-router-dom";

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
  const { collapsed, onCollapse } = useSidebar();

  return (
    <div
      className="hidden border-r bg-popover text-popover-foreground md:block"
      {...props}
    >
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 data-[state=open]:bg-muted md:hidden"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 border-r md:hidden">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <SidebarNav items={data.navMain} />
            <Separator className="my-6" />
            <SidebarNav items={data.navSecondary} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <ScrollArea className="py-2">
            <div className="px-3 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-8 w-full items-center justify-between rounded-md px-2 text-sm font-medium hover:underline"
                  >
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback>{data.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{collapsed ? data.user.name[0] : data.user.name}</span>
                    {!collapsed && <User2 className="ml-2 h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" forceMount className="w-[200px]">
                  <DropdownMenuItem>
                    Perfil
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Sair
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Separator className="my-2" />
              <SidebarNav items={data.navMain} collapsed={collapsed} />
            </div>
          </ScrollArea>
        </div>
        <div className="pb-3 pt-2">
          <Separator />
          <div className="px-3 py-2">
            <SidebarNav items={data.navSecondary} collapsed={collapsed} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarNavProps {
  items: {
    title: string;
    url: string;
    icon: any;
  }[];
  collapsed?: boolean;
}

function SidebarNav({ items, collapsed }: SidebarNavProps) {
  return (
    <div className="grid gap-2">
      {items?.map((item) => (
        <SidebarNavItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          url={item.url}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
}
