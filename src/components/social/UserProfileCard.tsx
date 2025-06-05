
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { User, Trophy, Target, Calendar } from 'lucide-react';

export function UserProfileCard() {
  const { user } = useAuth();

  return (
    <Card className="glass-card border-navy-600/30 bg-navy-800/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-accent-orange" />
          Perfil do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-accent-orange" />
          </div>
          <h3 className="text-white font-bold text-lg">
            {user?.email?.split('@')[0] || 'Usuário'}
          </h3>
          <p className="text-navy-400 text-sm">{user?.email}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-navy-300 text-sm">Conquistas</span>
            </div>
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              5
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-navy-300 text-sm">Metas Concluídas</span>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              12
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-navy-300 text-sm">Sequência</span>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              7 dias
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-navy-700/30">
          <h4 className="text-white font-medium mb-3">Estatísticas da Semana</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-orange">3</div>
              <div className="text-xs text-navy-400">Exercícios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">15km</div>
              <div className="text-xs text-navy-400">Distância</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
