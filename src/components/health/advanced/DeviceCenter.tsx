
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
  Sync,
  Battery
} from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Centro de Dispositivos
        </h1>
        <p className="text-navy-400 max-w-2xl mx-auto">
          Conecte e gerencie seus dispositivos de saúde para monitoramento automático
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
                  <p className="text-sm text-navy-400">Dispositivos</p>
                  <p className="text-2xl font-bold text-white">
                    {deviceIntegrations.length}
                  </p>
                  <p className="text-xs text-navy-500">total</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Smartphone className="w-6 h-6 text-blue-400" />
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
                  <p className="text-sm text-navy-400">Conectados</p>
                  <p className="text-2xl font-bold text-white">
                    {connectedDevices.length}
                  </p>
                  <p className="text-xs text-navy-500">ativos</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Wifi className="w-6 h-6 text-green-400" />
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
                  <p className="text-sm text-navy-400">Desconectados</p>
                  <p className="text-2xl font-bold text-white">
                    {disconnectedDevices.length}
                  </p>
                  <p className="text-xs text-navy-500">inativos</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <WifiOff className="w-6 h-6 text-red-400" />
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
                  <p className="text-sm text-navy-400">Última Sync</p>
                  <p className="text-lg font-bold text-white">
                    {connectedDevices.length > 0 ? 'Hoje' : 'N/A'}
                  </p>
                  <p className="text-xs text-navy-500">automática</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Sync className="w-6 h-6 text-purple-400" />
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
            <Smartphone className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-accent-orange">
            <Watch className="w-4 h-4 mr-2" />
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-accent-orange">
            <Sync className="w-4 h-4 mr-2" />
            Sincronização
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-accent-orange">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dispositivos Conectados */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-green-400" />
                  Dispositivos Conectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connectedDevices.map((device) => {
                    const IconComponent = deviceTypeIcons[device.device_type as keyof typeof deviceTypeIcons];
                    return (
                      <div key={device.id} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <IconComponent className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">
                            {device.device_brand} {device.device_model}
                          </p>
                          <p className="text-green-400 text-xs">
                            {deviceTypeLabels[device.device_type as keyof typeof deviceTypeLabels]} • 
                            Conectado
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-green-400">85%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {connectedDevices.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-navy-400">Nenhum dispositivo conectado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status de Sincronização */}
            <Card className="glass-card border-navy-600/30 bg-navy-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sync className="w-5 h-5 text-blue-400" />
                  Status de Sincronização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-navy-900/30 rounded-lg">
                    <div>
                      <p className="text-white text-sm">Dados de Atividade</p>
                      <p className="text-navy-400 text-xs">Última sync: Há 2 min</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      Sincronizado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-navy-900/30 rounded-lg">
                    <div>
                      <p className="text-white text-sm">Frequência Cardíaca</p>
                      <p className="text-navy-400 text-xs">Última sync: Há 5 min</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      Sincronizado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-navy-900/30 rounded-lg">
                    <div>
                      <p className="text-white text-sm">Dados de Sono</p>
                      <p className="text-navy-400 text-xs">Última sync: Há 1 hora</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      Pendente
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dispositivos */}
        <TabsContent value="devices" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Meus Dispositivos</h2>
            <Button 
              onClick={() => setIsAddingDevice(true)}
              className="bg-accent-orange hover:bg-accent-orange/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Dispositivo
            </Button>
          </div>

          {isAddingDevice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 border border-navy-600/30"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deviceIntegrations.map((device, index) => {
              const IconComponent = deviceTypeIcons[device.device_type as keyof typeof deviceTypeIcons];
              const isConnected = device.integration_status === 'connected';
              
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card border-navy-600/30 bg-navy-800/50 hover-lift">
                    <CardContent className="p-6">
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
                          <Sync className="w-4 h-4 mr-2" />
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
            <div className="text-center py-12">
              <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum Dispositivo</h3>
                <p className="text-navy-400 mb-4">
                  Adicione seus dispositivos de saúde para monitoramento automático
                </p>
                <Button 
                  onClick={() => setIsAddingDevice(true)}
                  className="bg-accent-orange hover:bg-accent-orange/80"
                >
                  Adicionar Primeiro Dispositivo
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Sincronização */}
        <TabsContent value="sync" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Gerenciamento de Sincronização</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sync className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sincronização Avançada</h3>
              <p className="text-navy-400">
                Configurações avançadas de sincronização em desenvolvimento
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Configurações de Dispositivos</h2>
          
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Configurações Avançadas</h3>
              <p className="text-navy-400">
                Painel de configurações detalhadas em desenvolvimento
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
