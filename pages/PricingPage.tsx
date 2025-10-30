import React, { useState } from 'react';
import { PRICING_PLANS } from '../constants';
import PlanCards from '../components/pricing/PlanCards';
import CheckoutModal from '../components/pricing/CheckoutModal';

const PricingPage: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:flex-col sm:align-center">
                    <h1 className="text-5xl font-extrabold text-slate-900 sm:text-center">Simple, transparent pricing</h1>
                    <p className="mt-5 text-xl text-slate-500 sm:text-center">
                        Choose the plan that fits your needs. No hidden fees, ever.
                    </p>
                </div>
                <PlanCards plans={PRICING_PLANS} onSelectPlan={handleSelectPlan} />
                {isModalOpen && selectedPlan && (
                    <CheckoutModal planId={selectedPlan} onClose={handleCloseModal} />
                )}
                 {/* FAQ Section */}
                <div className="mt-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900">Plans FAQ</h2>
                    </div>
                    <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-2 lg:gap-x-8 max-w-4xl mx-auto">
                        <div className="space-y-2">
                            <dt className="font-medium text-slate-900">Can I change my plan later?</dt>
                            <dd className="text-slate-500">Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied automatically.</dd>
                        </div>
                        <div className="space-y-2">
                            <dt className="font-medium text-slate-900">What counts as a "page"?</dt>
                            <dd className="text-slate-500">A page is any unique URL on your site that DualPilot crawls and optimizes. We automatically discover pages via your sitemap and internal links.</dd>
                        </div>
                        <div className="space-y-2">
                            <dt className="font-medium text-slate-900">What if I go over my page limit?</dt>
                            <dd className="text-slate-500">We'll notify you when you're approaching your limit. You can choose to upgrade your plan or purchase extra pages at $0.05 per page.</dd>
                        </div>
                        <div className="space-y-2">
                            <dt className="font-medium text-slate-900">What are "client accounts"?</dt>
                            <dd className="text-slate-500">The Agency plan allows you to create sub-accounts to manage multiple client websites under your main account, each with their own isolated data and settings.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
