import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../common/Button';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const navLinkClasses = "text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors";

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex-shrink-0 text-brand-blue text-2xl font-bold">
              DualPilot
            </NavLink>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/pricing" className={navLinkClasses}>Pricing</NavLink>
              <NavLink to="/scan" className={navLinkClasses}>Free Scan</NavLink>
              {isAuthenticated && (
                <NavLink to="/dashboard" className={navLinkClasses}>Dashboard</NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
             {isAuthenticated ? (
                <>
                  <NavLink to="/settings" className={`${navLinkClasses} hidden sm:block`}>Settings</NavLink>
                  <Button onClick={handleLogout} variant="outline" size="sm">Log Out</Button>
                </>
             ) : (
                <>
                  <NavLink to="/login" className={`${navLinkClasses} hidden sm:block`}>Log In</NavLink>
                  <NavLink to="/signup">
                    <Button 
                      variant="primary" 
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </NavLink>
                </>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;