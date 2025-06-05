
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  progress?: number;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  unit, 
  subtitle, 
  icon: Icon, 
  color = "text-accent-orange",
  progress,
  delay = 0 
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 border-navy-600/30 bg-navy-800/50 hover-lift"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-orange/10 rounded-xl">
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-navy-400">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{value}</span>
              {unit && <span className="text-sm text-navy-400">{unit}</span>}
            </div>
            {subtitle && <p className="text-xs text-navy-500">{subtitle}</p>}
          </div>
        </div>
      </div>
      
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-navy-400">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-navy-700/50 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange/80"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, delay: delay + 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
