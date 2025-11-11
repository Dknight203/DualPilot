import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const UpgradeForMoreSites: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-5">Site Limit Reached</h2>
            <p className="mt-2 text-slate-600 max-w-md mx-auto">
                You have reached the maximum number of sites allowed for your current plan. To add a new site, please upgrade your plan.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
                <Button onClick={() => navigate('/settings/billing')} variant="primary" size="lg">
                    Upgrade Your Plan
                </Button>
            </div>
             <div className="mt-4 text-center">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default UpgradeForMoreSites;