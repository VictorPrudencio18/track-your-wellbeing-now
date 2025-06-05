
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingWizard } from './OnboardingWizard';

interface OnboardingCheckProps {
  children: React.ReactNode;
}

export function OnboardingCheck({ children }: OnboardingCheckProps) {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      return;
    }

    checkOnboardingStatus();
  }, [user, authLoading]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    try {
      // Verificar se o perfil tem onboarding_completed
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        setLoading(false);
        return;
      }

      if (!profile?.onboarding_completed) {
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-orange"></div>
      </div>
    );
  }

  if (user && needsOnboarding) {
    return <OnboardingWizard />;
  }

  return <>{children}</>;
}
