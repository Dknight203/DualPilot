import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../auth/AuthContext';

interface StepGscConnectProps {
    domain: string;
    onNext: () => void;
    onBack: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const StepGscConnect: React.FC<StepGscConnectProps> = ({ onNext, onBack }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null);

    useEffect(() => {
        // Check for redirect parameters
        const params = new URLSearchParams(window.location.search);
        if (params.get('gsc') === 'connected') {
            setStatus('connected');
            navigate('/onboarding', { replace: true });
        } else if (params.get('gsc_error') === 'true') {
            setStatus('error');
            setToast({ message: 'Connection failed. Please try again.', type: 'error' });
            navigate('/onboarding', { replace: true });
        } else {
            // Check for existing connection in DB on initial load
            const checkConnection = async () => {
                if (!user) return;
                const { data, error } = await supabase
                    .from('gsc_connections')
                    .select('id')
                    .eq('owner_id', user.id)
                    .eq('gsc_status', 'connected')
                    .limit(1)
                    .single();
                if (data && !error) {
                    setStatus('connected');
                }
            };
            checkConnection();
        }
    }, [navigate, user]);

    async function handleConnect() {
        if (!user) {
            setToast({ message: 'You must be logged in to connect.', type: 'error' });
            return;
        }
        setStatus('connecting');
        window.location.href = `/api/gsc/start?userId=${user.id}`;
    }

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Connect Google Search Console</h2>
            <p className="mt-2 text-center text-slate-600 max-w-lg">
                This optional but highly recommended step allows DualPilot to show you real-world performance data.
            </p>

            <div className="mt-8">
                {status === 'connected' ? (
                    <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-semibold text-green-700">✓ Google Search Console Connected!</p>
                    </div>
                ) : (
                    <Button size="lg" onClick={handleConnect} isLoading={status === 'connecting'}>
                        <GoogleIcon />
                        {status === 'connecting' ? 'Redirecting...' : 'Connect with Google'}
                    </Button>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <Button onClick={onBack} variant="outline" size="lg" disabled={status === 'connecting'}>
                    Back
                </Button>
                <Button size="lg" onClick={onNext} disabled={status !== 'connected'}>
                    Continue
                </Button>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={onNext}
                    className="text-sm font-medium text-slate-500 hover:text-slate-700 hover:underline"
                >
                    Skip for now
                </button>
            </div>
        </div>
    );
};

export default StepGscConnect;
