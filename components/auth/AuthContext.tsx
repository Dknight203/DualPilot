import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state from localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = (email: string) => {
    // In a real app, you'd verify credentials.
    // For this demo, any successful login sets the flag.
    console.log(`User logged in: ${email}`);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email); // Store user's identity
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log('User logged out');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail'); // Clear user's identity
    localStorage.removeItem('gsc_connected'); // Clear GSC connection status
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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