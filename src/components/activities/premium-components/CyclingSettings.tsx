import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Bell, Map, Activity } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function CyclingSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoLap, setAutoLap] = useState(1.0);
  const [screenMode, setScreenMode] = useState<'metrics' | 'map' | 'split'>('metrics');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        className="glass-card border-navy-600"
      >
        <Settings2 className="w-4 h-4 mr-2" />
        Configurações
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <PremiumCard glass className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Settings2 className="w-6 h-6 text-accent-orange" />
                    <h3 className="text-xl font-bold text-white">Configurações</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                    className="glass-card border-navy-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Auto Lap */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <Label className="text-white">Auto Lap</Label>
                    </div>
                    <div className="space-y-2">
                      <Slider
                        value={[autoLap]}
                        onValueChange={(values) => setAutoLap(values[0])}
                        max={10}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-navy-400">
                        <span>0.5km</span>
                        <span className="text-accent-orange font-bold">{autoLap}km</span>
                        <span>10km</span>
                      </div>
                    </div>
                  </div>

                  {/* Modo de Tela */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-green-400" />
                      <Label className="text-white">Layout da Tela</Label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'metrics', label: 'Métricas' },
                        { id: 'map', label: 'Mapa' },
                        { id: 'split', label: 'Dividido' }
                      ].map((mode) => (
                        <Button
                          key={mode.id}
                          variant={screenMode === mode.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setScreenMode(mode.id as any)}
                          className={`glass-card border-navy-600 ${
                            screenMode === mode.id 
                              ? 'bg-accent-orange text-navy-900' 
                              : 'hover:bg-navy-700/50'
                          }`}
                        >
                          {mode.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Notificações */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <Label className="text-white">Notificações</Label>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Auto Lap</Label>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Zona de FC</Label>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Metas de Pace</Label>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Alertas de Velocidade</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Configurações de GPS */}
                  <div className="space-y-4">
                    <Label className="text-white">GPS & Precisão</Label>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Máxima Precisão</Label>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Salvar Pontos GPS</Label>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-navy-400">Backup na Nuvem</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 mt-8">
                  <Button
                    variant="outline"
                    className="flex-1 glass-card border-navy-600"
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-accent-orange text-navy-900 hover:bg-accent-orange/90"
                    onClick={handleClose}
                  >
                    Salvar
                  </Button>
                </div>
              </PremiumCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
