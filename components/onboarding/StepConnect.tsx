import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { verifyDomain } from '../../services/api';
import Toast from '../common/Toast';
import PlatformInstructions from './PlatformInstructions';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-800 rounded-lg p-4 relative">
            <pre className="text-slate-200 text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-500 transition-colors"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

interface StepConnectProps {
    onSiteConnected: () => void;
}

const StepConnect: React.FC<StepConnectProps> = ({ onSiteConnected }) => {
    const [domain, setDomain] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);

    const SCRIPT_TAG = `<script defer src="/dual.js"></script>`;
    
    useEffect(() => {
        if (verificationStatus === 'verified') {
            const timer = setTimeout(onSiteConnected, 1500); // Go to next step after a short delay
            return () => clearTimeout(timer);
        }
    }, [verificationStatus, onSiteConnected]);

    const handleVerify = async () => {
        if (!domain) {
            setToast({ message: 'Please enter your domain first.', type: 'error' });
            return;
        }
        setVerificationStatus('verifying');
        try {
            const result = await verifyDomain(domain);
            if (result.verified) {
                setVerificationStatus('verified');
                setToast({ message: 'Verification successful! Continuing...', type: 'success' });
            } else {
                setVerificationStatus('failed');
                setToast({ message: 'Verification failed. Please ensure the script is installed correctly.', type: 'error' });
            }
        } catch (error) {
            setVerificationStatus('failed');
            setToast({ message: 'An error occurred during verification.', type: 'error' });
        }
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Connect Your Site</h2>
            <p className="mt-2 text-center text-slate-600">Enter your domain and add our script to start the magic.</p>
            
            <div className="mt-6 max-w-xl mx-auto">
                <label htmlFor="domain" className="block text-sm font-medium text-slate-700">1. Enter your domain</label>
                <input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:ring-accent-default focus:border-accent-default sm:text-sm bg-white text-slate-900"
                  placeholder="e.g., example.com"
                  disabled={verificationStatus === 'verified' || verificationStatus === 'verifying'}
                />
            </div>

            <div className="mt-6 max-w-xl mx-auto">
                <p className="block text-sm font-medium text-slate-700">2. Add this script to your site's &lt;head&gt;</p>
                <div className="mt-2">
                    <CodeBlock code={SCRIPT_TAG} />
                </div>
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-sm font-medium text-accent-default hover:underline"
                    >
                        {showInstructions ? 'Hide instructions' : 'Where do I paste this?'}
                    </button>
                </div>
            </div>
            
            {showInstructions && (
                <div className="mt-4 max-w-xl mx-auto animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                    <PlatformInstructions />
                </div>
            )}

            <div className="mt-8 text-center">
                <Button 
                    onClick={handleVerify} 
                    isLoading={verificationStatus === 'verifying'} 
                    disabled={verificationStatus === 'verified'}
                    size="lg"
                >
                    {verificationStatus === 'verified' ? 'Connected!' : 'Verify Connection'}
                </Button>
            </div>
        </div>
    );
};

export default StepConnect;