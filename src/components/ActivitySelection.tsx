
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivitySelectionProps {
  onSelectActivity: (type: string) => void;
}

const activities = [
  { type: "run", label: "Corrida", icon: "🏃‍♂️", description: "GPS, pace, calorias", color: "bg-green-50 hover:bg-green-100 border-green-200" },
  { type: "cycle", label: "Ciclismo", icon: "🚴‍♂️", description: "Velocidade, elevação, mapa", color: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { type: "swim", label: "Natação", icon: "🏊‍♂️", description: "Voltas, braçadas, tempo", color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200" },
  { type: "gym", label: "Musculação", icon: "💪", description: "Séries, peso, descanso", color: "bg-orange-50 hover:bg-orange-100 border-orange-200" },
  { type: "yoga", label: "Yoga", icon: "🧘‍♀️", description: "Poses, respiração, relaxamento", color: "bg-purple-50 hover:bg-purple-100 border-purple-200" },
  { type: "dance", label: "Dança", icon: "💃", description: "Estilos, movimentos, energia", color: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
  { type: "walk", label: "Caminhada", icon: "🚶‍♂️", description: "Distância, ritmo casual", color: "bg-gray-50 hover:bg-gray-100 border-gray-200" },
  { type: "meditation", label: "Meditação", icon: "🧠", description: "Mindfulness, concentração", color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200" },
];

export function ActivitySelection({ onSelectActivity }: ActivitySelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha sua atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Button
              key={activity.type}
              onClick={() => onSelectActivity(activity.type)}
              variant="outline"
              className={`h-24 flex flex-col gap-2 hover:scale-105 transition-all ${activity.color}`}
            >
              <span className="text-3xl">{activity.icon}</span>
              <div className="text-center">
                <div className="font-medium">{activity.label}</div>
                <div className="text-xs text-gray-600">{activity.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
