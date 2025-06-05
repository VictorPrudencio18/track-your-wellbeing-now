
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparativeAnalysisProps {
  timeRange?: string;
}

export function ComparativeAnalysis({ timeRange }: ComparativeAnalysisProps) {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Análise Comparativa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-navy-400">Análise comparativa em desenvolvimento</p>
          {timeRange && (
            <p className="text-navy-500 text-sm mt-2">Período: {timeRange}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
