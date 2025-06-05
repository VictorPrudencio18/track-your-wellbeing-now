
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Share, Pause, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';

interface ModernActivityBaseProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  isPaused: boolean;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onBack: () => void;
  children: React.ReactNode;
  primaryMetric?: {
    value: string;
    unit: string;
    label: string;
  };
}

export function ModernActivityBase({
  title,
  icon,
  isActive,
  isPaused,
  duration,
  onStart,
  onPause,
  onStop,
  onBack,
  children,
  primaryMetric
}: ModernActivityBaseProps) {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b border-slate-800"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              {icon}
            </div>
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <div className="text-sm text-slate-400">
                {isActive ? (
                  <>
                    {formatTime(duration)}
                    {isPaused && <span className="text-yellow-400 ml-2">• Pausado</span>}
                  </>
                ) : (
                  'Pronto para começar'
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Primary Metric */}
        {primaryMetric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {primaryMetric.value}
            </div>
            <div className="text-xl text-slate-400 mb-1">{primaryMetric.unit}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">{primaryMetric.label}</div>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 py-6"
        >
          {!isActive ? (
            <Button
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl"
            >
              <Play className="w-6 h-6 mr-2" />
              Iniciar
            </Button>
          ) : (
            <>
              <Button
                onClick={onPause}
                size="lg"
                className={`px-8 py-4 text-lg font-bold rounded-2xl shadow-xl ${
                  isPaused
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                }`}
              >
                {isPaused ? <Play className="w-6 h-6 mr-2" /> : <Pause className="w-6 h-6 mr-2" />}
                {isPaused ? 'Retomar' : 'Pausar'}
              </Button>
              
              <Button
                onClick={onStop}
                size="lg"
                variant="destructive"
                className="px-8 py-4 text-lg font-bold rounded-2xl shadow-xl"
              >
                <Square className="w-6 h-6 mr-2" />
                Finalizar
              </Button>
            </>
          )}
        </motion.div>

        {/* Activity Content */}
        {children}
      </div>

      {/* Pause Overlay */}
      {isActive && isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="text-center">
            <Pause className="w-20 h-20 text-white mb-4 mx-auto opacity-80" />
            <h2 className="text-3xl font-bold text-white mb-2">Atividade Pausada</h2>
            <p className="text-slate-400">Toque em retomar para continuar</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
