import React, { useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface WebflowFormProps {
    onConnected: () => void;
    onBack?: () => void;
}

const WebflowForm: React.FC<WebflowFormProps> = ({ onConnected, onBack }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [siteId, setSiteId] = useState('');
    const [apiToken, setApiToken] = useState('');

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Connecting Webflow:", { siteId, apiToken });
            setIsConnecting(false);
            onConnected(); // Mark as connected
        }, 1500);
    };
    
    return (
        <div>
            <h3 className="font-bold text-lg text-slate-900 text-center">Connect Your Webflow Site</h3>
            <p className="text-sm text-slate-600 mt-1 text-center">Enable one-click publishing for your CMS items.</p>

            <form onSubmit={handleConnect} className="mt-6 space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Webflow Site ID
                         <a href="#" className="ml-2 text-xs text-accent-default hover:underline" target="_blank" rel="noopener noreferrer">(How do I get this?)</a>
                    </label>
                    <Input type="text" value={siteId} onChange={(e) => setSiteId(e.target.value)} placeholder="e.g., 60c7..." required className="mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        API Access Token
                    </label>
                    <Input type="password" value={apiToken} onChange={(e) => setApiToken(e.target.value)} placeholder="d8f2..." required className="mt-1 font-mono"/>
                </div>
                <div className="text-center pt-2 flex justify-center gap-4">
                    {onBack && <Button type="button" variant="outline" onClick={onBack}>Back</Button>}
                    <Button type="submit" isLoading={isConnecting}>Connect Webflow</Button>
                </div>
            </form>
        </div>
    );
};

export default WebflowForm;
