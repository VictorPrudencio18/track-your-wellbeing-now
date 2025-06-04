
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
            <div className="min-h-screen flex w-full bg-navy-900">
              {/* Subtle background pattern */}
              <div className="fixed inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.15) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>
              
              <AppSidebar />
              
              <main className="flex-1 overflow-hidden relative">
                <div className="h-full overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 glass-card-subtle sticky top-0 z-10">
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                      <AuthButton />
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="p-6 md:p-8 lg:p-12">
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
