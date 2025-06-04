
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Circle, Triangle, Square } from 'lucide-react';

interface FloatingElementsProps {
  count?: number;
  variant?: 'sparkles' | 'geometric' | 'mixed';
  className?: string;
}

export function FloatingElements({ 
  count = 20, 
  variant = 'mixed',
  className = ''
}: FloatingElementsProps) {
  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    size: 10 + Math.random() * 20
  }));

  const getIcon = (index: number) => {
    if (variant === 'sparkles') return Sparkles;
    if (variant === 'geometric') {
      const icons = [Circle, Triangle, Square, Star];
      return icons[index % icons.length];
    }
    const icons = [Sparkles, Star, Circle, Triangle, Square];
    return icons[index % icons.length];
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element) => {
        const Icon = getIcon(element.id);
        return (
          <motion.div
            key={element.id}
            className="absolute opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon 
              size={element.size} 
              className="text-white drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
