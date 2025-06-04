
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { toast } from '@/hooks/use-toast';

export function AuthButton() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        toast({
          title: "Erro",
          description: "Erro ao fazer logout. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi deslogado com sucesso!",
        });
      }
    } catch (error: any) {
      console.error('Unexpected signout error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Carregando...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Olá, {user.user_metadata?.full_name || user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
        <User className="w-4 h-4 mr-2" />
        Entrar
      </Button>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
