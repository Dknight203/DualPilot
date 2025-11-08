import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingsNav from '../settings/SettingsNav';

const SettingsLayout: React.FC = () => {
    return (
        <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
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