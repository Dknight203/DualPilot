import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBillingInfo, getTeamMembers, getApiKeys, generateApiKey, revokeApiKey, inviteTeamMember, updateTeamMemberRole, getCmsConnection, connectCms, disconnectCms } from '../services/api';
import { Invoice, TeamMember, ApiKey, CmsConnection } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApiKeyList from '../components/settings/ApiKeyList';
import ApiKeyModal from '../components/settings/ApiKeyModal';
import Toast from '../components/common/Toast';
import { useSite } from '../components/site/SiteContext';
import { useAuth } from '../components/auth/AuthContext';
import InviteMemberModal from '../components/settings/InviteMemberModal';
import CmsHelpModal from '../components/settings/CmsHelpModal';

const SettingsPage: React.FC = () => {
    const { activeSite } = useSite();
    const { user: currentUser } = useAuth();
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

    // State for Team Invites & Roles
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // State for CMS Connections
    const [cmsConnection, setCmsConnection] = useState<CmsConnection | null>(null);
    const [isCmsHelpModalOpen, setIsCmsHelpModalOpen] = useState(false);
    const [isConnectingCms, setIsConnectingCms] = useState(false);
    const [wpSiteUrl, setWpSiteUrl] = useState('');
    const [wpUsername, setWpUsername] = useState('');
    const [wpPassword, setWpPassword] = useState('');


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [billingData, teamData, keysData, cmsData] = await Promise.all([
                    getBillingInfo(), 
                    getTeamMembers(),
                    getApiKeys(),
                    getCmsConnection()
                ]);
                setInvoices(billingData.invoices);
                setTeamMembers(teamData);
                setApiKeys(keysData);
                setCmsConnection(cmsData);
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

    const handleInviteMember = async (email: string, role: 'Admin' | 'Member') => {
        try {
            const newMember = await inviteTeamMember(email, role);
            setTeamMembers(prev => [newMember, ...prev]);
            setToast({ message: `Invitation sent to ${email}.`, type: 'success' });
            setIsInviteModalOpen(false);
        } catch (error) {
            setToast({ message: 'Failed to send invitation.', type: 'error' });
        }
    };

    const handleUpdateRole = async (memberId: string, role: 'Admin' | 'Member') => {
        try {
            const updatedMember = await updateTeamMemberRole(memberId, role);
            setTeamMembers(prev => prev.map(m => m.id === memberId ? updatedMember : m));
            setToast({ message: 'Member role updated.', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to update role.', type: 'error' });
        } finally {
            setOpenDropdownId(null);
        }
    };

    const handleConnectCms = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnectingCms(true);
        try {
            await connectCms('wordpress', wpSiteUrl);
            setCmsConnection({ type: 'wordpress', siteUrl: wpSiteUrl });
            setToast({ message: 'WordPress site connected successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to connect WordPress site.', type: 'error' });
        } finally {
            setIsConnectingCms(false);
        }
    };
    
    const handleDisconnectCms = async () => {
        if (window.confirm('Are you sure you want to disconnect your CMS? This will disable direct content publishing.')) {
            setIsConnectingCms(true);
            try {
                await disconnectCms();
                setCmsConnection(null);
                setToast({ message: 'CMS disconnected.', type: 'success' });
            } catch (error) {
                setToast({ message: 'Failed to disconnect CMS.', type: 'error' });
            } finally {
                setIsConnectingCms(false);
            }
        }
    };

    if (isLoading || !activeSite || !currentUser) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner text="Loading Settings..." /></div>;
    }
    
    const isAdmin = currentUser.role === 'Admin';

    return (
        <>
            {generatedKey?.key && (
                <ApiKeyModal apiKey={generatedKey.key} onClose={() => setGeneratedKey(null)} />
            )}
            {isInviteModalOpen && (
                <InviteMemberModal
                    onClose={() => setIsInviteModalOpen(false)}
                    onInvite={handleInviteMember}
                />
            )}
            {isCmsHelpModalOpen && (
                <CmsHelpModal onClose={() => setIsCmsHelpModalOpen(false)} />
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

                    <Card title="CMS Connections">
                        {cmsConnection ? (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-6.09-3.432c.005.416.03.822.079 1.218.046.377.106.74.184 1.088a5.13 5.13 0 0 1 .458 1.62.502.502 0 0 1-.453.555.51.51 0 0 1-.56-.452 4.13 4.13 0 0 0-.37-1.312 25.682 25.682 0 0 0-.17-1.002 9.018 9.018 0 0 0-.07-1.218c-.01-.416-.03-.822-.079-1.218-.046-.377-.106-.74-.184-1.088a5.13 5.13 0 0 1-.458-1.62.502.502 0 0 1 .453-.555.51.51 0 0 1 .56.452 4.13 4.13 0 0 0 .37 1.312c.056.36.115.71.17 1.002zM7.5 11.5c.068 0 .136.002.203.007.456.03.89.155 1.29.358.388.196.74.464 1.036.79.28.307.515.65.69 1.002.164.328.283.67.35 1.018.015.087.022.176.022.264a.5.5 0 0 1-1 0c0-.07-.006-.138-.018-.204-.06-.312-.164-.61-.308-.88-.155-.29-.353-.54-.585-.736a2.71 2.71 0 0 0-1.12-.596 3.11 3.11 0 0 0-1.18-.11H7.5a.5.5 0 0 1 0-1z"/></svg>
                                    <div>
                                        <p className="font-bold text-slate-800 capitalize">{cmsConnection.type} Connected</p>
                                        <p className="text-sm text-slate-600">{cmsConnection.siteUrl}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleDisconnectCms} isLoading={isConnectingCms}>Disconnect</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleConnectCms} className="space-y-4">
                                <p className="text-sm text-slate-600">Connect your WordPress site to enable direct publishing of AI-optimized content.</p>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">WordPress Site URL</label>
                                    <input type="url" value={wpSiteUrl} onChange={(e) => setWpSiteUrl(e.target.value)} placeholder="https://yourblog.com" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Application Username</label>
                                    <input type="text" value={wpUsername} onChange={(e) => setWpUsername(e.target.value)} placeholder="dualpilot_user" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Application Password
                                        <button type="button" onClick={() => setIsCmsHelpModalOpen(true)} className="ml-2 text-xs text-accent-default hover:underline">(How do I get this?)</button>
                                    </label>
                                    <input type="password" value={wpPassword} onChange={(e) => setWpPassword(e.target.value)} placeholder="xxxx xxxx xxxx xxxx xxxx xxxx" required className="mt-1 block w-full shadow-sm sm:text-sm border-slate-300 rounded-md px-3 py-2 bg-white text-slate-900 font-mono" />
                                </div>
                                <div className="text-right">
                                    <Button type="submit" isLoading={isConnectingCms}>Connect WordPress</Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    <Card title="Team Members">
                        <ul className="divide-y divide-slate-200">
                           {currentUser && (
                                <li key={currentUser.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{currentUser.name}</p>
                                        <p className="text-sm text-slate-500">{currentUser.email} - {currentUser.role}</p>
                                    </div>
                                    <span className="text-sm text-slate-500 pr-4">Account Owner</span>
                                </li>
                           )}
                            {teamMembers.map(member => (
                                <li key={member.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{member.name}</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            {member.email}
                                            {member.status === 'Pending Invitation' && (
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-36" ref={openDropdownId === member.id ? dropdownRef : null}>
                                            <button
                                                onClick={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                                                disabled={!isAdmin || member.isOwner}
                                                className="flex items-center justify-between w-full text-left pl-3 pr-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-default disabled:bg-slate-100 disabled:cursor-not-allowed"
                                            >
                                                <span>{member.role}</span>
                                                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l3.47-3.47a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {openDropdownId === member.id && (
                                                <div className="absolute right-0 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleUpdateRole(member.id, 'Member')}
                                                            className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Member
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateRole(member.id, 'Admin')}
                                                            className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                        >
                                                            Admin
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="outline" disabled={!isAdmin || member.isOwner}>Remove</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {isAdmin && (
                         <div className="mt-4 text-right">
                             <Button onClick={() => setIsInviteModalOpen(true)}>Invite Member</Button>
                         </div>
                        )}
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