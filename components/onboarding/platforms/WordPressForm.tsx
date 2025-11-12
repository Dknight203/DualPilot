import React, { useState } from 'react';
import Button from '../../common/Button';
import Input from '../../common/Input';
import { connectCms } from '../../../services/api';
import Toast from '../../common/Toast';
import CmsHelpModal from '../../settings/CmsHelpModal';

interface WordPressFormProps {
    onConnected: () => void;
    onBack?: () => void;
}

const WordPressForm: React.FC<WordPressFormProps> = ({ onConnected, onBack }) => {
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [siteUrl, setSiteUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsConnecting(true);
        try {
            await connectCms('wordpress', siteUrl);
            setToast({ message: 'WordPress site connected successfully!', type: 'success' });
            onConnected();
        } catch (error) {
            setToast({ message: 'Failed to connect WordPress site.', type: 'error' });
        } finally {
            setIsConnecting(false);
        }
    };
    
    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {isHelpModalOpen && <CmsHelpModal onClose={() => setIsHelpModalOpen(false)} />}
            
            <h3 className="font-bold text-lg text-slate-900 text-center">Connect Your WordPress Site</h3>
            <p className="text-sm text-slate-600 mt-1 text-center">This enables one-click publishing of AI-optimized content.</p>

            <form onSubmit={handleConnect} className="mt-6 space-y-4 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium text-slate-700">WordPress Site URL</label>
                    <Input type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://yourblog.com" required className="mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Application Username</label>
                    <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_wp_username" required className="mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">
                        Application Password
                        <button type="button" onClick={() => setIsHelpModalOpen(true)} className="ml-2 text-xs text-accent-default hover:underline">(How do I get this?)</button>
                    </label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="xxxx ... xxxx" required className="mt-1 font-mono"/>
                </div>
                <div className="text-center pt-2 flex justify-center gap-4">
                     {onBack && <Button type="button" variant="outline" onClick={onBack}>Back</Button>}
                    <Button type="submit" isLoading={isConnecting}>Connect WordPress</Button>
                </div>
            </form>
        </div>
    );
};

export default WordPressForm;
