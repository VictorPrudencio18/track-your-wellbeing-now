
import React, { useState, useEffect } from 'react';
import { Waves, Timer, Target, TrendingUp, Zap, RotateCcw } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Lap {
  number: number;
  time: number;
  strokes: number;
  style: string;
}

interface ModernSwimmingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function ModernSwimmingActivity({ onComplete, onCancel }: ModernSwimmingActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [currentLapTime, setCurrentLapTime] = useState(0);
  const [currentStrokes, setCurrentStrokes] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [currentStyle, setCurrentStyle] = useState('crawl');
  const [poolLength] = useState(25); // metros

  const swimmingStyles = [
    { value: 'crawl', label: 'Crawl', multiplier: 1.0 },
    { value: 'costas', label: 'Costas', multiplier: 0.9 },
    { value: 'peito', label: 'Peito', multiplier: 0.8 },
    { value: 'borboleta', label: 'Borboleta', multiplier: 1.3 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setCurrentLapTime(prev => prev + 1);
        
        // Simular braçadas baseado no estilo
        const styleData = swimmingStyles.find(s => s.value === currentStyle);
        const strokeRate = styleData ? styleData.multiplier : 1.0;
        
        if (Math.random() > 0.7) {
          setCurrentStrokes(prev => prev + 1);
        }
        
        // Calcular calorias baseado no estilo e intensidade
        const calorieRate = styleData ? styleData.multiplier * 0.4 : 0.4;
        setCalories(prev => prev + calorieRate / 60);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, currentStyle]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    onComplete({
      type: 'swimming',
      name: 'Natação Avançada',
      duration,
      laps: laps.length,
      totalDistance,
      calories: Math.round(calories),
      avgLapTime: laps.length > 0 ? laps.reduce((sum, lap) => sum + lap.time, 0) / laps.length : 0,
      lapData: laps,
      date: new Date()
    });
  };

  const completeLap = () => {
    const newLap: Lap = {
      number: laps.length + 1,
      time: currentLapTime,
      strokes: currentStrokes,
      style: currentStyle
    };
    
    setLaps(prev => [...prev, newLap]);
    setTotalDistance(prev => prev + poolLength);
    setCurrentLapTime(0);
    setCurrentStrokes(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const averageLapTime = laps.length > 0 ? laps.reduce((sum, lap) => sum + lap.time, 0) / laps.length : 0;
  const bestLapTime = laps.length > 0 ? Math.min(...laps.map(lap => lap.time)) : 0;
  const currentPace = currentLapTime > 0 ? (currentLapTime / poolLength) * 100 : 0; // segundos por 100m

  const metrics = [
    {
      id: 'laps',
      icon: Waves,
      label: 'Voltas',
      value: laps.length,
      unit: `× ${poolLength}m`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'distance',
      icon: Target,
      label: 'Distância',
      value: totalDistance,
      unit: 'm',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'strokes',
      icon: RotateCcw,
      label: 'Braçadas',
      value: currentStrokes,
      unit: 'total',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: Math.round(calories),
      unit: 'kcal',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'avgTime',
      icon: Timer,
      label: 'Tempo Médio',
      value: formatTime(Math.round(averageLapTime)),
      unit: '/volta',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'pace',
      icon: TrendingUp,
      label: 'Ritmo',
      value: currentPace.toFixed(1),
      unit: 's/100m',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <ModernActivityBase
      title="Natação Pro"
      icon={<Waves className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: formatTime(currentLapTime),
        unit: '',
        label: 'Tempo da Volta Atual'
      }}
    >
      <div className="space-y-6">
        {/* Seletor de Estilo */}
        <PremiumCard className="p-4 bg-slate-900/50 border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Estilo de Nado:</span>
            <Select value={currentStyle} onValueChange={setCurrentStyle}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {swimmingStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PremiumCard>

        {/* Métricas Principais */}
        <MetricsGrid metrics={metrics} />

        {/* Controle de Volta */}
        {isActive && (
          <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {formatTime(currentLapTime)}
                </div>
                <div className="text-slate-400">Tempo da volta atual</div>
              </div>
              
              <Button
                onClick={completeLap}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3"
              >
                <Waves className="w-5 h-5 mr-2" />
                Completar Volta {laps.length + 1}
              </Button>
            </div>
          </PremiumCard>
        )}

        {/* Histórico de Voltas */}
        {laps.length > 0 && (
          <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Histórico de Voltas</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {laps.slice(-10).reverse().map((lap, index) => (
                <div key={lap.number} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {lap.number}
                    </div>
                    <div>
                      <div className="text-white font-medium">{formatTime(lap.time)}</div>
                      <div className="text-xs text-slate-400">{lap.style} • {lap.strokes} braçadas</div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    lap.time === bestLapTime ? 'text-green-400' : 
                    lap.time < averageLapTime ? 'text-blue-400' : 'text-slate-400'
                  }`}>
                    {lap.time === bestLapTime ? '🏆 Melhor' : 
                     lap.time < averageLapTime ? '⚡ Rápida' : ''}
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* Estatísticas da Sessão */}
        <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas da Sessão</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-400">Melhor Volta</div>
              <div className="text-xl font-bold text-green-400">
                {bestLapTime > 0 ? formatTime(bestLapTime) : '--:--'}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Distância Total</div>
              <div className="text-xl font-bold text-white">{totalDistance}m</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Braçadas/Volta</div>
              <div className="text-xl font-bold text-white">
                {laps.length > 0 ? Math.round(laps.reduce((sum, lap) => sum + lap.strokes, 0) / laps.length) : 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Ritmo Médio</div>
              <div className="text-xl font-bold text-white">
                {averageLapTime > 0 ? ((averageLapTime / poolLength) * 100).toFixed(1) : '0.0'}s/100m
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </ModernActivityBase>
  );
}
