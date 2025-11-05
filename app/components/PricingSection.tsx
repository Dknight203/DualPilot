import React from 'react';
import PlanButton from './PlanButton';

const plans = [
  {
    name: 'Essentials',
    price: '$49',
    period: '/mo',
    buttonText: 'Choose Plan',
    buttonStyle: 'outline',
    features: [
      'Up to 50 pages',
      'Weekly refresh',
      'AI meta generation',
      'JSON LD Schema',
      'IndexNow Pings',
      'Visibility Score',
    ],
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    buttonText: 'Choose Plan',
    buttonStyle: 'outline',
    features: [
      'Up to 250 pages',
      'Daily refresh',
      'Everything in Essentials',
      'Priority Support',
      'Advanced Analytics',
    ],
  },
  {
    name: 'Agency',
    price: '$299',
    period: '/mo',
    buttonText: 'Choose Plan',
    buttonStyle: 'outline',
    features: [
      'Up to 1000 pages',
      'Client Accounts',
      'Everything in Pro',
      'White label reports',
      'API Access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: null,
    buttonText: 'Contact Sales',
    buttonStyle: 'outline',
    features: [
      'Unlimited pages',
      'Continuous refresh with SLA',
      'Everything in Agency',
      'Dedicated Account Manager',
      'On premise option',
    ],
  },
];

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        <path d="M13.3332 4.6665L5.99984 11.9998L2.6665 8.6665" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface PricingCardProps {
    plan: typeof plans[0];
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
    return (
        <div className="bg-white rounded-xl border border-[#E8EEF4] shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-6 md:p-7 flex flex-col h-full hover:shadow-sm hover:-translate-y-px transition">
            <h3 className="text-sm uppercase tracking-wide text-[#6B7280] font-semibold">{plan.name}</h3>
            <div className="mt-4">
                <span className="text-[48px] md:text-[56px] font-bold leading-none text-[#0F172A]">{plan.price}</span>
                {plan.period && <span className="text-base align-baseline ml-1 text-[#6B7280]">{plan.period}</span>}
            </div>
            
            <div className="mt-5">
              <PlanButton 
                label={plan.buttonText} 
                variant={plan.buttonStyle === 'filled' ? 'filled' : 'outline'} 
              />
            </div>

            <div className="mt-5 border-t border-[#E5E7EB]" />
            
            <ul className="mt-5 space-y-2.5 text-[14px] text-[#1E1E1E]">
                {plan.features.map(feature => (
                    <li key={feature} className="flex items-center gap-x-2.5">
                        <CheckIcon />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const PricingSection: React.FC = () => {
    return (
        <section id="pricing" className="bg-[#F8FAFC] py-16 md:py-20">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-[#0F172A]">Pricing</h2>
                    <p className="mt-4 text-lg text-[#6B7280]">
                        Choose the plan that fits your needs. No hidden fees, ever.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-7">
                    {plans.map(plan => <PricingCard key={plan.name} plan={plan} />)}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;