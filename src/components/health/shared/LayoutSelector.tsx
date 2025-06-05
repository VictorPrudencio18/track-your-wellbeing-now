
import { motion } from 'framer-motion';
import { Calendar, Grid3X3, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type LayoutType = 'carousel' | 'monthly-heatmap' | 'yearly-heatmap';

interface LayoutSelectorProps {
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  const layouts = [
    {
      id: 'carousel' as LayoutType,
      label: 'Últimos Dias',
      icon: Calendar,
      description: 'Vista linear dos últimos dias'
    },
    {
      id: 'monthly-heatmap' as LayoutType,
      label: 'Mês Atual',
      icon: Grid3X3,
      description: 'Mapa de calor mensal'
    },
    {
      id: 'yearly-heatmap' as LayoutType,
      label: 'Ano Atual',
      icon: BarChart3,
      description: 'Vista anual resumida'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {layouts.map((layout) => {
        const Icon = layout.icon;
        const isSelected = selectedLayout === layout.id;
        
        return (
          <motion.div
            key={layout.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onLayoutChange(layout.id)}
              className={`
                glass-card border-navy-600/30 transition-all duration-200
                ${isSelected 
                  ? 'bg-accent-orange text-navy-900 border-accent-orange/50 shadow-lg' 
                  : 'bg-navy-800/50 text-white hover:bg-navy-700/50 border-navy-600/30'
                }
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              {layout.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}
