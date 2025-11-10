import React, { useState } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepConfirmProfile from '../components/onboarding/StepConfirmProfile';
import StepPlan from '../components/onboarding/StepPlan';
import StepGscConnect from '../components/onboarding/StepGscConnect';
import StepIntegrations from '../components/onboarding/StepIntegrations';
import StepScan from '../components/onboarding/StepScan';

const OnboardingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [domain, setDomain] = useState<string | null>(null);
    const steps = ['Your Site', 'Your Profile', 'Choose Plan', 'Connect GSC', 'Integrations', 'First Scan'];

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleDomainEntered = (enteredDomain: string) => {
        setDomain(enteredDomain);
        handleNextStep();
    };

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    }
    
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepEnterDomain onDomainEntered={handleDomainEntered} />;
            case 2:
                if (!domain) return <div>Please return to the previous step to enter your domain.</div>;
                return <StepConfirmProfile domain={domain} onProfileConfirmed={handleNextStep} />;
            case 3:
                return <StepPlan onPlanSelected={handleNextStep} />;
            case 4:
                return <StepGscConnect onNext={handleNextStep} />;
            case 5:
                 if (!domain) return <div>Please return to the previous step to enter your domain.</div>;
                return <StepIntegrations domain={domain} onNext={handleNextStep} />;
            case 6:
                return <StepScan />;
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