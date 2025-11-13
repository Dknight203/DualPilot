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
  const { user, isAuthenticated } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSiteState] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const userSites = await getSites(userId);
      setSites(userSites);
      
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
      setSites([]);
      setActiveSiteState(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSites(user.id);
    } else if (!isAuthenticated) {
      // If user is logged out, clear all site data
      setSites([]);
      setActiveSiteState(null);
      setIsLoading(false);
    }
  }, [user, isAuthenticated, fetchSites]);

  const setActiveSite = (site: Site) => {
    localStorage.setItem('activeSiteId', site.id);
    setActiveSiteState(site);
  };
  
  const refreshSitesAndState = useCallback(async () => {
    if (user) {
        await fetchSites(user.id);
    }
  }, [user, fetchSites]);

  const value = useMemo(() => ({
    sites,
    activeSite,
    setActiveSite,
    isLoading,
    refreshSites: refreshSitesAndState,
  }), [sites, activeSite, isLoading, refreshSitesAndState]);

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