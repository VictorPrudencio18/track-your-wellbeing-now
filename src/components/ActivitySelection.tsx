
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";

interface ActivitySelectionProps {
  onSelectActivity: (type: string) => void;
}

const activities = [
  { type: "run", label: "Corrida", icon: "🏃‍♂️", description: "GPS, pace, calorias" },
  { type: "cycle", label: "Ciclismo", icon: "🚴‍♂️", description: "Velocidade, elevação, mapa" },
  { type: "walk", label: "Caminhada", icon: "🚶‍♂️", description: "Distância, ritmo casual" },
  { type: "meditation", label: "Meditação", icon: "🧠", description: "Mindfulness, concentração" },
  { type: "pilates", label: "Pilates", icon: "🧘‍♀️", description: "Fortaleça seu core e melhore sua postura" },
  { type: "hits", label: "HITS", icon: "🔥", description: "Treino intervalado de alta intensidade" }
];

export function ActivitySelection({ onSelectActivity }: ActivitySelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="glass-card rounded-2xl p-6 cursor-pointer group hover:bg-accent-orange/5 transition-all duration-300 border border-navy-600/30 hover:border-accent-orange/30">
            <div className="text-center space-y-4">
              <motion.div
                className="text-5xl mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {activity.icon}
              </motion.div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-white">{activity.label}</h3>
                <p className="text-sm text-navy-400">{activity.description}</p>
              </div>
              
              <AnimatedButton 
                variant="default"
                size="sm"
                className="w-full bg-accent-orange hover:bg-accent-orange/80 text-navy-900 font-medium border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectActivity(activity.type);
                }}
              >
                Iniciar
              </AnimatedButton>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
