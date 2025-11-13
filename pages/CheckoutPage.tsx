import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../components/site/SiteContext';
import { PRICING_PLANS } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CheckoutPage: React.FC = () => {
    const { activeSite } = useSite();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const plan = activeSite ? PRICING_PLANS.find(p => p.id === activeSite.plan) : null;

    const handleCompletePurchase = () => {
        setIsProcessing(true);
        // Simulate a payment API call
        setTimeout(() => {
            setIsProcessing(false);
            // On success, navigate to the dashboard with a welcome message
            localStorage.setItem('isFirstLogin', 'true');
            navigate('/dashboard', { 
                replace: true,
                state: { 
                    toast: {
                        message: `Welcome! Your ${plan?.name} plan is now active.`,
                        type: 'success'
                    }
                }
            });
        }, 2000);
    };

    if (!activeSite || !plan) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
                <LoadingSpinner text="Loading your plan details..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
                 <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">One Last Step</h1>
                    <p className="mt-2 text-slate-600">Your site is ready to go! Activate your plan to unlock the dashboard and start optimizing.</p>
                </div>
                <Card className="mt-8">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-slate-800">Order Summary</h2>
                        <div className="mt-4 flow-root">
                             <ul className="divide-y divide-slate-200">
                                <li className="flex items-center justify-between py-4">
                                    <p className="text-slate-600">DualPilot <span className="font-medium text-slate-900">{plan.name}</span> Plan</p>
                                    <p className="font-semibold text-slate-900">${plan.price}/mo</p>
                                </li>
                                <li className="flex items-center justify-between py-4">
                                    <p className="text-slate-600">Total Due Today</p>
                                    <p className="font-semibold text-slate-900">${plan.price}</p>
                                </li>
                             </ul>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                        {/* Mock Payment Form */}
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-medium text-slate-700">Card Information</label>
                                <div className="mt-1 p-3 w-full border border-slate-300 rounded-md bg-white text-slate-400 text-sm">
                                    **** **** **** 4242
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Billing Address</label>
                                <div className="mt-1 p-3 w-full border border-slate-300 rounded-md bg-white text-slate-400 text-sm">
                                    123 Main St, Anytown, USA
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center">
                            This is a mock checkout page. Real payment processing is not yet integrated.
                        </p>
                    </div>
                </Card>
                 <div className="mt-6">
                    <Button
                        className="w-full"
                        size="lg"
                        isLoading={isProcessing}
                        onClick={handleCompletePurchase}
                    >
                        {isProcessing ? 'Processing...' : `Pay $${plan.price} and Start Optimizing`}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;