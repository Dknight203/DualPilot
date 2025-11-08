import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBrandingSettings, updateBrandingLogo, removeBrandingLogo } from '../../services/api';
import { BrandingSettings } from '../../types';
import { useSite } from '../../components/site/SiteContext';
import { useAuth } from '../../components/auth/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
);

const BrandingSettings: React.FC = () => {
    const { activeSite } = useSite();
    const { user: currentUser } = useAuth();
    const [brandingSettings, setBrandingSettings] = useState<BrandingSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchBranding = async () => {
            setIsLoading(true);
            if (activeSite?.plan === 'agency') {
                try {
                    const settings = await getBrandingSettings();
                    setBrandingSettings(settings);
                } catch (error) {
                     setToast({ message: 'Could not load branding settings.', type: 'error' });
                }
            }
            setIsLoading(false);
        };
        fetchBranding();
    }, [activeSite]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setToast({ message: 'File is too large. Please use an image under 2MB.', type: 'error' });
            return;
        }
        if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'].includes(file.type)) {
            setToast({ message: 'Invalid file type. Please use PNG, JPG, GIF or SVG.', type: 'error' });
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64Url = reader.result as string;
                const updatedSettings = await updateBrandingLogo(base64Url);
                setBrandingSettings(updatedSettings);
                setToast({ message: 'Logo uploaded successfully!', type: 'success' });
            } catch (error) {
                setToast({ message: 'Failed to upload logo.', type: 'error' });
            } finally {
                setIsUploading(false);
            }
        };
        reader.onerror = () => {
            setToast({ message: 'Failed to read file.', type: 'error' });
            setIsUploading(false);
        };
    };

    const handleRemoveLogo = async () => {
        if (window.confirm('Are you sure you want to remove your custom logo?')) {
            try {
                await removeBrandingLogo();
                setBrandingSettings(null);
                setToast({ message: 'Logo removed.', type: 'success' });
            } catch (error) {
                setToast({ message: 'Failed to remove logo.', type: 'error' });
            }
        }
    };

    const title = (
        <div className="flex items-center gap-2">
            Branding
            {activeSite?.plan !== 'agency' && <LockIcon />}
        </div>
    );

    if (isLoading || !activeSite || !currentUser) {
        return <Card title="Branding"><div className="flex justify-center py-8"><LoadingSpinner /></div></Card>;
    }

    const isAdmin = currentUser.role === 'Admin';

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Card title={title}>
                {activeSite.plan === 'agency' ? (
                    <>
                        {isAdmin ? (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600">Upload your logo to automatically brand all exported reports. This is a universal setting for your agency.</p>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                                    <div className="w-24 h-12 flex items-center justify-center bg-slate-200 rounded">
                                        {brandingSettings?.logoUrl ? <img src={brandingSettings.logoUrl} alt="Your Logo" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-slate-500">No Logo</span>}
                                    </div>
                                    <div className="flex-grow">
                                        <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/png, image/jpeg, image/svg+xml, image/gif" className="hidden" />
                                        <Button onClick={() => fileInputRef.current?.click()} isLoading={isUploading} variant="outline" size="sm">
                                            {brandingSettings?.logoUrl ? 'Change Logo' : 'Upload Logo'}
                                        </Button>
                                        {brandingSettings?.logoUrl && <Button onClick={handleRemoveLogo} variant="outline" size="sm" className="ml-2 !border-red-300 !text-red-600 hover:!bg-red-50">Remove</Button>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-lg">Branding settings are managed by your account administrators.</p>
                        )}
                    </>
                ) : (
                    <div className="text-center p-6">
                        <h4 className="text-lg font-semibold text-slate-800">White-Label Your Reports</h4>
                        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Add your own logo to all report exports by upgrading to our Agency plan.</p>
                        <div className="mt-6"><Link to="/pricing"><Button variant="primary">Upgrade to Agency Plan</Button></Link></div>
                    </div>
                )}
            </Card>
        </>
    );
};

export default BrandingSettings;