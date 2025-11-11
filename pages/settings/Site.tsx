import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../../components/site/SiteContext';
import { useAuth } from '../../components/auth/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { saveSiteSettings } from '../../services/api';

const SiteSettings: React.FC = () => {
    const { activeSite, setActiveSite } = useSite();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [siteName, setSiteName] = useState(activeSite?.siteName || '');
    const [domain, setDomain] = useState(activeSite?.domain || '');
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        if (activeSite) {
            setSiteName(activeSite.siteName);
            setDomain(activeSite.domain);
        }
    }, [activeSite]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSite) return;

        setIsSaving(true);
        try {
            const updatedSite = await saveSiteSettings(activeSite.id, siteName, domain);
            setActiveSite(updatedSite);
            setToast({ message: 'Site settings saved successfully!', type: 'success' });
        } catch (error) {
            setToast({ message: 'Failed to save settings. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const cardTitle = (
        <div className="flex justify-between items-center">
            <span>Site Settings</span>
            {user?.role === 'Admin' && (
                 <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/add-site')}
                >
                    + Add New Site
                </Button>
            )}
        </div>
    );


    if (!activeSite) {
        return (
            <Card title="Site Settings">
                <p>No active site selected.</p>
            </Card>
        );
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Card title={cardTitle}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-slate-700">Site Name</label>
                        <Input 
                            type="text" 
                            id="siteName" 
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)} 
                            className="mt-1" 
                        />
                    </div>
                    <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-slate-700">Primary Domain</label>
                        <Input 
                            type="text" 
                            id="domain" 
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)} 
                            className="mt-1" 
                        />
                    </div>
                     <div className="text-right pt-2">
                         <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                     </div>
                </form>
            </Card>
        </>
    );
};

export default SiteSettings;