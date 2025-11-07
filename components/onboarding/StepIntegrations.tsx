import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { verifyDomain, connectCms, disconnectCms } from '../../services/api';
import Toast from '../common/Toast';
import PlatformInstructions from './PlatformInstructions';
import CmsHelpModal from '../settings/CmsHelpModal';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-slate-800 rounded-lg p-4 relative">
            <pre className="text-slate-200 text-sm overflow-x-auto"><code>{code}</code></pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-500">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
    );
};

const InfoItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="font-semibold text-slate-700">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{children}</p>
    </div>
);

interface StepIntegrationsProps {
    onNext: () => void;
}

const StepIntegrations: React.FC<StepIntegrationsProps> = ({ onNext }) => {
    const [domain, setDomain] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    
    // CMS State
    const [isCmsHelpModalOpen, setIsCmsHelpModalOpen] = useState(false);
    const [isConnectingCms, setIsConnectingCms] = useState(false);
    const [wpSiteUrl, setWpSiteUrl] = useState('');
    const [wpUsername, setWpUsername] = useState('');
    const [wpPassword, setWpPassword] = useState('');

    const SCRIPT_TAG = `<script defer src="/dual.js"></script>`;
    
    useEffect(() => {
        // Retrieve domain saved during profile confirmation
        const savedDomain = localStorage.getItem('onboardingDomain');
        if (savedDomain) {
            setDomain(savedDomain);
        }
    }, []);

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
                setToast({ message: 'Script verification successful!', type: 'success' });
            } else {
                setVerificationStatus('failed');
                setToast({ message: 'Verification failed. Please ensure the script is installed correctly.', type: 'error' });
            }
        } catch (error) {
            setVerificationStatus('failed');
            setToast({ message: 'An error occurred during verification.', type: 'error' });
        }
    };

    const handleConnectCms = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnectingCms(true);
        try {
            await connectCms('wordpress', wpSiteUrl);
            setToast({ message: 'WordPress site connected successfully!', type: 'success' });
            // Optionally, disable the form or show a connected state here
        } catch (error) {
            setToast({ message: 'Failed to connect WordPress site.', type: 'error' });
        } finally {
            setIsConnectingCms(false);
        }
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {isCmsHelpModalOpen && <CmsHelpModal onClose={() => setIsCmsHelpModalOpen(false)} />}
            
            <h2 className="text-2xl font-bold text-center text-slate-900">Integrations</h2>
            <p className="mt-2 text-center text-slate-600">Connect your site to start the magic. The script is required, the CMS connection is for convenience.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- REQUIRED: SCRIPT INSTALLATION --- */}
                <div className="border border-slate-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-slate-900">1. Install DualPilot Script (Required)</h3>
                    <div className="mt-4">
                        <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Your Domain</label>
                        <input id="domain" type="text" value={domain} readOnly className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-100 cursor-not-allowed"/>
                    </div>
                    <div className="mt-4">
                        <p className="block text-sm font-medium text-slate-700">Add script to your site's &lt;head&gt;</p>
                        <div className="mt-1"><CodeBlock code={SCRIPT_TAG} /></div>
                        <button onClick={() => setShowInstructions(!showInstructions)} className="mt-2 text-xs font-medium text-accent-default hover:underline">{showInstructions ? 'Hide' : 'Show'} platform guides</button>
                    </div>
                    {showInstructions && <div className="mt-2 animate-fade-in-up" style={{ animationDuration: '0.3s' }}><PlatformInstructions /></div>}
                    <div className="mt-4 text-center">
                        <Button onClick={handleVerify} isLoading={verificationStatus === 'verifying'} disabled={verificationStatus === 'verified'}>{verificationStatus === 'verified' ? 'Verified!' : 'Verify Script'}</Button>
                    </div>
                </div>

                {/* --- OPTIONAL: CMS CONNECTION --- */}
                <div className="border border-slate-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-slate-900">2. Connect Your CMS (Optional)</h3>
                     <div className="mt-2 mb-4 grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3 rounded-md border text-xs">
                        <InfoItem title="Why we ask">A direct CMS connection allows DualPilot to publish optimizations for you.</InfoItem>
                        <InfoItem title="What you get">Approve changes with one click inside DualPilot. No more copy-pasting.</InfoItem>
                        <InfoItem title="If you skip">DualPilot will still work perfectly, but you will need to manually apply metadata to your site.</InfoItem>
                        <InfoItem title="Where to find it later">You can set this up anytime from the Settings page for this site.</InfoItem>
                    </div>
                    <form onSubmit={handleConnectCms} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">WordPress Site URL</label>
                            <input type="url" value={wpSiteUrl} onChange={(e) => setWpSiteUrl(e.target.value)} placeholder="https://yourblog.com" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Application Username</label>
                            <input type="text" value={wpUsername} onChange={(e) => setWpUsername(e.target.value)} placeholder="dualpilot_user" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2"/>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium text-slate-700">Application Password <button type="button" onClick={() => setIsCmsHelpModalOpen(true)} className="ml-1 text-xs text-accent-default hover:underline">(?)</button></label>
                            <input type="password" value={wpPassword} onChange={(e) => setWpPassword(e.target.value)} placeholder="xxxx ... xxxx" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 font-mono"/>
                        </div>
                        <div className="text-center pt-2">
                            <Button type="submit" isLoading={isConnectingCms} variant="outline">Connect WordPress</Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-10 text-center">
                <Button onClick={onNext} size="lg" disabled={verificationStatus !== 'verified'}>
                    Continue to Final Scan
                </Button>
                 <p className="text-xs text-slate-500 mt-2">Script verification is required to continue.</p>
            </div>
        </div>
    );
};

export default StepIntegrations;
