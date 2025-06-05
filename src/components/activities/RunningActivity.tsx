
import { useState, useEffect } from "react";
import { Play, Pause, Square, MapPin, Timer, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { AdvancedRunningActivity } from "./AdvancedRunningActivity";

interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  const [useAdvancedGPS, setUseAdvancedGPS] = useState(false);

  // Mostrar opção para usar GPS avançado
  if (!useAdvancedGPS) {
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
          <p className="text-navy-400 mb-6">Escolha como deseja registrar sua corrida</p>
        </div>

        <div className="space-y-4">
          <AnimatedButton
            onClick={() => setUseAdvancedGPS(true)}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
            size="lg"
          >
            <MapPin className="w-6 h-6 mr-3" />
            GPS Avançado (Recomendado)
            <div className="text-sm opacity-80 mt-1">
              Rastreamento preciso, métricas detalhadas, mapa em tempo real
            </div>
          </AnimatedButton>

          <AnimatedButton
            onClick={() => {
              // Continuar com o modo simples/simulado
              setUseAdvancedGPS(false);
            }}
            variant="outline"
            className="w-full glass-card border-navy-600 hover:border-accent-orange/50 text-white py-6 text-lg font-semibold"
            size="lg"
          >
            <Timer className="w-6 h-6 mr-3" />
            Modo Simples
            <div className="text-sm opacity-80 mt-1">
              Simulação básica para teste
            </div>
          </AnimatedButton>
        </div>

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

  // Usar o sistema GPS avançado
  return <AdvancedRunningActivity onComplete={onComplete} onCancel={onCancel} />;
}
