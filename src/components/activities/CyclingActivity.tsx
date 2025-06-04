
import { useState, useEffect } from "react";
import { Play, Pause, Square, Mountain, Gauge, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CyclingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function CyclingActivity({ onComplete, onCancel }: CyclingActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          const newSpeed = 15 + Math.random() * 10; // 15-25 km/h
          const newDistance = distance + (newSpeed / 3600); // km por segundo
          const newElevation = elevation + (Math.random() * 0.5); // metros
          const newCalories = Math.floor(newTime * 0.2); // ~12 cal/min

          setSpeed(newSpeed);
          setDistance(newDistance);
          setElevation(newElevation);
          setCalories(newCalories);
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, distance, elevation]);

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
      type: 'cycle',
      name: 'Ciclismo',
      duration: time,
      distance,
      calories,
      speed: speed.toFixed(1),
      elevation: elevation.toFixed(0),
      date: new Date()
    });
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
              {formatTime(time)}
            </div>
          </div>

          {/* Métricas Específicas do Ciclismo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Gauge className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {speed.toFixed(1)}
              </div>
              <div className="text-sm text-blue-700">km/h</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <MapPin className="w-6 h-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {distance.toFixed(2)}
              </div>
              <div className="text-sm text-green-700">km</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <Mountain className="w-6 h-6 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {elevation.toFixed(0)}
              </div>
              <div className="text-sm text-yellow-700">m elevação</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-red-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-red-600">{calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>
          </div>

          {/* Mapa Simulado */}
          <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Mapa da Rota</p>
              <p className="text-xs">GPS rastreando...</p>
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
                Iniciar Pedalada
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
        </CardContent>
      </Card>
    </div>
  );
}
