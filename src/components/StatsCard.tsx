
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { MinimalStatsCard } from "@/components/ui/minimal-stats-card";

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
  icon, 
  trend,
  delay = 0
}: StatsCardProps) {
  // Parse trend to determine if positive/negative
  const trendMatch = trend?.match(/([+-]?\d+)/);
  const trendValue = trendMatch ? parseInt(trendMatch[1]) : undefined;
  
  return (
    <MinimalStatsCard
      title={title}
      value={value}
      icon={icon}
      trend={trendValue !== undefined ? {
        value: Math.abs(trendValue),
        isPositive: trendValue >= 0
      } : undefined}
      delay={delay}
    />
  );
}
