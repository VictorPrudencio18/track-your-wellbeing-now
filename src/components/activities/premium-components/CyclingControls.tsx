
import { motion } from 'framer-motion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { PremiumCard } from '@/components/ui/premium-card';

interface CyclingControlsProps {
  isActive: boolean;
  isPaused: boolean;
  isGPSReady: boolean;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export function CyclingControls({
  isActive,
  isPaused,
  isGPSReady,
  duration,
  onStart,
  onPause,
  onStop,
  onCancel
}: CyclingControlsProps) {
  return (
    <PremiumCard glass className="p-6">
      <div className="flex items-center justify-center gap-4">
        {!isActive ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <AnimatedButton
              onClick={onStart}
              disabled={!isGPSReady}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Play className="w-8 h-8 mr-3" />
              {isGPSReady ? 'Iniciar Pedalada' : 'Aguardando GPS...'}
            </AnimatedButton>
            
            {!isGPSReady && (
              <p className="text-sm text-navy-400 text-center">
                Aguarde o GPS obter precisão suficiente para iniciar
              </p>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <AnimatedButton
              onClick={onPause}
              className={`${
                isPaused 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
              } text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl`}
              size="lg"
            >
              {isPaused ? (
                <>
                  <Play className="w-6 h-6 mr-2" />
                  Retomar
                </>
              ) : (
                <>
                  <Pause className="w-6 h-6 mr-2" />
                  Pausar
                </>
              )}
            </AnimatedButton>

            <AnimatedButton
              onClick={onStop}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl"
              size="lg"
            >
              <Square className="w-6 h-6 mr-2" />
              Finalizar
            </AnimatedButton>
          </div>
        )}

        {/* Botão de cancelar/reset sempre visível */}
        <AnimatedButton
          onClick={duration > 0 ? onStop : onCancel}
          variant="outline"
          className="glass-card border-navy-600 px-6 py-4"
          size="lg"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {duration > 0 ? 'Cancelar' : 'Sair'}
        </AnimatedButton>
      </div>

      {/* Status indicators */}
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-navy-400">
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isGPSReady ? 'bg-blue-500' : 'bg-yellow-500 animate-pulse'}`} />
          <span className="text-navy-400">
            {isGPSReady ? 'GPS Pronto' : 'GPS Aguardando'}
          </span>
        </div>

        {isPaused && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-navy-400">Pausado</span>
          </div>
        )}
      </div>
    </PremiumCard>
  );
}
