
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, TrendingUp } from 'lucide-react';

export function InsightsEngine() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-navy-600/30 bg-navy-800/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
              <Brain className="w-5 h-5 text-accent-orange" />
            </div>
            <CardTitle className="text-white">Motor de Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-navy-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Insights Inteligentes em Desenvolvimento
            </h3>
            <p className="text-navy-400 max-w-md mx-auto">
              Em breve nossa IA analisará seus dados de saúde para fornecer insights personalizados e recomendações inteligentes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
