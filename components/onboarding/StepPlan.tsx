import React, { useState } from 'react';
import { PRICING_PLANS } from '../../constants';
import PlanCards from '../pricing/PlanCards';
import Button from '../common/Button';
import { PlanId, TeamMember } from '../../types';
import { addSite } from '../../services/api';
import { Platform } from './StepIntegrations';
import Toast from '../common/Toast';
import { useSite } from '../site/SiteContext';

interface StepPlanProps {
    user: TeamMember;
    domain: string;
    platform: Platform;
    siteProfile: string;
    onPlanSelected: () => void;
    onBack: () => void;
}

const StepPlan: React.FC<StepPlanProps> = ({ user, domain, platform, siteProfile, onPlanSelected, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshSites } = useSite();

    const handleSelectPlan = async (planId: PlanId) => {
        setIsLoading(true);
        setError(null);
        try {
            await addSite(domain, platform, planId, siteProfile);
            await refreshSites(); // Refresh the site list in the context
            onPlanSelected();
        } catch (err) {
            console.error('Failed to create site:', err);
            setError('Could not create your site. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">You can upgrade, downgrade, or cancel at any time.</p>
            <div className="mt-8">
                {/* We need to adapt PlanCards or handle loading state here */}
                {/* For now, we pass a wrapped function to handle the async operation */}
                <PlanCards plans={PRICING_PLANS} onSelectPlan={(planId) => handleSelectPlan(planId as PlanId)} />
            </div>
            {isLoading && <p className="text-center mt-4">Creating your site...</p>}
             <div className="mt-8 text-center">
                <Button onClick={onBack} variant="outline" size="lg" disabled={isLoading}>
                    Back
                </Button>
            </div>
        </div>
    );
};

export default StepPlan;
