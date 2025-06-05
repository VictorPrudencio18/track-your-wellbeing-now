
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Timer, Zap, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { AdvancedRunningActivity } from "./AdvancedRunningActivity";
import { PremiumGPSRunner } from "./PremiumGPSRunner";

interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  const [selectedMode, setSelectedMode] = useState<'none' | 'advanced' | 'premium'>('none');

  if (selectedMode === 'advanced') {
    return <AdvancedRunningActivity onComplete={onComplete} onCancel={onCancel} />;
  }

  if (selectedMode === 'premium') {
    return <PremiumGPSRunner onComplete={onComplete} onCancel={onCancel} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h2 className="text-2xl font-bold text-white mb-4">Modo de Corrida</h2>
        <p className="text-navy-400 mb-6">Escolha sua experiência de corrida ideal</p>
      </div>

      <div className="space-y-4">
        {/* Modo Premium - NOVO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatedButton
            onClick={() => setSelectedMode('premium')}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white py-8 text-lg font-semibold relative overflow-hidden"
            size="lg"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-4" />
              <div>
                <div className="text-xl font-bold">GPS Runner Premium</div>
                <div className="text-sm opacity-90 mt-1">
                  Interface revolucionária • Mapas 3D • Análises em tempo real • Layouts personalizáveis
                </div>
              </div>
            </div>
          </AnimatedButton>
        </motion.div>

        {/* Modo Avançado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatedButton
            onClick={() => setSelectedMode('advanced')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
            size="lg"
          >
            <MapPin className="w-6 h-6 mr-3" />
            GPS Avançado
            <div className="text-sm opacity-80 mt-1">
              Rastreamento preciso, métricas detalhadas, interface clássica
            </div>
          </AnimatedButton>
        </motion.div>

        {/* Modo Simples */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedButton
            onClick={() => {
              // Modo simples/simulado básico
              onComplete({
                type: 'running',
                name: 'Corrida Simulada',
                duration: 1800, // 30 min
                distance: 5.2,
                calories: 350,
                pace: 346, // 5:46 min/km
                heartRate: { avg: 142, max: 165 },
                date: new Date()
              });
            }}
            variant="outline"
            className="w-full glass-card border-navy-600 hover:border-accent-orange/50 text-white py-6 text-lg font-semibold"
            size="lg"
          >
            <Timer className="w-6 h-6 mr-3" />
            Modo Simples
            <div className="text-sm opacity-80 mt-1">
              Simulação básica para teste rápido
            </div>
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Comparação de recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <PremiumCard glass className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Comparação de Recursos</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-navy-400">GPS em tempo real</span>
              <div className="flex gap-4">
                <span className="text-gray-500">❌</span>
                <span className="text-green-400">✅</span>
                <span className="text-purple-400">✅ Plus</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400">Mapas interativos</span>
              <div className="flex gap-4">
                <span className="text-gray-500">❌</span>
                <span className="text-yellow-400">Básico</span>
                <span className="text-purple-400">3D Premium</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400">Gráficos dinâmicos</span>
              <div className="flex gap-4">
                <span className="text-gray-500">❌</span>
                <span className="text-gray-500">❌</span>
                <span className="text-purple-400">✅</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-navy-400">Layouts personalizáveis</span>
              <div className="flex gap-4">
                <span className="text-gray-500">❌</span>
                <span className="text-gray-500">❌</span>
                <span className="text-purple-400">✅</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-navy-600 flex justify-between text-xs text-navy-400">
            <span>Simples</span>
            <span>Avançado</span>
            <span className="text-purple-400 font-medium">Premium</span>
          </div>
        </PremiumCard>
      </motion.div>

      <div className="text-center">
        <AnimatedButton
          onClick={onCancel}
          variant="destructive"
          className="px-6 py-3"
        >
          Cancelar
        </AnimatedButton>
      </div>
    </motion.div>
  );
}
