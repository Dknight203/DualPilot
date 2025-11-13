import React from 'react';
import { Plan } from '../../types';
import Button from '../common/Button';

interface PlanCardsProps {
    plans: Plan[];
    onSelectPlan: (planId: string) => void;
    disabled?: boolean;
}

const CheckIcon: React.FC = () => (
    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

const PlanCards: React.FC<PlanCardsProps> = ({ plans, onSelectPlan, disabled = false }) => {
    return (
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
            {plans.map((plan) => {
                const buttonText = plan.id === 'enterprise' 
                    ? 'Contact Sales' 
                    : 'Choose Plan';

                return (
                    <div key={plan.id} className={`relative border rounded-lg shadow-sm divide-y divide-slate-200 ${plan.isFeatured ? 'border-2 border-accent-default' : 'border-slate-200'}`}>
                        {plan.isFeatured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent-default text-white">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <div className="p-6">
                            <h2 className="text-lg leading-6 font-medium text-slate-900">{plan.name}</h2>
                            <p className="mt-4 text-sm text-slate-500">{plan.refresh}</p>
                            <p className="mt-8">
                                {typeof plan.price === 'number' ? (
                                    <>
                                        <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                                         <span className="text-base font-medium text-slate-500">/{plan.pricePeriod.substring(0, 2)}</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                )}
                            </p>
                            <Button
                                onClick={() => onSelectPlan(plan.id)}
                                className="mt-8 w-full"
                                variant={plan.isFeatured ? 'primary' : 'outline'}
                                disabled={disabled}
                            >
                                {buttonText}
                            </Button>
                        </div>
                        <div className="pt-6 pb-8 px-6">
                            <h3 className="text-xs font-medium text-slate-900 tracking-wide uppercase">What's included</h3>
                            <ul className="mt-6 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex space-x-3">
                                        <CheckIcon />
                                        <span className="text-sm text-slate-500">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default PlanCards;