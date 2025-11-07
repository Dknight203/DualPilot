import React, { useState } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepConfirmProfile from '../components/onboarding/StepConfirmProfile';
import StepPlan from '../components/onboarding/StepPlan';
import StepGscConnect from '../components/onboarding/StepGscConnect';
import StepConnect from '../components/onboarding/StepConnect';
import StepScan from '../components/onboarding/StepScan';

const OnboardingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ['Your Profile', 'Choose Plan', 'Connect GSC', 'Connect Site', 'First Scan'];

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleStepClick = (step: number) => {
        // Allow going back to previous completed steps
        if (step < currentStep) {
            setCurrentStep(step);
        }
    }
    
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepConfirmProfile onProfileConfirmed={handleNextStep} />;
            case 2:
                return <StepPlan onPlanSelected={handleNextStep} />;
            case 3:
                return <StepGscConnect onGscConnected={handleNextStep} />;
            case 4:
                return <StepConnect onSiteConnected={handleNextStep} />;
            case 5:
                return <StepScan />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
