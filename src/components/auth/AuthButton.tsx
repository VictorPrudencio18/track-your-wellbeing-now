
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { toast } from '@/hooks/use-toast';

export function AuthButton() {
  const { user, loading, initialized } = useAuth();
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

  // Show loading while auth is being initialized
  if (!initialized || loading) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        disabled
        className="glass-card-subtle border-navy-700"
      >
        Carregando...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-navy-400 hidden sm:block">
          Olá, {user.user_metadata?.full_name || user.email}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className="glass-card-subtle border-navy-700 hover:border-accent-orange/50 hover:bg-accent-orange/10 text-white"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Sair</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowAuthModal(true)}
        className="glass-card-subtle border-navy-700 hover:border-accent-orange/50 hover:bg-accent-orange/10 text-white"
      >
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
