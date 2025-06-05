
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedHealthDashboard } from '@/components/health/advanced/AdvancedHealthDashboard';
import { WorkoutPlanner } from '@/components/health/advanced/WorkoutPlanner';
import { NutritionCenter } from '@/components/health/advanced/NutritionCenter';
import { 
  Activity, 
  Apple, 
  Heart, 
  Target, 
  TrendingUp, 
  Stethoscope,
  Smartphone,
  Brain,
  BarChart3
} from 'lucide-react';

const healthTabs = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: Heart,
    component: AdvancedHealthDashboard
  },
  {
    value: 'workouts',
    label: 'Treinos',
    icon: Activity,
    component: WorkoutPlanner
  },
  {
    value: 'nutrition',
    label: 'Nutrição',
    icon: Apple,
    component: NutritionCenter
  },
  {
    value: 'metrics',
    label: 'Métricas',
    icon: TrendingUp,
    component: () => <div className="p-8 text-center text-navy-400">Métricas avançadas em desenvolvimento</div>
  },
  {
    value: 'goals',
    label: 'Metas',
    icon: Target,
    component: () => <div className="p-8 text-center text-navy-400">Gerenciador de metas em desenvolvimento</div>
  },
  {
    value: 'insights',
    label: 'Insights',
    icon: Brain,
    component: () => <div className="p-8 text-center text-navy-400">Engine de insights em desenvolvimento</div>
  },
  {
    value: 'medical',
    label: 'Médico',
    icon: Stethoscope,
    component: () => <div className="p-8 text-center text-navy-400">Registros médicos em desenvolvimento</div>
  },
  {
    value: 'devices',
    label: 'Dispositivos',
    icon: Smartphone,
    component: () => <div className="p-8 text-center text-navy-400">Integrações com dispositivos em desenvolvimento</div>
  },
  {
    value: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    component: () => <div className="p-8 text-center text-navy-400">Relatórios detalhados em desenvolvimento</div>
  }
];

export default function AdvancedHealthPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
            Centro Avançado de Saúde & Bem-estar
          </h1>
          <p className="text-navy-400 text-lg max-w-4xl mx-auto">
            Plataforma completa para monitoramento, análise e otimização da sua saúde com tecnologia de ponta e insights personalizados
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 mb-8 h-auto">
              {healthTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-navy-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white transition-all duration-300 hover:text-white min-h-[80px]"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
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
