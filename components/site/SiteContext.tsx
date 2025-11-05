import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { Site } from '../../types';
import { getSites } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  setActiveSite: (site: Site) => void;
  isLoading: boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSiteState] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSites = async () => {
      setIsLoading(true);
      try {
        const userSites = await getSites();
        setSites(userSites);
        // Set the first site as active by default, or from localStorage
        const lastActiveSiteId = localStorage.getItem('activeSiteId');
        const siteToActivate = userSites.find(s => s.id === lastActiveSiteId) || userSites[0];
        if (siteToActivate) {
            setActiveSiteState(siteToActivate);
        }
      } catch (error) {
        console.error("Failed to fetch sites", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchSites();
    } else {
      // Clear data if not authenticated
      setSites([]);
      setActiveSiteState(null);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const setActiveSite = (site: Site) => {
    localStorage.setItem('activeSiteId', site.id);
    setActiveSiteState(site);
  };

  const value = useMemo(() => ({
    sites,
    activeSite,
    setActiveSite,
    isLoading
  }), [sites, activeSite, isLoading]);

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};