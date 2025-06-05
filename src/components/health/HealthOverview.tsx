
import { motion } from 'framer-motion';
import { HealthStatsGrid } from './components/HealthStatsGrid';
import { HealthScoreRing } from './components/HealthScoreRing';
import { TrendChart } from './components/TrendChart';
import { QuickActions } from './components/QuickActions';
import { RecentActivity } from './components/RecentActivity';
import { useHealthAnalytics } from '@/hooks/useHealthAnalytics';
import { Loader2 } from 'lucide-react';

export function HealthOverview() {
  const { data: healthData, isLoading } = useHealthAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Section: Score e Stats principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <HealthScoreRing score={healthData?.overallScore || 0} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <HealthStatsGrid />
        </motion.div>
      </div>

      {/* Middle Section: Trends e Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TrendChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* Bottom Section: Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RecentActivity />
      </motion.div>
    </div>
  );
}
