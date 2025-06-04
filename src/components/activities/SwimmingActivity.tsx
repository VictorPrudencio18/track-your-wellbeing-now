
import { useState, useEffect } from "react";
import { Play, Pause, Square, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SwimmingActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function SwimmingActivity({ onComplete, onCancel }: SwimmingActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [currentLapTime, setCurrentLapTime] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        setCurrentLapTime(prevLapTime => prevLapTime + 1);
        setStrokes(prevStrokes => prevStrokes + Math.random() > 0.7 ? 1 : 0); // Braçadas simuladas
        setCalories(prevCalories => Math.floor(time * 0.25)); // ~15 cal/min
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const completeLap = () => {
    setLaps(prevLaps => prevLaps + 1);
    setLapTimes(prevTimes => [...prevTimes, currentLapTime]);
    setCurrentLapTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const averageLapTime = lapTimes.length > 0 
    ? lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length 
    : 0;

  const handleComplete = () => {
    onComplete({
      type: 'swim',
      name: 'Natação',
      duration: time,
      laps,
      strokes,
      calories,
      averageLapTime: formatTime(Math.floor(averageLapTime)),
      date: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏊‍♂️ Natação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-2">
              {formatTime(time)}
            </div>
            <div className="text-lg text-gray-600">
              Volta atual: {formatTime(currentLapTime)}
            </div>
          </div>

          {/* Métricas da Natação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Waves className="w-6 h-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">{laps}</div>
              <div className="text-sm text-blue-700">voltas (25m)</div>
            </div>

            <div className="bg-cyan-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-cyan-600 mb-2">🏊</div>
              <div className="text-2xl font-bold text-cyan-600">{strokes}</div>
              <div className="text-sm text-cyan-700">braçadas</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-green-600 mb-2">⏱️</div>
              <div className="text-2xl font-bold text-green-600">
                {formatTime(Math.floor(averageLapTime))}
              </div>
              <div className="text-sm text-green-700">tempo médio/volta</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-red-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-red-600">{calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>
          </div>

          {/* Últimas Voltas */}
          {lapTimes.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Últimas voltas:</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {lapTimes.slice(-6).map((lapTime, index) => (
                  <div key={index} className="bg-white p-2 rounded text-center">
                    Volta {lapTimes.length - 5 + index}: {formatTime(lapTime)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex gap-3">
            {!isActive ? (
              <Button 
                onClick={() => setIsActive(true)} 
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Natação
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setIsActive(false)} 
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </Button>
                
                <Button 
                  onClick={completeLap} 
                  variant="secondary"
                  className="flex-1"
                  size="lg"
                >
                  <Waves className="w-5 h-5 mr-2" />
                  Completar Volta
                </Button>
              </>
            )}
            
            <Button 
              onClick={time > 0 ? handleComplete : onCancel} 
              variant={time > 0 ? "default" : "destructive"}
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
