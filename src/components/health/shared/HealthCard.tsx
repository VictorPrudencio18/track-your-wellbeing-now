
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface HealthCardProps {
  title: string;
  children: ReactNode;
  icon?: LucideIcon;
  delay?: number;
  className?: string;
}

export function HealthCard({ title, children, icon: Icon, delay = 0, className = "" }: HealthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card rounded-2xl p-6 border-navy-600/30 bg-navy-800/50 hover-lift ${className}`}
    >
      <div className="flex items-center gap-3 mb-6">
        {Icon && (
          <div className="p-3 bg-accent-orange/10 rounded-xl">
            <Icon className="w-6 h-6 text-accent-orange" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
