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
        // Set a flag to trigger the tour on the first visit
        localStorage.setItem('isNewUserForTour', 'true');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <h2 className="text-2xl font-bold text-center text-slate-900">Running First Scan</h2>
            <p className="mt-2 text-center text-slate-600">
                We're analyzing your site to establish your baseline Visibility Score. This can take a minute.
            </p>
            
            <div className="mt-8 space-y-6 w-full max-w-xs">
                <StatusItem text="Crawling Site..." status={scanProgress >= 25 ? 'complete' : (scanProgress >= 0 ? 'active' : 'pending')} />
                <StatusItem text="Rewriting Metadata..." status={scanProgress >= 60 ? 'complete' : (scanProgress >= 25 ? 'active' : 'pending')} />
                <StatusItem text="Calculating Score..." status={scanProgress >= 90 ? 'complete' : (scanProgress >= 60 ? 'active' : 'pending')} />
                <StatusItem text="Scan Complete" status={scanProgress >= 100 ? 'complete' : 'pending'} />
            </div>

            {scanProgress === 100 && (
                <div className="mt-10 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-center text-green-600">Your site is ready!</h3>
                    <p className="mt-1 text-center text-slate-600">Let's see your new dashboard and start optimizing.</p>
                    <div className="mt-4 text-center">
                        <Button size="lg" onClick={handleGoToDashboard}>
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepScan;