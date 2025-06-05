
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function UserProfileCard() {
  const { user } = useAuth();

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-accent-orange" />
          Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-accent-orange" />
          </div>
          <h3 className="text-white font-medium">{user?.email}</h3>
          <p className="text-navy-400 text-sm">Membro ativo</p>
        </div>
      </CardContent>
    </Card>
  );
}
