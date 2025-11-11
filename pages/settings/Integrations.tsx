import React, { useState } from 'react';
import Card from '../../components/common/Card';
import PlatformSelector from '../../components/onboarding/platforms/PlatformSelector';
import WordPressForm from '../../components/onboarding/platforms/WordPressForm';
import ShopifyForm from '../../components/onboarding/platforms/ShopifyForm';
import WebflowForm from '../../components/onboarding/platforms/WebflowForm';
import OtherForm from '../../components/onboarding/platforms/OtherForm';
import { Platform } from '../../components/onboarding/StepIntegrations';

const IntegrationsSettings: React.FC = () => {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [isConnected, setIsConnected] = useState(false); // Mock state for connection status

    const handleBack = () => {
        setSelectedPlatform(null);
    };

    const handleConnected = () => {
        setIsConnected(true);
        // In a real app, you might refetch connection status here
    };

    const renderContent = () => {
        if (!selectedPlatform) {
            return (
                 <div>
                    <h3 className="text-lg font-bold text-center text-slate-900">Connect Your Site for One-Click Publishing</h3>
                    <p className="mt-2 text-center text-sm text-slate-600">Select your platform to set up a direct connection, enabling you to publish optimizations with a single click.</p>
                    <PlatformSelector onSelect={setSelectedPlatform} />
                </div>
            );
        }
        
        let formComponent;
        
        switch (selectedPlatform) {
            case 'wordpress':
                formComponent = <WordPressForm onBack={handleBack} onConnected={handleConnected} />;
                break;
            case 'shopify':
                formComponent = <ShopifyForm onBack={handleBack} onConnected={handleConnected} />;
                break;
            case 'webflow':
                formComponent = <WebflowForm onBack={handleBack} onConnected={handleConnected} />;
                break;
            case 'other':
            case 'squarespace':
                 formComponent = <OtherForm onBack={handleBack} onVerify={() => {}} isVerifying={false} isVerified={true} />;
                break;
            default:
                formComponent = <p>Something went wrong.</p>;
        }
        return formComponent;
    };
    
    return (
        <Card title="Integrations">
            {renderContent()}
        </Card>
    );
};

export default IntegrationsSettings;