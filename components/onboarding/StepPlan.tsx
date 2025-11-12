import React from 'react';
import { PRICING_PLANS } from '../../constants';
import PlanCards from '../pricing/PlanCards';
import Button from '../common/Button';

interface StepPlanProps {
    onPlanSelected: () => void;
    onBack: () => void;
}

const StepPlan: React.FC<StepPlanProps> = ({ onPlanSelected, onBack }) => {
    // In a real app, this would integrate with state management to store the chosen plan
    const handleSelectPlan = (planId: string) => {
        console.log(`Plan ${planId} selected.`);
        onPlanSelected();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Choose Your Plan</h2>
            <p className="mt-2 text-center text-slate-600">You can upgrade, downgrade, or cancel at any time.</p>
            <div className="mt-8">
                <PlanCards plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />
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
