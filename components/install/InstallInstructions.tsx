import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { verifyDomain } from '../../services/api';
import Toast from '../common/Toast';

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


const InstallInstructions: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
    const [lastHeartbeat, setLastHeartbeat] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const SCRIPT_TAG = `<script defer src="/dual.js"></script>`;
    // This assumes the user's domain is stored somewhere accessible. For demo, we use a placeholder.
    const userDomain = 'example.com'; 

    const handleVerify = async () => {
        setVerificationStatus('verifying');
        try {
            const result = await verifyDomain(userDomain);
            if (result.verified) {
                setVerificationStatus('verified');
                setLastHeartbeat(result.heartbeat);
                setToast({ message: 'Verification successful!', type: 'success' });
            } else {
                setVerificationStatus('failed');
                setToast({ message: 'Verification failed. Please ensure the script is installed correctly.', type: 'error' });
            }
        } catch (error) {
            setVerificationStatus('failed');
            setToast({ message: 'An error occurred during verification.', type: 'error' });
        }
    };
    
    // Poll for verification automatically
    useEffect(() => {
        if (verificationStatus === 'pending') {
           const interval = setInterval(async () => {
                try {
                    const result = await verifyDomain(userDomain);
                    if (result.verified) {
                         setVerificationStatus('verified');
                         setLastHeartbeat(result.heartbeat);
                         clearInterval(interval);
                    }
                } catch(e) { console.error("Polling failed"); }
           }, 5000);
           return () => clearInterval(interval);
        }
    }, [verificationStatus]);


    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Script Tag Installation */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">For Any Website</h2>
                    <p className="mt-2 text-slate-600">Copy and paste this script tag into the `<head>` section of your website's HTML.</p>
                    <div className="mt-4">
                        <CodeBlock code={SCRIPT_TAG} />
                    </div>
                </div>

                {/* WordPress Plugin */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">For WordPress</h2>
                    <p className="mt-2 text-slate-600">The easiest way to install DualPilot on WordPress is with our official plugin.</p>
                    <div className="mt-4">
                        <Button variant="secondary" onClick={() => window.open('https://wordpress.org/plugins/dualpilot-placeholder', '_blank')}>
                            Download WordPress Plugin
                        </Button>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold text-slate-900">Verification</h2>
                <div className="mt-4 bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                        <p className="font-medium">Status:</p>
                        {verificationStatus === 'verified' && <p className="text-green-600 font-bold">Site Connected</p>}
                        {verificationStatus === 'pending' && <p className="text-yellow-600 font-bold">Waiting for connection...</p>}
                        {verificationStatus === 'verifying' && <p className="text-blue-600 font-bold">Verifying...</p>}
                        {verificationStatus === 'failed' && <p className="text-red-600 font-bold">Connection Failed</p>}
                         {lastHeartbeat && <p className="text-sm text-slate-500">Last seen: {new Date(lastHeartbeat).toLocaleString()}</p>}
                    </div>
                    <Button 
                        onClick={handleVerify} 
                        isLoading={verificationStatus === 'verifying'} 
                        disabled={verificationStatus === 'verified'}
                    >
                        {verificationStatus === 'verified' ? 'Verified' : 'Verify Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InstallInstructions;
