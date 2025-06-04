
import { useState, useEffect } from "react";
import { Play, Square, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityTimerProps {
  activityType: string;
  onActivityComplete: (data: {
    type: string;
    duration: number;
    distance?: number;
    coordinates?: Array<{ lat: number; lng: number; timestamp: number }>;
  }) => void;
}

export function ActivityTimer({ activityType, onActivityComplete }: ActivityTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coordinates, setCoordinates] = useState<Array<{ lat: number; lng: number; timestamp: number }>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
        
        // Simular rastreamento GPS para atividades com movimento
        if (activityType === "run" || activityType === "cycle" || activityType === "walk") {
          const newDistance = distance + (Math.random() * 0.1); // Simular movimento
          setDistance(newDistance);
          
          // Adicionar coordenadas simuladas
          const newCoord = {
            lat: -23.5505 + (Math.random() - 0.5) * 0.01,
            lng: -46.6333 + (Math.random() - 0.5) * 0.01,
            timestamp: Date.now()
          };
          setCoordinates(prev => [...prev, newCoord]);
        }
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, distance, activityType]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startActivity = () => {
    setIsActive(true);
  };

  const stopActivity = () => {
    setIsActive(false);
    onActivityComplete({
      type: activityType,
      duration: time,
      distance: distance > 0 ? distance : undefined,
      coordinates: coordinates.length > 0 ? coordinates : undefined
    });
    
    // Reset
    setTime(0);
    setDistance(0);
    setCoordinates([]);
  };

  const hasGPS = activityType === "run" || activityType === "cycle" || activityType === "walk";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center capitalize">
          {activityType === "run" && "🏃‍♂️ Corrida"}
          {activityType === "cycle" && "🚴‍♂️ Ciclismo"}
          {activityType === "yoga" && "🧘‍♀️ Yoga"}
          {activityType === "walk" && "🚶‍♂️ Caminhada"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2">
            {formatTime(time)}
          </div>
          {hasGPS && (
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{distance.toFixed(2)} km</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          {!isActive ? (
            <Button 
              onClick={startActivity} 
              className="flex-1 gradient-primary text-white hover:opacity-90"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar
            </Button>
          ) : (
            <Button 
              onClick={stopActivity} 
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <Square className="w-5 h-5 mr-2" />
              Parar
            </Button>
          )}
        </div>
        
        {isActive && (
          <div className="text-center text-sm text-gray-600 animate-pulse">
            Atividade em andamento...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
