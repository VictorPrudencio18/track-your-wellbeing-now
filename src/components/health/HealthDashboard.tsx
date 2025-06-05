
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyCheckins } from '@/hooks/useDailyCheckins';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { useBackupData, useSyncStatus } from '@/hooks/useDataSync';
import { WellnessInsights } from './WellnessInsights';
import { DailyHistoryCarousel } from './DailyHistoryCarousel';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Moon, 
  Dumbbell, 
  Brain, 
  Briefcase, 
  Sun,
  Heart,
  Target,
  Database,
  RefreshCw
} from 'lucide-react';

export function HealthDashboard() {
  const { todayCheckin, isLoading } = useDailyCheckins();
  const { data: heartRateMetrics } = useHealthMetrics('heart_rate_avg', 7);
  const { data: weightMetrics } = useHealthMetrics('weight', 30);
  const { data: syncStatus } = useSyncStatus();
  const backupData = useBackupData();

  const metrics = [
    {
      icon: Droplets,
      label: 'Hidratação',
      value: `${todayCheckin?.hydration_glasses || 0} copos`,
      target: '8 copos',
      progress: ((todayCheckin?.hydration_glasses || 0) / 8) * 100,
      color: 'text-blue-400'
    },
    {
      icon: Moon,
      label: 'Qualidade do Sono',
      value: todayCheckin?.sleep_quality ? `${todayCheckin.sleep_quality}/5` : 'N/A',
      target: '4-5',
      progress: todayCheckin?.sleep_quality ? (todayCheckin.sleep_quality / 5) * 100 : 0,
      color: 'text-purple-400'
    },
    {
      icon: Sun,
      label: 'Energia',
      value: todayCheckin?.energy_level ? `${todayCheckin.energy_level}/10` : 'N/A',
      target: '7-10',
      progress: todayCheckin?.energy_level ? (todayCheckin.energy_level / 10) * 100 : 0,
      color: 'text-yellow-400'
    },
    {
      icon: Brain,
      label: 'Stress',
      value: todayCheckin?.stress_level ? `${todayCheckin.stress_level}/10` : 'N/A',
      target: '1-4',
      progress: todayCheckin?.stress_level ? ((10 - todayCheckin.stress_level) / 10) * 100 : 0,
      color: 'text-orange-400'
    }
  ];

  // Calcular médias das métricas da semana
  const avgHeartRate = heartRateMetrics?.length ? 
    Math.round(heartRateMetrics.reduce((sum, m) => sum + m.value, 0) / heartRateMetrics.length) : 0;
  
  const currentWeight = weightMetrics?.length ? weightMetrics[0].value : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-navy-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-navy-700/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header com Status de Sync */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard de Saúde</h2>
          <p className="text-navy-400">Acompanhe seus indicadores de bem-estar diários</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-navy-400">Último backup</div>
            <div className="text-xs text-navy-300">
              {syncStatus?.last_sync ? 
                new Date(syncStatus.last_sync).toLocaleDateString() : 
                'Nunca'
              }
            </div>
          </div>
          <Button
            onClick={() => backupData.mutate()}
            disabled={backupData.isPending}
            variant="outline"
            size="sm"
            className="glass-card border-navy-600"
          >
            {backupData.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            Backup
          </Button>
        </div>
      </div>

      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  <div className="text-right">
                    <div className="text-white font-semibold">{metric.value}</div>
                    <div className="text-xs text-navy-400">meta: {metric.target}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-navy-300">{metric.label}</div>
                  <div className="w-full bg-navy-700/50 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange/80 transition-all duration-500"
                      style={{ width: `${Math.min(metric.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Métricas Avançadas da Semana */}
      {(avgHeartRate > 0 || currentWeight > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-accent-orange" />
                Métricas da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {avgHeartRate > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {avgHeartRate}
                    </div>
                    <div className="text-sm text-navy-400">FC Média (7 dias)</div>
                    <div className="text-xs text-navy-500">
                      {heartRateMetrics?.length} medições
                    </div>
                  </div>
                )}
                
                {currentWeight > 0 && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {currentWeight.toFixed(1)}
                    </div>
                    <div className="text-sm text-navy-400">Peso Atual (kg)</div>
                    <div className="text-xs text-navy-500">
                      Última medição
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {syncStatus?.pending_uploads || 0}
                  </div>
                  <div className="text-sm text-navy-400">Dados Pendentes</div>
                  <div className="text-xs text-navy-500">
                    Para sincronizar
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Wellness Score & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <WellnessInsights />
        </div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-orange" />
                Status de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-navy-300 text-sm">Exercício</span>
                  <span className={`text-sm ${todayCheckin?.exercise_completed ? 'text-green-400' : 'text-red-400'}`}>
                    {todayCheckin?.exercise_completed ? '✓ Concluído' : '✗ Pendente'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-navy-300 text-sm">Alimentação Saudável</span>
                  <span className={`text-sm ${todayCheckin?.ate_healthy ? 'text-green-400' : 'text-gray-400'}`}>
                    {todayCheckin?.ate_healthy ? '✓ Sim' : '? Não informado'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-navy-300 text-sm">Score de Bem-estar</span>
                  <span className="text-accent-orange font-semibold">
                    {todayCheckin?.wellness_score?.toFixed(1) || '0.0'}/100
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-navy-300 text-sm">Dados Salvos</span>
                  <span className="text-green-400 text-sm">
                    ✓ Persistidos no BD
                  </span>
                </div>
              </div>
              
              {todayCheckin?.notes && (
                <div className="pt-3 border-t border-navy-700/50">
                  <div className="text-navy-300 text-sm mb-1">Anotações:</div>
                  <div className="text-navy-200 text-sm italic">
                    "{todayCheckin.notes}"
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily History Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <DailyHistoryCarousel />
      </motion.div>
    </div>
  );
}
