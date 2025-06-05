
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Moon, 
  Sun, 
  Pause, 
  Play, 
  Square, 
  Timer,
  Heart,
  Volume2
} from 'lucide-react';
import { useStartSleepSession, useEndSleepSession } from '@/hooks/useSleepAdvanced';

interface SleepTimerProps {
  sessionType?: 'night_sleep' | 'nap' | 'rest';
}

export function SleepTimer({ sessionType = 'night_sleep' }: SleepTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'light' | 'deep' | 'rem' | 'awake'>('light');

  const startSession = useStartSleepSession();
  const endSession = useEndSleepSession();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        
        // Simular mudanças de fase do sono
        const minutes = Math.floor(seconds / 60);
        if (minutes < 20) setPhase('light');
        else if (minutes < 90) setPhase('deep');
        else if (minutes < 110) setPhase('rem');
        else setPhase('light');
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds]);

  const handleStart = async () => {
    try {
      const session = await startSession.mutateAsync(sessionType);
      setCurrentSessionId(session.id);
      setIsActive(true);
      setSeconds(0);
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    if (currentSessionId) {
      try {
        await endSession.mutateAsync({
          sessionId: currentSessionId,
          duration: seconds
        });
        setIsActive(false);
        setIsPaused(false);
        setSeconds(0);
        setCurrentSessionId(null);
      } catch (error) {
        console.error('Erro ao finalizar sessão:', error);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'light': return <Moon className="w-4 h-4" />;
      case 'deep': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'rem': return <Timer className="w-4 h-4 text-purple-400" />;
      case 'awake': return <Sun className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'light': return 'from-blue-400/20 to-cyan-400/20';
      case 'deep': return 'from-indigo-500/20 to-purple-500/20';
      case 'rem': return 'from-purple-500/20 to-pink-500/20';
      case 'awake': return 'from-yellow-400/20 to-orange-400/20';
    }
  };

  const sessionTypeLabels = {
    night_sleep: 'Sono Noturno',
    nap: 'Cochilo',
    rest: 'Descanso'
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="glass-card-holographic border-navy-600/30 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000`} />
        
        <CardHeader className="relative z-10 text-center pb-4">
          <CardTitle className="text-white flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Timer className="w-5 h-5 text-white" />
            </div>
            Timer de Sono
            <Badge variant="outline" className="border-navy-400/50 text-navy-100 bg-navy-800/50">
              {sessionTypeLabels[sessionType]}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 space-y-8 pb-8">
          {/* Timer Display - Centralizado e mais proeminente */}
          <div className="text-center">
            <motion.div
              key={seconds}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-7xl font-mono font-bold text-white mb-4 tracking-wider leading-none"
              style={{
                textShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(99,102,241,0.2)',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }}
            >
              {formatTime(seconds)}
            </motion.div>
            
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-base text-gray-300 mb-6"
              >
                {getPhaseIcon()}
                <span className="capitalize font-medium">Fase {phase}</span>
                {isPaused && (
                  <Badge variant="outline" className="border-yellow-400/50 text-yellow-400 bg-yellow-500/10 ml-2">
                    Pausado
                  </Badge>
                )}
              </motion.div>
            )}
          </div>

          {/* Controls - Centralizados */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {!isActive ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    onClick={handleStart}
                    disabled={startSession.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    Iniciar
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    size="lg"
                    className="border-navy-600/50 text-white hover:bg-navy-700/50 px-6 py-3"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    onClick={handleStop}
                    disabled={endSession.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-8 py-3"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Finalizar
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sleep Metrics (during active session) */}
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="text-center p-4 bg-navy-800/40 rounded-xl border border-navy-600/30 backdrop-blur-sm">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">72</div>
                <div className="text-xs text-gray-400">BPM</div>
              </div>
              
              <div className="text-center p-4 bg-navy-800/40 rounded-xl border border-navy-600/30 backdrop-blur-sm">
                <Volume2 className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">23dB</div>
                <div className="text-xs text-gray-400">Ruído</div>
              </div>
              
              <div className="text-center p-4 bg-navy-800/40 rounded-xl border border-navy-600/30 backdrop-blur-sm">
                <Timer className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-semibold text-white">{Math.floor(seconds / 60)}</div>
                <div className="text-xs text-gray-400">Ciclos</div>
              </div>
            </motion.div>
          )}

          {/* Quick Tips */}
          {!isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm text-gray-400 space-y-1"
            >
              <p>Use o timer para monitorar automaticamente seu sono</p>
              <p className="text-xs">Dados serão salvos no seu perfil</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
