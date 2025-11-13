import React from 'react';
import { PRICING_PLANS } from '../../constants';
import PlanCards from '../pricing/PlanCards';
import Button from '../common/Button';
import { PlanId, TeamMember, Plan } from '../../types';
import Toast from '../common/Toast';

interface StepPlanProps {
    user: TeamMember;
    onConfirm: (planId: PlanId) => Promise<void>;
    onBack: () => void;
    isCreating: boolean;
}

const ADMIN_EMAIL = 'chrisley.ceme@gmail.com';

const StepPlan: React.FC<StepPlanProps> = ({ user, onConfirm, onBack, isCreating }) => {
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

        // For regular users, confirm their choice without validation.
        await onConfirm(planId);
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">
                Your site's exact page count will be determined after your first scan. Choose the plan that seems like the best fit to start.
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