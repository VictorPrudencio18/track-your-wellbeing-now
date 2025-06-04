
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import HealthPage from "@/pages/HealthPage";
import NotFound from "@/pages/NotFound";
import { HealthProvider } from "@/contexts/HealthContext";
import ReportsPage from "@/pages/ReportsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <HealthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </Router>
      </QueryClientProvider>
    </HealthProvider>
  );
}

export default App;
