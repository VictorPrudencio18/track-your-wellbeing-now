
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PatternAnalysis() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Análise de Padrões</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-navy-400">Análise de padrões em desenvolvimento</p>
        </div>
      </CardContent>
    </Card>
  );
}
