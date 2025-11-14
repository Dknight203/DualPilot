import React, { useState, useEffect, useRef } from 'react';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';
import { startGscAuth, pollGscStatus } from '../../../services/api';
import { useSite } from '../../site/SiteContext';

interface GscConnectModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const GoogleIcon: React.FC = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const GscConnectModal: React.FC<GscConnectModalProps> = ({ onClose, onSuccess }) => {
    const { activeSite } = useSite();
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const pollingInterval = useRef<number | null>(null);
    const popup = useRef<Window | null>(null);

     const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
    };
    
    useEffect(() => {
        const handleAuthMessage = (event: MessageEvent) => {
            if (event.data === 'gsc-connected') {
                stopPolling();
                setStatus('connected');
                setTimeout(onSuccess, 1500);
            }
        };
        window.addEventListener('message', handleAuthMessage);
        return () => {
            window.removeEventListener('message', handleAuthMessage);
            stopPolling();
        };
    }, [onSuccess]);

    const handleConnect = async () => {
        if (!activeSite) return;
        setStatus('connecting');
        try {
            const { authUrl } = await startGscAuth(activeSite.domain);
            popup.current = window.open(authUrl, '_blank', 'width=600,height=700');

            pollingInterval.current = window.setInterval(async () => {
                if (!activeSite) return;
                const gscStatus = await pollGscStatus(activeSite.domain);
                if (gscStatus === 'connected') {
                    stopPolling();
                    setStatus('connected');
                    setTimeout(onSuccess, 1500);
                }
            }, 3000);

        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Connect Google Search Console</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 p-1 rounded-full"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-8 flex flex-col items-center justify-center">
                     <p className="mt-2 text-center text-slate-600 max-w-md mb-8">
                        Connecting GSC allows DualPilot to show you real-world performance data like clicks and impressions right in your reports.
                    </p>
                    {status === 'idle' && (
                        <Button size="lg" onClick={handleConnect}>
                            <GoogleIcon />
                            Connect with Google
                        </Button>
                    )}
                     {status === 'connecting' && <LoadingSpinner text="Waiting for authorization..." />}
                     {status === 'connected' && (
                         <div className="text-center text-green-600 font-semibold text-lg animate-fade-in-up">
                            <p>✓ Successfully Connected!</p>
                            <p className="text-sm font-normal text-slate-500">Loading your data...</p>
                         </div>
                     )}
                     {status === 'error' && (
                          <p className="text-center text-red-500">Could not initiate connection. Please try again.</p>
                     )}
                </div>
            </div>
        </div>
    );
};

export default GscConnectModal;