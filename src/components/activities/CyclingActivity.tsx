
import { useEffect } from "react";
import { Play, Pause, Square, Mountain, Gauge, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunningMap } from './premium-components/RunningMap';
import { useActivityTracker, ActivityData } from '@/hooks/useActivityTracker';
import { GPSState } from '@/hooks/useGPS';

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
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
  } = useActivityTracker('cycling');

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    // Data from the hook is already structured, might need minor adjustments for onComplete
    onComplete({
      type: 'cycle', // Ensure this matches expected type by onComplete
      name: 'Ciclismo GPS', // Or derive from activityType
      duration: data.duration,
      distance: data.distance,
      calories: data.calories,
      speed: data.avgSpeed.toFixed(1), // avgSpeed from hook
      elevation: data.elevationGain.toFixed(0), // elevationGain from hook
      date: new Date(), // Consider standardizing date handling
      gpsPoints: data.gpsPoints, // Pass GPS points if needed
      // Add other relevant data from the hook's `data` object
    });
    stopActivity(); // Make sure to call stopActivity from the hook
  };

  const handlePrimaryAction = () => {
    if (!isActive) {
      startActivity();
    } else if (isPaused) {
      resumeActivity();
    } else {
      pauseActivity();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚴‍♂️ Ciclismo GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              {formatTime(data.duration)}
            </div>
          </div>

          {/* Métricas Específicas do Ciclismo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Gauge className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {(data.currentSpeed * 3.6).toFixed(1)}
              </div>
              <div className="text-sm text-blue-700">km/h</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <MapPin className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {data.distance.toFixed(2)}
              </div>
              <div className="text-sm text-green-700">km</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Mountain className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {data.elevationGain.toFixed(0)}
              </div>
              <div className="text-sm text-yellow-700">m elevação</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-red-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-red-600">{data.calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>
          </div>

          {/* RunningMap Integration */}
          <RunningMap
            gpsState={gpsState}
            data={data}
            isActive={isActive && !isPaused}
            route={data.gpsPoints || []}
          />

          {/* Controles */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrimaryAction}
              className={`flex-1 ${!isActive || isPaused ? 'bg-green-600 hover:bg-green-700' : ''}`}
              size="lg"
              disabled={!isGPSReady && !isActive} // Disable start if GPS is not ready
            >
              {!isActive ? <Play className="w-5 h-5 mr-2" /> : isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
              {!isActive ? "Iniciar Pedalada" : isPaused ? "Retomar" : "Pausar"}
            </Button>
            
            <Button 
              onClick={data.duration > 0 ? handleComplete : () => { stopActivity(); onCancel(); }}
              variant={data.duration > 0 ? "default" : "destructive"}
              className="flex-1"
              size="lg"
            >
              <Square className="w-5 h-5 mr-2" />
              {data.duration > 0 ? "Finalizar" : "Cancelar"}
            </Button>
          </div>
          {!isGPSReady && !isActive && (
            <p className="text-center text-sm text-yellow-600">Aguardando sinal GPS para iniciar...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
