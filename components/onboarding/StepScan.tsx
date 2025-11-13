import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { PlanId } from '../../types';
import { Platform } from './StepIntegrations';
import { addSite } from '../../services/api';
import { useSite } from '../site/SiteContext';
import ErrorState from '../common/ErrorState';


interface StepScanProps {
    domain: string;
    platform: Platform;
    siteProfile: string;
    planId: PlanId;
}

const StatusItem: React.FC<{ text: string; status: 'pending' | 'active' | 'complete' }> = ({ text, status }) => {
    const getStatusIcon = () => {
        if (status === 'complete') {
            return (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
            );
        }
        if (status === 'active') {
            return <LoadingSpinner size="sm" />;
        }
        return <div className="w-8 h-8 rounded-full bg-slate-200" />;
    };

    return (
        <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <span className={`text-lg ${status === 'pending' ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>{text}</span>
        </div>
    );
}

const StepScan: React.FC<StepScanProps> = ({ domain, platform, siteProfile, planId }) => {
    const [scanProgress, setScanProgress] = useState(0);
    const [creationStatus, setCreationStatus] = useState<'pending' | 'creating' | 'created' | 'failed'>('pending');
    const navigate = useNavigate();
    const { refreshSites } = useSite();
    
    const createSite = async () => {
        setCreationStatus('creating');
        try {
            await addSite(domain, platform, planId, siteProfile);
            await refreshSites();
            setCreationStatus('created');
        } catch (error) {
            console.error("Failed to create site in final step:", error);
            setCreationStatus('failed');
        }
    };

    // Create the site when the component mounts
    useEffect(() => {
        createSite();
    }, []);

    // Start the scan animation only after the site has been successfully created
    useEffect(() => {
        if (creationStatus !== 'created') return;

        const stages = [25, 60, 90, 100]; // Simulate progress percentages for each stage
        let currentStage = 0;
        
        const interval = setInterval(() => {
            if (currentStage < stages.length) {
                setScanProgress(stages[currentStage]);
                currentStage++;
            } else {
                clearInterval(interval);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [creationStatus]);

    const handleGoToDashboard = () => {
        // This flag will trigger the welcome modal on the dashboard for new users
        localStorage.setItem('isFirstLogin', 'true');
        navigate('/dashboard');
    };

    if (creationStatus === 'pending' || creationStatus === 'creating') {
        return (
             <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Finalizing Setup</h2>
                <div className="flex justify-center">
                    <LoadingSpinner text="Creating your site in DualPilot..." />
                </div>
            </div>
        )
    }

    if (creationStatus === 'failed') {
        return (
            <ErrorState
                title="Site Creation Failed"
                message="We were unable to create your site. Please go back and try again."
                onRetry={createSite}
            />
        )
    }
    
    const renderScanProgress = () => (
        <div className="max-w-md mx-auto space-y-6">
            <StatusItem text="Connecting to site..." status={scanProgress >= 25 ? 'complete' : 'active'} />
            <StatusItem text="Crawling pages..." status={scanProgress >= 60 ? 'complete' : (scanProgress >= 25 ? 'active' : 'pending')} />
            <StatusItem text="Analyzing content..." status={scanProgress >= 90 ? 'complete' : (scanProgress >= 60 ? 'active' : 'pending')} />
            <StatusItem text="Generating optimizations..." status={scanProgress === 100 ? 'complete' : (scanProgress >= 90 ? 'active' : 'pending')} />
        </div>
    );
    
    const renderScanComplete = () => (
        <div className="text-center animate-fade-in-up">
            <h3 className="text-xl font-semibold text-green-600">Scan Complete!</h3>
            <p className="mt-2 text-slate-600">Your site has been analyzed. Let's head to your dashboard to see the results.</p>
            <div className="mt-6">
                <Button onClick={handleGoToDashboard} size="lg">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
    
    return (
        <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Running First Scan</h2>
            <p className="text-slate-600 mb-8">Our AI is analyzing your site. This may take a few minutes...</p>
            {scanProgress < 100 ? renderScanProgress() : renderScanComplete()}
        </div>
    );
};

export default StepScan;