import React from 'react';
import { PRICING_PLANS } from '../../constants';
import PlanCards from '../pricing/PlanCards';
import Button from '../common/Button';
import { PlanId, TeamMember, Plan } from '../../types';
import Toast from '../common/Toast';

interface StepPlanProps {
    user: TeamMember;
    pageCount: number;
    onConfirm: (planId: PlanId) => Promise<void>;
    onBack: () => void;
    isCreating: boolean;
}

const ADMIN_EMAIL = 'chrisley.ceme@gmail.com';

const StepPlan: React.FC<StepPlanProps> = ({ user, pageCount, onConfirm, onBack, isCreating }) => {
    const [toast, setToast] = React.useState<{ message: string; type: 'error' } | null>(null);

    const handleSelectPlan = async (planId: PlanId) => {
        // If user is the admin, bypass validation and assign Agency plan.
        if (user.email === ADMIN_EMAIL) {
            await onConfirm(PlanId.Agency);
            return;
        }

        if (planId === PlanId.Enterprise) {
            alert('Please contact sales to learn more about our Enterprise plan.');
            return;
        }

        const selectedPlan = PRICING_PLANS.find(p => p.id === planId) as Plan;
        
        if (typeof selectedPlan.pages === 'number' && pageCount > selectedPlan.pages) {
            setToast({
                message: `Your site has ~${pageCount} pages. The ${selectedPlan.name} plan only supports up to ${selectedPlan.pages} pages. Please select a larger plan.`,
                type: 'error',
            });
            return;
        }

        // For regular users, confirm their valid choice.
        await onConfirm(planId);
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">
                Based on our analysis, your site has approximately <span className="font-bold text-slate-800">{pageCount} pages</span>.
            </p>
            <div className="mt-8">
                <PlanCards 
                    plans={PRICING_PLANS} 
                    onSelectPlan={(planId) => handleSelectPlan(planId as PlanId)} 
                    disabled={isCreating}
                />
            </div>
             <div className="mt-8 text-center">
                <Button onClick={onBack} variant="outline" size="lg" disabled={isCreating}>
                    Back
                </Button>
            </div>
        </div>
    );
};

export default StepPlan;