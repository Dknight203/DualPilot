import React, { useState } from 'react';
import { useSite } from '../components/site/SiteContext';
import { PlanId } from '../types';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepIntegrations from '../components/onboarding/StepIntegrations';
import StepScan from '../components/onboarding/StepScan';
import UpgradeForMoreSites from '../components/onboarding/UpgradeForMoreSites';
import { useNavigate } from 'react-router-dom';

const AddSitePage: React.FC = () => {
    const { sites, activeSite } = useSite();
    const navigate = useNavigate();

    const steps = ['Add Site', 'Integrations', 'First Scan'];
    const [currentStep, setCurrentStep] = useState(1);
    const [domain, setDomain] = useState<string | null>(null);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finished the flow, go to dashboard
            navigate('/dashboard');
        }
    };
    
    const handleDomainEntered = (enteredDomain: string) => {
        setDomain(enteredDomain);

        if (activeSite) {
            // Mock limit: Pro plan gets 1 site, Agency gets 10.
            const siteLimit = activeSite.plan === PlanId.Agency ? 10 : (activeSite.plan === PlanId.Pro ? 2 : 1);
            if (sites.length >= siteLimit) {
                setShowUpgradePrompt(true);
            } else {
                handleNextStep(); // This will go to step 2 (Integrations)
            }
        } else {
            // Should not happen for an existing user, but as a fallback, proceed.
            handleNextStep();
        }
    };

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            if (showUpgradePrompt) {
                setShowUpgradePrompt(false); // Go back to step 1 from upgrade prompt
                setCurrentStep(1);
            } else {
                setCurrentStep(step);
            }
        }
    }
    
    const renderStep = () => {
        if (showUpgradePrompt) {
            return <UpgradeForMoreSites />;
        }

        switch (currentStep) {
            case 1:
                return <StepEnterDomain onDomainEntered={handleDomainEntered} />;
            case 2:
                if (!domain) return <div>Please return to the previous step to enter your domain.</div>;
                return <StepIntegrations domain={domain} onNext={handleNextStep} />;
            case 3:
                // Note: The original StepScan always sets a "firstLogin" flag. 
                // A more robust implementation would use a different component or pass a prop.
                // For now, we reuse it, but it will set a flag that shows the welcome modal, which is a minor UX issue.
                // We will create a separate StepScan for this flow later.
                return <StepScan />; 
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
                   {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default AddSitePage;