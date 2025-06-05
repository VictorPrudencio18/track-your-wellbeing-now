
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, TrendingUp } from 'lucide-react';

export function GoalsManager() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-navy-600/30 bg-navy-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                <Target className="w-5 h-5 text-accent-orange" />
              </div>
              <CardTitle className="text-white">Gerenciador de Metas</CardTitle>
            </div>
            <Button size="sm" className="bg-accent-orange hover:bg-accent-orange/80">
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-navy-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Sistema de Metas em Desenvolvimento
            </h3>
            <p className="text-navy-400 max-w-md mx-auto">
              Em breve você poderá definir e acompanhar suas metas de saúde e bem-estar de forma inteligente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
