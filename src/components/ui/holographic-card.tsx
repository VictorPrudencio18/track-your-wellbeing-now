
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'neon' | 'cosmic';
  interactive?: boolean;
  glow?: boolean;
}

export function HolographicCard({ 
  children, 
  className, 
  variant = 'default',
  interactive = true,
  glow = false
}: HolographicCardProps) {
  const variants = {
    default: "card-holographic",
    premium: "glass-card-premium",
    neon: "border-2 border-cyan-400 bg-black/50 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.3)]",
    cosmic: "bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20 backdrop-blur-xl border border-white/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={interactive ? { 
        scale: 1.02, 
        y: -4,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      } : {}}
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-500",
        variants[variant],
        glow && "hover:shadow-glow",
        interactive && "cursor-pointer",
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {variant === 'cosmic' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
      )}
      
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-0 transition-opacity duration-500"
          whileHover={{ opacity: 1 }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {interactive && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0"
          whileHover={{ 
            opacity: 1,
            x: ['-100%', '100%'],
            transition: { duration: 0.6, ease: "easeInOut" }
          }}
        />
      )}
    </motion.div>
  );
}
