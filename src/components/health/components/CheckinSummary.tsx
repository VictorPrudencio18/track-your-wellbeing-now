
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, TrendingUp, Calendar } from 'lucide-react';

interface CheckinSummaryProps {
  onRestart: () => void;
}

export function CheckinSummary({ onRestart }: CheckinSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-green-500/30 bg-gradient-to-r from-green-800/20 to-green-700/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <CardTitle className="text-white text-2xl">
            Check-in Concluído! ✨
          </CardTitle>
          <p className="text-navy-400">
            Obrigado por compartilhar como você está se sentindo hoje
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-xs text-navy-400">Completo</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-400">7</div>
              <div className="text-xs text-navy-400">Dias seguidos</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-400">85</div>
              <div className="text-xs text-navy-400">Score médio</div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onRestart}
              variant="outline"
              className="flex-1 border-navy-600 text-navy-300 hover:bg-navy-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Fazer Outro
            </Button>
            <Button
              className="flex-1 bg-accent-orange hover:bg-accent-orange/80"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
