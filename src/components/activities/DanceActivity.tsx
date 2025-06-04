
import { useState, useEffect } from "react";
import { Play, Pause, Square, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DanceActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const danceStyles = [
  { name: "Zumba", intensity: "Alta", icon: "💃" },
  { name: "Ballet", intensity: "Média", icon: "🩰" },
  { name: "Hip Hop", intensity: "Alta", icon: "🕺" },
  { name: "Salsa", intensity: "Média", icon: "💃" },
  { name: "Jazz", intensity: "Média", icon: "🎭" },
  { name: "Contemporâneo", intensity: "Baixa", icon: "🌟" }
];

export function DanceActivity({ onComplete, onCancel }: DanceActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState(danceStyles[0]);
  const [energy, setEnergy] = useState(100);
  const [moves, setMoves] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        
        // Simular movimentos baseado na intensidade
        const moveFrequency = selectedStyle.intensity === "Alta" ? 0.8 : 
                            selectedStyle.intensity === "Média" ? 0.6 : 0.4;
        
        if (Math.random() < moveFrequency) {
          setMoves(prevMoves => prevMoves + 1);
        }
        
        // Calcular calorias baseado na intensidade
        const caloryRate = selectedStyle.intensity === "Alta" ? 0.2 : 
                          selectedStyle.intensity === "Média" ? 0.15 : 0.1;
        setCalories(Math.floor(time * caloryRate * 60)); // cal/min
        
        // Diminuir energia gradualmente
        setEnergy(prevEnergy => Math.max(prevEnergy - 0.1, 0));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, selectedStyle, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onComplete({
      type: 'dance',
      name: `Dança - ${selectedStyle.name}`,
      duration: time,
      style: selectedStyle.name,
      moves,
      calories,
      intensity: selectedStyle.intensity,
      date: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-6 h-6" />
            Dança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção do Estilo */}
          <div className="grid grid-cols-2 gap-3">
            {danceStyles.map((style) => (
              <Button
                key={style.name}
                onClick={() => setSelectedStyle(style)}
                variant={selectedStyle.name === style.name ? "default" : "outline"}
                className="h-16 flex flex-col gap-1"
              >
                <span className="text-xl">{style.icon}</span>
                <span className="text-sm font-medium">{style.name}</span>
                <span className="text-xs text-gray-600">{style.intensity}</span>
              </Button>
            ))}
          </div>

          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-pink-600 mb-2">
              {formatTime(time)}
            </div>
            <div className="text-lg text-gray-600">
              {selectedStyle.name} - Intensidade {selectedStyle.intensity}
            </div>
          </div>

          {/* Métricas da Dança */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-pink-600 mb-2">💃</div>
              <div className="text-2xl font-bold text-pink-600">{moves}</div>
              <div className="text-sm text-pink-700">movimentos</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-red-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-red-600">{calories}</div>
              <div className="text-sm text-red-700">calorias</div>
            </div>
          </div>

          {/* Barra de Energia */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Energia</span>
              <span className="text-sm text-gray-600">{Math.floor(energy)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${energy}%` }}
              ></div>
            </div>
          </div>

          {/* Playlist Simulada */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Tocando agora:</span>
            </div>
            <div className="text-purple-700">
              "Uptown Funk" - Mark Ronson ft. Bruno Mars
            </div>
            <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
              <div 
                className="bg-purple-600 h-1 rounded-full"
                style={{ width: `${(time % 180) / 180 * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            {!isActive ? (
              <Button 
                onClick={() => setIsActive(true)} 
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Dança
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
