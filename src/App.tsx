
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HealthPage from "./pages/HealthPage";
import SleepPage from "./pages/SleepPage";
import ReportsPage from "./pages/ReportsPage";
import VivaChatPage from "./pages/VivaChatPage";
import AdvancedHealthPage from "./pages/AdvancedHealthPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health" element={<HealthPage />} />
                <Route path="/health-advanced" element={<AdvancedHealthPage />} />
                <Route path="/sleep" element={<SleepPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/chat" element={<VivaChatPage />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
