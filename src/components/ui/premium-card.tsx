
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  gradient?: 'primary' | 'secondary' | 'success' | 'accent';
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function PremiumCard({ 
  children, 
  className, 
  glass = false, 
  gradient,
  hover = true,
  delay = 0,
  onClick
}: PremiumCardProps) {
  const baseClasses = "rounded-xl border transition-all duration-300";
  
  const glassClasses = glass 
    ? "glass-card" 
    : "bg-card text-card-foreground shadow-lg";
    
  const gradientClasses = gradient 
    ? `bg-gradient-${gradient} text-white border-transparent` 
    : "";
    
  const hoverClasses = hover 
    ? "hover-lift cursor-pointer hover:shadow-2xl" 
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      onClick={onClick}
      className={cn(
        baseClasses,
        glassClasses,
        gradientClasses,
        hoverClasses,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
