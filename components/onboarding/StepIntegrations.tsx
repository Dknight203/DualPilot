import React, { useState } from 'react';
import Button from '../common/Button';
import WordPressForm from './platforms/WordPressForm';
import ShopifyForm from './platforms/ShopifyForm';
import WebflowForm from './platforms/WebflowForm';
import OtherForm from './platforms/OtherForm';
import { verifyDomain } from '../../services/api';
import Toast from '../common/Toast';
import { Platform } from '../../types';

interface StepIntegrationsProps {
    domain: string;
    platform: Platform;
    onNext: () => void;
    onBack: () => void;
    continueText?: string;
}

const StepIntegrations: React.FC<StepIntegrationsProps> = ({ domain, platform, onNext, onBack, continueText }) => {
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
        let formComponent;
        
        switch (platform) {
            case 'wordpress':
                formComponent = <WordPressForm onConnected={() => setIsVerified(true)} />;
                break;
            case 'shopify':
                formComponent = <ShopifyForm onConnected={() => setIsVerified(true)} />;
                break;
            case 'webflow':
                formComponent = <WebflowForm onConnected={() => setIsVerified(true)} />;
                break;
            case 'other':
            case 'squarespace': // Fallback for now
                formComponent = <OtherForm onVerify={handleVerify} isVerifying={isVerifying} isVerified={isVerified} />;
                break;
            default:
                formComponent = <p>Something went wrong.</p>;
        }

        return (
            <div>
                {formComponent}
                <div className="mt-10 text-center flex justify-center gap-4">
                     <Button onClick={onBack} variant="outline" size="lg">
                        Back
                    </Button>
                    <Button onClick={onNext} size="lg" disabled={!isVerified}>
                        {continueText || 'Continue'}
                    </Button>
                </div>
                 <p className="text-xs text-slate-500 mt-2 text-center">A successful connection is required to continue.</p>
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