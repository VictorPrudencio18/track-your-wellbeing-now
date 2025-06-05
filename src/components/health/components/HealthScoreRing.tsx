
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, TrendingUp, Target } from 'lucide-react';

interface HealthScoreRingProps {
  score: number;
}

export function HealthScoreRing({ score }: HealthScoreRingProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Muito Bom';
    if (score >= 70) return 'Bom';
    if (score >= 60) return 'Regular';
    if (score >= 40) return 'Abaixo';
    return 'Crítico';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <Card className="glass-card border-navy-600/30 bg-gradient-to-br from-navy-800/70 to-navy-700/50 overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-white flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-accent-orange" />
          Score de Bem-estar
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Score Ring */}
        <div className="relative">
          <svg
            className="transform -rotate-90"
            width="200"
            height="200"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-navy-700/50"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`text-4xl font-bold ${getScoreColor(score)}`}
            >
              {score}
            </motion.div>
            <div className="text-sm text-navy-400">de 100</div>
          </div>
        </div>

        {/* Score info */}
        <div className="text-center space-y-3">
          <Badge className={`${getScoreBadgeColor(score)} px-4 py-1`}>
            {getScoreLabel(score)}
          </Badge>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <div className="text-white font-medium">+12%</div>
              <div className="text-navy-400 text-xs">vs semana passada</div>
            </div>
            <div className="text-center">
              <Target className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-white font-medium">85</div>
              <div className="text-navy-400 text-xs">meta mensal</div>
            </div>
          </div>
        </div>

        {/* Quick insights */}
        <div className="w-full space-y-2">
          <div className="text-xs text-navy-400 text-center">Principais fatores:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Sono', value: 85, color: 'bg-purple-500' },
              { label: 'Energia', value: 72, color: 'bg-yellow-500' },
              { label: 'Humor', value: 68, color: 'bg-blue-500' }
            ].map((factor) => (
              <div key={factor.label} className="flex items-center gap-2 text-xs">
                <div 
                  className={`w-2 h-2 rounded-full ${factor.color}`}
                  style={{ opacity: factor.value / 100 }}
                />
                <span className="text-navy-300">{factor.label}</span>
                <span className="text-white font-medium">{factor.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
