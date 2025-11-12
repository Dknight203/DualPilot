import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { TeamMember } from '../../types';
import { supabase } from '../../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: TeamMember | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (supabaseUser: User) => {
    if (!supabase) return null;
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    // In a real app, role would come from team_memberships, but for now we'll default it.
    // This simplifies the initial auth implementation.
    return {
      id: profile.id,
      name: profile.name || supabaseUser.email || 'New User',
      email: supabaseUser.email || '',
      role: 'Admin', // Default role for now
      status: 'Active',
      avatarUrl: profile.avatar_url,
    } as TeamMember;
  };

  useEffect(() => {
    if (!supabase) {
        setIsLoading(false);
        return;
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!supabase) throw new Error("Supabase client not available.");
    if (!password) throw new Error("Password is required for email login.");
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // The onAuthStateChange listener will handle setting the user state.
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Clear any local storage that might persist
    localStorage.removeItem('activeSiteId');
    localStorage.removeItem('gsc_connected');
  };

  const refreshUser = async () => {
    if (session?.user) {
      const profile = await fetchUserProfile(session.user);
      setUser(profile);
    }
  };

  const value = {
    isAuthenticated: !!session?.user,
    user,
    login,
    logout,
    refreshUser,
    session
  };
  
  // Render children immediately, auth state will update and trigger re-renders.
  // The initial isLoading state can be removed or handled differently if a loading screen is desired.
  if (isLoading) {
    return null; // Or a global loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};