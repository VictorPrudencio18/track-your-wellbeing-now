
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";

interface ActivitySelectionProps {
  onSelectActivity: (type: string) => void;
}

const activities = [
  { type: "run", label: "Corrida", icon: "🏃‍♂️", description: "GPS, pace, calorias", gradient: "success" as const },
  { type: "cycle", label: "Ciclismo", icon: "🚴‍♂️", description: "Velocidade, elevação, mapa", gradient: "primary" as const },
  { type: "swim", label: "Natação", icon: "🏊‍♂️", description: "Voltas, braçadas, tempo", gradient: "primary" as const },
  { type: "gym", label: "Musculação", icon: "💪", description: "Séries, peso, descanso", gradient: "secondary" as const },
  { type: "yoga", label: "Yoga", icon: "🧘‍♀️", description: "Poses, respiração, relaxamento", gradient: "accent" as const },
  { type: "dance", label: "Dança", icon: "💃", description: "Estilos, movimentos, energia", gradient: "secondary" as const },
  { type: "walk", label: "Caminhada", icon: "🚶‍♂️", description: "Distância, ritmo casual", gradient: "success" as const },
  { type: "meditation", label: "Meditação", icon: "🧠", description: "Mindfulness, concentração", gradient: "accent" as const },
];

export function ActivitySelection({ onSelectActivity }: ActivitySelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <PremiumCard 
            glass 
            className="p-4 cursor-pointer group hover:scale-105 transition-all duration-300"
            onClick={() => onSelectActivity(activity.type)}
          >
            <div className="text-center space-y-3">
              <motion.div
                className="text-4xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activity.icon}
              </motion.div>
              
              <div>
                <h3 className="font-semibold text-lg">{activity.label}</h3>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              
              <AnimatedButton 
                variant={activity.gradient}
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectActivity(activity.type);
                }}
              >
                Iniciar
              </AnimatedButton>
            </div>
          </PremiumCard>
        </motion.div>
      ))}
    </div>
  );
}
