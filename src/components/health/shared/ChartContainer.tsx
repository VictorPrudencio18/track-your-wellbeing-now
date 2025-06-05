
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
}

export function ChartContainer({ title, subtitle, children, delay = 0 }: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass-card rounded-2xl p-6 border-navy-600/30 bg-navy-800/50"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-navy-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}
