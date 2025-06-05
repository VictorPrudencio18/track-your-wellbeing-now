
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, TrendingUp, Settings } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start border-navy-600 text-navy-300 hover:bg-navy-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Check-in
        </Button>
        <Button variant="outline" className="w-full justify-start border-navy-600 text-navy-300 hover:bg-navy-700">
          <Calendar className="w-4 h-4 mr-2" />
          Ver Histórico
        </Button>
        <Button variant="outline" className="w-full justify-start border-navy-600 text-navy-300 hover:bg-navy-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Análise Detalhada
        </Button>
        <Button variant="outline" className="w-full justify-start border-navy-600 text-navy-300 hover:bg-navy-700">
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </Button>
      </CardContent>
    </Card>
  );
}
