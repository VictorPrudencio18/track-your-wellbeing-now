import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Settings, BarChart3, Map, Gauge } from 'lucide-react';
import { useEnhancedActivityTracker } from '@/hooks/useEnhancedActivityTracker';
import { useUserSettings } from '@/hooks/useUserSettings';
import { CyclingMetrics } from './premium-components/CyclingMetrics';
import { CyclingMap } from './premium-components/CyclingMap';
import { CyclingControls } from './premium-components/CyclingControls';
import { CyclingSettings } from './premium-components/CyclingSettings';
import { PremiumCard } from '@/components/ui/premium-card';
import { Button } from '@/components/ui/button';

interface PremiumCyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

type ViewMode = 'dashboard' | 'map' | 'metrics' | 'settings';

export function PremiumCyclingActivity({ onComplete, onCancel }: PremiumCyclingActivityProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const { data: userSettings } = useUserSettings();
  
  const {
    isActive,
    isPaused,
    data,
    gpsState,
    startActivity,
    pauseActivity,
    resumeActivity,
    stopActivity,
    isGPSReady
  } = useEnhancedActivityTracker('cycling');

  // Enhanced GPS ready check
  const isSystemReady = isGPSReady && gpsState.isReady;

  const handleComplete = async () => {
    await stopActivity();
    onComplete({
      type: 'cycling',
      duration: data.duration,
      distance: data.distance ? data.distance / 1000 : undefined,
      calories: data.calories,
      avg_heart_rate: data.heartRate || undefined,
      max_heart_rate: data.maxHeartRate || undefined,
      elevation_gain: data.elevationGain || undefined,
      pace: data.avgPace || undefined,
    });
  };

  const handleCancel = () => {
    if (isActive) {
      stopActivity();
    }
    onCancel();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const navigationItems = [
    { id: 'dashboard', icon: Gauge, label: 'Dashboard' },
    { id: 'map', icon: Map, label: 'Mapa' },
    { id: 'metrics', icon: BarChart3, label: 'Métricas' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-white hover:bg-navy-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">Ciclismo GPS Premium</h1>
              <p className="text-navy-400">
                {isActive ? (
                  <>
                  {formatDuration(data.duration)} • {(data.distance / 1000).toFixed(2)} km
                    {isPaused && <span className="text-yellow-400 ml-2">• Pausado</span>}
                  </>
                ) : isSystemReady ? (
                  'Sistema pronto para pedalar'
                ) : (
                  'Conectando GPS + Google Maps...'
                )}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView(item.id as ViewMode)}
                className={currentView === item.id ? 
                  "bg-accent-orange text-navy-900" : 
                  "text-white hover:bg-navy-700"
                }
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Controls */}
              <CyclingControls
                isActive={isActive}
                isPaused={isPaused}
                isGPSReady={isSystemReady}
                duration={data.duration}
                onStart={startActivity}
                onPause={isPaused ? resumeActivity : pauseActivity}
                onStop={handleComplete}
                onCancel={handleCancel}
              />

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Metrics */}
                <div>
                  <CyclingMetrics 
                    data={data} 
                    gpsState={gpsState} 
                    isActive={isActive}
                  />
                </div>

                {/* Map Preview */}
                <div className="h-96 lg:h-auto">
                  <CyclingMap
                    gpsState={gpsState}
                    data={data}
                    isActive={isActive && !isPaused}
                    route={data.gpsPoints}
                  />
                </div>
              </div>

              {/* Live Stats Bar */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <PremiumCard glass className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {(data.currentSpeed * 3.6).toFixed(1)}
                        </div>
                        <div className="text-xs text-navy-400">km/h</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {(data.distance / 1000).toFixed(2)}
                        </div>
                        <div className="text-xs text-navy-400">km</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {Math.round(data.elevationGain)}
                        </div>
                        <div className="text-xs text-navy-400">m</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-400">
                          {data.calories}
                        </div>
                        <div className="text-xs text-navy-400">kcal</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-400">
                          {data.heartRate}
                        </div>
                        <div className="text-xs text-navy-400">bpm</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {data.cadence || 0}
                        </div>
                        <div className="text-xs text-navy-400">rpm</div>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-[calc(100vh-200px)]"
            >
              <CyclingMap
                gpsState={gpsState}
                data={data}
                isActive={isActive && !isPaused}
                route={data.gpsPoints}
                fullscreen={true}
              />
            </motion.div>
          )}

          {currentView === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CyclingMetrics 
                data={data} 
                gpsState={gpsState} 
                isActive={isActive}
                detailed={true}
              />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CyclingSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
