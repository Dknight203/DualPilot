import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SettingsNav from '../settings/SettingsNav';
import { useSite } from '../site/SiteContext';
import LoadingSpinner from '../common/LoadingSpinner';

const SettingsLayout: React.FC = () => {
    const { activeSite, isLoading } = useSite();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner text="Loading settings..." />
            </div>
        );
    }

    // If loading is finished and there's still no active site,
    // the user shouldn't be here. Redirect them.
    if (!activeSite) {
        return <Navigate 
                    to="/onboarding" 
                    replace 
                    state={{ 
                        toast: { 
                            message: 'Please add or select a site to manage its settings.', 
                            type: 'info' 
                        } 
                    }} 
                />;
    }

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <SettingsNav />
                    </aside>
                    <main className="md:col-span-3">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
