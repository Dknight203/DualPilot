'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// FIX: Refactored NavLinkItem to use an interface and React.FC to resolve type errors.
interface NavLinkItemProps {
    href: string;
    children: React.ReactNode;
}
const NavLinkItem: React.FC<NavLinkItemProps> = ({ href, children }) => (
  <Link href={href} className="text-base font-medium text-gray-600 hover:text-brand-blue transition-colors">
      {children}
  </Link>
);

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // TODO: Replace with a more robust auth check (e.g., from a context or a hook that verifies a token)
    const session = localStorage.getItem('dp_session');
    setIsAuthenticated(!!session);
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem('dp_session');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 text-brand-blue text-2xl font-bold">
              DualPilot
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <NavLinkItem href="/pricing">Pricing</NavLinkItem>
              <NavLinkItem href="/scan">Free Scan</NavLinkItem>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 text-base font-medium text-gray-600 hover:text-brand-blue">
                    <span>Account</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</button>
                    </div>
                  )}
                </div>
             ) : (
                <>
                  <Link href="/login" className="text-base font-medium text-gray-600 hover:text-brand-blue">
                    Log In
                  </Link>
                  <Link href="/signup" className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
             )}
          </div>
          {/* Mobile menu button can be added here */}
        </div>
      </div>
    </header>
  );
};