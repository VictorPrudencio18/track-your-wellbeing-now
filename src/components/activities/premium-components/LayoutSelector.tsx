
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layout, Grid, Minimize2, Zap } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';
import { AnimatedButton } from '@/components/ui/animated-button';

type LayoutType = 'compact' | 'detailed' | 'minimal' | 'pro';

interface LayoutSelectorProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  onClose: () => void;
}

export function LayoutSelector({ currentLayout, onLayoutChange, onClose }: LayoutSelectorProps) {
  const layouts = [
    {
      id: 'minimal' as LayoutType,
      name: 'Minimalista',
      description: 'Apenas essencial: tempo, distância, pace e FC',
      icon: Minimize2,
      preview: (
        <div className="space-y-2">
          <div className="h-8 bg-accent-orange/30 rounded"></div>
          <div className="grid grid-cols-3 gap-1">
            <div className="h-4 bg-green-400/30 rounded"></div>
            <div className="h-4 bg-blue-400/30 rounded"></div>
            <div className="h-4 bg-red-400/30 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 'compact' as LayoutType,
      name: 'Compacto',
      description: 'Layout otimizado para telas pequenas',
      icon: Grid,
      preview: (
        <div className="space-y-1">
          <div className="h-6 bg-accent-orange/30 rounded"></div>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-3 bg-green-400/30 rounded"></div>
            <div className="h-3 bg-blue-400/30 rounded"></div>
            <div className="h-3 bg-purple-400/30 rounded"></div>
            <div className="h-3 bg-red-400/30 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="h-2 bg-gray-400/30 rounded"></div>
            <div className="h-2 bg-gray-400/30 rounded"></div>
            <div className="h-2 bg-gray-400/30 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 'detailed' as LayoutType,
      name: 'Detalhado',
      description: 'Todas as métricas com visualização clara',
      icon: Layout,
      preview: (
        <div className="space-y-1">
          <div className="h-4 bg-accent-orange/30 rounded"></div>
          <div className="grid grid-cols-2 gap-1">
            <div className="h-4 bg-green-400/30 rounded"></div>
            <div className="h-4 bg-blue-400/30 rounded"></div>
            <div className="h-4 bg-purple-400/30 rounded"></div>
            <div className="h-4 bg-red-400/30 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="h-3 bg-gray-400/30 rounded"></div>
            <div className="h-3 bg-gray-400/30 rounded"></div>
            <div className="h-3 bg-gray-400/30 rounded"></div>
          </div>
          <div className="h-3 bg-gray-400/30 rounded"></div>
        </div>
      )
    },
    {
      id: 'pro' as LayoutType,
      name: 'Profissional',
      description: 'Dashboard avançado com análises em tempo real',
      icon: Zap,
      preview: (
        <div className="grid grid-cols-3 gap-1 h-full">
          <div className="space-y-1">
            <div className="h-4 bg-accent-orange/30 rounded"></div>
            <div className="h-2 bg-green-400/30 rounded"></div>
            <div className="h-2 bg-blue-400/30 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-purple-400/30 rounded"></div>
            <div className="h-3 bg-red-400/30 rounded"></div>
            <div className="h-2 bg-gray-400/30 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-cyan-400/30 rounded"></div>
            <div className="h-2 bg-yellow-400/30 rounded"></div>
            <div className="h-3 bg-pink-400/30 rounded"></div>
          </div>
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <PremiumCard glass className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Escolher Layout</h2>
              <AnimatedButton
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </AnimatedButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {layouts.map((layout, index) => {
                const Icon = layout.icon;
                const isSelected = currentLayout === layout.id;

                return (
                  <motion.div
                    key={layout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => onLayoutChange(layout.id)}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-accent-orange bg-accent-orange/10 scale-105'
                          : 'border-navy-600 glass-card hover:border-accent-orange/50 hover:scale-102'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${
                          isSelected ? 'bg-accent-orange/20' : 'bg-navy-700'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isSelected ? 'text-accent-orange' : 'text-white'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-2 ${
                            isSelected ? 'text-accent-orange' : 'text-white'
                          }`}>
                            {layout.name}
                          </h3>
                          <p className="text-sm text-navy-400">
                            {layout.description}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-accent-orange rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-navy-900 rounded-full"></div>
                          </motion.div>
                        )}
                      </div>

                      {/* Preview do layout */}
                      <div className="h-24 bg-navy-800/50 rounded-lg p-3 border border-navy-600">
                        {layout.preview}
                      </div>

                      {/* Features específicas */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {layout.id === 'minimal' && (
                          <>
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Foco</span>
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">Rápido</span>
                          </>
                        )}
                        {layout.id === 'compact' && (
                          <>
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">Mobile</span>
                            <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Eficiente</span>
                          </>
                        )}
                        {layout.id === 'detailed' && (
                          <>
                            <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">Completo</span>
                            <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full">Balanceado</span>
                          </>
                        )}
                        {layout.id === 'pro' && (
                          <>
                            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Avançado</span>
                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Análises</span>
                            <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">Zonas</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <AnimatedButton
                onClick={onClose}
                variant="outline"
                className="glass-card border-navy-600 text-white"
              >
                Cancelar
              </AnimatedButton>
              <AnimatedButton
                onClick={onClose}
                className="bg-accent-orange text-navy-900 hover:bg-accent-orange/90"
              >
                Aplicar Layout
              </AnimatedButton>
            </div>
          </PremiumCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
