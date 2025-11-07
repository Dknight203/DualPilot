import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TeamMember } from '../../types';
import { getCurrentUser } from '../../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: TeamMember | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
      const storedEmail = localStorage.getItem('userEmail');
      if (storedAuth && storedEmail) {
        try {
          const userData = await getCurrentUser(storedEmail);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
             // Handle case where user in local storage is not in DB
             logout();
          }
        } catch (error) {
            console.error("Failed to fetch logged in user data", error);
            logout(); // Log out on error
        }
      }
      setIsLoading(false);
    };
    checkLoggedInUser();
  }, []);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('gsc_connected');
    setIsAuthenticated(false);
  };
  
  // Don't render children until we've checked for an active session
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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