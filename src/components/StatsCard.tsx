
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { CountUp } from "@/components/animations/count-up";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  gradientClass?: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  gradientClass = "bg-gradient-primary",
  delay = 0
}: StatsCardProps) {
  const numericValue = parseInt(value.replace(/[^\d]/g, '')) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <PremiumCard 
        glass 
        hover 
        className="overflow-hidden group"
      >
        <div className={`${gradientClass} p-6 text-white relative`}>
          <motion.div
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <p className="text-white/90 text-sm font-medium mb-2">{title}</p>
              <p className="text-3xl font-bold">
                <CountUp 
                  end={numericValue} 
                  suffix={value.replace(/[\d]/g, '')}
                  duration={2}
                />
              </p>
              {trend && (
                <p className="text-white/80 text-xs mt-2">{trend}</p>
              )}
            </div>
            
            <motion.div
              className="p-3 bg-white/20 rounded-full"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
}
