
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivitySelectionProps {
  onSelectActivity: (type: string) => void;
}

const activities = [
  { type: "run", label: "Corrida", icon: "🏃‍♂️", color: "gradient-secondary" },
  { type: "cycle", label: "Ciclismo", icon: "🚴‍♂️", color: "gradient-primary" },
  { type: "yoga", label: "Yoga", icon: "🧘‍♀️", color: "gradient-accent" },
  { type: "walk", label: "Caminhada", icon: "🚶‍♂️", color: "gradient-success" },
];

export function ActivitySelection({ onSelectActivity }: ActivitySelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha sua atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity) => (
            <Button
              key={activity.type}
              onClick={() => onSelectActivity(activity.type)}
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:scale-105 transition-transform"
            >
              <span className="text-2xl">{activity.icon}</span>
              <span className="font-medium">{activity.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
