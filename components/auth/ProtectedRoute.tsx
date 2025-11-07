import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const restrictedPathsForMembers = ['/settings', '/admin'];

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Role-based access control
  if (user?.role === 'Member' && restrictedPathsForMembers.includes(location.pathname)) {
     return <Navigate 
                to="/dashboard" 
                replace 
                state={{ 
                    toast: { 
                        message: 'You do not have permission to access that page.', 
                        type: 'error' 
                    } 
                }} 
            />;
  }

  return <Outlet />;
};

export default ProtectedRoute;