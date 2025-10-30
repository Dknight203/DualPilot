import React, { useState, useEffect } from 'react';
import { createCheckoutSession } from '../../services/api';
import { PRICING_PLANS } from '../../constants';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

interface CheckoutModalProps {
  planId: string;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ planId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const plan = PRICING_PLANS.find(p => p.id === planId);

  useEffect(() => {
    const processCheckout = async () => {
      try {
        // TODO: Replace with Stripe.js integration
        // The client secret would be used to confirm the payment
        const { checkoutUrl } = await createCheckoutSession(planId);
        console.log('Redirecting to Stripe checkout:', checkoutUrl);
        // In a real app, you would redirect:
        // window.location.href = checkoutUrl;
      } catch (err) {
        setError('Failed to create checkout session. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    processCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  if (!plan) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
            Checkout for {plan.name} Plan
          </h3>
          <div className="mt-4 py-8">
            {isLoading ? (
              <div className="text-center">
                <LoadingSpinner text="Connecting to Stripe..." />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="text-center">
                <p className="text-slate-600">You are being redirected to our secure payment processor.</p>
                <p className="mt-2 text-sm text-slate-500">(In this demo, the redirect is simulated. Check the console.)</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
