import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface StepEnterDomainProps {
    onDomainEntered: (domain: string) => void;
}

const StepEnterDomain: React.FC<StepEnterDomainProps> = ({ onDomainEntered }) => {
    const [domain, setDomain] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic sanitization to get the root domain
        const sanitizedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
        if (sanitizedDomain) {
            onDomainEntered(sanitizedDomain);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Let's get started with your site</h2>
            <p className="mt-2 text-center text-slate-600">Enter the primary domain you want to optimize.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto space-y-4">
                <div>
                    <label htmlFor="domain" className="sr-only">Your Domain</label>
                    <Input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g., yourwebsite.com"
                        required
                        className="text-center text-lg h-12"
                    />
                </div>
                <div className="text-center pt-2">
                    <Button type="submit" size="lg" disabled={!domain}>
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StepEnterDomain;