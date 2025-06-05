
import { useState, useEffect } from "react";
import { Play, Pause, Square, Mountain, Gauge, MapPin, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocation } from '@/hooks/useGeolocation';
import ActivityMap from './ActivityMap';

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
  const {
    currentPosition,
    path,
    distance: gpsDistance,
    // speed: gpsSpeed, // We'll use calculatedSpeed for now
    error: geolocationError,
    isTracking,
    startTracking,
    pauseTracking,
    stopTracking,
  } = useGeolocation();

  const [time, setTime] = useState(0);
  const [elevation, setElevation] = useState(0); // Still simulated
  const [calories, setCalories] = useState(0);   // Still simulated
  const [calculatedSpeed, setCalculatedSpeed] = useState(0); // km/h

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;

          if (gpsDistance > 0 && newTime > 0) {
            setCalculatedSpeed(gpsDistance / (newTime / 3600)); // km/h
          } else {
            setCalculatedSpeed(0);
          }

          // Simulate Elevation & Calories
          setElevation(prevElevation => prevElevation + (Math.random() * 0.5));
          setCalories(Math.floor(newTime * 0.2));
          
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, gpsDistance]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTracking = () => {
    setTime(0);
    setCalories(0);
    setElevation(0);
    setCalculatedSpeed(0);
    startTracking();
  };

  const handlePauseTracking = () => {
    pauseTracking();
  };

  const handleResumeTracking = () => {
    startTracking(); // Assumes useGeolocation handles resuming
  };

  const handleStopAndCompleteActivity = () => {
    pauseTracking();
    stopTracking();
    onComplete({
      type: 'cycle',
      name: 'Ciclismo GPS',
      duration: time,
      distance: parseFloat(gpsDistance.toFixed(2)),
      calories, // Simulated
      speed: calculatedSpeed.toFixed(1), // Calculated
      elevation: elevation.toFixed(0), // Simulated
      path: path,
      date: new Date().toISOString(),
    });
  };

  const handleCancelActivity = () => {
    pauseTracking();
    stopTracking();
    onCancel();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            🚴‍♂️ Ciclismo GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Geolocation Error Display */}
          {geolocationError && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>{geolocationError}</span>
            </div>
          )}
           {!geolocationError && isTracking && (
             <div className="flex items-center justify-center gap-2 text-green-600 text-sm p-2 bg-green-50 rounded-md">
               <CheckCircle size={16} />
               <span>GPS ativo e rastreando</span>
             </div>
          )}
           {!geolocationError && !isTracking && time > 0 && (
             <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm p-2 bg-yellow-50 rounded-md">
               <Pause size={16} />
               <span>GPS pausado</span>
             </div>
          )}

          {/* Activity Map */}
          <ActivityMap path={path} currentPosition={currentPosition} height="250px" className="my-4 rounded-lg overflow-hidden border" />

          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              {formatTime(time)}
            </div>
          </div>

          {/* Métricas Específicas do Ciclismo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <Gauge className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {calculatedSpeed.toFixed(1)}
              </div>
              <div className="text-sm text-blue-700">km/h</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
              <MapPin className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {gpsDistance.toFixed(2)}
              </div>
              <div className="text-sm text-green-700">km</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
              <Mountain className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {elevation.toFixed(0)}
              </div>
              <div className="text-sm text-yellow-700">m elevação</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
              <div className="w-6 h-6 mx-auto text-red-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-red-600">{calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isTracking && time === 0 && (
              <Button 
                onClick={handleStartTracking}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Pedalada
              </Button>
            )}
            {!isTracking && time > 0 && (
              <Button
                onClick={handleResumeTracking}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retomar
              </Button>
            )}
            {isTracking && (
              <Button 
                onClick={handlePauseTracking}
                variant="outline"
                className="flex-1 border-gray-400 hover:border-gray-600"
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </Button>
            )}
            
            <Button 
              onClick={time > 0 ? handleStopAndCompleteActivity : handleCancelActivity}
              variant={time > 0 ? "default" : "destructive"}
              className={`flex-1 ${time > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
              size="lg"
              disabled={isTracking && time === 0}
            >
              <Square className="w-5 h-5 mr-2" />
              {time > 0 ? "Finalizar" : "Cancelar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
