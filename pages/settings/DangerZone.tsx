import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../../components/site/SiteContext';
import { disconnectSite } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import DisconnectSiteModal from '../../components/settings/DisconnectSiteModal';

const DangerZone: React.FC = () => {
    const { activeSite, refreshSites } = useSite();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const handleConfirmDisconnect = async () => {
        if (!activeSite) return;

        setIsDisconnecting(true);
        try {
            await disconnectSite(activeSite.id);
            await refreshSites();
            navigate('/dashboard', {
                replace: true,
                state: {
                    toast: {
                        message: 'Site disconnected successfully!',
                        type: 'success'
                    }
                }
            });
        } catch (error) {
            setToast({ message: 'Failed to disconnect site. Please try again.', type: 'error' });
            setIsDisconnecting(false); // Only stop loading on error, success navigates away
            setIsModalOpen(false); // Close modal on error
        }
    };
    
    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {activeSite && (
                 <DisconnectSiteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmDisconnect}
                    siteName={activeSite.siteName}
                    isConfirming={isDisconnecting}
                />
            )}
            <Card title="Danger Zone">
                <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg border border-red-200">
                    <div>
                        <h4 className="font-bold text-red-800">Disconnect Site</h4>
                        <p className="text-sm text-red-700">This will stop all optimizations and remove your site data. This action cannot be undone.</p>
                    </div>
                    <Button 
                        variant="danger"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!activeSite}
                    >
                        Disconnect
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default DangerZone;