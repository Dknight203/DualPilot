import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { GscConnectCard } from '../GscConnectCard';

interface StepGscConnectProps {
    domain: string;
    onNext: () => void;
    onBack: () => void;
}

const StepGscConnect: React.FC<StepGscConnectProps> = ({ onNext, onBack }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('gsc') === 'connected') {
            setStatus('connected');
            setToast({ message: 'Google Search Console connected successfully!', type: 'success' });
            navigate(location.pathname, { replace: true });
        } else if (params.get('gsc_error') === 'true') {
            setStatus('error');
            setToast({ message: 'Connection failed. Please try again.', type: 'error' });
            navigate(location.pathname, { replace: true });
        }
    }, [location.pathname, navigate]);

    const handleConnectClick = () => {
        setStatus('connecting');
        // The GscConnectCard handles the actual redirect. This state just provides feedback.
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {status === 'connected' ? (
                <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg animate-fade-in-up">
                    <p className="font-semibold text-green-700">✓ Google Search Console Connected!</p>
                </div>
            ) : (
                <div onClick={handleConnectClick}>
                    <GscConnectCard isLoading={status === 'connecting'} />
                </div>
            )}
            
            <div className="mt-8 flex items-center gap-4">
                <Button onClick={onBack} variant="outline" size="lg" disabled={status === 'connecting'}>
                    Back
                </Button>
                <Button size="lg" onClick={onNext} disabled={status !== 'connected'}>
                    Continue
                </Button>
            </div>

            {status !== 'connected' && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onNext}
                        className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline"
                    >
                        Skip for now
                    </button>
                </div>
            )}
        </div>
    );
};

export default StepGscConnect;
