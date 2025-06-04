
import { motion } from "framer-motion";
import { Target, CheckCircle, Clock } from "lucide-react";

export function WeeklyGoalsCard() {
  const goals = [
    { name: "Correr 5km", progress: 80, completed: false },
    { name: "30min yoga", progress: 100, completed: true },
    { name: "10k passos", progress: 87, completed: false },
    { name: "Beber 2L água", progress: 100, completed: true },
    { name: "Treino força", progress: 60, completed: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      className="glass-card rounded-3xl p-8 hover-lift border border-navy-600/20 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
          <Target className="w-5 h-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Metas Semanais</h3>
          <p className="text-navy-400 text-sm">3 de 5 concluídas</p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + (index * 0.1) }}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              goal.completed 
                ? 'bg-accent-orange/10 border-accent-orange/30' 
                : 'bg-navy-800/30 border-navy-700/30 hover:border-navy-600/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {goal.completed ? (
                  <CheckCircle className="w-5 h-5 text-accent-orange" />
                ) : (
                  <Clock className="w-5 h-5 text-navy-400" />
                )}
                <span className={`font-medium ${goal.completed ? 'text-white' : 'text-navy-300'}`}>
                  {goal.name}
                </span>
              </div>
              <span className={`text-sm font-bold ${goal.completed ? 'text-accent-orange' : 'text-navy-400'}`}>
                {goal.progress}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-navy-700/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  goal.completed ? 'bg-accent-orange' : 'bg-navy-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, delay: 1.4 + (index * 0.1) }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
