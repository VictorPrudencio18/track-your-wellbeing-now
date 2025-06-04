
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useDarkMode();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const getNextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const Icon = themeIcons[theme];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(getNextTheme())}
      className="relative overflow-hidden"
    >
      <motion.div
        key={theme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="h-4 w-4" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-primary opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
      
      <span className="sr-only">
        Alternar tema - Atual: {theme}
      </span>
    </Button>
  );
}
