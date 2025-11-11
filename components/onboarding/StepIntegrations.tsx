import React, { useState } from 'react';
import Button from '../common/Button';
import PlatformSelector from './platforms/PlatformSelector';
import WordPressForm from './platforms/WordPressForm';
import ShopifyForm from './platforms/ShopifyForm';
import WebflowForm from './platforms/WebflowForm';
import OtherForm from './platforms/OtherForm';
import { verifyDomain } from '../../services/api';
import Toast from '../common/Toast';

export type Platform = 'wordpress' | 'shopify' | 'webflow' | 'squarespace' | 'other';

interface StepIntegrationsProps {
    domain: string;
    onNext: () => void;
}

const StepIntegrations: React.FC<StepIntegrationsProps> = ({ domain, onNext }) => {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            const result = await verifyDomain(domain);
            if (result.verified) {
                setIsVerified(true);
                setToast({ message: 'Script verification successful!', type: 'success' });
            } else {
                setToast({ message: 'Verification failed. Please ensure the script is installed correctly.', type: 'error' });
            }
        } catch (error) {
            setToast({ message: 'An error occurred during verification.', type: 'error' });
        } finally {
            setIsVerifying(false);
        }
    };
    
    const renderContent = () => {
        if (!selectedPlatform) {
            return (
                <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900">Connect Your Site</h2>
                    <p className="mt-2 text-center text-slate-600">First, tell us where your site is hosted. This allows us to provide a seamless one-click publishing experience.</p>
                    <PlatformSelector onSelect={setSelectedPlatform} />
                </div>
            );
        }

        const handleBack = () => setSelectedPlatform(null);
        let formComponent;
        
        switch (selectedPlatform) {
            case 'wordpress':
                formComponent = <WordPressForm onBack={handleBack} onConnected={() => setIsVerified(true)} />;
                break;
            case 'shopify':
                formComponent = <ShopifyForm onBack={handleBack} onConnected={() => setIsVerified(true)} />;
                break;
            case 'webflow':
                formComponent = <WebflowForm onBack={handleBack} onConnected={() => setIsVerified(true)} />;
                break;
            case 'other':
            case 'squarespace': // Fallback for now
                formComponent = <OtherForm onBack={handleBack} onVerify={handleVerify} isVerifying={isVerifying} isVerified={isVerified} />;
                break;
            default:
                formComponent = <p>Something went wrong.</p>;
        }

        return (
            <div>
                {formComponent}
                <div className="mt-10 text-center">
                    <Button onClick={onNext} size="lg" disabled={!isVerified}>
                        Continue to Final Scan
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">A successful connection is required to continue.</p>
                </div>
            </div>
        );
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {renderContent()}
        </div>
    );
};

export default StepIntegrations;