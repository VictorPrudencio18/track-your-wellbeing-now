
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CorrelationMatrix } from './components/CorrelationMatrix';
import { AdvancedTrendChart } from './components/AdvancedTrendChart';
import { PatternAnalysis } from './components/PatternAnalysis';
import { ComparativeAnalysis } from './components/ComparativeAnalysis';
import { useHealthAnalytics } from '@/hooks/useHealthAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  GitBranch, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const analyticsTabs = [
  {
    value: 'trends',
    label: 'Tendências',
    icon: TrendingUp,
    component: AdvancedTrendChart
  },
  {
    value: 'correlations',
    label: 'Correlações',
    icon: GitBranch,
    component: CorrelationMatrix
  },
  {
    value: 'patterns',
    label: 'Padrões',
    icon: BarChart3,
    component: PatternAnalysis
  },
  {
    value: 'comparative',
    label: 'Comparativo',
    icon: Calendar,
    component: ComparativeAnalysis
  }
];

export function AnalyticsCenter() {
  const [activeTab, setActiveTab] = useState('trends');
  const [timeRange, setTimeRange] = useState('30d');
  const { data: analytics, isLoading } = useHealthAnalytics({ timeRange });

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <Card className="glass-card border-navy-600/30 bg-gradient-to-r from-navy-800/50 to-navy-700/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-orange" />
                Centro de Analytics
              </CardTitle>
              <p className="text-navy-400 text-sm">
                Análises avançadas dos seus dados de saúde
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex rounded-lg bg-navy-800/50 p-1">
                {[
                  { value: '7d', label: '7D' },
                  { value: '30d', label: '30D' },
                  { value: '90d', label: '90D' },
                  { value: '1y', label: '1A' }
                ].map((range) => (
                  <Button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    variant={timeRange === range.value ? "default" : "ghost"}
                    size="sm"
                    className={`px-3 py-1 text-xs ${
                      timeRange === range.value 
                        ? 'bg-accent-orange text-white' 
                        : 'text-navy-300 hover:text-white'
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
              
              <Button variant="outline" size="sm" className="border-navy-600 text-navy-300">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-navy-800/50 p-2 rounded-xl backdrop-blur-sm border border-navy-600/30">
          {analyticsTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-navy-300 data-[state=active]:bg-accent-orange data-[state=active]:text-white transition-all duration-300"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        {analyticsTabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ComponentToRender timeRange={timeRange} />
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Correlação Mais Forte',
            value: 'Sono ↔ Energia',
            change: '+23%',
            positive: true
          },
          {
            title: 'Melhoria Detectada',
            value: 'Stress Management',
            change: '-15%',
            positive: true
          },
          {
            title: 'Área de Foco',
            value: 'Hidratação',
            change: '-8%',
            positive: false
          }
        ].map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-navy-600/30 bg-navy-800/30">
              <CardContent className="p-4">
                <div className="text-xs text-navy-400 mb-1">{insight.title}</div>
                <div className="font-semibold text-white mb-2">{insight.value}</div>
                <div className={`text-sm font-medium ${
                  insight.positive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {insight.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
