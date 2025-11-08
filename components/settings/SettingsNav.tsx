import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSite } from '../site/SiteContext';
import { useAuth } from '../auth/AuthContext';

const navItems = [
    { path: 'profile', label: 'Profile', requiredRole: ['Admin', 'Member'], requiredPlan: ['essentials', 'pro', 'agency'] },
    { path: 'site', label: 'Site', requiredRole: ['Admin', 'Member'], requiredPlan: ['essentials', 'pro', 'agency'] },
    { path: 'billing', label: 'Plan & Billing', requiredRole: ['Admin', 'Member'], requiredPlan: ['essentials', 'pro', 'agency'] },
    { path: 'branding', label: 'Branding', requiredRole: ['Admin', 'Member'], requiredPlan: ['agency'], isPremium: true },
    { path: 'cms', label: 'CMS Connections', requiredRole: ['Admin', 'Member'], requiredPlan: ['essentials', 'pro', 'agency'] },
    { path: 'team', label: 'Team Members', requiredRole: ['Admin'], requiredPlan: ['essentials', 'pro', 'agency'] },
    { path: 'api', label: 'API Access', requiredRole: ['Admin', 'Member'], requiredPlan: ['agency'], isPremium: true },
    { path: 'danger', label: 'Danger Zone', requiredRole: ['Admin'], requiredPlan: ['essentials', 'pro', 'agency'] },
];

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 ml-auto" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);


const SettingsNav: React.FC = () => {
    const { activeSite } = useSite();
    const { user } = useAuth();
    
    const navLinkClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-200";
    const activeNavLinkClasses = "bg-slate-200 text-slate-900 font-semibold";

    if (!activeSite || !user) {
        return null; // Or a loading state
    }

    return (
        <nav className="space-y-1" aria-label="Settings navigation">
            {navItems.map(item => {
                const hasRequiredRole = item.requiredRole.includes(user.role);
                const hasRequiredPlan = item.requiredPlan.includes(activeSite.plan);
                
                if (!hasRequiredRole) {
                    return null;
                }
                
                const showLock = item.isPremium && !hasRequiredPlan;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? `${navLinkClasses} ${activeNavLinkClasses}` : navLinkClasses
                        }
                    >
                        {item.label}
                        {showLock && <LockIcon />}
                    </NavLink>
                );
            })}
        </nav>
    );
};

export default SettingsNav;