import React, { useState, useRef, useEffect } from 'react';
import { useSite } from './SiteContext';

const SiteSwitcher: React.FC = () => {
    const { sites, activeSite, setActiveSite, isLoading } = useSite();
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    if (isLoading) {
        return <div className="w-48 h-9 bg-slate-200 rounded-md animate-pulse" />;
    }

    if (!activeSite || sites.length <= 1) {
        return (
             <span className="text-sm font-medium text-slate-700">{activeSite?.siteName}</span>
        );
    }
    
    const handleSelectSite = (siteId: string) => {
        const site = sites.find(s => s.id === siteId);
        if (site) {
            setActiveSite(site);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={switcherRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 transition-colors"
            >
                <span className="text-sm font-medium text-slate-700">{activeSite.siteName}</span>
                <svg className="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1">
                        {sites.map(site => (
                            <button
                                key={site.id}
                                onClick={() => handleSelectSite(site.id)}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${activeSite.id === site.id ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                            >
                                {site.siteName}
                                {activeSite.id === site.id && (
                                    <svg className="w-5 h-5 ml-auto text-accent-default" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteSwitcher;
