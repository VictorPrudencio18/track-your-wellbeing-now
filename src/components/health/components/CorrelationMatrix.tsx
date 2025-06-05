
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CorrelationMatrix() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Matriz de Correlação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-navy-400">Matriz de correlação em desenvolvimento</p>
        </div>
      </CardContent>
    </Card>
  );
}
