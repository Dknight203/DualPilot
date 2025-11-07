import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';


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

const StepScan: React.FC = () => {
    const [scanProgress, setScanProgress] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
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
    }, []);

    const handleGoToDashboard = () => {
        // This flag will trigger the welcome modal on the dashboard
        localStorage.setItem('isFirstLogin', 'true');
        navigate('/dashboard');
    };
    
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