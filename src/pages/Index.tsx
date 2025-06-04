
import { motion } from "framer-motion";
import { useState } from "react";
import { ActivitySelection } from "@/components/ActivitySelection";
import { ActivityTimer } from "@/components/ActivityTimer";
import { useToast } from "@/hooks/use-toast";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { ArrowLeft, Activity, Zap, Target } from "lucide-react";

const Index = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { toast } = useToast();

  const handleActivitySelect = (type: string) => {
    setSelectedActivity(type);
  };

  const handleActivityComplete = (data: any) => {
    const newActivity = {
      id: Date.now().toString(),
      type: data.type,
      duration: `${Math.floor(data.duration / 60)}:${(data.duration % 60).toString().padStart(2, '0')}`,
      distance: data.distance ? `${data.distance.toFixed(1)} km` : undefined,
      date: "Agora",
      calories: Math.floor(data.duration * 5)
    };

    setSelectedActivity(null);
    
    toast({
      title: "Atividade concluída! 🎉",
      description: `${data.type} de ${newActivity.duration} registrada com sucesso.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 max-w-7xl mx-auto"
    >
      {/* Hero Header - Mais limpo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <PremiumCard glass className="p-12 border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-transparent" />
          <div className="relative z-10">
            <motion.h1 
              className="text-6xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Suas Atividades 🚀
            </motion.h1>
            <motion.p 
              className="text-xl text-navy-400 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Escolha uma atividade e comece seu treino agora mesmo
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8"
            >
              <div className="flex items-center gap-3 text-sm text-navy-400">
                <Activity className="w-5 h-5 text-accent-orange" />
                <span>8 modalidades disponíveis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-navy-400">
                <Zap className="w-5 h-5 text-accent-orange" />
                <span>Tracking em tempo real</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-navy-400">
                <Target className="w-5 h-5 text-accent-orange" />
                <span>Metas personalizadas</span>
              </div>
            </motion.div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Activity Selection or Timer */}
      {selectedActivity ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PremiumCard glass className="p-12">
            <div className="flex items-center justify-between mb-8">
              <motion.h2 
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Nova Atividade
              </motion.h2>
              <AnimatedButton 
                variant="outline"
                onClick={() => setSelectedActivity(null)}
                className="flex items-center gap-2 glass-card border-navy-600 hover:border-accent-orange/50"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </AnimatedButton>
            </div>
            <ActivityTimer 
              activityType={selectedActivity}
              onActivityComplete={handleActivityComplete}
            />
          </PremiumCard>
        </motion.div>
      ) : (
        <StaggerContainer>
          <PremiumCard glass className="p-12">
            <motion.h2 
              className="text-4xl font-bold text-white mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Escolha sua Atividade
            </motion.h2>
            <ActivitySelection onSelectActivity={handleActivitySelect} />
          </PremiumCard>
        </StaggerContainer>
      )}
    </motion.div>
  );
};

export default Index;
