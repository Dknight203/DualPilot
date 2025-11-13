import React, { useState } from 'react';
import { useSite } from '../components/site/SiteContext';
import { PlanId, Platform } from '../types';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepIntegrations from '../components/onboarding/StepIntegrations';
import UpgradeForMoreSites from '../components/onboarding/UpgradeForMoreSites';
import { useNavigate } from 'react-router-dom';
import { addSite } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AddSitePage: React.FC = () => {
    const { sites, activeSite, refreshSites } = useSite();
    const navigate = useNavigate();

    const steps = ['Add Site', 'Integrations'];
    const [currentStep, setCurrentStep] = useState(1);
    const [domain, setDomain] = useState<string | null>(null);
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBackStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleDetailsEntered = (newDomain: string, newPlatform: Platform) => {
        setDomain(newDomain);
        setPlatform(newPlatform);

        if (activeSite) {
            const siteLimit = activeSite.plan === PlanId.Agency ? 10 : (activeSite.plan === PlanId.Pro ? 2 : 1);
            if (sites.length >= siteLimit) {
                setShowUpgradePrompt(true);
            } else {
                handleNextStep();
            }
        } else {
            // Should not happen if coming from settings, but as a fallback
            handleNextStep();
        }
    };

    const handleCreateSite = async () => {
        if (!domain || !platform || !activeSite || !activeSite.plan) {
            alert("An error occurred. Missing required information.");
            return;
        }
        setIsCreating(true);
        try {
            // Re-use existing plan, generate a dummy profile for now
            const dummyProfile = `Site profile for ${domain}. This can be edited in your site settings.`;
            await addSite(domain, platform, activeSite.plan, dummyProfile, 0);
            await refreshSites();
            navigate('/dashboard', { state: { toast: { message: `Successfully added ${domain}!`, type: 'success' }}});
        } catch (error) {
            alert("Failed to create site.");
            setIsCreating(false);
        }
    };

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            if (showUpgradePrompt) {
                setShowUpgradePrompt(false);
            }
            setCurrentStep(step);
        }
    }
    
    const renderContent = () => {
        if (showUpgradePrompt) {
            return <UpgradeForMoreSites />;
        }
        
        if (isCreating) {
            return <div className="h-48 flex justify-center items-center"><LoadingSpinner text="Adding your new site..." /></div>
        }

        switch (currentStep) {
            case 1:
                return <StepEnterDomain onDetailsEntered={handleDetailsEntered} />;
            case 2:
                if (!domain || !platform) return <div>Please return to the previous step to enter your domain.</div>;
                return <StepIntegrations domain={domain} platform={platform} onNext={handleCreateSite} onBack={handleBackStep} continueText="Finish & Create Site" />;
            default:
                return <div>Loading flow...</div>;
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 flex justify-center">
                    <Stepper steps={steps} currentStep={currentStep - 1} onStepClick={handleStepClick} />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                   {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AddSitePage;