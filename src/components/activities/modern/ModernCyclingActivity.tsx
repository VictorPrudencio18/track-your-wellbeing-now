
import React, { useState, useEffect } from 'react';
import { Bike, Gauge, Mountain, Zap, Heart, RotateCcw, TrendingUp, Timer } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { PremiumCard } from '@/components/ui/premium-card';
import { Progress } from '@/components/ui/progress';

interface ModernCyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function ModernCyclingActivity({ onComplete, onCancel }: ModernCyclingActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [power, setPower] = useState(0);
  const [segments, setSegments] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simular dados realistas
        const newSpeed = Math.max(0, 15 + Math.random() * 25 + Math.sin(Date.now() / 10000) * 10);
        setCurrentSpeed(newSpeed);
        setDistance(prev => prev + (newSpeed / 3600));
        setAvgSpeed(distance > 0 ? distance / (duration / 3600) : 0);
        setMaxSpeed(prev => Math.max(prev, newSpeed));
        setElevation(prev => prev + Math.random() * 0.5);
        setCalories(Math.floor(duration * 0.3));
        setHeartRate(120 + Math.floor(Math.random() * 60));
        setCadence(70 + Math.floor(Math.random() * 40));
        setPower(150 + Math.floor(Math.random() * 200));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, distance]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    onComplete({
      type: 'cycling',
      name: 'Ciclismo Avançado',
      duration,
      distance,
      avgSpeed,
      maxSpeed,
      elevation,
      calories,
      heartRate,
      cadence,
      power,
      segments,
      date: new Date()
    });
  };

  const metrics = [
    {
      id: 'speed',
      icon: Gauge,
      label: 'Velocidade',
      value: currentSpeed.toFixed(1),
      unit: 'km/h',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'distance',
      icon: TrendingUp,
      label: 'Distância',
      value: distance.toFixed(2),
      unit: 'km',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'elevation',
      icon: Mountain,
      label: 'Elevação',
      value: Math.round(elevation),
      unit: 'm',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: calories,
      unit: 'kcal',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'heartRate',
      icon: Heart,
      label: 'FC',
      value: heartRate,
      unit: 'bpm',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'cadence',
      icon: RotateCcw,
      label: 'Cadência',
      value: cadence,
      unit: 'rpm',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Zonas de treino baseadas na FC
  const heartRateZones = [
    { name: 'Recuperação', min: 100, max: 130, color: 'bg-blue-500' },
    { name: 'Aeróbico', min: 130, max: 150, color: 'bg-green-500' },
    { name: 'Limiar', min: 150, max: 170, color: 'bg-yellow-500' },
    { name: 'Anaeróbico', min: 170, max: 190, color: 'bg-red-500' }
  ];

  const currentZone = heartRateZones.find(zone => heartRate >= zone.min && heartRate <= zone.max);

  return (
    <ModernActivityBase
      title="Ciclismo GPS"
      icon={<Bike className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: currentSpeed.toFixed(1),
        unit: 'km/h',
        label: 'Velocidade Atual'
      }}
    >
      <div className="space-y-6">
        {/* Métricas Principais */}
        <MetricsGrid metrics={metrics} />

        {/* Zona de Frequência Cardíaca */}
        {isActive && (
          <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Zona de Treino</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">
                  {currentZone ? currentZone.name : 'Fora da zona'}
                </span>
                <span className="text-white font-bold">{heartRate} bpm</span>
              </div>
              
              <div className="space-y-2">
                {heartRateZones.map((zone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${zone.color} ${
                      currentZone?.name === zone.name ? 'ring-2 ring-white' : ''
                    }`} />
                    <span className="text-sm text-slate-400 flex-1">{zone.name}</span>
                    <span className="text-xs text-slate-500">{zone.min}-{zone.max}</span>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Estatísticas da Sessão */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas da Sessão</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">Velocidade Média</div>
              <div className="text-xl font-bold text-white">{avgSpeed.toFixed(1)} km/h</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Velocidade Máxima</div>
              <div className="text-xl font-bold text-white">{maxSpeed.toFixed(1)} km/h</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Potência Média</div>
              <div className="text-xl font-bold text-white">{power} W</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Tempo Ativo</div>
              <div className="text-xl font-bold text-white">
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Progresso de Metas */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Progresso de Metas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Distância (Meta: 20km)</span>
                <span className="text-white">{((distance / 20) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(distance / 20) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Calorias (Meta: 500kcal)</span>
                <span className="text-white">{((calories / 500) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(calories / 500) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Tempo (Meta: 60min)</span>
                <span className="text-white">{((duration / 3600) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(duration / 3600) * 100} className="h-2" />
            </div>
          </div>
        </PremiumCard>
      </div>
    </ModernActivityBase>
  );
}
