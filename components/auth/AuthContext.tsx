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

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (error || !data) {
        console.error("Error fetching user profile or profile not found:", error);

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
        id: data.id,
        name: data.name || supabaseUser.email || "New User",
        email: supabaseUser.email || "",
        role: "Admin",
        status: "Active",
        avatarUrl: data.avatar_url,
      } as TeamMember;
    },
    []
  );

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        // Restore existing session on first load
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        if (!cancelled) {
          setSession(session || null);

          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            if (!cancelled) {
              setUser(profile);
            }
          }
        }
      } catch (err) {
        console.error("Unexpected error during auth init:", err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    init();

    // Listen for future logins or logouts
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (cancelled) return;

      setSession(newSession);

      if (newSession?.user) {
        const profile = await fetchUserProfile(newSession.user);
        if (!cancelled) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase client not available.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
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
