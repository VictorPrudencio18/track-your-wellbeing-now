
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvancedHealthDashboard } from '@/components/health/advanced/AdvancedHealthDashboard';
import { WorkoutPlanner } from '@/components/health/advanced/WorkoutPlanner';
import { NutritionCenter } from '@/components/health/advanced/NutritionCenter';
import { MedicalCenter } from '@/components/health/advanced/MedicalCenter';
import { DeviceCenter } from '@/components/health/advanced/DeviceCenter';
import { ReportsCenter } from '@/components/health/advanced/ReportsCenter';
import { 
  Activity, 
  Apple, 
  Heart, 
  Target, 
  TrendingUp, 
  Stethoscope,
  Smartphone,
  Brain,
  BarChart3,
  Sparkles,
  Plus
} from 'lucide-react';

const healthTabs = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: Heart,
    component: AdvancedHealthDashboard,
    color: 'from-red-500/20 to-pink-500/10',
    iconColor: 'text-red-400'
  },
  {
    value: 'workouts',
    label: 'Treinos',
    icon: Activity,
    component: WorkoutPlanner,
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400'
  },
  {
    value: 'nutrition',
    label: 'Nutrição',
    icon: Apple,
    component: NutritionCenter,
    color: 'from-green-500/20 to-emerald-600/10',
    iconColor: 'text-green-400'
  },
  {
    value: 'medical',
    label: 'Médico',
    icon: Stethoscope,
    component: MedicalCenter,
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400'
  },
  {
    value: 'devices',
    label: 'Dispositivos',
    icon: Smartphone,
    component: DeviceCenter,
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-400'
  },
  {
    value: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    component: ReportsCenter,
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-400'
  },
  {
    value: 'metrics',
    label: 'Métricas',
    icon: TrendingUp,
    component: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Métricas Avançadas</h3>
          <p className="text-navy-400 leading-relaxed">
            Analytics detalhados e métricas personalizadas estarão disponíveis em breve
          </p>
        </motion.div>
      </div>
    ),
    color: 'from-indigo-500/20 to-indigo-600/10',
    iconColor: 'text-indigo-400'
  },
  {
    value: 'goals',
    label: 'Metas',
    icon: Target,
    component: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Gerenciador de Metas</h3>
          <p className="text-navy-400 leading-relaxed">
            Sistema inteligente de definição e acompanhamento de metas em desenvolvimento
          </p>
        </motion.div>
      </div>
    ),
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-400'
  },
  {
    value: 'insights',
    label: 'Insights',
    icon: Brain,
    component: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500/20 to-violet-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Engine de Insights</h3>
          <p className="text-navy-400 leading-relaxed">
            Inteligência artificial para insights personalizados e recomendações inteligentes
          </p>
        </motion.div>
      </div>
    ),
    color: 'from-violet-500/20 to-violet-600/10',
    iconColor: 'text-violet-400'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function AdvancedHealthPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-6 mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 bg-gradient-to-br from-accent-orange/20 to-accent-orange/10 rounded-3xl border border-accent-orange/20"
              >
                <Sparkles className="w-8 h-8 text-accent-orange" />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-accent-orange to-white bg-clip-text text-transparent">
                  Sistema Avançado de Saúde
                </h1>
                <div className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                  & Bem-estar Inteligente
                </div>
              </div>
            </div>
            
            <motion.p
              variants={itemVariants}
              className="text-navy-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
            >
              Plataforma completa para monitoramento, análise e otimização da sua saúde com 
              <span className="text-accent-orange font-semibold"> tecnologia de ponta</span> e 
              <span className="text-blue-400 font-semibold"> insights personalizados</span>
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {['IA Avançada', 'Tempo Real', 'Multiplataforma', 'Seguro & Privado'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 bg-gradient-to-r from-navy-700/50 to-navy-600/50 border border-navy-500/30 rounded-full text-navy-300 text-sm backdrop-blur-sm"
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Navigation Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-navy-800/50 p-3 rounded-3xl backdrop-blur-xl border border-navy-600/30 mb-12 h-auto overflow-x-auto">
                {healthTabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.value;
                  
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`
                        flex flex-col items-center gap-3 px-4 py-6 rounded-2xl text-navy-300 
                        transition-all duration-500 hover:text-white min-h-[100px] group
                        data-[state=active]:bg-gradient-to-br data-[state=active]:from-accent-orange 
                        data-[state=active]:to-accent-orange/80 data-[state=active]:text-white 
                        data-[state=active]:shadow-lg data-[state=active]:scale-105
                        ${!isActive ? `hover:bg-gradient-to-br hover:${tab.color}` : ''}
                      `}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          p-3 rounded-2xl transition-all duration-300
                          ${isActive 
                            ? 'bg-white/20 border border-white/30' 
                            : `bg-gradient-to-br ${tab.color} border border-white/10 group-hover:border-white/20`
                          }
                        `}
                      >
                        <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : tab.iconColor}`} />
                      </motion.div>
                      <span className="text-sm font-semibold">{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"
                        />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {/* Tab Content with Enhanced Animations */}
              {healthTabs.map((tab) => {
                const ComponentToRender = tab.component;
                return (
                  <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      className="relative"
                    >
                      {/* Content Background Glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} rounded-3xl blur-3xl opacity-20 -z-10`} />
                      
                      <div className="relative z-10">
                        <ComponentToRender />
                      </div>
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Button (opcional) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-r from-accent-orange to-accent-orange/80 text-white rounded-full shadow-lg backdrop-blur-sm border border-accent-orange/30 flex items-center justify-center group"
        >
          <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
        </motion.button>
      </motion.div>
    </div>
  );
}
