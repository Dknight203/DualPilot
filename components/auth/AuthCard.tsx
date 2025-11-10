import React from 'react';
import Card from '../common/Card';

interface AuthCardProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ icon, title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {icon && (
                     <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-accent-start to-accent-end text-white">
                        {icon}
                    </div>
                )}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">{title}</h2>
                {subtitle && <div className="mt-2 text-center text-sm text-slate-600">{subtitle}</div>}
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card bodyClassName="px-4 py-8 sm:px-10">
                    {children}
                </Card>
            </div>
        </div>
    );
};

export default AuthCard;