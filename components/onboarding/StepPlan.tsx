import React from 'react';
import { PRICING_PLANS } from '../../constants';
import PlanCards from '../pricing/PlanCards';
import Button from '../common/Button';
import { PlanId, TeamMember } from '../../types';

interface StepPlanProps {
    user: TeamMember;
    onPlanSelected: (planId: PlanId) => void;
    onBack: () => void;
}

const ADMIN_EMAIL = 'chrisley.ceme@gmail.com';

const StepPlan: React.FC<StepPlanProps> = ({ user, onPlanSelected, onBack }) => {

    const handleSelectPlan = async (planId: PlanId) => {
        // If user is the admin, bypass payment and just continue the flow.
        // The site will be created at the end of the onboarding process.
        if (user.email === ADMIN_EMAIL) {
            // Force the Agency plan to give the admin full access
            onPlanSelected(PlanId.Agency);
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
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">You can upgrade, downgrade, or cancel at any time.</p>
            <div className="mt-8">
                <PlanCards plans={PRICING_PLANS} onSelectPlan={(planId) => handleSelectPlan(planId as PlanId)} />
            </div>
             <div className="mt-8 text-center">
                <Button onClick={onBack} variant="outline" size="lg">
                    Back
                </Button>
            </div>
        </div>
    );
};

export default StepPlan;