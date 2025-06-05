
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HealthOverview } from '@/components/health/HealthOverview';
import { CheckinFlow } from '@/components/health/CheckinFlow';
import { AnalyticsCenter } from '@/components/health/AnalyticsCenter';
import { GoalsManager } from '@/components/health/GoalsManager';
import { InsightsEngine } from '@/components/health/InsightsEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Brain, 
  CheckCircle,
  BarChart3
} from 'lucide-react';

const healthTabs = [
  {
    value: 'overview',
    label: 'Visão Geral',
    icon: Activity,
    component: HealthOverview
  },
  {
    value: 'checkin',
    label: 'Check-in',
    icon: CheckCircle,
    component: CheckinFlow
  },
  {
    value: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    component: AnalyticsCenter
  },
  {
    value: 'goals',
    label: 'Metas',
    icon: Target,
    component: GoalsManager
  },
  {
    value: 'insights',
    label: 'Insights',
    icon: Brain,
    component: InsightsEngine
  }
];

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-accent-orange to-white bg-clip-text text-transparent">
            Centro de Saúde & Bem-estar
          </h1>
          <p className="text-navy-400 text-lg max-w-3xl mx-auto">
            Monitore, analise e melhore sua saúde com insights inteligentes e acompanhamento personalizado
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 mb-8">
              {healthTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white transition-all duration-300 hover:text-white"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Content */}
            {healthTabs.map((tab) => {
              const ComponentToRender = tab.component;
              return (
                <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ComponentToRender />
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
