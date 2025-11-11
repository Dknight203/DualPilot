import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Site } from '../../types';
import { getSites } from '../../services/api';
import { useAuth } from '../auth/AuthContext';

interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  setActiveSite: (site: Site) => void;
  isLoading: boolean;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSiteState] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    try {
      const userSites = await getSites();
      setSites(userSites);
      // Set the first site as active by default, or from localStorage
      const lastActiveSiteId = localStorage.getItem('activeSiteId');
      const siteToActivate = userSites.find(s => s.id === lastActiveSiteId) || userSites[0] || null;
      setActiveSiteState(siteToActivate);
      if (siteToActivate) {
          localStorage.setItem('activeSiteId', siteToActivate.id);
      } else {
          localStorage.removeItem('activeSiteId');
      }
    } catch (error) {
      console.error("Failed to fetch sites", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchSites();
    } else {
      // Clear data if not authenticated
      setSites([]);
      setActiveSiteState(null);
      localStorage.removeItem('activeSiteId');
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchSites]);

  const setActiveSite = (site: Site) => {
    localStorage.setItem('activeSiteId', site.id);
    setActiveSiteState(site);
  };

  const value = useMemo(() => ({
    sites,
    activeSite,
    setActiveSite,
    isLoading,
    refreshSites: fetchSites,
  }), [sites, activeSite, isLoading, fetchSites]);

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