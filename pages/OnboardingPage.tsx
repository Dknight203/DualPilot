import React, { useState } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepPlan from '../components/onboarding/StepPlan';
import StepConnect from '../components/onboarding/StepConnect';
import StepScan from '../components/onboarding/StepScan';
import Card from '../components/common/Card';

const OnboardingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ['Select Plan', 'Connect Site', 'First Scan'];

    const goToNextStep = () => setCurrentStep(prev => prev + 1);
    const goToStep = (step: number) => setCurrentStep(step);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StepPlan onPlanSelected={goToNextStep} />;
            case 2:
                return <StepConnect onSiteConnected={goToNextStep} />;
            case 3:
                return <StepScan />;
            default:
                return <StepPlan onPlanSelected={goToNextStep} />;
        }
    }

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Stepper steps={steps} currentStep={currentStep} onStepClick={goToStep} />
                <div className="mt-8">
                   <Card>
                       {renderStepContent()}
                   </Card>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;