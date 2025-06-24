
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Zap, Heart, TrendingUp, Timer } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { ModernWalkingMap } from './ModernWalkingMap';
import { useGPS } from '@/hooks/useGPS';
import { PremiumCard } from '@/components/ui/premium-card';

interface ModernWalkingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function ModernWalkingActivity({ onComplete, onCancel }: ModernWalkingActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [steps, setSteps] = useState(0);

  // Auto-start GPS when component mounts
  const gps = useGPS(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        if (gps.position) {
          const gpsDistance = gps.calculateTotalDistance();
          const gpsSpeed = gps.calculateCurrentSpeed();
          
          setDistance(gpsDistance);
          setCurrentSpeed(gpsSpeed);
          setAvgSpeed(gpsDistance > 0 ? gpsDistance / (duration / 3600) : 0);
        } else {
          const simulatedSpeed = 3 + Math.random() * 2;
          setCurrentSpeed(simulatedSpeed);
          setDistance(prev => prev + (simulatedSpeed / 3600));
          setAvgSpeed(distance > 0 ? distance / (duration / 3600) : 0);
        }
        
        setCalories(Math.floor(duration * 0.15));
        setHeartRate(100 + Math.floor(Math.random() * 40));
        setSteps(prev => prev + Math.floor(Math.random() * 3) + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, distance, gps.position]);

  const handleStart = async () => {
    console.log('Iniciando caminhada...');
    
    // Ensure GPS is ready before starting
    if (!gps.isReady && !gps.isTracking) {
      console.log('GPS não está pronto, iniciando...');
      try {
        await gps.startTracking();
      } catch (error) {
        console.error('Erro ao iniciar GPS:', error);
      }
    }
    
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    gps.stopTracking();
    onComplete({
      type: 'walking',
      name: 'Caminhada',
      duration,
      distance,
      avgSpeed,
      currentSpeed,
      calories,
      heartRate,
      steps,
      route: gps.getPositionHistory(),
      date: new Date()
    });
  };

  const handleBack = () => {
    if (isActive) {
      gps.stopTracking();
    }
    onCancel();
  };

  const metrics = [
    {
      id: 'distance',
      icon: MapPin,
      label: 'Distância',
      value: distance.toFixed(2),
      unit: 'km',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'speed',
      icon: TrendingUp,
      label: 'Velocidade',
      value: (currentSpeed * 3.6).toFixed(1),
      unit: 'km/h',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: calories,
      unit: 'kcal',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'steps',
      icon: Timer,
      label: 'Passos',
      value: steps,
      unit: '',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'heartRate',
      icon: Heart,
      label: 'FC',
      value: heartRate,
      unit: 'bpm',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'time',
      icon: Clock,
      label: 'Tempo',
      value: Math.floor(duration / 60),
      unit: 'min',
      color: 'from-slate-500 to-slate-600'
    }
  ];

  return (
    <ModernActivityBase
      title="Caminhada GPS"
      icon={<MapPin className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={handleBack}
      primaryMetric={{
        value: distance.toFixed(2),
        unit: 'km',
        label: 'Distância Percorrida'
      }}
    >
      <div className="space-y-6">
        {/* Métricas Principais */}
        <MetricsGrid metrics={metrics} />

        {/* Mapa da Caminhada */}
        <ModernWalkingMap
          gpsState={gps}
          isActive={isActive && !isPaused}
          route={gps.getPositionHistory()}
          distance={distance}
          currentSpeed={currentSpeed}
        />

        {/* Informações de GPS */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status do GPS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">Status</div>
              <div className="text-lg font-bold text-white">
                {gps.isReady ? 'Pronto' : gps.isTracking ? 'Conectando...' : 'Desconectado'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Precisão</div>
              <div className="text-lg font-bold text-white">
                {gps.position ? `${gps.accuracy.toFixed(0)}m` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Pontos GPS</div>
              <div className="text-lg font-bold text-white">{gps.getPositionHistory().length}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Qualidade</div>
              <div className="text-lg font-bold text-white">
                {gps.isHighAccuracy ? 'Alta' : gps.position ? 'Média' : 'Baixa'}
              </div>
            </div>
          </div>
          
          {gps.error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{gps.error}</p>
            </div>
          )}
        </PremiumCard>

        {/* Estatísticas da Sessão */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas da Sessão</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">Velocidade Média</div>
              <div className="text-xl font-bold text-white">{(avgSpeed * 3.6).toFixed(1)} km/h</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Ritmo Médio</div>
              <div className="text-xl font-bold text-white">
                {avgSpeed > 0 ? `${(60 / (avgSpeed * 3.6)).toFixed(1)} min/km` : '0 min/km'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Tempo Ativo</div>
              <div className="text-xl font-bold text-white">
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Passos/min</div>
              <div className="text-xl font-bold text-white">
                {duration > 0 ? Math.round((steps / duration) * 60) : 0}
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </ModernActivityBase>
  );
}
