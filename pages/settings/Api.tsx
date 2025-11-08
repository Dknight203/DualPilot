import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiKeys, generateApiKey, revokeApiKey } from '../../services/api';
import { ApiKey } from '../../types';
import { useSite } from '../../components/site/SiteContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApiKeyList from '../../components/settings/ApiKeyList';
import ApiKeyModal from '../../components/settings/ApiKeyModal';
import Toast from '../../components/common/Toast';

const ApiSettings: React.FC = () => {
    const { activeSite } = useSite();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRevokingId, setIsRevokingId] = useState<string | null>(null);
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const fetchKeys = async () => {
            if (activeSite?.plan === 'agency') {
                setIsLoading(true);
                try {
                    const keysData = await getApiKeys();
                    setApiKeys(keysData);
                } catch (error) {
                    setToast({ message: 'Failed to load API keys.', type: 'error' });
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchKeys();
    }, [activeSite]);
    
    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;
        setIsGenerating(true);
        try {
            const newKey = await generateApiKey(newKeyName);
            setGeneratedKey(newKey);
            setApiKeys(prev => [newKey, ...prev]);
            setNewKeyName('');
            setToast({ message: 'API Key generated successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to generate API key.', type: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        setIsRevokingId(keyId);
        try {
            await revokeApiKey(keyId);
            setApiKeys(prev => prev.filter(key => key.id !== keyId));
            setToast({ message: 'API Key revoked.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to revoke API key.', type: 'error' });
        } finally {
            setIsRevokingId(null);
        }
    };

    const title = (
        <div className="flex items-center gap-2">
            API Access
            {activeSite?.plan !== 'agency' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002 2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
            )}
        </div>
    );

    return (
        <>
            {generatedKey?.key && <ApiKeyModal apiKey={generatedKey.key} onClose={() => setGeneratedKey(null)} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Card title={title}>
                {isLoading && <div className="flex justify-center py-8"><LoadingSpinner /></div>}
                {!isLoading && activeSite && (
                    <>
                        {activeSite.plan === 'agency' ? (
                            <>
                                <p className="text-sm text-slate-600 mb-4">Generate API keys to integrate DualPilot with your custom applications.</p>
                                <form onSubmit={handleGenerateKey} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="flex-grow w-full">
                                        <label htmlFor="keyName" className="sr-only">Key Name</label>
                                        <input type="text" id="keyName" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g., My CMS Integration" className="w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900" />
                                    </div>
                                    <Button type="submit" isLoading={isGenerating} className="w-full sm:w-auto flex-shrink-0">Generate Key</Button>
                                </form>
                                <ApiKeyList apiKeys={apiKeys} onRevoke={handleRevokeKey} isRevokingId={isRevokingId} />
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <h4 className="text-lg font-semibold text-slate-800">Unlock API Access</h4>
                                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Integrate DualPilot with your custom applications by upgrading to our Agency plan.</p>
                                <div className="mt-6"><Link to="/pricing"><Button variant="primary">Upgrade to Agency Plan</Button></Link></div>
                            </div>
                        )}
                    </>
                )}
            </Card>
        </>
    );
};

export default ApiSettings;
