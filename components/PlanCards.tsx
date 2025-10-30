'use client';
import React, { useState } from 'react';
import { Plan } from '@/lib/types';
import CheckoutModal from './CheckoutModal';

interface PlanCardsProps {
    plans: Plan[];
}

const CheckIcon: React.FC = () => (
    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

export default function PlanCards({ plans }: PlanCardsProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectPlan = (planId: string) => {
        // In a real app, this would likely involve a redirect or more complex state management
        localStorage.setItem('selectedPlan', planId);
        setSelectedPlan(planId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    return (
        <>
            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-none lg:mx-auto xl:grid-cols-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-200 bg-white">
                        <div className="p-6">
                            <h2 className="text-lg leading-6 font-bold text-gray-900">{plan.name}</h2>
                            <p className="mt-4 text-sm text-gray-600">{plan.refresh}</p>
                            <p className="mt-8">
                                {typeof plan.price === 'number' ? (
                                    <>
                                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-base font-medium text-gray-600">/mo</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                )}
                            </p>
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                className={`mt-8 block w-full rounded-xl px-5 py-3 text-base font-semibold text-center transition-colors
                                ${plan.id === 'pro' 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-white text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300'}`}
                            >
                                {plan.id === 'enterprise' ? 'Contact Sales' : 'Select Plan'}
                            </button>
                        </div>
                        <div className="pt-6 pb-8 px-6">
                            <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What is included</h3>
                            <ul className="mt-6 space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex space-x-3">
                                        <CheckIcon />
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && selectedPlan && (
                <CheckoutModal planId={selectedPlan} onClose={handleCloseModal} />
            )}
        </>
    );
};
