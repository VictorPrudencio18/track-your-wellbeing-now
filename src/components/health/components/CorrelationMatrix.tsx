
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

const correlationData = [
  { x: 'Sono', y: 'Energia', value: 0.82, color: 'bg-green-500' },
  { x: 'Exercício', y: 'Humor', value: 0.78, color: 'bg-green-400' },
  { x: 'Stress', y: 'Sono', value: -0.65, color: 'bg-red-400' },
  { x: 'Hidratação', y: 'Energia', value: 0.45, color: 'bg-yellow-400' },
  { x: 'Exercício', y: 'Sono', value: 0.58, color: 'bg-blue-400' },
  { x: 'Humor', y: 'Energia', value: 0.72, color: 'bg-green-400' }
];

interface CorrelationMatrixProps {
  timeRange: string;
}

export function CorrelationMatrix({ timeRange }: CorrelationMatrixProps) {
  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-accent-orange" />
          Matriz de Correlações
        </CardTitle>
        <p className="text-navy-400 text-sm">
          Relacionamentos entre suas métricas de saúde
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {correlationData.map((correlation, index) => (
            <motion.div
              key={`${correlation.x}-${correlation.y}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-navy-700/30 rounded-lg"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-white font-medium">{correlation.x}</span>
                <span className="text-navy-400">↔</span>
                <span className="text-white font-medium">{correlation.y}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-20 bg-navy-600 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${correlation.color} transition-all duration-1000`}
                    style={{ width: `${Math.abs(correlation.value) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  correlation.value > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {correlation.value > 0 ? '+' : ''}{correlation.value.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-navy-700/20 rounded-lg">
          <h4 className="text-white font-medium mb-2">Interpretação:</h4>
          <div className="space-y-1 text-sm text-navy-400">
            <p>• <span className="text-green-400">Positivo</span>: As métricas aumentam juntas</p>
            <p>• <span className="text-red-400">Negativo</span>: Uma aumenta quando a outra diminui</p>
            <p>• Valores próximos de ±1 indicam correlação forte</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
