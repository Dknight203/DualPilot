import React, { useState, useEffect } from 'react';
import { getCmsConnection, connectCms, disconnectCms } from '../../services/api';
import { CmsConnection } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import CmsHelpModal from '../../components/settings/CmsHelpModal';
import Input from '../../components/common/Input';

const CmsSettings: React.FC = () => {
    const [cmsConnection, setCmsConnection] = useState<CmsConnection | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCmsHelpModalOpen, setIsCmsHelpModalOpen] = useState(false);
    const [isConnectingCms, setIsConnectingCms] = useState(false);
    const [wpSiteUrl, setWpSiteUrl] = useState('');
    const [wpUsername, setWpUsername] = useState('');
    const [wpPassword, setWpPassword] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const fetchConnection = async () => {
            setIsLoading(true);
            try {
                const cmsData = await getCmsConnection();
                setCmsConnection(cmsData);
            } catch (error) {
                setToast({ message: 'Failed to load CMS connection status.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchConnection();
    }, []);

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
        if (window.confirm('Are you sure? This will disable direct content publishing.')) {
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

    return (
        <>
            {isCmsHelpModalOpen && <CmsHelpModal onClose={() => setIsCmsHelpModalOpen(false)} />}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Card title="CMS Connections">
                {isLoading ? <div className="flex justify-center py-8"><LoadingSpinner /></div> : (
                    <>
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
                                    <Input type="url" value={wpSiteUrl} onChange={(e) => setWpSiteUrl(e.target.value)} placeholder="https://yourblog.com" required className="mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Application Username</label>
                                    <Input type="text" value={wpUsername} onChange={(e) => setWpUsername(e.target.value)} placeholder="dualpilot_user" required className="mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Application Password
                                        <button type="button" onClick={() => setIsCmsHelpModalOpen(true)} className="ml-2 text-xs text-accent-default hover:underline">(How?)</button>
                                    </label>
                                    <Input type="password" value={wpPassword} onChange={(e) => setWpPassword(e.target.value)} placeholder="xxxx ... xxxx" required className="mt-1 font-mono"/>
                                </div>
                                <div className="text-right pt-2">
                                    <Button type="submit" isLoading={isConnectingCms}>Connect WordPress</Button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </Card>
        </>
    );
};

export default CmsSettings;