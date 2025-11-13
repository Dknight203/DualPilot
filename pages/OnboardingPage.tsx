import React, { useState, useEffect } from 'react';
import Stepper from '../components/onboarding/Stepper';
import StepEnterDomain from '../components/onboarding/StepEnterDomain';
import StepConfirmProfile from '../components/onboarding/StepConfirmProfile';
import StepPlan from '../components/onboarding/StepPlan';
import StepGscConnect from '../components/onboarding/StepGscConnect';
import StepIntegrations, { Platform } from '../components/onboarding/StepIntegrations';
import { useAuth } from '../components/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PlanId } from '../types';
import { getSitePageCount, addSite } from '../services/api';
import { useSite } from '../components/site/SiteContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
    const { user } = useAuth();
    const { refreshSites } = useSite();
    const navigate = useNavigate();
    const steps = ['Your Site', 'Your Profile', 'Connect GSC', 'Integrations', 'Choose Plan'];
    const [currentStep, setCurrentStep] = useState(1);
    
    // State to be collected through the wizard
    const [domain, setDomain] = useState<string | null>(null);
    const [platform, setPlatform] = useState<Platform | null>(null);
    const [siteProfile, setSiteProfile] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    
    // UI/Flow state
    const [isScanning, setIsScanning] = useState(false);
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
    
    const handleDetailsEntered = (enteredDomain: string, selectedPlatform: Platform) => {
        setDomain(enteredDomain);
        setPlatform(selectedPlatform);
        handleNextStep();
    };
    
    const handleProfileConfirmed = (profile: string) => {
        setSiteProfile(profile);
        handleNextStep();
    }
    
    // This is called after the "Integrations" step
    const handleStartPageScan = () => {
        if (!domain) return;
        setIsScanning(true);
        handleNextStep(); // Move to the final step's container
        
        const fetchPageCount = async () => {
            try {
                const count = await getSitePageCount(domain);
                setPageCount(count);
            } catch (error) {
                console.error("Failed to fetch page count", error);
                setPageCount(0); // Default to 0 on error
            } finally {
                setIsScanning(false);
            }
        };
        fetchPageCount();
    };

    const handleOnboardingComplete = async (planId: PlanId) => {
        if (!domain || !platform || !siteProfile || !user) {
            alert("Error: Missing information. Please restart the onboarding process.");
            return;
        }

        setIsCreatingSite(true);
        try {
            await addSite(domain, platform, planId, siteProfile);
            await refreshSites();

            if (user.email === 'chrisley.ceme@gmail.com') {
                localStorage.setItem('isFirstLogin', 'true');
                navigate('/dashboard');
            } else {
                navigate('/checkout');
            }

        } catch (error) {
            console.error("Failed to create site in final step:", error);
            // In a real app, show a toast message
            alert("Could not create your site. Please try again.");
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
                return <StepIntegrations domain={domain} platform={platform} onNext={handleStartPageScan} onBack={handleBackStep} />;
            case 5:
                if (isScanning) {
                    return <div className="h-64 flex justify-center items-center"><LoadingSpinner text="Analyzing your site to recommend a plan..." /></div>;
                }
                if (pageCount === null) return <div>Please complete previous steps.</div>;
                return <StepPlan 
                            user={user} 
                            pageCount={pageCount}
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