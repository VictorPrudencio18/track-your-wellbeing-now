
import { motion } from "framer-motion";
import { Award, Trophy, Star, Target } from "lucide-react";

export function AchievementsCard() {
  const achievements = [
    {
      title: "Primeira Corrida 5K",
      description: "Completou sua primeira corrida de 5km",
      icon: Trophy,
      earned: true,
      date: "Há 2 dias"
    },
    {
      title: "Sequência de 7 dias",
      description: "Manteve atividade por 7 dias seguidos",
      icon: Star,
      earned: true,
      date: "Há 1 semana"
    },
    {
      title: "Meta de Passos",
      description: "Alcançou 10,000 passos em um dia",
      icon: Target,
      earned: true,
      date: "Ontem"
    },
    {
      title: "Maratonista",
      description: "Complete uma corrida de 21km",
      icon: Award,
      earned: false,
      progress: 60
    }
  ];

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
          <p className="text-navy-400 text-sm">3 de 4 desbloqueadas</p>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.6 + (index * 0.1) }}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              achievement.earned 
                ? 'bg-accent-orange/10 border-accent-orange/30' 
                : 'bg-navy-800/30 border-navy-700/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg border ${
                achievement.earned 
                  ? 'bg-accent-orange/20 border-accent-orange/30' 
                  : 'bg-navy-700/50 border-navy-600/50'
              }`}>
                <achievement.icon className={`w-4 h-4 ${
                  achievement.earned ? 'text-accent-orange' : 'text-navy-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${achievement.earned ? 'text-white' : 'text-navy-300'}`}>
                    {achievement.title}
                  </span>
                  {achievement.earned && (
                    <span className="text-xs text-accent-orange bg-accent-orange/20 px-2 py-1 rounded-full">
                      {achievement.date}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-navy-400 mb-2">
                  {achievement.description}
                </p>
                
                {!achievement.earned && achievement.progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-navy-500">Progresso</span>
                      <span className="text-navy-400">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-navy-700/50 rounded-full h-2">
                      <motion.div
                        className="h-full bg-navy-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 1.8 + (index * 0.1) }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
