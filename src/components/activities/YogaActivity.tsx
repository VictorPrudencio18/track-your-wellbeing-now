
import { useState, useEffect } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface YogaActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const yogaPoses = [
  "Postura da Montanha",
  "Saudação ao Sol",
  "Postura do Guerreiro I",
  "Postura do Guerreiro II",
  "Postura da Árvore",
  "Postura do Cão Olhando para Baixo",
  "Postura da Cobra",
  "Postura da Criança",
  "Postura do Lótus",
  "Relaxamento Final"
];

export function YogaActivity({ onComplete, onCancel }: YogaActivityProps) {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [yogaType, setYogaType] = useState("Hatha Yoga");
  const [breathingRate, setBreathingRate] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        setPoseTime(prevPoseTime => {
          const newPoseTime = prevPoseTime + 1;
          
          // Mudar pose a cada 60 segundos
          if (newPoseTime >= 60 && currentPoseIndex < yogaPoses.length - 1) {
            setCurrentPoseIndex(prev => prev + 1);
            return 0;
          }
          
          return newPoseTime;
        });
        
        // Simular respiração (respirações por minuto)
        if (time % 4 === 0) {
          setBreathingRate(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentPoseIndex, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextPose = () => {
    if (currentPoseIndex < yogaPoses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
      setPoseTime(0);
    }
  };

  const previousPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(currentPoseIndex - 1);
      setPoseTime(0);
    }
  };

  const handleComplete = () => {
    onComplete({
      type: 'yoga',
      name: yogaType,
      duration: time,
      poses: currentPoseIndex + 1,
      calories: Math.floor(time * 0.05), // ~3 cal/min
      breathingRate: Math.floor((breathingRate / time) * 60),
      date: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧘‍♀️ {yogaType}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção do Tipo */}
          <div className="grid grid-cols-2 gap-2">
            {["Hatha Yoga", "Vinyasa", "Yin Yoga", "Ashtanga"].map((type) => (
              <Button
                key={type}
                onClick={() => setYogaType(type)}
                variant={yogaType === type ? "default" : "outline"}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Timer Principal */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-purple-600 mb-2">
              {formatTime(time)}
            </div>
          </div>

          {/* Pose Atual */}
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <div className="text-lg font-medium text-purple-900 mb-2">
              Pose {currentPoseIndex + 1} de {yogaPoses.length}
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-3">
              {yogaPoses[currentPoseIndex]}
            </div>
            <div className="text-lg text-purple-700">
              {formatTime(poseTime)} nesta pose
            </div>
            
            <div className="flex gap-2 mt-4 justify-center">
              <Button 
                onClick={previousPose} 
                disabled={currentPoseIndex === 0}
                variant="outline"
                size="sm"
              >
                ← Pose Anterior
              </Button>
              <Button 
                onClick={nextPose} 
                disabled={currentPoseIndex === yogaPoses.length - 1}
                variant="outline"
                size="sm"
              >
                Próxima Pose →
              </Button>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-green-600 mb-2">🌬️</div>
              <div className="text-2xl font-bold text-green-600">
                {Math.floor((breathingRate / time) * 60) || 0}
              </div>
              <div className="text-sm text-green-700">respirações/min</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="w-6 h-6 mx-auto text-orange-600 mb-2">🔥</div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.floor(time * 0.05)}
              </div>
              <div className="text-sm text-orange-700">calorias</div>
            </div>
          </div>

          {/* Guia de Respiração */}
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-sm text-blue-800 mb-2">💨 Guia de Respiração</div>
            <div className="text-lg font-medium text-blue-600">
              Inspire por 4s → Segure por 4s → Expire por 6s
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            {!isActive ? (
              <Button 
                onClick={() => setIsActive(true)} 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Sessão
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
