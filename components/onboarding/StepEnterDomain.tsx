import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { Platform } from '../../types';
import CustomSelect from '../common/CustomSelect';
import Toast from '../common/Toast';

interface StepEnterDomainProps {
    onDetailsEntered: (domain: string, platform: Platform) => void;
}

const StepEnterDomain: React.FC<StepEnterDomainProps> = ({ onDetailsEntered }) => {
    const [domain, setDomain] = useState('');
    const [platform, setPlatform] = useState<Platform | ''>('');
    const [showPlatformSelect, setShowPlatformSelect] = useState(false);
    const [isPlatformSelectOpen, setIsPlatformSelectOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const platformOptions = [
        { value: 'wordpress', label: 'WordPress' },
        { value: 'shopify', label: 'Shopify' },
        { value: 'webflow', label: 'Webflow' },
        { value: 'squarespace', label: 'Squarespace' },
        { value: 'other', label: 'Other / Custom' },
    ];

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value);
        if (e.target.value.length > 0 && !showPlatformSelect) {
            setShowPlatformSelect(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sanitizedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
        if (!sanitizedDomain || !platform) return;
        
        setIsSubmitting(true);
        // No API call here, just pass data to parent.
        onDetailsEntered(sanitizedDomain, platform as Platform);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-slate-900">Let's get started with your site</h2>
            <p className="mt-2 text-center text-slate-600">Enter the primary domain you want to optimize and select its platform.</p>
            
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto space-y-4">
                <div>
                    <label htmlFor="domain" className="sr-only">Your Domain</label>
                    <Input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={handleDomainChange}
                        placeholder="e.g., yourwebsite.com"
                        required
                        className="text-center text-lg h-12"
                        disabled={isSubmitting}
                    />
                </div>
                
                {showPlatformSelect && (
                     <div className="animate-fade-in-up" style={{ animationDuration: '0.5s'}}>
                        <label htmlFor="platform" className="sr-only">Platform</label>
                        <CustomSelect
                            value={platform}
                            onChange={(val) => setPlatform(val as Platform)}
                            options={platformOptions}
                            placeholder="Select your platform..."
                            onOpenChange={setIsPlatformSelectOpen}
                        />
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            If your site is a SaaS tool or your platform isn't listed, please select 'Other / Custom'.
                        </p>
                    </div>
                )}

                {!isPlatformSelectOpen && (
                    <div className="text-center pt-2">
                        <Button type="submit" size="lg" disabled={!domain || !platform || isSubmitting} isLoading={isSubmitting}>
                            Continue
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default StepEnterDomain;