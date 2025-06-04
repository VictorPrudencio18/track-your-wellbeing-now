
import { useState } from "react";
import { Plus, Minus, Square, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Exercise {
  name: string;
  sets: { reps: number; weight: number; completed: boolean }[];
}

interface GymActivityProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function GymActivity({ onComplete, onCancel }: GymActivityProps) {
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: "Supino", sets: [{ reps: 10, weight: 70, completed: false }] }
  ]);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [startTime] = useState(Date.now());

  const addExercise = () => {
    setExercises([...exercises, { 
      name: "Novo Exercício", 
      sets: [{ reps: 10, weight: 0, completed: false }] 
    }]);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
    newExercises[exerciseIndex].sets.push({ 
      reps: lastSet.reps, 
      weight: lastSet.weight, 
      completed: false 
    });
    setExercises(newExercises);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex].completed = true;
    setExercises(newExercises);
    
    // Iniciar timer de descanso
    setRestTimer(90); // 90 segundos
    setIsResting(true);
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          setIsResting(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateExercise = (exerciseIndex: number, field: string, value: any, setIndex?: number) => {
    const newExercises = [...exercises];
    if (setIndex !== undefined) {
      newExercises[exerciseIndex].sets[setIndex][field] = value;
    } else {
      newExercises[exerciseIndex][field] = value;
    }
    setExercises(newExercises);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = exercises.reduce((total, ex) => 
    total + ex.sets.filter(set => set.completed).length, 0
  );
  const workoutDuration = Math.floor((Date.now() - startTime) / 1000 / 60);

  const handleComplete = () => {
    onComplete({
      type: 'gym',
      name: 'Musculação',
      duration: workoutDuration * 60,
      exercises,
      totalSets,
      completedSets,
      calories: completedSets * 15, // Estimativa
      date: new Date()
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              💪 Musculação
            </span>
            <div className="text-sm text-gray-600">
              {completedSets}/{totalSets} séries • {workoutDuration}min
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer de Descanso */}
          {isResting && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
              <Timer className="w-6 h-6 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(restTimer)}
              </div>
              <div className="text-sm text-orange-700">Tempo de descanso</div>
            </div>
          )}

          {/* Lista de Exercícios */}
          <div className="space-y-4">
            {exercises.map((exercise, exerciseIndex) => (
              <Card key={exerciseIndex} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Input
                      value={exercise.name}
                      onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                      className="font-medium"
                      placeholder="Nome do exercício"
                    />
                    
                    {/* Séries */}
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                          <div className="text-sm font-medium w-12">
                            #{setIndex + 1}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Reps:</Label>
                            <Input
                              type="number"
                              value={set.reps}
                              onChange={(e) => updateExercise(exerciseIndex, 'reps', parseInt(e.target.value), setIndex)}
                              className="w-16 h-8"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Peso:</Label>
                            <Input
                              type="number"
                              value={set.weight}
                              onChange={(e) => updateExercise(exerciseIndex, 'weight', parseFloat(e.target.value), setIndex)}
                              className="w-20 h-8"
                            />
                            <span className="text-xs text-gray-600">kg</span>
                          </div>
                          
                          <Button
                            onClick={() => completeSet(exerciseIndex, setIndex)}
                            disabled={set.completed}
                            size="sm"
                            variant={set.completed ? "secondary" : "default"}
                          >
                            {set.completed ? "✓" : "Completar"}
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        onClick={() => addSet(exerciseIndex)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Série
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={addExercise}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Exercício
          </Button>

          {/* Controles */}
          <div className="flex gap-3">
            <Button 
              onClick={handleComplete} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={completedSets === 0}
            >
              Finalizar Treino
            </Button>
            
            <Button 
              onClick={onCancel} 
              variant="destructive"
              size="lg"
            >
              <Square className="w-5 h-5 mr-2" />
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
