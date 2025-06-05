import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButton } from "@/components/auth/AuthButton";
import { Toaster } from "@/components/ui/toaster";
import { DailyCheckinManager } from "@/components/health/DailyCheckinManager";
import { OnboardingCheck } from "@/components/onboarding/OnboardingCheck";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import HealthPage from "@/pages/HealthPage";
import AdvancedHealthPage from "@/pages/AdvancedHealthPage";
import VivaChatPage from "@/pages/VivaChatPage";
import SleepPage from "@/pages/SleepPage";
import NotFound from "@/pages/NotFound";
import { HealthProvider } from "@/contexts/HealthContext";
import ReportsPage from "@/pages/ReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <HealthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <OnboardingCheck>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-navy-900">
                <div className="fixed inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800" />
                </div>
                
                <AppSidebar />
                
                <main className="flex-1 overflow-hidden relative">
                  <div className="h-full overflow-y-auto">
                    <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 glass-card-subtle sticky top-0 z-10 border-b border-navy-700/20">
                      <div className="flex-1" />
                      <div className="flex items-center gap-3 sm:gap-6">
                        <AuthButton />
                        <ThemeToggle />
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/health" element={<HealthPage />} />
                          <Route path="/advanced-health" element={<AdvancedHealthPage />} />
                          <Route path="/sleep" element={<SleepPage />} />
                          <Route path="/viva" element={<VivaChatPage />} />
                          <Route path="/reports" element={<ReportsPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AnimatePresence>
                    </div>
                  </div>
                </main>
              </div>
              
              <DailyCheckinManager />
              <Toaster />
            </SidebarProvider>
          </OnboardingCheck>
        </Router>
      </QueryClientProvider>
    </HealthProvider>
  );
}

export default App;
