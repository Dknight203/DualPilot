import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBillingInfo, getTeamMembers, getApiKeys, generateApiKey, revokeApiKey } from '../services/api';
import { Invoice, TeamMember, ApiKey } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApiKeyList from '../components/settings/ApiKeyList';
import ApiKeyModal from '../components/settings/ApiKeyModal';
import Toast from '../components/common/Toast';
import { useSite } from '../components/site/SiteContext';

const SettingsPage: React.FC = () => {
    const { activeSite } = useSite();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for API keys
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRevokingId, setIsRevokingId] = useState<string | null>(null);
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [billingData, teamData, keysData] = await Promise.all([
                    getBillingInfo(), 
                    getTeamMembers(),
                    getApiKeys()
                ]);
                setInvoices(billingData.invoices);
                setTeamMembers(teamData);
                setApiKeys(keysData);
            } catch (error) {
                console.error("Failed to load settings data", error);
                setToast({ message: 'Failed to load settings data.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) {
            setToast({ message: 'Please provide a name for the key.', type: 'error' });
            return;
        }
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

    if (isLoading || !activeSite) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Settings..." /></div>;
    }

    return (
        <>
            {generatedKey?.key && (
                <ApiKeyModal apiKey={generatedKey.key} onClose={() => setGeneratedKey(null)} />
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
            <div className="bg-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    
                    <Card title="Site Settings">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">Site Name</label>
                                <input type="text" id="siteName" defaultValue={activeSite.siteName} className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900" />
                            </div>
                            <div>
                                <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Primary Domain</label>
                                <input type="text" id="domain" defaultValue={activeSite.domain} className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900" />
                            </div>
                             <div className="text-right">
                                 <Button>Save Changes</Button>
                             </div>
                        </form>
                    </Card>

                    <Card title="Plan & Billing">
                        <p>Current Plan: <span className="font-bold capitalize">{activeSite.plan}</span></p>
                        <p>Refresh Policy: <span className="font-bold">{activeSite.refreshPolicy}</span></p>
                        <div className="mt-4">
                            <h4 className="font-medium">Invoices</h4>
                            <ul className="divide-y divide-slate-200">
                                {invoices.map(invoice => (
                                    <li key={invoice.id} className="py-2 flex justify-between items-center">
                                        <span>{invoice.date} - {invoice.amount} ({invoice.status})</span>
                                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-accent-default hover:underline">Download</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="mt-4 text-right">
                             <Button variant="outline">Manage Billing</Button>
                         </div>
                    </Card>

                    <Card title="Team Members">
                        <ul className="divide-y divide-slate-200">
                            {teamMembers.map(member => (
                                <li key={member.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-slate-500">{member.email} - {member.role}</p>
                                    </div>
                                    <Button variant="outline">Remove</Button>
                                </li>
                            ))}
                        </ul>
                         <div className="mt-4 text-right">
                             <Button>Invite Member</Button>
                         </div>
                    </Card>

                     <Card title={
                        <div className="flex items-center gap-2">
                            API Access
                            {activeSite.plan !== 'agency' && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    }>
                        {activeSite.plan === 'agency' ? (
                            <>
                                <p className="text-sm text-slate-600 mb-4">
                                    Generate API keys to integrate DualPilot with your custom applications or third-party services.
                                </p>
                                <form onSubmit={handleGenerateKey} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="flex-grow w-full">
                                        <label htmlFor="keyName" className="sr-only">Key Name</label>
                                        <input 
                                            type="text" 
                                            id="keyName" 
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            placeholder="e.g., My CMS Integration"
                                            className="w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900"
                                        />
                                    </div>
                                    <Button type="submit" isLoading={isGenerating} className="w-full sm:w-auto flex-shrink-0">
                                        Generate Key
                                    </Button>
                                </form>
                                <ApiKeyList apiKeys={apiKeys} onRevoke={handleRevokeKey} isRevokingId={isRevokingId} />
                            </>
                        ) : (
                            <div className="text-center p-6">
                                <h4 className="text-lg font-semibold text-slate-800">Unlock API Access</h4>
                                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                                    Integrate DualPilot with your custom applications by upgrading to our Agency plan.
                                </p>
                                <div className="mt-6">
                                    <Link to="/pricing">
                                        <Button variant="primary">
                                            Upgrade to Agency Plan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </Card>
                    
                    <Card title="Danger Zone">
                        <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg">
                            <div>
                                <h4 className="font-bold text-red-800">Disconnect Site</h4>
                                <p className="text-sm text-red-700">This will stop all optimizations and remove your site data. This action cannot be undone.</p>
                            </div>
                            <Button variant="secondary" className="bg-red-600 hover:bg-red-700 focus:ring-red-500">Disconnect</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SettingsPage;