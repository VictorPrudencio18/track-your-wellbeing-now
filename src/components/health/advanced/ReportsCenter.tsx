
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download,
  Calendar,
  Target,
  Activity,
  Heart,
  Moon,
  Apple,
  PieChart,
  LineChart
} from 'lucide-react';

export function ReportsCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportCategories = [
    {
      id: 'overall',
      name: 'Saúde Geral',
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      description: 'Visão geral do seu estado de saúde',
      reports: ['Score de Saúde', 'Tendências Gerais', 'Resumo Mensal']
    },
    {
      id: 'activity',
      name: 'Atividade Física',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: 'Análise de exercícios e movimentação',
      reports: ['Histórico de Treinos', 'Metas vs Realizado', 'Progresso Físico']
    },
    {
      id: 'nutrition',
      name: 'Nutrição',
      icon: Apple,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Relatórios de alimentação e nutrição',
      reports: ['Diário Alimentar', 'Análise Nutricional', 'Tendências Calóricas']
    },
    {
      id: 'sleep',
      name: 'Sono',
      icon: Moon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: 'Análise de qualidade e padrões do sono',
      reports: ['Qualidade do Sono', 'Padrões de Sono', 'Relatório de Recuperação']
    }
  ];

  const mockReports = [
    {
      id: '1',
      title: 'Relatório Mensal de Saúde',
      category: 'overall',
      period: 'Janeiro 2025',
      generated_at: '2025-01-31',
      status: 'completed',
      file_size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Análise de Atividade Física',
      category: 'activity',
      period: 'Últimas 4 semanas',
      generated_at: '2025-01-30',
      status: 'completed',
      file_size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Relatório Nutricional',
      category: 'nutrition',
      period: 'Janeiro 2025',
      generated_at: '2025-01-29',
      status: 'processing',
      file_size: '-'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Centro de Relatórios
        </h1>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Gere relatórios detalhados e análises personalizadas sobre sua saúde e bem-estar
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Relatórios</p>
                  <p className="text-2xl font-bold text-white">
                    {mockReports.length}
                  </p>
                  <p className="text-xs text-navy-500">gerados</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Concluídos</p>
                  <p className="text-2xl font-bold text-white">
                    {mockReports.filter(r => r.status === 'completed').length}
                  </p>
                  <p className="text-xs text-navy-500">prontos</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Em Processamento</p>
                  <p className="text-2xl font-bold text-white">
                    {mockReports.filter(r => r.status === 'processing').length}
                  </p>
                  <p className="text-xs text-navy-500">aguardando</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-card border-navy-600/30 bg-navy-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-navy-400">Período</p>
                  <p className="text-lg font-bold text-white">
                    Janeiro
                  </p>
                  <p className="text-xs text-navy-500">ativo</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border border-navy-600/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-orange">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="generate" className="data-[state=active]:bg-accent-orange">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-accent-orange">
            <Download className="w-4 h-4 mr-2" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-accent-orange">
            <LineChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorias de Relatórios */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white">Categorias de Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={category.id} className="flex items-center gap-4 p-3 bg-navy-900/30 rounded-lg">
                        <div className={`p-2 rounded-lg ${category.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{category.name}</h3>
                          <p className="text-navy-400 text-sm">{category.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.reports.length}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Relatórios Recentes */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white">Relatórios Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-navy-900/30 rounded-lg">
                      <div>
                        <p className="text-white text-sm font-medium">{report.title}</p>
                        <p className="text-navy-400 text-xs">
                          {report.period} • {new Date(report.generated_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            report.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }
                        >
                          {report.status === 'completed' ? 'Pronto' : 'Processando'}
                        </Badge>
                        {report.status === 'completed' && (
                          <Button size="sm" variant="ghost" className="p-2">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gerar Relatório */}
        <TabsContent value="generate" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Gerar Novo Relatório</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${category.bgColor}`}>
                          <IconComponent className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                          <p className="text-navy-400 text-sm">{category.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <p className="text-navy-300 text-sm font-medium">Relatórios Disponíveis:</p>
                        {category.reports.map((report, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-accent-orange rounded-full" />
                            <span className="text-navy-400 text-sm">{report}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full bg-accent-orange hover:bg-accent-orange/80">
                        Gerar Relatório
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Meus Relatórios</h2>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white text-sm"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Ano</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {mockReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-navy-600/30 bg-navy-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                          <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{report.title}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-navy-400 text-sm">{report.period}</span>
                            <span className="text-navy-500 text-xs">
                              Gerado em {new Date(report.generated_at).toLocaleDateString('pt-BR')}
                            </span>
                            {report.file_size !== '-' && (
                              <span className="text-navy-500 text-xs">{report.file_size}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={
                            report.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }
                        >
                          {report.status === 'completed' ? 'Pronto' : 'Processando'}
                        </Badge>
                        
                        {report.status === 'completed' ? (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-navy-600/30 text-navy-300">
                              Visualizar
                            </Button>
                            <Button size="sm" className="bg-accent-orange hover:bg-accent-orange/80">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ) : (
                          <div className="text-orange-400 text-sm">
                            Processando...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Analytics Avançado</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics em Desenvolvimento</h3>
              <p className="text-navy-400">
                Dashboards interativos e análises avançadas estarão disponíveis em breve
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
