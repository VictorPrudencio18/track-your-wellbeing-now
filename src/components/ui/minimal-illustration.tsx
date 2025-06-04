
import React from 'react';
import { motion } from 'framer-motion';

interface MinimalIllustrationProps {
  type: 'mountain' | 'wave' | 'dashboard';
  className?: string;
}

export function MinimalIllustration({ type, className = '' }: MinimalIllustrationProps) {
  if (type === 'mountain') {
    return (
      <motion.svg
        className={`w-full h-full ${className}`}
        viewBox="0 0 200 100"
        fill="none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.path
          d="M0 80 L50 40 L100 60 L150 20 L200 50 L200 100 L0 100 Z"
          fill="url(#mountainGradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />
        <motion.path
          d="M0 90 L40 70 L80 75 L120 55 L160 65 L200 45 L200 100 L0 100 Z"
          fill="url(#mountainGradient2)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  }

  if (type === 'wave') {
    return (
      <motion.svg
        className={`w-full h-full ${className}`}
        viewBox="0 0 200 100"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.path
          d="M0 50 Q50 30 100 50 T200 50 L200 100 L0 100 Z"
          fill="url(#waveGradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7 }}
        />
        <motion.path
          d="M0 65 Q40 45 80 65 T160 65 Q180 55 200 65 L200 100 L0 100 Z"
          fill="url(#waveGradient2)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </motion.svg>
    );
  }

  return null;
}
