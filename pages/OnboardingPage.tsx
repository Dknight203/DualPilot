import React, { useState } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepConfirmProfile from '../components/onboarding/StepConfirmProfile';
import StepPlan from '../components/onboarding/StepPlan';
import StepGscConnect from '../components/onboarding/StepGscConnect';
import StepIntegrations, { Platform } from '../components/onboarding/StepIntegrations';
import StepScan from '../components/onboarding/StepScan';
import { useAuth } from '../components/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlanId } from '../types';

const OnboardingPage: React.FC = () => {
    const { user } = useAuth();
    const steps = ['Your Site', 'Your Profile', 'Choose Plan', 'Connect GSC', 'Integrations', 'First Scan'];
    const [currentStep, setCurrentStep] = useState(1);
    
    // State to be collected through the wizard
    const [domain, setDomain] = useState<string | null>(null);
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [siteProfile, setSiteProfile] = useState<string | null>(null);
    const [planId, setPlanId] = useState<PlanId | null>(null);

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
    
    const handleDetailsEntered = (enteredDomain: string, selectedPlatform: Platform) => {
        setDomain(enteredDomain);
        setPlatform(selectedPlatform);
        handleNextStep();
    };
    
    const handleProfileConfirmed = (profile: string) => {
        setSiteProfile(profile);
        handleNextStep();
    }

    const handlePlanSelected = (selectedPlanId: PlanId) => {
        setPlanId(selectedPlanId);
        handleNextStep();
    };

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    }
    
    const renderStep = () => {
        if (!user) {
            return <div className="flex justify-center py-10"><LoadingSpinner text="Loading user session..." /></div>;
        }

        switch (currentStep) {
            case 1:
                return <StepEnterDomain onDetailsEntered={handleDetailsEntered} />;
            case 2:
                if (!domain) return <div>Please return to the previous step to enter your domain.</div>;
                return <StepConfirmProfile domain={domain} onProfileConfirmed={handleProfileConfirmed} onBack={handleBackStep} />;
            case 3:
                return <StepPlan user={user} onPlanSelected={handlePlanSelected} onBack={handleBackStep} />;
            case 4:
                return <StepGscConnect onNext={handleNextStep} onBack={handleBackStep} />;
            case 5:
                 if (!domain || !platform) return <div>Please return to a previous step to enter your site details.</div>;
                return <StepIntegrations domain={domain} platform={platform} onNext={handleNextStep} onBack={handleBackStep} />;
            case 6:
                if (!domain || !platform || !siteProfile || !planId) {
                    return <div>Please complete all previous steps.</div>;
                }
                return <StepScan domain={domain} platform={platform} siteProfile={siteProfile} planId={planId} />;
            default:
                return <div>Unknown Step</div>;
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

export default OnboardingPage;