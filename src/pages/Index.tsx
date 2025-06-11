
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivitySelection } from "@/components/ActivitySelection";
import { ActivityTimer } from "@/components/ActivityTimer";
import { useToast } from "@/hooks/use-toast";
import { useCreateActivity } from '@/hooks/useSupabaseActivities';
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { ArrowLeft, Activity, Zap, Target } from "lucide-react";

const Index = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const createActivity = useCreateActivity();

  const handleActivitySelect = (type: string) => {
    console.log('Activity selected:', type);
    
    // Redirecionar para a página específica do Pilates
    if (type === 'pilates') {
      navigate('/activities/pilates');
      return;
    }
    
    setSelectedActivity(type);
  };

  const handleActivityComplete = async (data: any) => {
    let distanceInMeters = data.distance; // Default assumption: distance is in meters

    // PremiumCyclingActivity sends distance in KM, convert to meters.
    // Other activities like PremiumGPSRunner and SwimmingActivity send in meters.
    if (data.type === 'cycling' && data.distance) {
      distanceInMeters = data.distance * 1000;
    } else if (data.type === 'swimming' && data.totalDistance) {
      // SwimmingActivity uses 'totalDistance' field for distance in meters
      distanceInMeters = data.totalDistance;
    }

    try {
      const activityToSave = {
        type: data.type, // Ensure this is Enums<'activity_type'> compatible
        duration: data.duration, // Should be in seconds
        distance: distanceInMeters || undefined,
        calories: data.calories || undefined,
        avg_heart_rate: data.avg_heart_rate || undefined,
        max_heart_rate: data.max_heart_rate || undefined,
        pace: data.pace || undefined,
        elevation_gain: data.elevation_gain || undefined,
        name: data.name || `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Activity`,
        // notes, gps_data (for metadata) could also be added if available in `data`
      };

      await createActivity.mutateAsync(activityToSave);

      setSelectedActivity(null);

      toast({
        title: "Atividade Registrada!",
        description: `${data.type} de ${Math.floor(data.duration / 60)}m${(data.duration % 60)}s registrada com sucesso no Supabase.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Registrar",
        description: "Não foi possível salvar a atividade. Tente novamente.",
        variant: "destructive",
      });
    }
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
                <span>9 modalidades disponíveis</span>
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
