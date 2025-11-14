

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { Platform, PlanId } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import PlatformInstructions from './PlatformInstructions';
import { buildDualPilotSnippet } from '../../services/snippet';
import { addSite, createCmsConnection, getCmsConnectionStatus } from '../../services/api';
import { useSite } from '../site/SiteContext';

interface StepIntegrationsProps {
    domain: string;
    platform: Platform;
    onNext: () => void;
    onBack: () => void;
    // FIX: Added optional prop to customize button text.
    continueText?: string;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="bg-slate-800 rounded-lg p-4 relative">
            <pre className="text-slate-200 text-xs font-mono overflow-x-auto"><code>{code}</code></pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 bg-slate-600 text-white px-2 py-1 rounded text-xs hover:bg-slate-500">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
    );
};

const StepIntegrations: React.FC<StepIntegrationsProps> = ({ domain, platform, onNext, onBack, continueText = "Continue" }) => {
    const [cmsConnectionInfo, setCmsConnectionInfo] = useState<{ id: string; verification_token: string; siteId: string } | null>(null);
    const [snippet, setSnippet] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const { refreshSites } = useSite();

    useEffect(() => {
        const setupSnippetIntegration = async () => {
            setIsLoading(true);
            try {
                // To generate a snippet, we must create site and connection records first.
                // A default plan is used here; it will be updated in the final onboarding step.
                const newSite = await addSite(domain, platform, PlanId.Essentials, `Profile for ${domain}`, 0);
                const connectionInfo = await createCmsConnection(newSite.id, platform);
                
                const connectionData = {
                    id: connectionInfo.id,
                    verification_token: connectionInfo.verification_token,
                    siteId: newSite.id,
                };
                setCmsConnectionInfo(connectionData);

                const snippetString = buildDualPilotSnippet(connectionData.siteId, connectionData.verification_token);
                setSnippet(snippetString);
                
                await refreshSites();
            } catch (error) {
                console.error("Failed to set up integration:", error);
                setToast({ message: "An error occurred during setup. Please try refreshing.", type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        
        // Snippet flow for platforms without a direct API connection
        if (['other', 'squarespace', 'webflow', 'shopify'].includes(platform)) {
             setupSnippetIntegration();
        } else {
             // For platforms like WordPress with a dedicated plugin, we skip the snippet.
             setIsVerified(true);
        }
    }, [domain, platform, refreshSites]);

    const handleVerify = async () => {
        if (!cmsConnectionInfo) return;

        setIsVerifying(true);
        setToast({ message: "Verifying... Please make sure you've visited your site at least once after installing the script.", type: 'info' });

        try {
            const timeout = 45000;
            const interval = 3000;
            const startTime = Date.now();

            while (Date.now() - startTime < timeout) {
                const { verified } = await getCmsConnectionStatus(cmsConnectionInfo.id);
                if (verified) {
                    setIsVerified(true);
                    setToast({ message: "Success! Your site is connected.", type: 'success' });
                    setIsVerifying(false);
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, interval));
            }
            throw new Error("Verification timed out.");
        } catch (error) {
            setToast({ message: "Could not verify the snippet. Please check it's installed correctly and try again.", type: 'error' });
            setIsVerifying(false);
        }
    };
    
    if (!isVerified) { // The main view for snippet installation
        return (
             <div>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                
                <h3 className="font-bold text-lg text-slate-900 text-center">Connect Your Site</h3>
                <p className="text-sm text-slate-600 mt-1 text-center">To finish connecting, add this unique script to your site's &lt;head&gt; tag.</p>

                {isLoading ? (
                    <div className="h-48 flex items-center justify-center"><LoadingSpinner text="Generating your connection snippet..." /></div>
                ) : (
                    <>
                        <div className="mt-6 max-w-2xl mx-auto">
                            <CodeBlock code={snippet} />
                        </div>
                        
                        <div className="mt-4 max-w-2xl mx-auto">
                            <PlatformInstructions />
                        </div>
                    </>
                )}
                
                <div className="mt-8 text-center flex justify-center gap-4">
                    <Button onClick={onBack} variant="outline" size="lg" disabled={isVerifying || isLoading}>
                        Back
                    </Button>
                    <Button onClick={handleVerify} isLoading={isVerifying} disabled={isLoading || isVerified} size="lg">
                        I've Installed the Snippet
                    </Button>
                </div>
            </div>
        )
    }

    // This view shows after verification is complete (for any platform)
    return (
        <div className="text-center py-8">
             {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mt-5">Connection Successful!</h2>
             <p className="mt-2 text-slate-600">Your site is connected to DualPilot. Let's finish up by choosing your plan.</p>
             <div className="mt-8 flex justify-center gap-4">
                <Button onClick={onBack} variant="outline" size="lg">Back</Button>
                <Button onClick={onNext} size="lg">{continueText}</Button>
            </div>
        </div>
    );
};

export default StepIntegrations;
