import React, { useState, useEffect } from 'react';
import { MapPin, Timer, Footprints, Heart, Navigation, Target, Zap, TrendingUp } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion } from 'framer-motion';
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { useGPS } from '@/hooks/useGPS';
import { RunningMap } from '../premium-components/RunningMap';

interface ModernWalkingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const walkingGoals = [
  { name: 'Relaxamento', steps: 3000, duration: 30, intensity: 1, color: 'from-green-400 to-emerald-500' },
  { name: 'Saúde', steps: 5000, duration: 45, intensity: 2, color: 'from-blue-400 to-cyan-500' },
  { name: 'Fitness', steps: 8000, duration: 60, intensity: 3, color: 'from-orange-400 to-red-500' },
  { name: 'Desafio', steps: 12000, duration: 90, intensity: 4, color: 'from-purple-400 to-pink-500' }
];

const terrainTypes = [
  { name: 'Plano', modifier: 1.0, icon: '🏞️', description: 'Terreno plano e uniforme' },
  { name: 'Colinas', modifier: 1.3, icon: '⛰️', description: 'Terreno com elevações suaves' },
  { name: 'Montanha', modifier: 1.6, icon: '🏔️', description: 'Terreno montanhoso desafiador' },
  { name: 'Praia', modifier: 1.4, icon: '🏖️', description: 'Caminhada na areia' },
  { name: 'Trilha', modifier: 1.5, icon: '🌲', description: 'Trilha em mata ou floresta' },
  { name: 'Urbano', modifier: 1.1, icon: '🏙️', description: 'Caminhada urbana' }
];

export function ModernWalkingActivity({ onComplete, onCancel }: ModernWalkingActivityProps) {
  const createActivity = useCreateActivity();
  const gps = useGPS();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(75);
  const [pace, setPace] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(walkingGoals[1]);
  const [selectedTerrain, setSelectedTerrain] = useState(terrainTypes[0]);
  const [elevation, setElevation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [avgHeartRate, setAvgHeartRate] = useState(75);
  const [heartRateZone, setHeartRateZone] = useState('Leve');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simulação de métricas baseadas no terreno
        const terrainMultiplier = selectedTerrain.modifier;
        const baseSteps = 90 + (Math.random() * 20); // 90-110 steps per minute
        setSteps(prev => prev + (baseSteps / 60));
        
        // Distância via GPS se disponível
        if (gps.position) {
          const gpsDistance = gps.calculateTotalDistance();
          setDistance(gpsDistance);

          // Velocidade atual (km/h para exibição, m/s para mapa)
          const speedMs = gps.calculateCurrentSpeed();
          setSpeed(speedMs * 3.6);
          setMaxSpeed(prev => Math.max(prev, speedMs * 3.6));

          // Pace (min/km)
          setPace(speedMs > 0 ? (1000 / speedMs) / 60 : 0);
        } else {
          // Fallback para simulação se GPS não disponível
          const simulatedSpeed = 4.5; // 4.5 km/h velocidade média de caminhada
          setDistance(prev => prev + (simulatedSpeed / 3600)); // incremento por segundo
          setSpeed(simulatedSpeed);
          setPace(60 / simulatedSpeed); // min/km
        }
        
        // Frequência cardíaca baseada na intensidade
        const targetHR = 60 + (selectedGoal.intensity * 20) + (terrainMultiplier * 10);
        setHeartRate(prev => {
          const newHR = prev + (Math.random() - 0.5) * 4;
          return Math.max(60, Math.min(180, newHR));
        });
        
        // Zona de frequência cardíaca
        if (heartRate < 100) setHeartRateZone('Leve');
        else if (heartRate < 120) setHeartRateZone('Moderado');
        else if (heartRate < 140) setHeartRateZone('Vigoroso');
        else setHeartRateZone('Intenso');
        
        // Calorias queimadas
        const caloriesPerMinute = (selectedGoal.intensity * 4 * terrainMultiplier);
        setCalories(prev => prev + (caloriesPerMinute / 60));
        
        // Elevação para terrenos montanhosos
        if (selectedTerrain.name === 'Montanha' || selectedTerrain.name === 'Colinas') {
          setElevation(prev => prev + (Math.random() * 2));
        }
        
        // Média da frequência cardíaca
        setAvgHeartRate(prev => (prev + heartRate) / 2);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, steps, distance, heartRate, selectedGoal, selectedTerrain, gps]);

  const handleStart = async () => {
    try {
      console.log('Iniciando atividade de caminhada...');
      await gps.startTracking();
      setIsActive(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Erro ao iniciar GPS:', error);
      // Continuar mesmo sem GPS
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = async () => {
    gps.stopTracking();
    const sessionData = {
      type: 'walking' as const,
      name: `Caminhada ${selectedGoal.name}`,
      duration,
      distance: Number(distance.toFixed(2)),
      calories: Math.round(calories),
      avg_heart_rate: Math.round(avgHeartRate),
      max_heart_rate: Math.round(heartRate),
      pace: Number(pace.toFixed(2)),
      elevation_gain: Math.round(elevation),
      notes: `Meta: ${selectedGoal.name} | Terreno: ${selectedTerrain.name} | Zona Cardíaca: ${heartRateZone}`,
      gps_data: {
        steps: Math.round(steps),
        max_speed: Number(maxSpeed.toFixed(2)),
        terrain: selectedTerrain.name,
        heart_rate_zone: heartRateZone,
        goal_achieved: steps >= selectedGoal.steps,
        terrain_modifier: selectedTerrain.modifier,
        route: gps.getPositionHistory()
      }
    };
    
    try {
      await createActivity.mutateAsync(sessionData);
      onComplete(sessionData);
    } catch (error) {
      console.error('Error saving walking activity:', error);
      onComplete(sessionData); // Still complete the activity even if save fails
    }
  };

  const goalProgress = (steps / selectedGoal.steps) * 100;

  const metrics = [
    {
      id: 'steps',
      icon: Footprints,
      label: 'Passos',
      value: Math.round(steps),
      unit: 'passos',
      color: 'from-blue-500 to-cyan-600',
      trend: (steps > selectedGoal.steps * 0.5 ? 'up' : 'neutral') as 'up' | 'down' | 'neutral',
      trendValue: `${Math.round(goalProgress)}%`
    },
    {
      id: 'heartrate',
      icon: Heart,
      label: 'Frequência Cardíaca',
      value: Math.round(heartRate),
      unit: 'bpm',
      color: 'from-red-500 to-pink-600',
      trend: (heartRate > 100 ? 'up' : 'down') as 'up' | 'down' | 'neutral',
      trendValue: heartRateZone
    },
    {
      id: 'distance',
      icon: MapPin,
      label: 'Distância',
      value: distance.toFixed(2),
      unit: 'km',
      color: 'from-green-500 to-emerald-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: `${speed.toFixed(1)} km/h`
    },
    {
      id: 'calories',
      icon: Zap,
      label: 'Calorias',
      value: Math.round(calories),
      unit: 'kcal',
      color: 'from-orange-500 to-yellow-600',
      trend: 'up' as 'up' | 'down' | 'neutral',
      trendValue: `${(calories/duration*60).toFixed(0)}/min`
    }
  ];

  return (
    <ModernActivityBase
      title="Caminhada"
      icon={<Footprints className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: Math.round(steps).toLocaleString(),
        unit: 'passos',
        label: 'Total de Passos'
      }}
    >
      <div className="space-y-6">
        {/* Seleção de Meta */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha sua Meta</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {walkingGoals.map((goal) => (
                <motion.button
                  key={goal.name}
                  onClick={() => setSelectedGoal(goal)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedGoal.name === goal.name
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-blue-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${goal.color} mb-2`} />
                  <div className="text-left">
                    <div className="font-semibold text-white">{goal.name}</div>
                    <div className="text-xs text-slate-400">{goal.steps.toLocaleString()} passos</div>
                    <div className="text-xs text-blue-400">{goal.duration} min</div>
                  </div>
                </motion.button>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-white mb-4 mt-8">Tipo de Terreno</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {terrainTypes.map((terrain) => (
                <motion.button
                  key={terrain.name}
                  onClick={() => setSelectedTerrain(terrain)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedTerrain.name === terrain.name
                      ? 'border-green-400 bg-green-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-green-400/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{terrain.icon}</div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{terrain.name}</div>
                    <div className="text-xs text-slate-400">{terrain.description}</div>
                    <div className="text-xs text-green-400">+{Math.round((terrain.modifier - 1) * 100)}% calorias</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {isActive && (
          <>
            {/* Métricas Principais */}
            <MetricsGrid metrics={metrics} columns={4} />

            {/* Progresso da Meta */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-white">Progresso da Meta</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">{selectedGoal.name}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Passos</span>
                    <span className="text-white">{Math.round(steps).toLocaleString()} / {selectedGoal.steps.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      className={`bg-gradient-to-r ${selectedGoal.color} h-3 rounded-full flex items-center justify-end pr-2`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, goalProgress)}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      {goalProgress >= 20 && (
                        <span className="text-xs text-white font-bold">
                          {Math.round(goalProgress)}%
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>

                {goalProgress >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4 bg-green-500/20 rounded-lg border border-green-400"
                  >
                    <div className="text-2xl">🎉</div>
                    <div className="text-green-400 font-semibold">Meta Alcançada!</div>
                    <div className="text-xs text-slate-400">Parabéns pelo seu desempenho!</div>
                  </motion.div>
                )}
              </div>
            </PremiumCard>

            {/* Estatísticas Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Velocidade Atual</span>
                    <span className="text-white">{speed.toFixed(1)} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Velocidade Máxima</span>
                    <span className="text-white">{maxSpeed.toFixed(1)} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pace Atual</span>
                    <span className="text-white">{pace > 0 ? `${pace.toFixed(1)} min/km` : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Terreno</span>
                    <span className="text-white">{selectedTerrain.icon} {selectedTerrain.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Status</span>
                    <span className={`${gps.position ? 'text-green-400' : 'text-orange-400'}`}>
                      {gps.position ? `Ativo (${gps.accuracy.toFixed(0)}m)` : 'Simulado'}
                    </span>
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
                <h4 className="text-lg font-semibold text-white mb-4">Zona Cardíaca</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-400">{Math.round(heartRate)}</div>
                    <div className="text-sm text-slate-400">bpm atual</div>
                  </div>
                  <div className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      heartRateZone === 'Leve' ? 'bg-green-500/20 text-green-400' :
                      heartRateZone === 'Moderado' ? 'bg-yellow-500/20 text-yellow-400' :
                      heartRateZone === 'Vigoroso' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {heartRateZone}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">FC Média</span>
                    <span className="text-white">{Math.round(avgHeartRate)} bpm</span>
                  </div>
                  {elevation > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Elevação</span>
                      <span className="text-white">{Math.round(elevation)}m</span>
                    </div>
                  )}
                </div>
              </PremiumCard>
            </div>

            {/* Mapa da Caminhada */}
            <RunningMap
              gpsState={gps}
              data={{
                type: 'walking',
                duration,
                distance,
                avgSpeed: speed,
                maxSpeed,
                currentSpeed: gps.calculateCurrentSpeed(),
                pace: pace,
                avgPace: pace,
                calories: Math.round(calories),
                elevationGain: elevation,
                heartRate: Math.round(heartRate),
                maxHeartRate: Math.round(heartRate),
                gpsPoints: gps.getPositionHistory(),
                metrics: [],
                segments: []
              } as any}
              isActive={isActive && !isPaused}
              route={gps.getPositionHistory()}
            />
          </>
        )}
      </div>
    </ModernActivityBase>
  );
}
