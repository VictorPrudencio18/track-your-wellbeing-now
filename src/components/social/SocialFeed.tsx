
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function SocialFeed() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-accent-orange" />
          Feed Social
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <div className="text-navy-400">
          <p>Feed social em desenvolvimento</p>
          <p className="text-sm mt-2">Aqui você verá atividades dos seus amigos</p>
        </div>
      </CardContent>
    </Card>
  );
}
