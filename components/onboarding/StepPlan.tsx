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

const ADMIN_EMAIL = 'chrisley.ceme@gmail.com';

const StepPlan: React.FC<StepPlanProps> = ({ user, domain, platform, siteProfile, onPlanSelected, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshSites } = useSite();

    const handleSelectPlan = async (planId: PlanId) => {
        // If user is the admin, bypass payment and create the site with the highest-tier plan.
        if (user.email === ADMIN_EMAIL) {
            setIsLoading(true);
            setError(null);
            try {
                // Force the Agency plan to give the admin full access
                await addSite(domain, platform, PlanId.Agency, siteProfile);
                await refreshSites(); // Refresh the site list in the context
                setIsLoading(false); // Set loading to false BEFORE navigating
                onPlanSelected();
            } catch (err) {
                console.error('Failed to create admin site:', err);
                setError('Could not create your admin site. Please try again.');
                setIsLoading(false); // Also set loading to false on error
            }
        } else {
            // For regular users, since Stripe is not integrated, show a message.
            if (planId === PlanId.Enterprise) {
                 alert('Please contact sales to learn more about our Enterprise plan.');
            } else {
                 alert('Online checkout is coming soon! For now, only admin accounts can be created through this flow.');
            }
        }
    };

    return (
        <div>
            {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">You can upgrade, downgrade, or cancel at any time.</p>
            <div className="mt-8">
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