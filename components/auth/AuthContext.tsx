import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { TeamMember } from "../../types";
import { supabase } from "../../supabaseClient";

interface AuthContextType {
  isAuthenticated: boolean;
  user: TeamMember | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  session: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(
    async (supabaseUser: any): Promise<TeamMember | null> => {
      if (!supabase || !supabaseUser) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error || !profile) {
        console.error("Error fetching user profile or profile not found:", error);

        // Fallback so the app never crashes for new users
        return {
          id: supabaseUser.id,
          name: supabaseUser.email || "New User",
          email: supabaseUser.email || "",
          role: "Admin",
          status: "Active",
          avatarUrl: undefined,
        } as TeamMember;
      }

      return {
        id: profile.id,
        name: profile.name || supabaseUser.email || "New User",
        email: supabaseUser.email || "",
        role: "Admin",
        status: "Active",
        avatarUrl: profile.avatar_url,
      } as TeamMember;
    },
    []
  );

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const initAuth = async () => {
      try {
        // 1. Explicitly restore any existing session on page load
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }

        if (data?.session && isMounted) {
          setSession(data.session);
          const profile = await fetchUserProfile(data.session.user);
          if (!isMounted) return;
          setUser(profile);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // 2. Subscribe for future auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        const profile = await fetchUserProfile(newSession.user);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not available.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // onAuthStateChange will update session and user
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.removeItem("activeSiteId");
    localStorage.removeItem("gsc_connected");
  };

  const refreshUser = async () => {
    if (session?.user) {
      const profile = await fetchUserProfile(session.user);
      setUser(profile);
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!session?.user,
    user,
    login,
    logout,
    refreshUser,
    session,
  };

  if (isLoading) {
    // Render a simple loading state instead of a hard blank
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm">Loading your account…</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
