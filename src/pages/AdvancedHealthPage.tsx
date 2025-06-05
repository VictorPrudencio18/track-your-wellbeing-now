
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Utensils, 
  BarChart3, 
  Target,
  Brain,
  Stethoscope,
  Dumbbell,
  Calendar,
  Settings
} from 'lucide-react';
import { AdvancedHealthDashboard } from '@/components/health/advanced/AdvancedHealthDashboard';
import { WorkoutPlanner } from '@/components/health/advanced/WorkoutPlanner';
import { NutritionCenter } from '@/components/health/advanced/NutritionCenter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ActiveTab = 'dashboard' | 'workouts' | 'nutrition' | 'metrics' | 'goals' | 'insights' | 'medical' | 'devices';

export default function AdvancedHealthPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart, color: 'text-red-400' },
    { id: 'workouts', label: 'Treinos', icon: Dumbbell, color: 'text-blue-400' },
    { id: 'nutrition', label: 'Nutrição', icon: Utensils, color: 'text-green-400' },
    { id: 'metrics', label: 'Métricas', icon: BarChart3, color: 'text-purple-400' },
    { id: 'goals', label: 'Metas', icon: Target, color: 'text-yellow-400' },
    { id: 'insights', label: 'Insights', icon: Brain, color: 'text-orange-400' },
    { id: 'medical', label: 'Médico', icon: Stethoscope, color: 'text-pink-400' },
    { id: 'devices', label: 'Dispositivos', icon: Settings, color: 'text-cyan-400' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdvancedHealthDashboard />;
      case 'workouts':
        return <WorkoutPlanner />;
      case 'nutrition':
        return <NutritionCenter />;
      case 'metrics':
        return <MetricsCenter />;
      case 'goals':
        return <GoalsManager />;
      case 'insights':
        return <InsightsCenter />;
      case 'medical':
        return <MedicalRecords />;
      case 'devices':
        return <DeviceIntegrations />;
      default:
        return <AdvancedHealthDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 glass-card border-r border-navy-600/30 z-50 p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Health Pro</h2>
            <p className="text-navy-300 text-sm">Sistema Avançado de Saúde</p>
          </div>
          
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' 
                      : 'text-navy-300 hover:text-white hover:bg-navy-800/50'
                  }`}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : tab.color}`} />
                  {tab.label}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderActiveComponent()}
        </motion.div>
      </div>
    </div>
  );
}

// Placeholder components for the remaining tabs
function MetricsCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card-ultra border-navy-600/30">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Centro de Métricas</h2>
            <p className="text-navy-300">Monitoramento avançado de métricas de saúde em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoalsManager() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card-ultra border-navy-600/30">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Gerenciador de Metas</h2>
            <p className="text-navy-300">Sistema de metas personalizadas em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsightsCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card-ultra border-navy-600/30">
          <CardContent className="p-8 text-center">
            <Brain className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Centro de Insights</h2>
            <p className="text-navy-300">IA para análises e recomendações personalizadas em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MedicalRecords() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card-ultra border-navy-600/30">
          <CardContent className="p-8 text-center">
            <Stethoscope className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registros Médicos</h2>
            <p className="text-navy-300">Sistema de registros médicos e exames em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeviceIntegrations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="glass-card-ultra border-navy-600/30">
          <CardContent className="p-8 text-center">
            <Settings className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Integrações de Dispositivos</h2>
            <p className="text-navy-300">Conexão com smartwatches e dispositivos de saúde em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
