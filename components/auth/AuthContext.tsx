import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { TeamMember } from '../../types';
import { getCurrentUser } from '../../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: TeamMember | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('gsc_connected');
    setIsAuthenticated(false);
  }, []);

  const fetchUser = useCallback(async () => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedEmail = localStorage.getItem('userEmail');
    if (storedAuth && storedEmail) {
      try {
        const userData = await getCurrentUser(storedEmail);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch logged in user data", error);
        logout();
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string) => {
    const userData = await getCurrentUser(email);
    if (userData) {
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      setIsAuthenticated(true);
    } else {
        throw new Error("User data could not be found.");
    }
  };

  const refreshUser = async () => {
    // This is the corrected logic. It re-fetches user data without
    // setting the global `isLoading` state, which was causing the entire
    // application to unmount and preventing the toast from appearing.
    const storedEmail = localStorage.getItem('userEmail');
    if (isAuthenticated && storedEmail) {
        try {
            const userData = await getCurrentUser(storedEmail);
            if (userData) {
                setUser(userData); // This will cause components using the user object to re-render gracefully.
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to refresh user data during update.", error);
            // Optionally, you could show a toast here about the refresh failing
        }
    }
  }
  
  if (isLoading) {
    return null; // This is for the initial app load only.
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshUser }}>
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