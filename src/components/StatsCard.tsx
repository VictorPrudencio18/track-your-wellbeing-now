
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  gradientClass: string;
}

export function StatsCard({ title, value, icon: Icon, trend, gradientClass }: StatsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className={`${gradientClass} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <p className="text-white/90 text-xs mt-1">{trend}</p>
              )}
            </div>
            <Icon className="w-8 h-8 text-white/90" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
