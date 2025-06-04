
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButton } from "@/components/auth/AuthButton";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import HealthPage from "@/pages/HealthPage";
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
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <AppSidebar />
              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                      <AuthButton />
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/health" element={<HealthPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </div>
              </main>
            </div>
            <Toaster />
          </SidebarProvider>
        </Router>
      </QueryClientProvider>
    </HealthProvider>
  );
}

export default App;
