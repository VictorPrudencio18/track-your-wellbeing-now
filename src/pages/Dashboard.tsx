import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarHeatmap } from '@/components/dashboard/CalendarHeatmap';
import { WeeklyGoalsCard } from '@/components/dashboard/WeeklyGoalsCard';
import { ActivityList } from '@/components/activity/ActivityList';
import { HealthDashboard } from '@/components/health/HealthDashboard';
import { AdvancedDataTable } from '@/components/reports/AdvancedDataTable';
import { AdvancedMetricsComparison } from '@/components/reports/AdvancedMetricsComparison';
import { SocialFeed } from '@/components/social/SocialFeed';
import { UserProfileCard } from '@/components/social/UserProfileCard';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  HeartPulse,
  Activity,
  BarChartBig,
  Users,
} from 'lucide-react';
import { WeeklyGoalsSystem } from '@/components/goals/WeeklyGoalsSystem';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="glass-card flex items-center justify-between p-6 border-b border-navy-600/30">
        <div className="flex items-center gap-4">
          <LayoutDashboard className="w-6 h-6 text-accent-orange" />
          <h1 className="text-2xl font-bold">Painel</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-navy-300">{user.email}</span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-card bg-navy-800/50 border-navy-600/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent-orange">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-accent-orange">
              Atividades
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-accent-orange">
              Metas Semanais
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-accent-orange">
              Saúde
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-accent-orange">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-accent-orange">
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <CalendarHeatmap />
                </motion.div>
              </div>
              <WeeklyGoalsCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AdvancedMetricsComparison />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <AdvancedDataTable />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-8">
            <ActivityList />
          </TabsContent>

          <TabsContent value="goals" className="space-y-8">
            <WeeklyGoalsSystem />
          </TabsContent>

          <TabsContent value="health" className="space-y-8">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>Em breve!</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SocialFeed />
              </div>
              <UserProfileCard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
