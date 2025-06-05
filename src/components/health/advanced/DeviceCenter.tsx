import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeviceIntegrations } from '@/hooks/useDeviceIntegrations';
import { 
  Smartphone, 
  Plus, 
  Wifi, 
  WifiOff,
  Watch,
  Activity,
  Heart,
  Scale,
  Bluetooth,
  Settings,
  RefreshCw,
  Battery,
  Zap,
  Signal,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

export function DeviceCenter() {
  const { deviceIntegrations, createDeviceIntegration } = useDeviceIntegrations();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  const [newDevice, setNewDevice] = useState({
    device_type: 'smartwatch',
    device_brand: '',
    device_model: '',
    sync_frequency: 'automatic',
  });

  const handleAddDevice = () => {
    createDeviceIntegration.mutate(newDevice);
    setIsAddingDevice(false);
    setNewDevice({
      device_type: 'smartwatch',
      device_brand: '',
      device_model: '',
      sync_frequency: 'automatic',
    });
  };

  const deviceTypeLabels = {
    smartwatch: 'Smartwatch',
    fitness_tracker: 'Monitor de Atividade',
    smart_scale: 'Balança Inteligente',
    blood_pressure_monitor: 'Monitor de Pressão',
    heart_rate_monitor: 'Monitor Cardíaco',
  };

  const deviceTypeIcons = {
    smartwatch: Watch,
    fitness_tracker: Activity,
    smart_scale: Scale,
    blood_pressure_monitor: Heart,
    heart_rate_monitor: Heart,
  };

  const connectedDevices = deviceIntegrations.filter(d => d.integration_status === 'connected');
  const disconnectedDevices = deviceIntegrations.filter(d => d.integration_status === 'disconnected');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Melhorado */}
      <motion.div variants={itemVariants} className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-orange/5 to-transparent rounded-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl border border-blue-500/20">
              <Smartphone className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Centro de Dispositivos
              </h1>
              <p className="text-navy-400 text-lg max-w-2xl mx-auto">
                Conecte e gerencie seus dispositivos de saúde para monitoramento automático
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Redesenhados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Dispositivos',
            value: deviceIntegrations.length,
            subtitle: 'total',
            icon: Smartphone,
            color: 'from-blue-500/20 to-blue-600/10',
            iconColor: 'text-blue-400',
            trend: '+2 este mês'
          },
          {
            label: 'Conectados',
            value: connectedDevices.length,
            subtitle: 'ativos',
            icon: Wifi,
            color: 'from-green-500/20 to-emerald-600/10',
            iconColor: 'text-green-400',
            trend: 'Todos online'
          },
          {
            label: 'Desconectados',
            value: disconnectedDevices.length,
            subtitle: 'inativos',
            icon: WifiOff,
            color: 'from-red-500/20 to-red-600/10',
            iconColor: 'text-red-400',
            trend: disconnectedDevices.length === 0 ? 'Perfeito!' : 'Verificar'
          },
          {
            label: 'Última Sync',
            value: connectedDevices.length > 0 ? 'Agora' : 'N/A',
            subtitle: 'automática',
            icon: RefreshCw,
            color: 'from-purple-500/20 to-purple-600/10',
            iconColor: 'text-purple-400',
            trend: 'Em tempo real'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-navy-400 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-white group-hover:text-accent-orange transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-xs text-navy-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl border border-white/10`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-xs text-navy-400 bg-navy-700/30 rounded-lg px-3 py-2">
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs Melhoradas */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-navy-800/50 p-2 rounded-2xl backdrop-blur-sm border border-navy-600/30 h-auto">
            {[
              { value: 'overview', label: 'Visão Geral', icon: Smartphone },
              { value: 'devices', label: 'Dispositivos', icon: Watch },
              { value: 'sync', label: 'Sincronização', icon: RefreshCw },
              { value: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-navy-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-orange data-[state=active]:to-accent-orange/80 data-[state=active]:text-white transition-all duration-300 hover:text-white"
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Visão Geral Tab */}
          <TabsContent value="overview" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Dispositivos Conectados */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Wifi className="w-5 h-5 text-green-400" />
                    </div>
                    Dispositivos Conectados
                    <Badge className="bg-green-500/20 text-green-400 ml-auto">
                      {connectedDevices.length} online
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connectedDevices.map((device, index) => {
                    const IconComponent = deviceTypeIcons[device.device_type as keyof typeof deviceTypeIcons];
                    return (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all duration-300 group"
                      >
                        <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                          <IconComponent className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-green-400 transition-colors">
                            {device.device_brand} {device.device_model}
                          </p>
                          <p className="text-green-400 text-sm">
                            {deviceTypeLabels[device.device_type as keyof typeof deviceTypeLabels]} • Conectado
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-1">
                            <Battery className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400 font-medium">85%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Signal className="w-4 h-4 text-green-400" />
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((bar) => (
                                <div key={bar} className="w-1 h-3 bg-green-400 rounded-full" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {connectedDevices.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-navy-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <WifiOff className="w-8 h-8 text-navy-500" />
                      </div>
                      <p className="text-navy-400">Nenhum dispositivo conectado</p>
                      <p className="text-navy-500 text-sm">Adicione um dispositivo para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status de Sincronização */}
              <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <RefreshCw className="w-5 h-5 text-blue-400" />
                    </div>
                    Status de Sincronização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Dados de Atividade', lastSync: '2 min', status: 'success', icon: Activity },
                    { name: 'Frequência Cardíaca', lastSync: '5 min', status: 'success', icon: Heart },
                    { name: 'Dados de Sono', lastSync: '1 hora', status: 'warning', icon: Moon },
                    { name: 'Peso Corporal', lastSync: '1 dia', status: 'error', icon: Scale }
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                        item.status === 'success' ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20' :
                        item.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20' :
                        'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${
                          item.status === 'success' ? 'text-green-400' :
                          item.status === 'warning' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-navy-400 text-sm">Última sync: Há {item.lastSync}</p>
                        </div>
                      </div>
                      <Badge className={
                        item.status === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        item.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {item.status === 'success' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Sincronizado</>
                        ) : item.status === 'warning' ? (
                          <><AlertTriangle className="w-3 h-3 mr-1" /> Pendente</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3 mr-1" /> Erro</>
                        )}
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outras tabs mantém a funcionalidade existente mas com styling melhorado */}
          <TabsContent value="devices" className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Meus Dispositivos</h2>
              <Button 
                onClick={() => setIsAddingDevice(true)}
                className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Dispositivo
              </Button>
            </div>

            {isAddingDevice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8 border border-navy-600/30 bg-navy-800/60 backdrop-blur-xl"
              >
                <h3 className="text-xl font-bold text-white mb-4">Adicionar Novo Dispositivo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-navy-300 text-sm">Tipo de Dispositivo</label>
                    <select
                      value={newDevice.device_type}
                      onChange={(e) => setNewDevice({ ...newDevice, device_type: e.target.value })}
                      className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                    >
                      <option value="smartwatch">Smartwatch</option>
                      <option value="fitness_tracker">Monitor de Atividade</option>
                      <option value="smart_scale">Balança Inteligente</option>
                      <option value="blood_pressure_monitor">Monitor de Pressão</option>
                      <option value="heart_rate_monitor">Monitor Cardíaco</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-navy-300 text-sm">Marca</label>
                    <Input
                      value={newDevice.device_brand}
                      onChange={(e) => setNewDevice({ ...newDevice, device_brand: e.target.value })}
                      placeholder="Ex: Apple, Samsung, Fitbit"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-navy-300 text-sm">Modelo</label>
                    <Input
                      value={newDevice.device_model}
                      onChange={(e) => setNewDevice({ ...newDevice, device_model: e.target.value })}
                      placeholder="Ex: Watch Series 9, Galaxy Watch 6"
                      className="bg-navy-800/50 border-navy-600/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-navy-300 text-sm">Frequência de Sync</label>
                    <select
                      value={newDevice.sync_frequency}
                      onChange={(e) => setNewDevice({ ...newDevice, sync_frequency: e.target.value })}
                      className="w-full p-2 bg-navy-800/50 border border-navy-600/30 rounded-md text-white"
                    >
                      <option value="automatic">Automática</option>
                      <option value="manual">Manual</option>
                      <option value="scheduled">Agendada</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleAddDevice} className="bg-accent-orange hover:bg-accent-orange/80">
                    Adicionar Dispositivo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingDevice(false)}
                    className="border-navy-600/30 text-navy-300 hover:bg-navy-800/50"
                  >
                    Cancelar
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {deviceIntegrations.map((device, index) => {
                const IconComponent = deviceTypeIcons[device.device_type as keyof typeof deviceTypeIcons];
                const isConnected = device.integration_status === 'connected';
                
                return (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="glass-card border-navy-600/20 bg-navy-800/40 backdrop-blur-xl hover-lift group overflow-hidden relative">
                      <div className={`absolute inset-0 ${isConnected ? 'bg-green-500/5' : 'bg-red-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${isConnected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                              <IconComponent className={`w-6 h-6 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                {device.device_brand} {device.device_model}
                              </h3>
                              <p className="text-navy-400 text-sm">
                                {deviceTypeLabels[device.device_type as keyof typeof deviceTypeLabels]}
                              </p>
                            </div>
                          </div>
                          <Badge className={isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {isConnected ? 'Conectado' : 'Desconectado'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-navy-300">Sincronização</span>
                            <span className="text-white capitalize">{device.sync_frequency}</span>
                          </div>
                          {device.last_sync_at && (
                            <div className="flex justify-between text-sm">
                              <span className="text-navy-300">Última Sync</span>
                              <span className="text-white">
                                {new Date(device.last_sync_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-navy-300">Adicionado em</span>
                            <span className="text-white">
                              {new Date(device.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-navy-700/50">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Configurar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-navy-600/30 text-navy-300 hover:bg-navy-700/50"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sincronizar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {deviceIntegrations.length === 0 && (
              <div className="text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Nenhum Dispositivo</h3>
                  <p className="text-navy-400 mb-6 leading-relaxed">
                    Adicione seus dispositivos de saúde para monitoramento automático e insights personalizados
                  </p>
                  <Button 
                    onClick={() => setIsAddingDevice(true)}
                    className="bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/80 hover:to-accent-orange text-white border-0 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Dispositivo
                  </Button>
                </motion.div>
              </div>
            )}
          </TabsContent>

          {/* Outras tabs com placeholders melhorados */}
          <TabsContent value="sync" className="space-y-6 mt-8">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Sincronização Avançada</h3>
                <p className="text-navy-400 leading-relaxed">
                  Configurações avançadas de sincronização e automação estarão disponíveis em breve
                </p>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-8">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-12 max-w-md mx-auto bg-navy-800/40 backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Configurações Avançadas</h3>
                <p className="text-navy-400 leading-relaxed">
                  Painel de configurações detalhadas e personalização avançada em desenvolvimento
                </p>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
