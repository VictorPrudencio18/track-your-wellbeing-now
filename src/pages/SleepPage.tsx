
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

// Import sleep components
import { SleepDashboard } from '@/components/sleep/SleepDashboard';
import { SleepTracker } from '@/components/sleep/SleepTracker';
import { SleepAnalytics } from '@/components/sleep/SleepAnalytics';
import { SleepInsights } from '@/components/sleep/SleepInsights';
import { SleepGoals } from '@/components/sleep/SleepGoals';

export default function SleepPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-[80vh] flex items-center justify-center p-4"
      >
        <Card className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-accent-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">VIVA Sleep</h2>
          <p className="text-gray-300">
            Faça login para acessar seu sistema completo de monitoramento de sono.
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">
              VIVA Sleep
            </h1>
            <p className="text-gray-300 text-lg">
              Sistema Avançado de Monitoramento de Sono
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sun className="w-4 h-4" />
          <span>Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
          <Sparkles className="w-4 h-4 text-accent-orange ml-2" />
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 bg-navy-800/50 border border-navy-700/30">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="tracker"
            className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
          >
            Registro
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
          >
            Análises
          </TabsTrigger>
          <TabsTrigger 
            value="goals"
            className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
          >
            Metas
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
          >
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-6">
            <SleepDashboard />
          </TabsContent>

          <TabsContent value="tracker" className="space-y-6">
            <SleepTracker />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SleepAnalytics />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <SleepGoals />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SleepInsights />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
