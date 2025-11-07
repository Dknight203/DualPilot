import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { getInitialOptimizations } from '../../services/api';
import { InitialOptimizations, OptimizationExample } from '../../types';
import OptimizationExampleCard from './OptimizationExampleCard';

interface WelcomeModalProps {
    onApproveAll: () => Promise<void>;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onApproveAll, onClose }) => {
    const [optimizations, setOptimizations] = useState<InitialOptimizations | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getInitialOptimizations();
                setOptimizations(data);
            } catch (error) {
                console.error("Failed to load initial optimizations", error);
                onClose();
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [onClose]);

    const handleApprove = async () => {
        setIsApproving(true);
        await onApproveAll();
    };

    const buttonText = optimizations 
        ? `Approve All ${optimizations.optimizablePages} Suggestions`
        : 'Approve All & Continue';

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up">
                <div className="p-6 border-b border-slate-200">
                     <h2 className="text-2xl font-bold text-slate-900">Welcome to DualPilot!</h2>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && <div className="h-64 flex items-center justify-center"><LoadingSpinner text="Analyzing initial results..." /></div>}
                    {!isLoading && optimizations && (
                        <>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-900">
                                    <span className="text-accent-default">Success!</span> We found {optimizations.optimizablePages} pages we can improve immediately.
                                </h3>
                                <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
                                   Here are a few examples of the improvements our AI has generated. You can approve them all now or review each one manually from your dashboard.
                                </p>
                            </div>
                            <div className="mt-6 space-y-4">
                                {optimizations.examples.map((ex, i) => <OptimizationExampleCard key={i} example={ex} />)}
                            </div>
                             <p className="text-xs text-slate-500 text-center mt-6">
                                You can review, edit, or revert any optimization at any time from your dashboard. Approving now applies these changes immediately.
                            </p>
                        </>
                    )}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-center gap-4 flex-shrink-0">
                    <Button onClick={onClose} variant="outline" size="lg" disabled={isApproving}>
                        Review Manually on Dashboard
                    </Button>
                    <Button onClick={handleApprove} isLoading={isApproving} size="lg" disabled={isLoading}>
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;