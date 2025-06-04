
import { motion } from "framer-motion";
import { Award, Trophy, Star, Target, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAchievementsWithStatus } from "@/hooks/useSupabaseAchievements";
import { useAuth } from "@/hooks/useAuth";

export function AchievementsCard() {
  const { user, loading: authLoading } = useAuth();
  const { data: achievements, isLoading, error } = useAchievementsWithStatus();

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'epic':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'rare':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default:
        return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getAchievementIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'trophy':
        return Trophy;
      case 'star':
        return Star;
      case 'target':
        return Target;
      case 'award':
        return Award;
      default:
        return Award;
    }
  };

  if (authLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-navy-700 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-navy-700/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Award className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Conquistas</h3>
            <p className="text-navy-400 text-sm">Faça login para ver suas conquistas</p>
          </div>
        </div>
        <Alert className="glass-card border-accent-orange/20">
          <AlertCircle className="h-4 w-4 text-accent-orange" />
          <AlertDescription className="text-white">
            Faça login para ver suas conquistas e desbloqueios.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
            <Award className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Conquistas</h3>
            <p className="text-navy-400 text-sm">Erro ao carregar conquistas</p>
          </div>
        </div>
        <Alert className="glass-card border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-white">
            Erro ao carregar conquistas. Tente atualizar a página.
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  const unlockedAchievements = achievements?.filter(a => a.is_unlocked) || [];
  const totalAchievements = achievements?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
          <Award className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Conquistas</h3>
          <p className="text-navy-400 text-sm">
            {totalAchievements > 0 
              ? `${unlockedAchievements.length} de ${totalAchievements} desbloqueadas`
              : 'Nenhuma conquista disponível'
            }
          </p>
        </div>
      </div>

      {/* Achievements Grid */}
      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => {
            const IconComponent = getAchievementIcon(achievement.badge_icon);
            const isUnlocked = achievement.is_unlocked;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.6 + (index * 0.1) }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isUnlocked
                    ? `${getRarityColor(achievement.rarity || 'common')} border-opacity-50`
                    : 'bg-navy-800/30 border-navy-700/30 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-xl mb-3 ${
                    isUnlocked 
                      ? 'bg-accent-orange/20 border border-accent-orange/30' 
                      : 'bg-navy-700/30 border border-navy-600/30'
                  }`}>
                    <IconComponent 
                      className={`w-6 h-6 ${
                        isUnlocked ? 'text-accent-orange' : 'text-navy-500'
                      }`} 
                    />
                  </div>
                  
                  <h4 className={`font-semibold text-sm mb-1 ${
                    isUnlocked ? 'text-white' : 'text-navy-400'
                  }`}>
                    {achievement.name}
                  </h4>
                  
                  <p className={`text-xs leading-relaxed mb-2 ${
                    isUnlocked ? 'text-navy-300' : 'text-navy-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full font-medium ${getRarityColor(achievement.rarity || 'common')}`}>
                      {achievement.rarity?.toUpperCase() || 'COMUM'}
                    </span>
                    {achievement.points_reward && (
                      <span className="text-navy-400">
                        +{achievement.points_reward}pts
                      </span>
                    )}
                  </div>
                  
                  {isUnlocked && achievement.unlocked_at && (
                    <p className="text-xs text-navy-500 mt-2">
                      Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-navy-500 mx-auto mb-4" />
          <p className="text-navy-400 text-sm">
            Nenhuma conquista disponível ainda.
          </p>
          <p className="text-navy-500 text-xs mt-2">
            Continue registrando atividades para desbloquear conquistas!
          </p>
        </div>
      )}
    </motion.div>
  );
}
