import React from 'react';
import { Platform } from '../StepIntegrations';

interface PlatformCardProps {
    name: string;
    logo: React.ReactNode;
    onClick: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ name, logo, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-sm transition-all text-center group"
    >
        <div className="h-12 w-12 flex items-center justify-center text-slate-500 group-hover:text-slate-700 transition-colors">
            {logo}
        </div>
        <span className="mt-3 font-medium text-slate-700">{name}</span>
    </button>
);

interface PlatformSelectorProps {
    onSelect: (platform: Platform) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect }) => {
    const platforms = [
        { id: 'wordpress', name: 'WordPress', logo: <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Wordpress-Logo.svg" alt="WordPress logo" className="h-12 w-12 object-contain" /> },
        { id: 'shopify', name: 'Shopify', logo: <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" alt="Shopify logo" className="h-12 w-12 object-contain" /> },
        { id: 'webflow', name: 'Webflow', logo: <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Webflow_logo.svg" alt="Webflow logo" className="h-10 w-10 object-contain" /> },
        { id: 'squarespace', name: 'Squarespace', logo: <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Squarespace_Logomark-black.svg" alt="Squarespace logo" className="h-10 w-10 object-contain" /> },
        { id: 'other', name: 'Other / Custom', logo: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
        ) },
    ];

    // Use a grid that better matches the image (e.g., 4 columns on larger screens)
    return (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {platforms.map(p => (
                <PlatformCard key={p.id} name={p.name} logo={p.logo} onClick={() => onSelect(p.id as Platform)} />
            ))}
        </div>
    );
};

export default PlatformSelector;
