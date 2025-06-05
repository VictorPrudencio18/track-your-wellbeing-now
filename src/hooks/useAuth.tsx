
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;

      setState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        initialized: true,
      });

      // Handle successful OAuth redirects
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully:', session.user.email);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        console.log('Initial session:', session?.user?.email);
        
        if (!mounted) return;

        setState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          initialized: true,
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (!mounted) return;
        
        setState({
          user: null,
          session: null,
          loading: false,
          initialized: true,
        });
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    ...state,
    signOut,
  };
}
