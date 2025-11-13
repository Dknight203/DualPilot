import React, { useState } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepConfirmProfile from '../components/onboarding/StepConfirmProfile';
import StepPlan from '../components/onboarding/StepPlan';
import StepGscConnect from '../components/onboarding/StepGscConnect';
import StepIntegrations from '../components/onboarding/StepIntegrations';
import { useAuth } from '../components/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlanId, Platform } from '../types';
import { addSite } from '../services/api';
import { useSite } from '../components/site/SiteContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
    const { user } = useAuth();
    const { refreshSites } = useSite();
    const navigate = useNavigate();
    const steps = ['Your Site', 'Your Profile', 'Connect GSC', 'Integrations', 'Choose Plan'];
    const [currentStep, setCurrentStep] = useState(1);
    
    // State to be collected through the wizard, held in memory
    const [domain, setDomain] = useState('');
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [siteProfile, setSiteProfile] = useState('');
    
    // UI/Flow state
    const [isCreatingSite, setIsCreatingSite] = useState(false);

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
        handleNextStep();
    };
    
    const handleProfileConfirmed = (profile: string) => {
        setSiteProfile(profile);
        handleNextStep();
    }

    const handleOnboardingComplete = async (planId: PlanId) => {
        if (!domain || !platform || !siteProfile || !user) {
            alert("Error: Missing information. Please restart the onboarding process.");
            return;
        }

        setIsCreatingSite(true);
        try {
            // Save site with an initial page count of 0. The real scan will happen post-creation.
            await addSite(domain, platform, planId, siteProfile, 0);
            await refreshSites();

            // Special handling for demo user to show tour vs. checkout
            if (user.email === 'chrisley.ceme@gmail.com') {
                localStorage.setItem('isFirstLogin', 'true');
                navigate('/dashboard');
            } else {
                navigate('/checkout');
            }

        } catch (error) {
            console.error("Failed to create site in final step:", error);
            alert("Could not save your site. Please try again.");
            setIsCreatingSite(false);
        }
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
                return <StepGscConnect onNext={handleNextStep} onBack={handleBackStep} />;
            case 4:
                if (!domain || !platform) return <div>Please return to a previous step to enter your site details.</div>;
                // Directly proceed to the next step (plan selection)
                return <StepIntegrations domain={domain} platform={platform} onNext={handleNextStep} onBack={handleBackStep} />;
            case 5:
                return <StepPlan 
                            user={user} 
                            onConfirm={handleOnboardingComplete} 
                            onBack={handleBackStep} 
                            isCreating={isCreatingSite}
                        />;
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