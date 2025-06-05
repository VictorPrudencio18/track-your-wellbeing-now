
import React, { useState, useEffect } from 'react';
import { Music, Heart, Zap, Flame, Trophy, Volume2, Shuffle, SkipForward } from 'lucide-react';
import { ModernActivityBase } from './ModernActivityBase';
import { MetricsGrid } from './MetricsGrid';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernDanceActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const danceStyles = [
  { 
    name: 'Hip Hop', 
    description: 'Movimentos urbanos e energéticos', 
    intensity: 4, 
    color: 'from-orange-500 to-red-600',
    bpm: '90-140',
    moves: ['Pop', 'Lock', 'Break', 'Freestyle']
  },
  { 
    name: 'Salsa', 
    description: 'Ritmos latinos passionais', 
    intensity: 3, 
    color: 'from-red-500 to-pink-600',
    bpm: '150-250',
    moves: ['Básico', 'Cross Body', 'Turn', 'Dip']
  },
  { 
    name: 'Ballet', 
    description: 'Elegância e técnica clássica', 
    intensity: 2, 
    color: 'from-pink-500 to-purple-600',
    bpm: '60-120',
    moves: ['Plié', 'Tendu', 'Arabesque', 'Pirouette']
  },
  { 
    name: 'Zumba', 
    description: 'Fitness latino divertido', 
    intensity: 4, 
    color: 'from-yellow-500 to-orange-600',
    bpm: '120-160',
    moves: ['Merengue', 'Reggaeton', 'Cumbia', 'Salsa']
  },
  { 
    name: 'Jazz', 
    description: 'Expressão contemporânea', 
    intensity: 3, 
    color: 'from-blue-500 to-purple-600',
    bpm: '100-140',
    moves: ['Isolations', 'Kicks', 'Turns', 'Leaps']
  },
  { 
    name: 'Contemporâneo', 
    description: 'Movimento livre e criativo', 
    intensity: 2, 
    color: 'from-teal-500 to-blue-600',
    bpm: '80-120',
    moves: ['Floor Work', 'Release', 'Contract', 'Spiral']
  }
];

const musicTracks = [
  { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', duration: 270, bpm: 115, genre: 'Funk' },
  { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', duration: 228, bpm: 89, genre: 'Reggaeton' },
  { title: 'Shape of You', artist: 'Ed Sheeran', duration: 233, bpm: 96, genre: 'Pop' },
  { title: 'Havana', artist: 'Camila Cabello', duration: 217, bpm: 105, genre: 'Latin Pop' },
  { title: 'Can\'t Stop the Feeling', artist: 'Justin Timberlake', duration: 236, bpm: 113, genre: 'Pop' },
  { title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, bpm: 171, genre: 'Synthpop' }
];

const choreographyMoves = [
  { name: 'Grapevine', difficulty: 1, energy: 2 },
  { name: 'Mambo Step', difficulty: 2, energy: 3 },
  { name: 'Cha Cha', difficulty: 2, energy: 3 },
  { name: 'Hip Bump', difficulty: 1, energy: 2 },
  { name: 'Body Roll', difficulty: 3, energy: 4 },
  { name: 'Pirouette', difficulty: 4, energy: 3 },
  { name: 'Leap', difficulty: 3, energy: 4 },
  { name: 'Isolation', difficulty: 2, energy: 2 },
  { name: 'Drop', difficulty: 4, energy: 5 },
  { name: 'Freestyle', difficulty: 3, energy: 4 }
];

export function ModernDanceActivity({ onComplete, onCancel }: ModernDanceActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(danceStyles[0]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [heartRate, setHeartRate] = useState(75);
  const [energy, setEnergy] = useState(100);
  const [rhythm, setRhythm] = useState(70);
  const [expression, setExpression] = useState(60);
  const [currentMove, setCurrentMove] = useState(choreographyMoves[0]);
  const [moveTimer, setMoveTimer] = useState(0);
  const [perfectMoves, setPerfectMoves] = useState(0);
  const [missedBeats, setMissedBeats] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        setTrackProgress(prev => prev + 1);
        setMoveTimer(prev => prev + 1);
        
        // Mudança automática de música
        if (trackProgress >= musicTracks[currentTrack].duration) {
          setCurrentTrack(prev => (prev + 1) % musicTracks.length);
          setTrackProgress(0);
        }
        
        // Mudança de movimento a cada 15-30 segundos
        if (moveTimer >= 20) {
          const newMove = choreographyMoves[Math.floor(Math.random() * choreographyMoves.length)];
          setCurrentMove(newMove);
          setMoveTimer(0);
          setMoves(prev => prev + 1);
          
          // Simulação de performance
          if (Math.random() > 0.3) {
            setCombo(prev => prev + 1);
            setPerfectMoves(prev => prev + 1);
          } else {
            setCombo(0);
            setMissedBeats(prev => prev + 1);
          }
        }
        
        // Atualização de métricas
        setMaxCombo(prev => Math.max(prev, combo));
        setHeartRate(prev => Math.max(80, Math.min(180, prev + (Math.random() - 0.5) * 4)));
        setEnergy(prev => Math.max(10, prev - (selectedStyle.intensity * 0.02)));
        setRhythm(prev => Math.min(100, prev + (combo > 5 ? 0.2 : -0.1)));
        setExpression(prev => Math.min(100, prev + 0.1));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, duration, trackProgress, moveTimer, currentTrack, combo, selectedStyle.intensity]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    const sessionData = {
      type: 'dance',
      name: `Dança ${selectedStyle.name}`,
      duration,
      style: selectedStyle.name,
      moves_performed: moves,
      perfect_moves: perfectMoves,
      missed_beats: missedBeats,
      max_combo: maxCombo,
      avg_heart_rate: Math.round(heartRate),
      rhythm_score: Math.round(rhythm),
      expression_score: Math.round(expression),
      calories: Math.round(duration * 0.15 * selectedStyle.intensity),
      tracks_played: Math.floor(duration / 180) + 1,
      date: new Date()
    };
    
    onComplete(sessionData);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % musicTracks.length);
    setTrackProgress(0);
  };

  const shuffleTrack = () => {
    const randomTrack = Math.floor(Math.random() * musicTracks.length);
    setCurrentTrack(randomTrack);
    setTrackProgress(0);
  };

  const metrics = [
    {
      id: 'heartrate',
      icon: Heart,
      label: 'Frequência Cardíaca',
      value: Math.round(heartRate),
      unit: 'bpm',
      color: 'from-red-500 to-pink-600',
      trend: heartRate > 120 ? 'up' : 'down',
      trendValue: '5%'
    },
    {
      id: 'moves',
      icon: Zap,
      label: 'Movimentos',
      value: moves,
      unit: 'total',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'combo',
      icon: Trophy,
      label: 'Combo Máximo',
      value: maxCombo,
      unit: 'hits',
      color: 'from-yellow-500 to-orange-600',
      trend: combo > 3 ? 'up' : 'neutral',
      trendValue: '+1'
    },
    {
      id: 'energy',
      icon: Flame,
      label: 'Energia',
      value: Math.round(energy),
      unit: '%',
      color: 'from-orange-500 to-red-600',
      trend: energy > 50 ? 'up' : 'down',
      trendValue: '2%'
    }
  ];

  const track = musicTracks[currentTrack];

  return (
    <ModernActivityBase
      title="Dança"
      icon={<Music className="w-6 h-6 text-white" />}
      isActive={isActive}
      isPaused={isPaused}
      duration={duration}
      onStart={handleStart}
      onPause={handlePause}
      onStop={handleStop}
      onBack={onCancel}
      primaryMetric={{
        value: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
        unit: 'min',
        label: 'Tempo de Dança'
      }}
    >
      <div className="space-y-6">
        {/* Seleção de Estilo */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Escolha seu Estilo</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {danceStyles.map((style) => (
                <motion.button
                  key={style.name}
                  onClick={() => setSelectedStyle(style)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedStyle.name === style.name
                      ? 'border-pink-400 bg-pink-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-pink-400/50'
                  }`}
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${style.color} mb-2`} />
                  <div className="text-left">
                    <div className="font-semibold text-white">{style.name}</div>
                    <div className="text-xs text-slate-400">{style.description}</div>
                    <div className="text-xs text-pink-400">BPM: {style.bpm}</div>
                    <div className="text-xs text-slate-500">
                      {'⚡'.repeat(style.intensity)}
                    </div>
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

            {/* Player de Música */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Music className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-white">{track.title}</h4>
                      <p className="text-sm text-slate-400">{track.artist}</p>
                      <p className="text-xs text-pink-400">{track.genre} • {track.bpm} BPM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={shuffleTrack} size="sm" variant="outline" className="border-slate-600">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                    <Button onClick={nextTrack} size="sm" variant="outline" className="border-slate-600">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{Math.floor(trackProgress / 60)}:{(trackProgress % 60).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(trackProgress / track.duration) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </PremiumCard>

            {/* Movimento Atual */}
            <PremiumCard className="p-6 bg-slate-900/50 border-slate-700">
              <div className="text-center space-y-4">
                <h4 className="text-lg font-semibold text-white">Movimento Atual</h4>
                
                <motion.div
                  key={currentMove.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="text-3xl font-bold text-pink-400">
                    {currentMove.name}
                  </div>
                  
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="text-slate-400">
                      Dificuldade: {'⭐'.repeat(currentMove.difficulty)}
                    </div>
                    <div className="text-slate-400">
                      Energia: {'⚡'.repeat(currentMove.energy)}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-mono text-white">
                    {20 - moveTimer}s
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(moveTimer / 20) * 100}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            </PremiumCard>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PremiumCard className="p-4 bg-slate-900/50 border-slate-700 text-center">
                <div className="text-2xl font-bold text-green-400">{perfectMoves}</div>
                <div className="text-xs text-slate-400">Movimentos Perfeitos</div>
              </PremiumCard>
              
              <PremiumCard className="p-4 bg-slate-900/50 border-slate-700 text-center">
                <div className="text-2xl font-bold text-yellow-400">{combo}</div>
                <div className="text-xs text-slate-400">Combo Atual</div>
              </PremiumCard>
              
              <PremiumCard className="p-4 bg-slate-900/50 border-slate-700 text-center">
                <div className="text-2xl font-bold text-blue-400">{Math.round(rhythm)}%</div>
                <div className="text-xs text-slate-400">Ritmo</div>
              </PremiumCard>
              
              <PremiumCard className="p-4 bg-slate-900/50 border-slate-700 text-center">
                <div className="text-2xl font-bold text-purple-400">{Math.round(expression)}%</div>
                <div className="text-xs text-slate-400">Expressão</div>
              </PremiumCard>
            </div>

            {/* Combo Visual */}
            <AnimatePresence>
              {combo > 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                  <div className="text-6xl font-bold text-yellow-400">
                    {combo}x COMBO!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </ModernActivityBase>
  );
}
