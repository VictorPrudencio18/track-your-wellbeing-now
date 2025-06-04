import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient } from "react-query";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/SidebarInset";
import { SidebarProvider } from "@/components/SidebarProvider";

import { Index } from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import HealthPage from "@/pages/HealthPage";
import NotFound from "@/pages/NotFound";
import { HealthProvider } from "@/contexts/HealthContext";
import ReportsPage from "@/pages/ReportsPage";

function App() {
  return (
    <HealthProvider>
      <QueryClient>
        <Router>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Router>
      </QueryClient>
    </HealthProvider>
  );
}

export default App;
