import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../common/Card';
import Button from '../../common/Button';

const ConnectGscPrompt: React.FC = () => {
    const navigate = useNavigate();

    // In a real app, this might go to a specific settings page,
    // but for the demo, we'll link to the start of onboarding.
    const handleConnect = () => {
        navigate('/onboarding');
    };

    return (
        <Card>
            <div className="text-center p-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Connect Google Search Console</h3>
                <p className="mt-2 text-sm text-slate-500">
                    To see your website's real-world performance data like clicks and impressions, connect your GSC account.
                </p>
                <div className="mt-6">
                    <Button onClick={handleConnect}>
                        Connect Account
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ConnectGscPrompt;