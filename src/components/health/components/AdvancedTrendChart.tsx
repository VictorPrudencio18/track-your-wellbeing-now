
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdvancedTrendChartProps {
  timeRange?: string;
}

export function AdvancedTrendChart({ timeRange }: AdvancedTrendChartProps) {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Gráfico de Tendências Avançado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-navy-400">Gráfico avançado em desenvolvimento</p>
          {timeRange && (
            <p className="text-navy-500 text-sm mt-2">Período: {timeRange}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
