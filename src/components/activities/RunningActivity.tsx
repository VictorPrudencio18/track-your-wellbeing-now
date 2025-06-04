
import { useState, useEffect } from "react";
import { Play, Pause, Square, MapPin, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RunningActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function RunningActivity({ onComplete, onCancel }: RunningActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState("0:00");
  const [heartRate, setHeartRate] = useState(120);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          // Simular progresso
          const newDistance = distance + (Math.random() * 0.002 + 0.003); // ~4-6 km/h
          const newCalories = Math.floor(newTime * 0.15); // ~9 cal/min
          const currentPace = newDistance > 0 ? (newTime / 60) / newDistance : 0;
          const paceMinutes = Math.floor(currentPace);
          const paceSeconds = Math.floor((currentPace - paceMinutes) * 60);
          const newHeartRate = 120 + Math.floor(Math.random() * 40) + Math.floor(newTime / 60) * 2;

          setDistance(newDistance);
          setCalories(newCalories);
          setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`);
          setHeartRate(Math.min(newHeartRate, 180));
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, distance]);

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
    onComplete({
      type: 'run',
      name: 'Corrida',
      duration: time,
      distance,
      calories,
      pace,
      heartRate: { avg: heartRate, max: heartRate + 15 },
      date: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏃‍♂️ Corrida GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              {formatTime(time)}
            </div>
          </div>

          {/* Métricas em Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <MapPin className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {distance.toFixed(2)}
              </div>
              <div className="text-sm text-green-700">km</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Timer className="w-6 h-6 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">{pace}</div>
              <div className="text-sm text-orange-700">min/km</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <Zap className="w-6 h-6 mx-auto text-red-600 mb-2" />
              <div className="text-2xl font-bold text-red-600">{calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-purple-600 mb-2">❤️</div>
              <div className="text-2xl font-bold text-purple-600">{heartRate}</div>
              <div className="text-sm text-purple-700">bpm</div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            {!isActive ? (
              <Button 
                onClick={() => setIsActive(true)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button 
                onClick={() => setIsActive(false)} 
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </Button>
            )}
            
            <Button 
              onClick={time > 0 ? handleComplete : onCancel} 
              variant={time > 0 ? "default" : "destructive"}
              className="flex-1"
              size="lg"
            >
              <Square className="w-5 h-5 mr-2" />
              {time > 0 ? "Finalizar" : "Cancelar"}
            </Button>
          </div>

          {isActive && (
            <div className="text-center text-sm text-gray-600 animate-pulse">
              🛰️ GPS ativo - Rastreando localização...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
