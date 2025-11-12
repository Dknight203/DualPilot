import React, { useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface ShopifyFormProps {
    onConnected: () => void;
    onBack?: () => void;
}

const ShopifyForm: React.FC<ShopifyFormProps> = ({ onConnected, onBack }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [storeUrl, setStoreUrl] = useState('');
    const [apiToken, setApiToken] = useState('');

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Connecting Shopify:", { storeUrl, apiToken });
            setIsConnecting(false);
            onConnected(); // Mark as connected
        }, 1500);
    };
    
    return (
        <div>
            <h3 className="font-bold text-lg text-slate-900 text-center">Connect Your Shopify Store</h3>
            <p className="text-sm text-slate-600 mt-1 text-center">Enable one-click publishing for your product and collection pages.</p>

            <form onSubmit={handleConnect} className="mt-6 space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Shopify Store URL</label>
                    <Input type="text" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="your-store.myshopify.com" required className="mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Admin API Access Token
                        <a href="#" className="ml-2 text-xs text-accent-default hover:underline" target="_blank" rel="noopener noreferrer">(How do I get this?)</a>
                    </label>
                    <Input type="password" value={apiToken} onChange={(e) => setApiToken(e.target.value)} placeholder="shpat_..." required className="mt-1 font-mono"/>
                </div>
                <div className="text-center pt-2 flex justify-center gap-4">
                    {onBack && <Button type="button" variant="outline" onClick={onBack}>Back</Button>}
                    <Button type="submit" isLoading={isConnecting}>Connect Shopify</Button>
                </div>
            </form>
        </div>
    );
};

export default ShopifyForm;
